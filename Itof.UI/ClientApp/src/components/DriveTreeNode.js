import React, { Component, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHdd } from '@fortawesome/free-solid-svg-icons'
import humanFileSize from '../services/humanFileSize';

export default class DriveTreeNode extends Component {
    static displayName = DriveTreeNode.name;
    
    render() {
        const freeSpace = humanFileSize(this.props.drive.totalFreeSpace);
        const totalSpace = humanFileSize(this.props.drive.totalSize);

        return (
            <Fragment>
                <FontAwesomeIcon icon={faHdd} />
                <strong> {this.props.drive.name}</strong> <br />
                <small className="text-muted">{freeSpace} available of {totalSpace} </small>
            </Fragment>
        );
    }
}

