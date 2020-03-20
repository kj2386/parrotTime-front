import React from 'react';
import {
  Dimmer,
  Divider,
  Form,
  Grid,
  Header,
  Image,
  GridColumn,
  Loader,
  Menu,
  Message,
  Segment
} from 'semantic-ui-react';
import Nav from './Nav';
import { addressListUrl } from '../constants';
import { authAxios } from '../utils';

class Profile extends React.Component {
  state = {
    activeItem: 'billingAddress',
    error: null,
    loading: false,
    addresses: []
  };

  componentDidMount() {
      this.handleFetchAddresses();
  }

  handleItemClick = name => this.setState({ activeItem: name });

  handleFetchAddresses = () => {
    this.setState({ loading: true });
    authAxios
      .get(addressListUrl)
      .then(res => {
        this.setState({ addresses: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  render() {
    const { activeItem, error, loading, addresses } = this.state;
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
              {addresses.map(a => {
                return <div>{a.streetAddress}</div>;
              })}
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
              </Menu>
            </GridColumn>
            <GridColumn width={10}>
              <Header>{`Update your ${
                activeItem === 'billingAddress' ? 'billing' : 'shipping'
              } address`}</Header>
              <Divider />

              <Form>
                <Form.Input name="streetAdress" placeholder="Street Address" />
                <Form.Input name="city" placeholder="City" />
                <Form.Input name="state" placeholder="State" />
                <Form.Input name="zip" placeholder="Zip" />
                <Form.Checkbox
                  name="default"
                  label="Make this the default address"
                />
                <Form.Button primary>Save</Form.Button>
              </Form>

              <p>physical address form</p>
            </GridColumn>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Profile;
