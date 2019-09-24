import React from 'react';
import { Input } from 'reactstrap';
import classNames from 'classnames';

export default class EntryNameEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            entryName: this.props.value
        };
    }

    handleRef = input => {
        if (input) {
            input.focus();
        }
    }

    handleFocus = e => {
        e.target.select();
    }

    handleChange = e => {
        this.setState({
            entryName: e.target.value
        });
    }

    handleKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.props.onSetEntryName(this.state.entryName);
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            this.props.onFinishEdit();
        }
    }

    render() {
        return (<Input
            type="text"
            value={this.state.entryName}
            ref={this.handleRef}
            onFocus={this.handleFocus}
            onBlur={this.props.onFinishEdit}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            onClick={e => e.stopPropagation()}/>);
    }
}