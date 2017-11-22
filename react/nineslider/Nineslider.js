import settings from './Settings';
import {react} from 'react';
import {Slide} from './Slide';
import {NavigationItem} from './NavigationItem';
import {PagingItem} from './PagingItem';


export class Nineslider extends React.Component {

    constructor(){
        super(...arguments);
        this.settings = this.extend(settings, this.props.settings)
        this.timer = null;
        this.state = {
            currentIndex: 0
        }
    }
    
    extend(targetObject, extendingObject){
        for(var key in extendingObject) {
            targetObject[key] = extendingObject[key];
        }
        return targetObject;
    }

    generateGuid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    componentDidMount(){       
        this.setTimer();
        this.settings.loaded.call(this);
    }

    setTimer() {
        if(this.settings.autoPlay.enable) {
            this.timer = setInterval(() => {
                this.navigate(false);
            }, this.settings.autoPlay.interval);        
        }
    }

    clearTimer() {
        clearInterval(this.timer);        
    }

    pagingItemEvent(index){

        this.clearTimer();
        this.settings.before.call(this);
        this.refs["paging" + this.state.currentIndex].setStateExternal(false);
        this.refs["slide" + index].setAsNextSlide();
        this.refs["slide" + this.state.currentIndex].transition().then(()=>{
            this.setState((currentState, props) => {
                currentState.currentIndex = index;
                return currentState;
            });

            this.setTimer()
            this.settings.after.call(this);
        });
    }

    navigationItemEvent(reverse) {
        this.clearTimer();
        this.navigate(reverse);
        this.setTimer();
    }

    navigate(reverse){
        
        this.settings.before.call(this);
        var currentIndex = this.state.currentIndex;
        var oldIndex = this.state.currentIndex;
        var itemCount = this.props.data.length;

        if(reverse) {
            if(currentIndex === 0) { // are we at the beginning?
                currentIndex = itemCount - 1;
            } else {
                currentIndex--;
            }
        } else {
            if(currentIndex === itemCount - 1) { // are we at the end?
                currentIndex = 0;
            } else {
                currentIndex++;
            }
        }

        this.refs["slide" + currentIndex].setAsNextSlide();
        this.refs["slide" + oldIndex].transition().then(()=>{

            this.setState((currentState, props) => {
                currentState.currentIndex = currentIndex;
                return currentState;
            });

            this.settings.after.call(this);
            
        });

    }

    render(){

        var slides = this.props.data.map((item, index) => {
            return (<Slide key={this.generateGuid()} index={index} ref={"slide" + index} isCurrentSlide={this.state.currentIndex === index} image={item.image} link={item.link} caption={item.caption} />);        
        });
        
        var paging = this.props.data.map((item, index) => {
            return (<PagingItem key={this.generateGuid()} index={index} ref={"paging" + index} isActive={this.state.currentIndex === index} update={(index) => this.pagingItemEvent(index)} />);        
        });

        return(
            <div class="nbs-nineslider-container">
                <ul class="nbs-nineslider-ul">
                    {slides}
                </ul>                
                <NavigationItem direction={"left"} update={() => this.navigationItemEvent(true)} />
                <NavigationItem direction={"right"} update={() => this.navigationItemEvent(false)} />
                <ul class="nbs-nineslider-paging">
                    {paging}
                </ul>
            </div>            
        );    
    }
}