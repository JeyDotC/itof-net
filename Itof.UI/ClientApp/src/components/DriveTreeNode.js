import React, { Component, Fragment } from 'react';

export default class DriveTreeNode extends Component {
    static displayName = DriveTreeNode.name;
    
    render() {
        return (
            <Fragment>
                <strong>{this.props.drive.name}</strong> <br />
                <small className="text-muted">{this.props.drive.totalFreeSpace} available of {this.props.drive.totalSize} </small>
            </Fragment>
        );
    }
}

