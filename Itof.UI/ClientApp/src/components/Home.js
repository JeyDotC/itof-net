import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { NavMenu } from './NavMenu';
import DirectoryTree from './DirectoryTree';
import TableDirectoryView from './directoryViews/TableDirectoryView';
import ContextMenu from './ContextMenu'

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
            isEditingFileSystemEntry: false
        };
    }

    componentDidMount() {
        fetch('api/FileSystem/drives')
            .then(response => response.json())
            .then(data => this.setState({ drives: data }));
        document.addEventListener('keydown', this.handleGlobalKeyBoard);
    }

    handleGlobalKeyBoard = event => {
        if (event.key === 'F2' && this.state.currentFileSystemEntry !== undefined) {
            this.setState({isEditingFileSystemEntry: true});
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

    handleNavigate = path => new Promise((resolve, reject) => {
        Promise.all([
            fetch(`api/FileSystem/dirs?path=${path}`),
            fetch(`api/FileSystem/files?path=${path}`)
        ]).then(result => {
            const validResults = result.filter(response => response.ok);
            const inValidResults = result.filter(response => !response.ok);

            if (validResults.length > 0) {
                Promise.all(validResults.map(response => response.json()))
                .then(jsonResults => {
                    const [dirs, files] = jsonResults;
                    this.setState({
                        currentPath: path,
                        directoriesAtCurrentPath: dirs,
                        filesAtCurrentPath: files,
                        contextMenuOpen: false
                    });
                    resolve(path);
                });
            }

            if (inValidResults.length > 0) {
                inValidResults[0].json()
                .then(jsonResults => {
                    alert(jsonResults.message);
                });
                reject(path);
            }
         });
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

    handleSetEntryName = entryName => fetch(`/api/FileSystem/dirs?path=${this.state.currentFileSystemEntry.fullName}&newPath=${this.state.currentFileSystemEntry.directory}/${entryName}`, {
            method: 'PUT'
        }).then(response => {
            if (response.ok) {
                this.handleNavigate(this.state.currentFileSystemEntry.directory);
            } else {
                response.json()
                .then(jsonResults => {
                    alert(jsonResults.message);
                });
            }
        });

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
                    show={this.state.contextMenuOpen}
                    currentPath={this.state.currentPath}
                    directoriesAtCurrentPath={this.state.directoriesAtCurrentPath}
                    onNavigate={this.handleNavigate}
                    onItemSelected={this.handleItemSelected}
                    x={this.state.contextMenuPosition.x}
                    y={this.state.contextMenuPosition.y} />
            </div>
        );
    }
}
