import {react} from 'react';

export class PagingItem extends React.Component {
    constructor(){
        super(...arguments);
        this.state = {
            isActive: this.props.isActive
        }
    }

    pagingClick(e) {
        this.setState((currentState, props) => {
            props.update(this.props.index);
            currentState.isActive = true;            
            return currentState;
        });
    }

    setStateExternal(active) {
        this.setState((currentState, props) => {
            currentState.isActive = active;            
            return currentState;
        });        
    }

    render(){
        var isActive = this.state.isActive ? "active" : "";        
        return(<li className={isActive} onClick={() => this.pagingClick()}></li>)
    }
}