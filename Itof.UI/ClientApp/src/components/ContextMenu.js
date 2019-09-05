import React from 'react';
import { DropdownMenu, DropdownItem } from 'reactstrap';

export default class ContextMenu extends React.Component {

    handleCopyAsPath = () => {
        navigator.clipboard.writeText(this.props.selectedItem.fullName);
    }

    render() {
        return (<div className="dropdown-menu" style={{
            display: this.props.show ? 'block' : 'none',
            position: 'fixed',
            left: this.props.x,
            top: this.props.y
        }}>
            <button className="dropdown-item" type="button" onClick={this.handleCopyAsPath}>Copy Path</button>
        </div>);
    }
}