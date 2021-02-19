import React, { useState } from 'react';
import { Container, Navbar } from 'reactstrap';
import DirectoryBar from './DirectoryBar';
import './NavMenu.css';

export function NavMenu(props) {

    const { currentPath, onNavigate } = props;

    const [collapsed, setCollapsed] = useState(true);
    const [editingPath, setEditingPath] = useState(false);
    const [pathBeingEdited, setPathBeingEdited] = useState(currentPath);


    const toggleNavbar = () => {
        setCollapsed(!collapsed);
    };

    const handleEditPath = () => {
        setEditingPath(true);
        setPathBeingEdited(currentPath);
    };

    const handleFinishEditPath = () => {
        setEditingPath(false);
    };

    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onNavigate(pathBeingEdited);
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            handleFinishEditPath();
        }
    };

    const handlePathInputChanged = e => {
        setPathBeingEdited(e.target.value);
    }

    const handleFocus = e => {
        const value = e.target.value;
        e.target.value = '';
        e.target.value = value;
    }

    return (
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" fixed={"top"} light={true}>
            <Container className="border" onClick={handleEditPath}>
                {!editingPath && <DirectoryBar className="navbar-left" currentPath={currentPath || ''} onNavigate={onNavigate} />}
                {editingPath && <input ref={input => input && input.focus()}
                    className="form-control"
                    type="text"
                    onChange={handlePathInputChanged}
                    onKeyDown={handleKeyDown}
                    onBlur={handleFinishEditPath}
                    onFocus={handleFocus}
                    value={pathBeingEdited} />}
            </Container>
        </Navbar>
    );
}
