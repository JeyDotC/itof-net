

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
                        {this.props.children}
                    </Col>
                </Row>
        </Container>
      </div>
    );
  }
}
