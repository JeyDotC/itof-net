import React from 'react';
import classNames from 'classnames';

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

    handleCreateFile = () => {
        const defaultFileName = 'Untitled';
        const fullName = this.props.currentPath;
        const proposedName = [...this.props.filesAtCurrentPath.filter(p => p.name.startsWith(defaultFileName))].map(d => d.name).pop();
        const lastNumber = proposedName !== undefined ? proposedName.split(' ').pop() : undefined;
        const newNumber = lastNumber === undefined ? '' : (isNaN(lastNumber) ? 1 : parseInt(lastNumber) + 1);
        const newFileName = proposedName === undefined ? `${defaultFileName}.txt` : `${defaultFileName} ${newNumber}.txt`;
        const newFullFileName = `${fullName}/${newFileName}`;

        fetch(`/api/FileSystem/files?path=${newFullFileName}`, {
            method: 'POST'
        }).then(response => {
            if (response.ok) {
                this.props.onNavigate(fullName).then(() => this.props.onItemSelected({ item: newFileName, edit: true }));
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
        const isFile = this.props.selectedItem && this.props.selectedItem.kind === 1;
        const isDir = this.props.selectedItem && this.props.selectedItem.kind === 0;

        return (<div className="dropdown-menu" style={{
            display: this.props.show ? 'block' : 'none',
            position: 'fixed',
            left: this.props.x,
            top: this.props.y
        }}>
            <button className="dropdown-item" type="button" onClick={this.handleRename}>Rename</button>
            <button className={classNames("dropdown-item", "text-danger")} type="button" onClick={() => this.props.onDeleteEntry(this.props.selectedItem)}>Delete</button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" type="button" onClick={this.handleOpenTerminal}>Open Terminal Here</button>
            <button className="dropdown-item" type="button" onClick={this.handleCopyAsPath}>Copy Path</button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" type="button" onClick={this.handleCreateDirectory}>Create Directory</button>
            <button className="dropdown-item" type="button" onClick={this.handleCreateFile}>Create File</button>
        </div>);
    }
}