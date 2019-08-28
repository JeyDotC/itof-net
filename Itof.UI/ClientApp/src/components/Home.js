import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);

        this.state = {
            folders: []
        };
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
