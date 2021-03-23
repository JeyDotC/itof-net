import React, { useState } from 'react';
import { Table } from 'reactstrap';
import './TableDirectoryView.css';
import classNames from 'classnames';
import FileSystemEntryIcon from '../FileSystemEntryIcon';
import EntryNameEditor from '../EntryNameEditor';
import humanFileSize from '../../services/humanFileSize';
import { parseISO } from 'date-fns/fp';
import { format } from 'date-fns';

export default function TableDirectoryView(props) {

    const {
        currentFileSystemEntry,
        isEditingFileSystemEntry,
        currentPath,
        directories,
        files,
        onItemSelected,
        onContextMenu,
        onFinishEdit,
        onSetEntryName,
        onItemOpen,
    } = props;

    const [currentItemKey, setCurrentItemKey] = useState(undefined);
    const [lastClick, setLastClick] = useState(0);

    const handleClick = (pickedElement) => {
        const newItemKey = pickedElement.fullName;
        const currentTime = Date.now();
        // First click on an element.
        if (currentItemKey !== newItemKey) {
            setCurrentItemKey(newItemKey);
            onItemSelected({ item: pickedElement });
        } else {
            // Second click on an element.
            const interval = currentTime - lastClick;
            if (interval <= 500) {
                onItemOpen(pickedElement);
            } else if (interval > 500 && interval < 1000) {
                onItemSelected({ item: pickedElement, edit: true });
            }
        }
        setLastClick(currentTime);
    }

    const isHidden = name => name.startsWith('.');

    const renderFileSystemEntry = ({ entry, color = undefined }) => {
        const isFolder = entry.kind === 0;
        const isFile = entry.kind === 1;
        const isCurrentlyPickedEntry = entry.fullName === (currentFileSystemEntry || { fullName: undefined }).fullName;
        const isEditingFileSystemEntryName = isCurrentlyPickedEntry && isEditingFileSystemEntry;
        const dateFormat = "PP 'at' pp";
        const { dateCreated, dateModified } = entry;

        const classes = {
            'text-muted': isHidden(entry.name),
            'directory-row': isFolder,
            'file-row': isFile,
            'table-primary': isCurrentlyPickedEntry
        };

        return (<tr className={classNames(classes)}
            onContextMenu={e => onContextMenu(entry, e)}
            onClick={() => handleClick(entry)} >
            <td>
                <FileSystemEntryIcon entry={entry} color={color} />
            </td>
            <th scope="row">
                {isEditingFileSystemEntryName && <EntryNameEditor value={entry.name} onFinishEdit={onFinishEdit} onSetEntryName={onSetEntryName} />}
                {!isEditingFileSystemEntryName && entry.name}
            </th>
            <td className="text-right"><small>{dateCreated && format(parseISO(dateCreated), dateFormat)}</small></td>
            <td className="text-right"><small>{dateModified && format(parseISO(dateModified), dateFormat)}</small></td>
            <td className="text-right">
                {entry.kind === 1 ? humanFileSize(entry.size) : ''}
            </td>
        </tr>);
    }


    const FileSystemEntry = props => renderFileSystemEntry(props);
    let currentDirectoryParts = currentPath.split('/');
    currentDirectoryParts.pop();
    const upperFile = {
        fullName: currentDirectoryParts.join('/'),
        kind: 0,
        name: ' ..',
        dateCreated: undefined,
        dateModified: undefined,
        directory: "",
        extension: "",
        mime: "",
        size: 0
    };
    return (
        <Table size={'sm'} hover={true} className={'table-directory-view'}>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th className="text-right">Date Created</th>
                    <th className="text-right">Date Modified</th>
                    <th className="text-right">Size</th>
                </tr>
            </thead>
            <tbody>
                {currentDirectoryParts.length > 0 && <FileSystemEntry entry={upperFile} color={'brown'} />}
                {directories.map(d => <FileSystemEntry key={d.fullName} entry={d} color={'brown'} />)}
                {files.map(f => <FileSystemEntry key={f.fullName} entry={f} />)}
            </tbody>
        </Table>
    );
}
