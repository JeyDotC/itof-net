
import React, { Component } from 'react';

export class DirectoryList extends Component {
    static displayName = DirectoryList.name;
    
    render() {
        return (
            <ul>
                {this.props.directories.map(dir => <li>{dir.name}</li>)}
            </ul>
        );
    }
}

