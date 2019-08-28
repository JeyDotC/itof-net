import React, { Component } from 'react';
import DriveTreeNode from './DriveTreeNode'

export default class DirectoryTree extends Component {
    static displayName = DirectoryTree.name;

    constructor(props) {
        super(props);

        this.state = {
            drives: [],
            directories: []
        };
    }

     componentDidMount() {
        fetch('api/FileSystem/drives')
            .then(response => response.json())
            .then(data => this.setState({ drives: data }));
    }

    render() {
        console.log(this.state);
        return (
            <ul>
                {this.state.drives.map(drive => <li>
                    <DriveTreeNode drive={drive} />
                </li>)}
            </ul>
        );
    }
}

