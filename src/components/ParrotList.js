import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Card,
  Container,
  Dimmer,
  Icon,
  Image,
  Loader,
  Message,
  Segment
} from 'semantic-ui-react';
import axios from 'axios';
import { parrotListUrl, addToCartUrl } from '../constants';
import { authAxios } from '../utils';
import { fetchCart } from '../store/actions/cart';

class ParrotList extends React.Component {
  state = {
    loading: false,
    error: null,
    data: []
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(parrotListUrl)
      .then(res => {
        this.setState({ data: res.data, loading: false });
      })
      .catch(error => {
        this.setState({ error: error, loading: false });
      });
  }

  handleAddToCart = slug => {
    this.setState({ loading: true });
    authAxios
      .post(addToCartUrl, { slug })
      .then(res => {
        this.props.fetchCart();
        this.setState({ loading: false });
      })
      .catch(error => {
        this.setState({ error: error, loading: false });
      });
  };

  render() {
    const { data, error, loading } = this.state;
    return (
      <Container>
        {error && (
          <Message
            error
            header="There was some errors with your submission"
            content={JSON.stringify(error)}
          />
        )}
        {loading && (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>

            <Image src="/images/wireframe/short-paragraph.png" />
          </Segment>
        )}
        <Card.Group>
          {data.map(parrot => {
            return (
              <Card key={parrot.id}>
                <Card.Content>
                  <Image src={parrot.gif_url} />
                </Card.Content>

                <Card.Content>
                  <Card.Header as="a">{parrot.name}</Card.Header>
                  <Card.Description>${parrot.price}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    primary
                    icon
                    labelPosition="right"
                    onClick={() => this.handleAddToCart(parrot.slug)}
                  >
                    Add to Cart
                    <Icon name="cart plus" />
                  </Button>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCart: () => dispatch(fetchCart())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ParrotList);
