import React, { Component } from 'react';
import { ButtonGroup, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHdd } from '@fortawesome/free-solid-svg-icons'

export default class DirectoryBar extends Component {
    static displayName = DirectoryBar.name;

    renderPart = ({ path, part }) => <Button key={path} color={'default'} onClick={() => this.props.onNavigate(path)}>{part} &rsaquo;</Button>;

    render() {
        const currentPath = this.props.currentPath;
        const parts = [(currentPath.startsWith('/') ? '/' : ''), ...currentPath.split('/')].filter(part => part.length !== 0);
        let root = parts.shift();
        const Part = props => this.renderPart(props);

        return (
            <ButtonGroup size={'sm'}>
                <Part path={root} part={<React.Fragment>
                    <FontAwesomeIcon icon={faHdd} /> {root || '/'}
                </React.Fragment>} />
                {parts.map(part => {
                    let path = `${root}/${part}`;
                    root = path;
                    return <Part key={path} path={path} part={part} />
                })}
            </ButtonGroup>
        );
    }
}
