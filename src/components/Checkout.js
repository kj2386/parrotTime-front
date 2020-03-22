import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  CardElement,
  injectStripe,
  Elements,
  StripeProvider
} from 'react-stripe-elements';
import {
  Button,
  Dimmer,
  Divider,
  Header,
  Image,
  Loader,
  Message,
  Segment,
  Select
} from 'semantic-ui-react';
import { authAxios } from '../utils';
import { checkoutUrl, addressListUrl, orderSummaryUrl } from '../constants';
import Nav from './Nav';
import OrderPreview from './OrderPreview';

class Checkout extends Component {
  state = {
    data: null,
    loading: false,
    error: null,
    success: false,
    shippingAddresses: [],
    billingAddresses: [],
    selectedBillingAddress: '',
    selectedShippingAddress: ''
  };

  componentDidMount() {
    this.handleFetchOrder();
    this.handleFetchBillingAddresses();
    this.handleFetchShippingAddresses();
  }

  handleGetDefaultAddress = addresses => {
    const filteredAddresses = addresses.filter(el => el.default === true);
    if (filteredAddresses.length > 0) {
      return filteredAddresses[0].id;
    }
    return '';
  };

  handleFetchBillingAddresses = () => {
    this.setState({ loading: true });
    authAxios
      .get(addressListUrl('B'))
      .then(res => {
        this.setState({
          billingAddresses: res.data.map(a => {
            return {
              key: a.id,
              text: `${a.street_address}, ${a.city}, ${a.state}, ${a.zip}`,
              value: a.id
            };
          }),
          selectedBillingAddress: this.handleGetDefaultAddress(res.data),
          loading: false
        });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  handleFetchShippingAddresses = () => {
    this.setState({ loading: true });
    authAxios
      .get(addressListUrl('S'))
      .then(res => {
        this.setState({
          shippingAddresses: res.data.map(a => {
            return {
              key: a.id,
              text: `${a.street_address}, ${a.city}, ${a.state}, ${a.zip}`,
              value: a.id
            };
          }),
          selectedShippingAddress: this.handleGetDefaultAddress(res.data),
          loading: false
        });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  handleFetchOrder = () => {
    this.setState({ loading: true });
    authAxios
      .get(orderSummaryUrl)
      .then(res => {
        this.setState({ data: res.data, loading: false });
      })
      .catch(err => {
        if (err.response.status === 404) {
          this.props.history.push('/');
        } else {
          this.setState({ error: err, loading: false });
        }
      });
  };

  handleSelectChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  submit = ev => {
    ev.preventDefault();
    this.setState({ loading: true });
    if (this.props.stripe) {
      this.props.stripe.createToken().then(result => {
        if (result.error) {
          this.setState({ error: result.error.message, loading: false });
        } else {
          this.setState({ error: null });
          const {
            selectedBillingAddress,
            selectedShippingAddress
          } = this.state;
          authAxios
            .post(checkoutUrl, {
              stripeToken: result.token.id,
              selectedBillingAddress,
              selectedShippingAddress
            })
            .then(res => {
              this.setState({ loading: false, success: true });
            })
            .catch(error => {
              this.setState({ loading: false, error: error });
            });
        }
      });
    } else {
      console.log('Stripe is not loaded');
    }
  };

  render() {
    const {
      data,
      error,
      loading,
      success,
      billingAddresses,
      shippingAddresses,
      selectedBillingAddress,
      selectedShippingAddress
    } = this.state;
    return (
      <div>
        <Nav />
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
        <OrderPreview data={data} />
        <Divider />
        <Header>Select a billing address</Header>
        {billingAddresses.length > 0 ? (
          <Select
            name="selectedBillingAddress"
            value={selectedBillingAddress}
            clearable
            options={billingAddresses}
            selection
            onChange={this.handleSelectChange}
          />
        ) : (
          <p>
            You need to <Link to="/profile">add a billing address</Link>
          </p>
        )}
        <Header>Select a shipping address</Header>
        {shippingAddresses.length > 0 ? (
          <Select
            name="selectedShippingAddress"
            value={selectedShippingAddress}
            clearable
            options={shippingAddresses}
            selection
            onChange={this.handleSelectChange}
          />
        ) : (
          <p>
            You need to <Link to="/profile">add a shipping address</Link>
          </p>
        )}
        <Divider />

        {billingAddresses.length < 1 || shippingAddresses.length < 1 ? (
          <p>You need to add addresses before you can complete your purchase</p>
        ) : (
          <React.Fragment>
            <Header>Would you like to complete the purchase?</Header>
            <CardElement />
            {success && (
              <Message positive>
                <Message.Header>Your payment was successful</Message.Header>
                <p>
                  Go to your <b>profile</b> to see the order delivery status.
                </p>
              </Message>
            )}
            <Button
              loading={loading}
              disabled={loading}
              primary
              onClick={this.submit}
              style={{ marginTop: '10px' }}
            >
              Submit
            </Button>
          </React.Fragment>
        )}
      </div>
    );
  }
}

const InjectedForm = injectStripe(Checkout);

const WrappedForm = () => (
  <Segment>
    <StripeProvider apiKey="pk_test_qd1iFYV4BUKn4UMlOdYH2dg000muvejSMt">
      <div>
        <Header size="huge">Parrot Time</Header>
        <h1>Complete Your Order</h1>
        <Elements>
          <InjectedForm />
        </Elements>
      </div>
    </StripeProvider>
  </Segment>
);

export default WrappedForm;
