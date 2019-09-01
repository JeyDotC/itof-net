import React, { Component } from 'react';
import DriveTreeNode from './DriveTreeNode'
import { Nav, NavLink } from 'reactstrap';

export default class DirectoryTree extends Component {
    static displayName = DirectoryTree.name;

    render() {
        return (
            <Nav vertical={true} className={"position-fixed"}>
                {this.props.drives.map(drive => <NavLink key={drive.name} href="#" onClick={() => this.props.onPathSelected(drive.rootDirectory)}>
                    <DriveTreeNode drive={drive} />
                </NavLink>)}
            </Nav>
        );
    }
}

