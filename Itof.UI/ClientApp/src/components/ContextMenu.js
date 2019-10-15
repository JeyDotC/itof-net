import React from 'react';
import classNames from 'classnames';
import { proposeFolderName, proposeFileName } from "../services/NameProposer"

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
        console.log('handleCreateDirectory');
        const currentPath = this.props.currentPath;
        const directoriesAtCurrentPath = this.props.directoriesAtCurrentPath;
        const newFullFolderName = proposeFolderName({ currentPath, directoriesAtCurrentPath });

        const response = await fetch(`/api/FileSystem/dirs?path=${newFullFolderName.fullName}`, {
            method: 'POST'
        });

        if (response.ok) {
            await this.props.onNavigate(currentPath)
            this.props.onItemSelected({ item: newFullFolderName.name, edit: true });
        } else {
            const data = await response.json();
            alert(data.message);
        }
    }

    handleCreateFile = async () => {
        const currentPath = this.props.currentPath;
        const filesAtCurrentPath = this.props.filesAtCurrentPath;
        const newFullFileName = proposeFileName({ currentPath, filesAtCurrentPath });

        const response = await fetch(`/api/FileSystem/files?path=${newFullFileName.fullName}`, {
            method: 'POST'
        })

        if (response.ok) {
            await this.props.onNavigate(currentPath);
            this.props.onItemSelected({ item: newFullFileName.name, edit: true });
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