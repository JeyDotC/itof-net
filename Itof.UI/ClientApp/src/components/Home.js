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
            currentFileSystemEntry: undefined
        };
    }

    componentDidMount() {
        fetch('api/FileSystem/drives')
            .then(response => response.json())
            .then(data => this.setState({ drives: data }));
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

    handleItemSelected = item => {
        this.setState({ currentFileSystemEntry: item });
    }

    handleNavigate = path => {
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
                });
            }

            if (inValidResults.length > 0) {
                inValidResults[0].json()
                .then(jsonResults => {
                    alert(jsonResults.message);
                });
            }
         });
    }

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
                                directories={this.state.directoriesAtCurrentPath}
                                files={this.state.filesAtCurrentPath}
                                onItemSelected={this.handleItemSelected}
                                onItemOpen={this.handleItemOpen}
                                onContextMenu={this.handleContextMenu}
                            />
                            <div id="bottom-gutter" style={{ height: '300px' }} />
                        </Col>
                    </Row>
                </Container>
                <ContextMenu
                    selectedItem={this.state.currentFileSystemEntry}
                    show={this.state.contextMenuOpen}
                    x={this.state.contextMenuPosition.x}
                    y={this.state.contextMenuPosition.y} />
            </div>
        );
    }
}
