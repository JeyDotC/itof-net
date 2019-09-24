import React, { Component } from 'react';
import { Container, Navbar } from 'reactstrap';
import DirectoryBar from './DirectoryBar';
import './NavMenu.css';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true,
            editingPath: false,
            pathBeingEdited: this.props.currentPath
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    handleEditPath = () => {
        this.setState({
            editingPath: true,
            pathBeingEdited: this.props.currentPath
        });
    }

    handleFinishEditPath = () => {
        this.setState({
            editingPath: false
        });
    }

    handleKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.props.onNavigate(this.state.pathBeingEdited);
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            this.handleFinishEditPath();
        }
    }

    handlePathInputChanged = e => {
        this.setState({
            pathBeingEdited: e.target.value
        });
    }

    handleFocus = e => {
        const value = e.target.value;
        e.target.value = '';
        e.target.value = value;
    }

    render() {
        return (
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" fixed={"top"} light={true}>
                <Container className="border" onClick={this.handleEditPath}>
                    {!this.state.editingPath && <DirectoryBar className="navbar-left" currentPath={this.props.currentPath || ''} onNavigate={this.props.onNavigate} />}
                    {this.state.editingPath && <input ref={input => input && input.focus()}
                        className="form-control"
                        type="text"
                        onChange={this.handlePathInputChanged}
                        onKeyDown={this.handleKeyDown}
                        onBlur={this.handleFinishEditPath}
                        onFocus={this.handleFocus}
                        value={this.state.pathBeingEdited} />}
                </Container>
            </Navbar>
        );
    }
}
