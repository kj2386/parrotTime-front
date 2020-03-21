import React from 'react';
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
import AddressForm from './AddressForm'
import { addressListUrl, userIdUrl } from '../constants';
import { authAxios } from '../utils';

// class AddressForm extends React.Component {
//   state = {
//     error: null,
//     loading: false,
//     formData: { default: false },
//     saving: false,
//     success: false
//   };
//   handleCreateAddress = e => {
//     this.setState({ saving: true });
//     e.preventDefault();
//     const { activeItem, formData, userId } = this.state;
//     authAxios
//       .post(addressCreateUrl, {
//         ...formData,
//         user: userId,
//         address_type: activeItem === 'billingAddress' ? 'B' : 'S'
//       })
//       .then(res => {
//         this.setState({ saving: false, success: true });
//       })
//       .catch(err => {
//         this.setState({ error: err });
//       });
//   };

//   handleToggleDefault = () => {
//     const { formData } = this.state;
//     const updatedFormData = {
//       ...formData,
//       default: !formData.default
//     };
//     this.setState({
//       formData: updatedFormData
//     });
//   };

//   handleChange = e => {
//     const { formData } = this.state;
//     const updatedFormData = {
//       ...formData,
//       [e.target.name]: e.target.value
//     };
//     this.setState({
//       formData: updatedFormData
//     });
//   };
//   render() {
//     const { success, error, saving } = this.state;
//     return (
//       <Form onSubmit={this.handleCreateAddress} success={success} error={error}>
//         <Form.Input
//           required
//           name="street_address"
//           placeholder="Street Address"
//           onChange={this.handleChange}
//         />
//         <Form.Input
//           required
//           name="city"
//           placeholder="City"
//           onChange={this.handleChange}
//         />
//         <Form.Input
//           required
//           name="state"
//           placeholder="State"
//           onChange={this.handleChange}
//         />
//         <Form.Input
//           required
//           name="zip"
//           placeholder="Zip"
//           onChange={this.handleChange}
//         />
//         <Form.Checkbox
//           name="default"
//           label="Make this the default address"
//           onChange={this.handleToggleDefault}
//         />
//         {success && (
//           <Message success header="Success!" content="Your address was saved" />
//         )}
//         {error && (
//           <Message
//             error
//             header="There was an error"
//             content={JSON.stringify(error)}
//           />
//         )}
//         <Form.Button disabled={saving} loading={saving} primary>
//           Save
//         </Form.Button>
//       </Form>
//     );
//   }
// }

class Profile extends React.Component {
  state = {
    activeItem: 'billingAddress',
    addresses: [],
    userId: null
  };

  componentDidMount() {
    this.handleFetchAddresses();
    this.handleFetchUserId();
  }

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
              <Header>{`Update your ${
                activeItem === 'billingAddress' ? 'billing' : 'shipping'
              } address`}</Header>
              <Divider />
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
                        <Button color="yellow">Update</Button>
                        <Button color="red">Delete</Button>
                      </Card.Content>
                    </Card>
                  );
                })}
              </Card.Group>
              {addresses.length > 0 ? <Divider /> : null}
              <AddressForm addresses={addresses} />
            </GridColumn>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Profile;
