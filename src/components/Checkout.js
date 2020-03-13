import React, { Component } from 'react';
import {
  CardElement,
  injectStripe,
  Elements,
  StripeProvider
} from 'react-stripe-elements';
import { Button, Container, Message } from 'semantic-ui-react';
import { authAxios } from '../utils';
import { checkoutUrl } from '../constants';

class Checkout extends Component {
  state = {
    loading: false,
    error: null,
    success: false
  };

  submit = ev => {
    ev.preventDefault();
    this.setState({ loading: true });
    if (this.props.stripe) {
      this.props.stripe.createToken().then(result => {
        if (result.error) {
          this.setState({ error: result.error.message, loading: false });
        } else {
          authAxios
            .post(checkoutUrl, { stripeToken: result.token.id })
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
    const { error, loading, success } = this.state;
    return (
      <div>
        {error && (
          <Message negative>
            <Message.Header>Your Payment Was Unsuccessful</Message.Header>
            <p>{JSON.stringify(error)}</p>
          </Message>
        )}
        {success && (
          <Message positive>
            <Message.Header>Your Payment Was Successful!</Message.Header>
            <p>
              Go to your <b>profile</b> to see the order.
            </p>
          </Message>
        )}
        <p>Would you like to complete the purchase?</p>
        <CardElement />
        <Button
          loading={loading}
          disabled={loading}
          primary
          onClick={this.submit}
          style={{ marginTop: '10px' }}
        >
          Submit
        </Button>
      </div>
    );
  }
}

const InjectedForm = injectStripe(Checkout);

const WrappedForm = () => (
  <Container text>
    <StripeProvider apiKey="pk_test_qd1iFYV4BUKn4UMlOdYH2dg000muvejSMt">
      <div>
        <h1>Complete Your Order</h1>
        <Elements>
          <InjectedForm />
        </Elements>
      </div>
    </StripeProvider>
  </Container>
);

export default WrappedForm;
