import {react} from 'react';
import {Slide} from './Slide';
import {NavigationItem} from './NavigationItem';
import {PagingItem} from './PagingItem';

export class Nineslider extends React.Component {
    
    constructor(){
        super(...arguments);
        
        this.timer = null;

        this.state = {
            currentIndex: 0
        }
    }
    
    generateGuid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    componentDidMount(){

        this.setTimer();

    }

    setTimer() {
        this.timer = setInterval(() => {
            this.navigate(false);
        }, 5000);        
    }

    clearTimer() {
        clearInterval(this.timer);        
    }

    pagingItemEvent(index){

        this.clearTimer();

        this.refs["paging" + this.state.currentIndex].setStateExternal(false);
        this.refs["slide" + index].setAsNextSlide();
        this.refs["slide" + this.state.currentIndex].transition().then(()=>{
            this.setState((currentState, props) => {
                currentState.currentIndex = index;
                return currentState;
            });

            this.setTimer()

        });
    }

    navigationItemEvent(reverse) {
        this.clearTimer();
        this.navigate(reverse);
        this.setTimer();
    }

    navigate(reverse){
        
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

        });

    }

    render(){

        var slides = this.props.data.map((item, index) => {
            return (<Slide key={this.generateGuid()} index={index} ref={"slide" + index} isCurrentSlide={this.state.currentIndex === index} image={item.image} link={item.link} />);        
        });
        
        var paging = this.props.data.map((item, index) => {
            return (<PagingItem key={this.generateGuid()} index={index} ref={"paging" + index} isActive={this.state.currentIndex === index} update={(index) => this.pagingItemEvent(index)} />);        
        });

        return(
            <div class="nbs-nineslider-container">
                <ul class="nbs-nineslider-ul">
                    {slides}
                </ul>                
                <NavigationItem direction={"left"} update={(isReversed) => this.navigationItemEvent(isReversed)} />
                <NavigationItem direction={"right"} update={(isReversed) => this.navigationItemEvent(isReversed)} />
                <ul class="nbs-nineslider-paging">
                    {paging}
                </ul>
            </div>            
        );    
    }
}