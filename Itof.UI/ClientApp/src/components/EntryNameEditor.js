import React from 'react';
import { Input } from 'reactstrap';
import classNames from 'classnames';

export default class EntryNameEditor extends React.Component {

    render() {
        return (<Input type="text" value={this.props.value} ref={input => input && input.focus()} />);
    }
}