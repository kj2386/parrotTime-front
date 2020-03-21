import React from 'react';
import { Form, Message } from 'semantic-ui-react';

import { addressCreateUrl } from '../constants';
import { authAxios } from '../utils';

const UPDATE_FORM = 'UPDATE_FORM'
const CREATE_FORM = 'CREATE_FORM';

class AddressForm extends React.Component {
  state = {
    error: null,
    loading: false,
    formData: { default: false },
    saving: false,
    success: false
  };

  componentDidMount() {

  }

  handleCreateAddress = e => {
    this.setState({ saving: true });
    e.preventDefault();
    const { activeItem, formData, userId } = this.state;
    authAxios
      .post(addressCreateUrl, {
        ...formData,
        user: userId,
        address_type: activeItem === 'billingAddress' ? 'B' : 'S'
      })
      .then(res => {
        this.setState({ saving: false, success: true });
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  handleToggleDefault = () => {
    const { formData } = this.state;
    const updatedFormData = {
      ...formData,
      default: !formData.default
    };
    this.setState({
      formData: updatedFormData
    });
  };

  handleChange = e => {
    const { formData } = this.state;
    const updatedFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    this.setState({
      formData: updatedFormData
    });
  };
  render() {
    const { success, error, saving } = this.state;
    return (
      <Form onSubmit={this.handleCreateAddress} success={success} error={error}>
        <Form.Input
          required
          name="street_address"
          placeholder="Street Address"
          onChange={this.handleChange}
        />
        <Form.Input
          required
          name="city"
          placeholder="City"
          onChange={this.handleChange}
        />
        <Form.Input
          required
          name="state"
          placeholder="State"
          onChange={this.handleChange}
        />
        <Form.Input
          required
          name="zip"
          placeholder="Zip"
          onChange={this.handleChange}
        />
        <Form.Checkbox
          name="default"
          label="Make this the default address"
          onChange={this.handleToggleDefault}
        />
        {success && (
          <Message success header="Success!" content="Your address was saved" />
        )}
        {error && (
          <Message
            error
            header="There was an error"
            content={JSON.stringify(error)}
          />
        )}
        <Form.Button disabled={saving} loading={saving} primary>
          Save
        </Form.Button>
      </Form>
    );
  }
}

export default AddressForm;
