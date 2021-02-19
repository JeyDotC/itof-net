import React, { Component, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHdd } from '@fortawesome/free-solid-svg-icons'
import humanFileSize from '../services/humanFileSize';
import ProgressLine from './ProgressLine';

export default class DriveTreeNode extends Component {
    static displayName = DriveTreeNode.name;
    
    render() {
        // Space in bytes.
        const { totalFreeSpace, totalSize } = this.props.drive;
        const availablePercent = 1 - (totalSize > 0 ? totalFreeSpace / totalSize : 0);

        const humanReadableTotalFreeSpace = humanFileSize(totalFreeSpace);
        const humanReadableTotalSize = humanFileSize(totalSize);

        return (
            <Fragment>
                <FontAwesomeIcon icon={faHdd} />
                <strong> {this.props.drive.name}</strong> <br />
                <ProgressLine percentage={availablePercent} />
                <small className="text-muted">{humanReadableTotalFreeSpace} available of {humanReadableTotalSize} </small>
            </Fragment>
        );
    }
}

