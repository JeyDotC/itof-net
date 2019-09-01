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

    handlePathSelected = path => {
        fetch(`api/FileSystem/dirs?path=${path}`)
            .then(response => response.json())
            .then(data => this.setState({ directoriesAtCurrentPath: data }));

    }

    render() {
        return (
            <div style={{ paddingTop: '70px' }}>
                <NavMenu />
                <Container fluid={true}>
                    <Row noGutters={true}>
                        <Col lg={3} sm={4}>
                            <DirectoryTree drives={this.state.drives} onPathSelected={this.handlePathSelected} />
                        </Col>
                        <Col lg={9} sm={8}>
                            <TableDirectoryView directories={this.state.directoriesAtCurrentPath} />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
