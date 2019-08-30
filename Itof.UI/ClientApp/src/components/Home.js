import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { NavMenu } from './NavMenu';
import DirectoryTree from './DirectoryTree'

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);

        this.state = {
            drives: []
        };
    }

     componentDidMount() {
        fetch('api/FileSystem/drives')
            .then(response => response.json())
            .then(data => this.setState({ drives: data }));
     }

    handlePathSelected = path => {
        console.log(path);
        console.log(this);
    }

    render() {
        return (
            <div>
            <NavMenu />
            <Container fluid={true}>
                <Row noGutters={true}>
                    <Col sm="4">
                            <DirectoryTree drives={this.state.drives} onPathSelected={this.handlePathSelected} />
                    </Col>
                    <Col sm="8">

                    </Col>
                </Row>
                </Container>
            </div>
        );
    }
}
