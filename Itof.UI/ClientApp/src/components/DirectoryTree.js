import React, { Component } from 'react';
import DriveTreeNode from './DriveTreeNode'
import { Nav, NavLink } from 'reactstrap';

export default function DirectoryTree(props) {
    const { drives, onNavigate } = props;

    return (
        <Nav vertical={true} size={'sm'} className={"position-fixed"}>
            {drives.map(drive =>
                <NavLink key={drive.name} className={'small'} href="#" onClick={() => onNavigate(drive.rootDirectory)}>
                    <DriveTreeNode drive={drive} />
                </NavLink>)}
        </Nav>
    );
}

