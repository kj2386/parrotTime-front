import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  Button,
  Card,
  Dimmer,
  Divider,
  Grid,
  GridColumn,
  Header,
  Image,
  Label,
  Loader,
  Menu,
  Message,
  Segment
} from 'semantic-ui-react';
import Nav from './Nav';
import AddressForm from './AddressForm';
import PaymentHistory from './PaymentHistory';
import { addressListUrl, userIdUrl, addressDeleteUrl } from '../constants';
import { authAxios } from '../utils';


const CREATE_FORM = 'CREATE_FORM';
const UPDATE_FORM = 'UPDATE_FORM';

class Profile extends React.Component {
  state = {
    activeItem: 'billingAddress',
    addresses: [],
    userId: null,
    selectedAddress: null
  };

  componentDidMount() {
    this.handleFetchAddresses();
    this.handleFetchUserId();
  }

  handleDeleteAddress = addressId => {
    authAxios
      .delete(addressDeleteUrl(addressId))
      .then(res => {
        this.handleCallback();
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  handleSelectAddress = address => {
    this.setState({ selectedAddress: address });
  };

  handleFetchUserId = () => {
    authAxios
      .get(userIdUrl)
      .then(res => {
        this.setState({ userId: res.data.userId });
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  handleItemClick = name => {
    this.setState({ activeItem: name }, () => {
      this.handleFetchAddresses();
    });
  };

  handleGetActiveItem = () => {
    const { activeItem } = this.state;
    if (activeItem === 'billingAddress') {
      return 'Billing Address';
    } else if (activeItem === 'shippingAddress') {
      return 'Shipping Address';
    } else {
      return 'Payment History';
    }
  };

  handleFetchAddresses = () => {
    this.setState({ loading: true });
    const { activeItem } = this.state;
    authAxios
      .get(addressListUrl(activeItem === 'billingAddress' ? 'B' : 'S'))
      .then(res => {
        this.setState({ addresses: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  handleCallback = () => {
    this.handleFetchAddresses();
    this.setState({ selectedAddress: null });
  };

  renderAddresses = () => {
    const { activeItem, addresses, selectedAddress, userId } = this.state;
    return (
      <React.Fragment>
        <Card.Group>
          {addresses.map(a => {
            return (
              <Card key={a.id}>
                <Card.Content>
                  {a.default && (
                    <Label as="a" color="blue" ribbon="right">
                      Default
                    </Label>
                  )}

                  <Card.Header>{a.street_address}</Card.Header>
                  <Card.Meta>
                    {a.city}, {a.state}
                  </Card.Meta>
                  <Card.Description>{a.zip}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    color="yellow"
                    onClick={() => this.handleSelectAddress(a)}
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => this.handleDeleteAddress(a.id)}
                    color="red"
                  >
                    Delete
                  </Button>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
        {addresses.length > 0 ? <Divider /> : null}

        {selectedAddress === null ? (
          <AddressForm
            activeItem={activeItem}
            userId={userId}
            formType={CREATE_FORM}
            callback={this.handleCallback}
          />
        ) : null}

        {selectedAddress && (
          <AddressForm
            activeItem={activeItem}
            userId={userId}
            address={selectedAddress}
            formType={UPDATE_FORM}
            callback={this.handleCallback}
          />
        )}
      </React.Fragment>
    );
  };

  render() {
    const { activeItem, error, loading } = this.state;

    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    return (
      <div>
        <Header size="huge">Parrot Time</Header>
        <Nav />
        <Grid container columns={2} divided>
          <Grid.Row columns={1}>
            <Grid.Column>
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
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <GridColumn width={6}>
              <Menu pointing vertical fluid>
                <Menu.Item
                  name="Billig Address"
                  active={activeItem === 'billingAddress'}
                  onClick={() => this.handleItemClick('billingAddress')}
                />
                <Menu.Item
                  name="Shipping Address"
                  active={activeItem === 'shippingAddress'}
                  onClick={() => this.handleItemClick('shippingAddress')}
                />
                <Menu.Item
                  name="Payment History"
                  active={activeItem === 'paymentHistory'}
                  onClick={() => this.handleItemClick('paymentHistory')}
                />
              </Menu>
            </GridColumn>
            <GridColumn width={10}>
              <Header>{this.handleGetActiveItem()}</Header>
              <Divider />
              {activeItem === 'paymentHistory' ? (
                <PaymentHistory />
              ) : (
                this.renderAddresses()
              )}
            </GridColumn>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

export default connect(mapStateToProps)(Profile);
