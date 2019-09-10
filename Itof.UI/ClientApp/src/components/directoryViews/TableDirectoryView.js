import React from 'react';
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons'
import './TableDirectoryView.css';
import classNames from 'classnames';

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
            this.props.onItemSelected(pickedElement);
        }else
        // Second click on an element.
        if ((currentTime - this.state.lastClick) <= 500) {
            this.props.onItemOpen(pickedElement);
        }

        this.setState({ lastClick: currentTime });
    }

    isHidden = name => name.startsWith('.');

    renderFileSystemEntry({ entry, icon, color = undefined }) {
        const isFolder = entry.kind === 0;
        const isFile = entry.kind === 1;
        const isCurrentlyPickedEntry = entry.fullName === (this.props.currentFileSystemEntry || {fullName:undefined}).fullName;
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
                            <FontAwesomeIcon icon={icon} color={color} />
                        </td>
                        <th scope="row">{entry.name}</th>
                    </tr>);
    }

    render() {
        const FileSystemEntry = props => this.renderFileSystemEntry(props);

        return (
            <Table size={'sm'} hover={true} className={'table-directory-view'}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.directories.map(d => <FileSystemEntry key={d.fullName} entry={d} icon={faFolder} color={'brown'} />)}
                    {this.props.files.map(f => <FileSystemEntry key={f.fullName}  entry={f} icon={faFile} />)}
                </tbody>
            </Table>
        );
    }
}