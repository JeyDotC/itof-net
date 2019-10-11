import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { NavMenu } from './NavMenu';
import DirectoryTree from './DirectoryTree';
import TableDirectoryView from './directoryViews/TableDirectoryView';
import ContextMenu from './ContextMenu';
import * as signalR from '@aspnet/signalr';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);

        this.state = {
            currentPath: '',
            drives: [],
            directoriesAtCurrentPath: [],
            filesAtCurrentPath: [],
            contextMenuOpen: false,
            contextMenuPosition: { x: 0, y: 0 },
            currentFileSystemEntry: undefined,
            selectedForCopy: undefined,
            isEditingFileSystemEntry: false
        };
    }

    async componentDidMount() {
        const response = await fetch('api/FileSystem/drives');
        const data = await response.json();

        this.setState({ drives: data });

        document.addEventListener('keydown', this.handleGlobalKeyBoard);

        this.connection = new signalR.HubConnectionBuilder().withUrl("/fileSystemHub").build();

        this.connection.on('DirectoryChanged', this.handleDirectoryChanged);

        try {
            await this.connection.start();
            console.log('Connected');
        } catch (err) {
            console.log('Connection failed', err);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleGlobalKeyBoard);
    }

    handleDirectoryChanged = path => {

        if (this.state.isEditingFileSystemEntry) {
            return;
        }

        this.handleNavigate(this.state.currentPath);
    }

    handleGlobalKeyBoard = event => {
        if (this.state.currentFileSystemEntry !== undefined) {
            switch (event.key) {
                case 'F2':
                    this.setState({ isEditingFileSystemEntry: true });
                    break;
                case 'Delete':
                    this.handleDeleteEntry(this.state.currentFileSystemEntry);
                    break;
                case 'c':
                    event.ctrlKey && this.state.currentFileSystemEntry.kind === 1 && this.handleSelectedForCopy({ item: this.state.currentFileSystemEntry });
                    break;
                default: break;
            }
        }
        if (this.state.selectedForCopy !== undefined) {
            switch (event.key) {
                case 'v':
                    event.ctrlKey && this.handlePaste({ source: this.state.selectedForCopy });
                    break;
                default: break;
            }
        }
    }

    handleItemOpen = item => {
        const isFolder = item.kind === 0;
        const isFile = item.kind === 1;

        if (isFolder) {
            this.handleNavigate(item.fullName);
        } else if (isFile) {
            this.openFile(item.fullName);
        }
    }

    openFile = fullName => fetch(`/api/Process/OsOpen?file=${fullName}`, {
        method: 'POST'
    });

    handleItemSelected = ({ item, edit = false }) => {
        let currentItem = item;
        if (typeof item === 'string') {
            currentItem = this.state.directoriesAtCurrentPath.find(d => d.name === item) || this.state.filesAtCurrentPath.find(f => f.name === item);
        }
        this.setState({
            contextMenuOpen: false,
            currentFileSystemEntry: currentItem,
            isEditingFileSystemEntry: edit
        });
    }

    handleSelectedForCopy = ({ item }) => {
        this.setState({
            selectedForCopy: item,
        });
    }

    handleNavigate = path => new Promise(async (resolve, reject) => {
        const result = await Promise.all([
            fetch(`api/FileSystem/dirs?path=${path}`),
            fetch(`api/FileSystem/files?path=${path}`)
        ]);

        const validResults = result.filter(response => response.ok);
        const inValidResults = result.filter(response => !response.ok);

        if (validResults.length > 0) {
            const [dirs, files] = await Promise.all(validResults.map(response => response.json()));
            this.setState({
                currentPath: path,
                directoriesAtCurrentPath: dirs,
                filesAtCurrentPath: files,
                contextMenuOpen: false
            });

            resolve(path);

            this.connection && this.connection.invoke('ListenTo', path).catch(err => console.error(err.toString()));
        }

        if (inValidResults.length > 0) {
            const error = await inValidResults[0].json();
            alert(error.message);
            reject(path);
        }
    });

    handleContextMenu = (fileSystemEntry, e) => {
        e.preventDefault();
        e.stopPropagation();

        if (fileSystemEntry !== undefined) {
            this.setState({
                contextMenuOpen: true,
                contextMenuPosition: { x: e.clientX, y: e.clientY },
                currentFileSystemEntry: fileSystemEntry
            });
        }
    }

    handleFinishEdit = () => this.setState({ isEditingFileSystemEntry: false });

    handleSetEntryName = async entryName => {
        const response = await fetch(`/api/FileSystem/dirs?path=${this.state.currentFileSystemEntry.fullName}&newPath=${this.state.currentFileSystemEntry.directory}/${entryName}`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            this.handleNavigate(this.state.currentFileSystemEntry.directory);
        } else {
            const jsonResults = await response.json();
            alert(jsonResults.message);
        }
    }

    handleDeleteEntry = fileSystemEntry => new Promise(async (resolve, reject) => {

        const kindName = fileSystemEntry.kind === 0 ? 'directory' : 'file';

        if (!window.confirm(`Are you sure to delete ${kindName} ${fileSystemEntry.name}?\nDeletion is PERMANENT!`)) {
            return reject();
        }

        const apiPart = fileSystemEntry.kind === 0 ? 'dirs' : 'files';

        const response = await fetch(`/api/FileSystem/${apiPart}?path=${fileSystemEntry.fullName}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            this.handleNavigate(this.state.currentPath);
            resolve();
        } else {
            const jsonResults = await response.json();
            alert(jsonResults.message);
            reject();
        }
    });

    handlePaste = async ({ source }) => {
        const destination = `${this.state.currentPath}/${source.name}`;
        const result = await fetch(`/api/FileSystem/files/copy?source=${source.fullName}&destination=${destination}`, {
            method: 'POST'
        });

        if (result.ok) {
            this.setState({ selectedForCopy: undefined });
            this.handleNavigate(this.state.currentPath);
        } else {
            const error = await result.json();
            alert(error.message);
        }
    }

    render() {
        return (
            <div style={{ paddingTop: '70px', minHeight: '600px' }}
                onClick={() => this.setState({ contextMenuOpen: false })}
                onContextMenu={e => this.handleContextMenu({ fullName: this.state.currentPath, kind: 0 }, e)}>
                <NavMenu currentPath={this.state.currentPath} onNavigate={this.handleNavigate} />
                <Container fluid={true}>
                    <Row noGutters={true}>
                        <Col lg={3} sm={4}>
                            <DirectoryTree drives={this.state.drives} onNavigate={this.handleNavigate} />
                        </Col>
                        <Col lg={9} sm={8}>
                            <TableDirectoryView
                                currentPath={this.state.currentPath}
                                currentFileSystemEntry={this.state.currentFileSystemEntry}
                                isEditingFileSystemEntry={this.state.isEditingFileSystemEntry}
                                directories={this.state.directoriesAtCurrentPath}
                                files={this.state.filesAtCurrentPath}
                                onItemSelected={this.handleItemSelected}
                                onSetEntryName={this.handleSetEntryName}
                                onItemOpen={this.handleItemOpen}
                                onContextMenu={this.handleContextMenu}
                                onFinishEdit={this.handleFinishEdit}
                            />
                            <div id="bottom-gutter" style={{ height: '300px' }} />
                        </Col>
                    </Row>
                </Container>
                <ContextMenu
                    selectedItem={this.state.currentFileSystemEntry}
                    selectedForCopy={this.state.selectedForCopy}
                    show={this.state.contextMenuOpen}
                    currentPath={this.state.currentPath}
                    directoriesAtCurrentPath={this.state.directoriesAtCurrentPath}
                    filesAtCurrentPath={this.state.filesAtCurrentPath}
                    onNavigate={this.handleNavigate}
                    onDeleteEntry={this.handleDeleteEntry}
                    onItemSelected={this.handleItemSelected}
                    onSelectedForCopy={this.handleSelectedForCopy}
                    onPaste={this.handlePaste}
                    x={this.state.contextMenuPosition.x}
                    y={this.state.contextMenuPosition.y} />
            </div>
        );
    }
}
