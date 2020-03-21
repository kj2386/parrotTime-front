import React from 'react';
import { authAxios } from '../utils';
import {
  Button,
  Dimmer,
  Header,
  Icon,
  Image,
  Loader,
  Segment,
  Table,
  Message
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { orderSummaryUrl, orderItemDeleteUrl } from '../constants';
import Nav from './Nav';

class OrderSummary extends React.Component {
  state = {
    data: null,
    error: null,
    loading: false
  };

  componentDidMount() {
    this.handleFetchOrder();
  }

  handleFetchOrder = () => {
    this.setState({ loading: true });
    authAxios
      .get(orderSummaryUrl)
      .then(res => {
        this.setState({ data: res.data, loading: false });
      })
      .catch(error => {
        if (error.response.status === 404) {
          this.setState({
            error: 'You currently do not have an order',
            loading: false
          });
        } else {
          this.setState({ error: error, loading: false });
        }
      });
  };

  handleRemoveItem = itemId => {
    authAxios
      .delete(orderItemDeleteUrl(itemId))
      .then(res => {
        this.handleFetchOrder();
      })
      .catch(error => {
        this.setState({ error: error });
      });
  };

  render() {
    const { data, error, loading } = this.state;
    return (
      <Segment>
        <Header size="huge">Parrot Time</Header>
        <Header as="h3">Order Summary</Header>
        <Nav />
        {error && (
          <Message
            error
            header="There was an error"
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
        {data && (
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Parrot #</Table.HeaderCell>
                <Table.HeaderCell>Parrot Name</Table.HeaderCell>
                <Table.HeaderCell>Parrot Price</Table.HeaderCell>
                <Table.HeaderCell>Parrot Quantity</Table.HeaderCell>
                <Table.HeaderCell>Total Price</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {data.order_parrots.map((order_parrot, i) => {
                return (
                  <Table.Row key={order_parrot.id}>
                    <Table.Cell>{i + 1}</Table.Cell>
                    <Table.Cell>{order_parrot.parrot}</Table.Cell>
                    <Table.Cell>${order_parrot.parrot_obj.price}</Table.Cell>
                    <Table.Cell>{order_parrot.quantity}</Table.Cell>
                    <Table.Cell>
                      ${order_parrot.quantity}.00
                      <Icon
                        name="trash"
                        color="red"
                        style={{ float: 'right', cursor: 'pointer' }}
                        onClick={() => this.handleRemoveItem(order_parrot.id)}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
              <Table.Row>
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell colSpan="2" textAlign="center">
                  Total: ${data.total}.00
                </Table.Cell>
              </Table.Row>
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="5" textAlign="right">
                  <Link to="/checkout">
                    <Button color="yellow">Checkout</Button>
                  </Link>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        )}
      </Segment>
    );
  }
}

export default OrderSummary;
