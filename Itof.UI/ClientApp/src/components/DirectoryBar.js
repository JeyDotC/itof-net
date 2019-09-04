import React, { Component } from 'react';
import { ButtonGroup, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHdd } from '@fortawesome/free-solid-svg-icons'

export default class DirectoryBar extends Component {
    static displayName = DirectoryBar.name;

    renderPart = (path, part) => <Button key={path} color={'default'} onClick={() => this.props.onNavigate(path)}>{part} &rsaquo;</Button>;

    render() {
        const parts = this.props.currentPath.split('/').filter(part => part.length !== 0);
        let root = parts.shift();
        return (
            <ButtonGroup size={'sm'}>
                {this.renderPart(root, <React.Fragment>
                    <FontAwesomeIcon icon={faHdd} /> {root || '/'}
                </React.Fragment>)}
                {parts.map(part => {
                    let path = `${root}/${part}`;
                    root = path;
                    return this.renderPart(root, part);
                })}
            </ButtonGroup>
        );
    }
}
