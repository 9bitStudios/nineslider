import {react} from 'react';

export class NavigationItem extends React.Component {
    constructor(){
        super(...arguments);
        this.state = {
        }
    }

    itemClick(e) {

        var reverse = this.props.direction === "left" ? true : false;
        this.props.update(reverse);
    }

    render(){    

        let directionClass = "nbs-nineslider-nav-" + this.props.direction;
        return(<div className={directionClass} onClick={() => this.itemClick()}></div>);
        
    }
}