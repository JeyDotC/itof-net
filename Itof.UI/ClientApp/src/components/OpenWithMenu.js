import React from 'react';

export default class OpenWithMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            apps: [],
        };
    }

    async componentDidMount() {
        const response = await fetch('api/Host/applications');
        const apps = await response.json();

        this.setState({apps});

    }

    handleOpenFileWith = app => this.props.onOpenFileWith(app);

    render(){
        const apps = this.state.apps;
        return (
            <div className="list-group">
                {apps.map(app => <a key={app.name} href="#" className="list-group-item list-group-item-action" onClick={() => this.handleOpenFileWith(app)}>{app.name}</a>)}
            </div>
        );
    }
};