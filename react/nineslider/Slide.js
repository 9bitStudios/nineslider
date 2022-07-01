
import {react} from 'react';
import $ from 'jquery';

export class Slide extends React.Component {
    constructor(){
        super(...arguments);

        this.activeSlideStyle = {
            display: "block",
            position: "relative",
            zIndex: 2
        };  

        this.inactiveSlideStyle = {
            display: "none",
            zIndex: 1
        };

        this.nextSlideStyle = {
            display: "block",
            position: "absolute",
            zIndex: 1
        };

        this.state = { 
            index: this.props.index,
            link: this.props.link,
            caption: this.props.caption,
            src: this.props.image,
            style: (this.props.isCurrentSlide) ? this.activeSlideStyle : this.inactiveSlideStyle
        }
    }

    transition() {
        var node = ReactDOM.findDOMNode(this);        
        return new Promise((resolve, reject) => {
            $(node).fadeOut(() => {

                this.setState((currentState, props) => {
                    currentState.style = this.activeSlideStyle;
                    return currentState;
                });

                resolve();
            });
        });
    }

    setAsNextSlide(){
        this.setState((currentState, props) => {
            currentState.style = this.nextSlideStyle;
            return currentState;
        });
    }

    render() {
        
        var caption = (this.props.caption) ? `<div class="caption">${this.props.caption}</div>` : ""; 

        return(
            <li class="nbs-nineslider-item" style={this.state.style} dangerouslySetInnerHTML={{ __html: `<img src="${this.props.image}" />${caption}` }}></li>
        )  
    }

}