import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export default class DirectoryBar extends Component {
    static displayName = DirectoryBar.name;

    renderPart = (path, part) => <BreadcrumbItem key={path} tag={"a"} href="#" onClick={() => this.props.onNavigate(path)}>{part}</BreadcrumbItem>;

    render() {
        const parts = this.props.currentPath.split('/');
        let root = '/';
        return (
            <Breadcrumb className={'list-group-horizontal'}>
                {this.renderPart(root, 'Root')}
                {parts.filter(part => part.length != 0).map((part, index) => {
                    let path = `${root}/${part}`;
                    root = path;
                    return this.renderPart(root, part);
                })}
            </Breadcrumb>
        );
    }
}
