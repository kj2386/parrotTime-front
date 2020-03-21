import React, { Component } from 'react';
import {
  Dimmer,
  Image,
  Item,
  Label,
  Loader,
  Message,
  Segment
} from 'semantic-ui-react';
import { authAxios } from '../utils';
import { orderSummaryUrl } from '../constants';

class OrderPreview extends Component {
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

  render() {
    const { data, error, loading } = this.state;
    return (
      <React.Fragment>
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
          <React.Fragment>
            <Item.Group relaxed>
              {data.order_parrots.map((order_parrot, i) => {
                return (
                  <Item key={i}>
                    <Item.Image
                      size="tiny"
                      src={`${order_parrot.parrot_obj.gif_url}`}
                    />

                    <Item.Content verticalAlign="middle">
                      <Item.Header as="a">
                        {order_parrot.quantity} x {order_parrot.parrot}
                      </Item.Header>
                      <Item.Extra>
                        <Label>${order_parrot.parrot_obj.price}</Label>
                      </Item.Extra>
                    </Item.Content>
                  </Item>
                );
              })}

              <Item.Group>
                <Item>
                  <Item.Content>
                    <Item.Header>Order Total: ${data.total}.00</Item.Header>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Item.Group>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default OrderPreview;
