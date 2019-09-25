import React from 'react';

export default class ContextMenu extends React.Component {

    handleCopyAsPath = () => {
        navigator.clipboard.writeText(this.props.selectedItem.fullName);
    }

    handleOpenTerminal = () => {
        const fullName = this.props.selectedItem.kind === 0 ? this.props.selectedItem.fullName : this.props.selectedItem.directory
        fetch(`/api/Process/OsTerminal?at=${fullName}`, {
            method: 'POST'
        });
    }

    handleCreateDirectory = () => {
        const defaultFolderName = 'Untitled Folder';
        const fullName = this.props.currentPath;
        const proposedName = [...this.props.directoriesAtCurrentPath.filter(p => p.name.startsWith(defaultFolderName))].map(d => d.name).pop();
        const lastNumber = proposedName !== undefined ? proposedName.split(' ').pop() : undefined;
        const newNumber = lastNumber === undefined ? '' : (isNaN(lastNumber) ? 1 : parseInt(lastNumber) + 1);
        const newFolderName = proposedName === undefined ? defaultFolderName : `${defaultFolderName} ${newNumber}`;
        const newFullFolderName = `${fullName}/${newFolderName}`;

        fetch(`/api/FileSystem/dirs?path=${newFullFolderName}`, {
            method: 'POST'
        }).then(response => {
            if (response.ok) {
                this.props.onNavigate(fullName).then(() => this.props.onItemSelected({ item: newFolderName, edit: true }));
            } else {
                response.json().then(data => alert(data.message));
            }
        });
    }

    handleRename = e => {
        e.stopPropagation();
        e.preventDefault();
        this.props.onItemSelected({ item: this.props.selectedItem, edit: true });
    }

    render() {
        return (<div className="dropdown-menu" style={{
            display: this.props.show ? 'block' : 'none',
            position: 'fixed',
            left: this.props.x,
            top: this.props.y
        }}>
            <button className="dropdown-item" type="button" onClick={this.handleRename}>Rename</button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" type="button" onClick={this.handleOpenTerminal}>Open Terminal Here</button>
            <button className="dropdown-item" type="button" onClick={this.handleCopyAsPath}>Copy Path</button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" type="button" onClick={this.handleCreateDirectory}>Create Directory</button>
        </div>);
    }
}