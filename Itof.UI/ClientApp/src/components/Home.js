import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { NavMenu } from './NavMenu';
import DirectoryTree from './DirectoryTree';
import TableDirectoryView from './directoryViews/TableDirectoryView';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);

        this.state = {
            currentPath: '',
            drives: [],
            directoriesAtCurrentPath: [],
            filesAtCurrentPath: []
        };
    }

    componentDidMount() {
        fetch('api/FileSystem/drives')
            .then(response => response.json())
            .then(data => this.setState({ drives: data }));
    }

    handleNavigate = path => {
        Promise.all([
            fetch(`api/FileSystem/dirs?path=${path}`),
            fetch(`api/FileSystem/files?path=${path}`)
        ]).then(result => {

            Promise.all(result.map(response => response.json()))
                .then(jsonResults => {
                    const [dirs, files] = jsonResults;
                    this.setState({
                        currentPath: path,
                        directoriesAtCurrentPath: dirs,
                        filesAtCurrentPath: files
                    });
                });
        });
    }

    render() {
        return (
            <div style={{ paddingTop: '70px' }}>
                <NavMenu currentPath={this.state.currentPath} onNavigate={this.handleNavigate} />
                <Container fluid={true}>
                    <Row noGutters={true}>
                        <Col lg={3} sm={4}>
                            <DirectoryTree drives={this.state.drives} onNavigate={this.handleNavigate} />
                        </Col>
                        <Col lg={9} sm={8}>
                            <TableDirectoryView
                                directories={this.state.directoriesAtCurrentPath}
                                files={this.state.filesAtCurrentPath}
                                onNavigate={this.handleNavigate}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
