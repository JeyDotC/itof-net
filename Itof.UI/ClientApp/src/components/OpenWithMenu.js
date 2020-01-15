import React from 'react';

export default class OpenWithMenu extends React.Component {

    handleOpenFileWith = app => this.props.onOpenFileWith(app);

    render(){
        const apps = this.props.apps;
        return (
            <div className="list-group">
                {apps.map(app => <a key={app.name} href="#" className="list-group-item list-group-item-action" onClick={() => this.handleOpenFileWith(app)}>{app.name}</a>)}
            </div>
        );
    }
};