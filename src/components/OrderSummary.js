import React from 'react';
import { authAxios } from '../utils';
import { Button, Container, Header, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { orderSummaryUrl } from '../constants';

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
        this.setState({ error: error, loading: false });
      });
  };

  render() {
    const { data, error, loading } = this.state;
    return (
      <Container>
        <Header as="h3">Order Summary</Header>
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
                    <Table.Cell>${order_parrot.quantity}.00</Table.Cell>
                  </Table.Row>
                );
              })}
              <Table.Row>
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell colSpan="2" textAlign="center">
                  Total: $6.00
                </Table.Cell>
              </Table.Row>
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="5" textAlign="right">
                  <Link to='/checkout'>
                    <Button color="yellow">Checkout</Button>
                  </Link>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        )}
      </Container>
    );
  }
}

export default OrderSummary;
