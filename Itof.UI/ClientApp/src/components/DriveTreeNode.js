import React, { Component, Fragment } from 'react';

export default class DriveTreeNode extends Component {
    static displayName = DriveTreeNode.name;
    
    render() {
        return (
            <Fragment>
                <div>
                    <strong>{this.props.drive.name}</strong>
                </div>
                <small className="text-silenced">{this.props.drive.totalFreeSpace} available of {this.props.drive.totalSize} </small>
            </Fragment>
        );
    }
}

