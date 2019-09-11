import React from 'react';
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons'
import './TableDirectoryView.css';
import classNames from 'classnames';

export default class TableDirectoryView extends React.Component {

    static IconMap = {
        'image': ['fab', 'image'],
        // Text
        'plain': ['fab', 'file-alt'],
        'css': ['fab', 'css3-alt'],
        'csv': ['fab', 'file-csv'],
        'html': ['fab', 'file-code'],
        'calendar': ['fab', 'calendar'],
        // Application
        'octet-stream': ['fab', 'file'],

        getByMime(mime) {
            if (!mime) {
                return this['octet-stream'];
            }
            const [mainType, subType] = mime.split('/');

            return this[mainType] || this[subType] || this['octet-stream'];
        }
    };

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
        } else
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
        const isCurrentlyPickedEntry = entry.fullName === (this.props.currentFileSystemEntry || { fullName: undefined }).fullName;
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
                <FontAwesomeIcon icon={TableDirectoryView.IconMap.getByMime(entry.mime)} color={color} />
            </td>
            <th scope="row">{entry.name}</th>
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
                    {currentDirectoryParts.length > 0 && <FileSystemEntry entry={upperFile} icon={faFolder} color={'brown'} />}
                    {this.props.directories.map(d => <FileSystemEntry key={d.fullName} entry={d} icon={faFolder} color={'brown'} />)}
                    {this.props.files.map(f => <FileSystemEntry key={f.fullName} entry={f} icon={faFile} />)}
                </tbody>
            </Table>
        );
    }
}