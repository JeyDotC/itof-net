import React from 'react';
import { Table } from 'reactstrap';
import './TableDirectoryView.css';
import classNames from 'classnames';
import FileSystemEntryIcon from '../FileSystemEntryIcon';
import EntryNameEditor from '../EntryNameEditor';

export default class TableDirectoryView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentItemKey: undefined,
            lastClick: 0
        };
    }

    handleClick = (pickedElement) => {
        const newItemKey = pickedElement.fullName;
        const currentTime = Date.now();
        // First click on an element.
        if (this.state.currentItemKey !== newItemKey) {
            this.setState({ currentItemKey: newItemKey });
            this.props.onItemSelected({ item: pickedElement });
        } else
            // Second click on an element.
            if ((currentTime - this.state.lastClick) <= 500) {
                this.props.onItemOpen(pickedElement);
            }

        this.setState({ lastClick: currentTime });
    }

    isHidden = name => name.startsWith('.');

    renderFileSystemEntry({ entry, color = undefined }) {
        const isFolder = entry.kind === 0;
        const isFile = entry.kind === 1;
        const isCurrentlyPickedEntry = entry.fullName === (this.props.currentFileSystemEntry || { fullName: undefined }).fullName;
        const isEditingFileSystemEntry = isCurrentlyPickedEntry && this.props.isEditingFileSystemEntry;

        const classes = {
            'text-muted': this.isHidden(entry.name),
            'directory-row': isFolder,
            'file-row': isFile,
            'table-primary': isCurrentlyPickedEntry
        };

        return (<tr className={classNames(classes)}
            onContextMenu={e => this.props.onContextMenu(entry, e)}
            onClick={() => this.handleClick(entry)} >
            <td>
                <FileSystemEntryIcon entry={entry} color={color} />
            </td>
            <th scope="row">
                {isEditingFileSystemEntry && <EntryNameEditor value={entry.name} />}
                {!isEditingFileSystemEntry && entry.name}
            </th>
        </tr>);
    }

    render() {
        const FileSystemEntry = props => this.renderFileSystemEntry(props);
        let currentDirectoryParts = this.props.currentPath.split('/');
        currentDirectoryParts.pop();
        const upperFile = {
            fullName: currentDirectoryParts.join('/'),
            kind: 0,
            name: ' ..'
        };
        return (
            <Table size={'sm'} hover={true} className={'table-directory-view'}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {currentDirectoryParts.length > 0 && <FileSystemEntry entry={upperFile} color={'brown'} />}
                    {this.props.directories.map(d => <FileSystemEntry key={d.fullName} entry={d} color={'brown'} />)}
                    {this.props.files.map(f => <FileSystemEntry key={f.fullName} entry={f}  />)}
                </tbody>
            </Table>
        );
    }
}