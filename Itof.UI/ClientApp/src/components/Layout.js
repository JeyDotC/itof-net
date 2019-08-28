import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { NavMenu } from './NavMenu';
import DirectoryTree from './DirectoryTree'

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
            <NavMenu />
            <Container fluid={true}>
                <Row noGutters={true}>
                    <Col sm="4">
                        <DirectoryTree />
                    </Col>
                    <Col sm="8">
                        {this.props.children}
                    </Col>
                </Row>
        </Container>
      </div>
    );
  }
}
