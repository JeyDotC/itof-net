import React from 'react';
import classNames from 'classnames';

export default class ContextMenu extends React.Component {

    handleCopyAsPath = () => {
        navigator.clipboard.writeText(this.props.selectedItem.fullName);
    }

    handleOpenTerminal = () => {
        const fullName = this.props.selectedItem.kind === 0 ? this.props.selectedItem.fullName : this.props.selectedItem.directory;
        fetch(`/api/Process/OsTerminal?at=${fullName}`, {
            method: 'POST'
        });
    }

    handleCreateDirectory = async () => {
        const defaultFolderName = 'Untitled Folder';
        const fullName = this.props.currentPath;
        const proposedName = [...this.props.directoriesAtCurrentPath.filter(p => p.name.startsWith(defaultFolderName))].map(d => d.name).pop();
        const lastNumber = proposedName !== undefined ? proposedName.split(' ').pop() : undefined;
        const newNumber = lastNumber === undefined ? '' : (isNaN(lastNumber) ? 1 : parseInt(lastNumber, 10) + 1);
        const newFolderName = proposedName === undefined ? defaultFolderName : `${defaultFolderName} ${newNumber}`;
        const newFullFolderName = `${fullName}/${newFolderName}`;

        const response = await fetch(`/api/FileSystem/dirs?path=${newFullFolderName}`, {
            method: 'POST'
        });

        if (response.ok) {
            await this.props.onNavigate(fullName)
            this.props.onItemSelected({ item: newFolderName, edit: true });
        } else {
            const data = await response.json();
            alert(data.message);
        }
    }

    handleCreateFile = async () => {
        const defaultFileName = 'Untitled';
        const fullName = this.props.currentPath;
        const proposedName = [...this.props.filesAtCurrentPath.filter(p => p.name.startsWith(defaultFileName))].map(d => d.name).pop();
        const lastNumber = proposedName !== undefined ? proposedName.split(' ').pop() : undefined;
        const newNumber = lastNumber === undefined ? '' : (isNaN(lastNumber) ? 1 : parseInt(lastNumber, 10) + 1);
        const newFileName = proposedName === undefined ? `${defaultFileName}.txt` : `${defaultFileName} ${newNumber}.txt`;
        const newFullFileName = `${fullName}/${newFileName}`;

        const response = await fetch(`/api/FileSystem/files?path=${newFullFileName}`, {
            method: 'POST'
        })

        if (response.ok) {
            await this.props.onNavigate(fullName);
            this.props.onItemSelected({ item: newFileName, edit: true });
        } else {
            const data = await response.json();
            alert(data.message);
        }
    }

    handleRename = e => {
        e.stopPropagation();
        e.preventDefault();
        this.props.onItemSelected({ item: this.props.selectedItem, edit: true });
    }

    handleSelectForCopy = e => {
        this.props.onSelectedForCopy({ item: this.props.selectedItem });
    }

    handlePaste = e => {
        this.props.onPaste({ source: this.props.selectedForCopy, pasteKind: "copy" });
    }

    render() {
        const isDir = this.props.selectedItem && this.props.selectedItem.kind === 0;
        const selectedBlank = !this.props.selectedItem || this.props.selectedItem.name === undefined;
        const canPaste = selectedBlank && this.props.selectedForCopy !== undefined;

        return (<div className="dropdown-menu" style={{
            display: this.props.show ? 'block' : 'none',
            position: 'fixed',
            left: this.props.x,
            top: this.props.y
        }}>
            {canPaste && <button className="dropdown-item" type="button" onClick={this.handlePaste}>Paste</button>}
            {!(selectedBlank || isDir) && <button className="dropdown-item" type="button" onClick={this.handleSelectForCopy}>Copy</button>}
            {!selectedBlank && <button className="dropdown-item" type="button" onClick={this.handleRename}>Rename</button>}
            {!selectedBlank && <button className={classNames("dropdown-item", "text-danger")} type="button" onClick={() => this.props.onDeleteEntry(this.props.selectedItem)}>Delete</button>}
            {(!selectedBlank || canPaste) && <div className="dropdown-divider"></div>}
            <button className="dropdown-item" type="button" onClick={this.handleOpenTerminal}>Open Terminal Here</button>
            <button className="dropdown-item" type="button" onClick={this.handleCopyAsPath}>Copy Path</button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" type="button" onClick={this.handleCreateDirectory}>Create Directory</button>
            <button className="dropdown-item" type="button" onClick={this.handleCreateFile}>Create File</button>
        </div>);
    }
}