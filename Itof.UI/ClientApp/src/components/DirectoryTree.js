import React, { Component } from 'react';
import DriveTreeNode from './DriveTreeNode'
import { Nav, NavLink } from 'reactstrap';

export default class DirectoryTree extends Component {
    static displayName = DirectoryTree.name;

    render() {
        return (
            <Nav vertical={true}>
                {this.props.drives.map(drive => <NavLink href="#" onClick={() => this.props.onPathSelected(drive.rootDirectory)}>
                    <DriveTreeNode drive={drive}  />
                </NavLink>)}
            </Nav>
        );
    }
}

