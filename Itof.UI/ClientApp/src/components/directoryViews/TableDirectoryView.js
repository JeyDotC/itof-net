import React from 'react';
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import './TableDirectoryView.css';
import classNames from 'classnames';

library.add(fas);
library.add(fab);

export default class TableDirectoryView extends React.Component {

    static IconMap = {
        'image': 'image',
        'audio': 'volume-up',
        'video': 'film',
        // Text
        'plain': 'file-alt',
        'css': 'css3-alt',
        'csv': 'file-csv',
        'html': 'file-code',
        'calendar': 'calendar',
        // Application
        'xml': 'code',
        'json': ['fab', 'js'],
        'js': ['fab', 'js'],
        'javascript': ['fab', 'js'],
        'octet-stream': 'file',
        'x-compressed': 'file-archive',
        'x-zip-compressed': 'file-archive',
        'x-zip': 'file-archive',
        'zip': 'file-archive',
        'pdf': 'file-pdf',

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

    renderFileSystemEntry({ entry, color = undefined }) {
        const isFolder = entry.kind === 0;
        const isFile = entry.kind === 1;
        const isCurrentlyPickedEntry = entry.fullName === (this.props.currentFileSystemEntry || { fullName: undefined }).fullName;
        const classes = {
            'text-muted': this.isHidden(entry.name),
            'directory-row': isFolder,
            'file-row': isFile,
            'table-primary': isCurrentlyPickedEntry
        };
        const icon = isFolder ? 'folder' : TableDirectoryView.IconMap.getByMime(entry.mime);

        return (<tr className={classNames(classes)}
            onContextMenu={e => this.props.onContextMenu(entry, e)}
            onClick={() => this.handleClick(entry)} >
            <td>
                <FontAwesomeIcon icon={icon} color={color} size={'1x'} />
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
                    {currentDirectoryParts.length > 0 && <FileSystemEntry entry={upperFile} color={'brown'} />}
                    {this.props.directories.map(d => <FileSystemEntry key={d.fullName} entry={d} color={'brown'} />)}
                    {this.props.files.map(f => <FileSystemEntry key={f.fullName} entry={f}  />)}
                </tbody>
            </Table>
        );
    }
}