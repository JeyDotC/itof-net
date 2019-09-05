import React from 'react';
import { DropdownMenu, DropdownItem } from 'reactstrap';

export default class ContextMenu extends React.Component {
    render() {
        return (<div className="dropdown-menu" style={{
            display: this.props.show ? 'block' : 'none',
            position: 'fixed',
            left: this.props.x,
            top: this.props.y
        }}>
            <a className="dropdown-item" href="#">Action</a>
            <a className="dropdown-item" href="#">Another action</a>
            <a className="dropdown-item" href="#">Something else here</a>
        </div>);
    }
}