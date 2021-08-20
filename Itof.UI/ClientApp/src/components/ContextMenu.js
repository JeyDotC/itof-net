import React from 'react';
import classNames from 'classnames';
import { proposeFolderName, proposeFileName } from "../services/NameProposer"

export default function ContextMenu(props) {
    const {
        x,
        y,
        selectedItem,
        currentPath,
        directoriesAtCurrentPath,
        filesAtCurrentPath,
        selectedForCopy,
        onNavigate,
        onItemSelected,
        onSelectedForCopy,
        onPaste,
        onOpenWith,
        onDeleteEntry,
        show,
    } = props;

    const handleCopyAsPath = () => {
        navigator.clipboard.writeText(selectedItem.fullName);
    }

    const handleOpenTerminal = () => {
        const fullName = selectedItem.kind === 0 ? selectedItem.fullName : selectedItem.directory;
        fetch(`/api/Process/OsTerminal?at=${fullName}`, {
            method: 'POST'
        });
    }

    const handleCreateDirectory = async () => {
        console.log('handleCreateDirectory');
        const newFullFolderName = proposeFolderName({ currentPath, directoriesAtCurrentPath });

        const response = await fetch(`/api/FileSystem/dirs?path=${newFullFolderName.fullName}`, {
            method: 'POST'
        });

        if (response.ok) {
            await onNavigate(currentPath)
            onItemSelected({ item: newFullFolderName.name, edit: true });
        } else {
            const data = await response.json();
            alert(data.message);
        }
    }

    const handleCreateFile = async () => {
        const newFullFileName = proposeFileName({ currentPath, filesAtCurrentPath });

        const response = await fetch(`/api/FileSystem/files?path=${newFullFileName.fullName}`, {
            method: 'POST'
        })

        if (response.ok) {
            await onNavigate(currentPath);
            onItemSelected({ item: newFullFileName.name, edit: true });
        } else {
            const data = await response.json();
            alert(data.message);
        }
    }

    const handleRename = e => {
        e.stopPropagation();
        e.preventDefault();
        onItemSelected({ item: selectedItem, edit: true });
    }

    const handleSelectForCopy = e => {
        onSelectedForCopy({ item: selectedItem });
    }

    const handlePaste = e => {
        onPaste({ source: selectedForCopy, pasteKind: "copy" });
    }

    const handleOpenWith = e => {
        onOpenWith({ item: selectedItem });
    }


    const selectedBlank = !selectedItem || selectedItem.name === undefined;
    const canPaste = selectedBlank && selectedForCopy !== undefined;

    return (<div className="dropdown-menu" style={{
        display: show ? 'block' : 'none',
        position: 'fixed',
        left: x,
        top: y
    }}>
        {canPaste && <button className="dropdown-item" type="button" onClick={handlePaste}>Paste</button>}

        <button className="dropdown-item" type="button" onClick={handleOpenWith}>Open With...</button>
        {!selectedBlank && <button className="dropdown-item" type="button" onClick={handleSelectForCopy}>Copy</button>}
        {!selectedBlank && <button className="dropdown-item" type="button" onClick={handleRename}>Rename</button>}
        {!selectedBlank && <button className={classNames("dropdown-item", "text-danger")} type="button" onClick={() => onDeleteEntry(selectedItem)}>Delete</button>}
        {(!selectedBlank || canPaste) && <div className="dropdown-divider"></div>}
        <button className="dropdown-item" type="button" onClick={handleOpenTerminal}>Open Terminal Here</button>
        <button className="dropdown-item" type="button" onClick={handleCopyAsPath}>Copy Path</button>
        <div className="dropdown-divider"></div>
        <button className="dropdown-item" type="button" onClick={handleCreateDirectory}>Create Directory</button>
        <button className="dropdown-item" type="button" onClick={handleCreateFile}>Create File</button>
    </div>);

}