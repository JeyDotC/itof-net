import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);

        this.state = {
            folders: []
        };
    }

    componentDidMount() {
        fetch('api/SampleData/folders')
            .then(response => response.json())
            .then(data => this.setState({ folders: data }));
    }

    render() {
        console.log(this.state);
        return (
            <ul>
                {this.state.folders.map(folderName => <li>{folderName}</li>)}
            </ul>
        );
    }
}
