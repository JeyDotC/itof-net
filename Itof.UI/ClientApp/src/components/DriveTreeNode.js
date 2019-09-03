import React, { Component, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHdd } from '@fortawesome/free-solid-svg-icons'

export default class DriveTreeNode extends Component {
    static displayName = DriveTreeNode.name;
    
    render() {
        return (
            <Fragment>
                <FontAwesomeIcon icon={faHdd} />
                <strong> {this.props.drive.name}</strong> <br />
                <small className="text-muted">{this.props.drive.totalFreeSpace} available of {this.props.drive.totalSize} </small>
            </Fragment>
        );
    }
}

