import React from 'react';
import { Form, Message } from 'semantic-ui-react';

import { addressCreateUrl, addressUpdateUrl } from '../constants';
import { authAxios } from '../utils';

const UPDATE_FORM = 'UPDATE_FORM';

class AddressForm extends React.Component {
  state = {
    error: null,
    loading: false,
    formData: {
      address_type: '',
      street_address: '',
      city: '',
      state: '',
      zip: '',
      default: false,
      user: 1
    },
    saving: false,
    success: false
  };

  componentDidMount() {
    const { address, formType } = this.props;
    console.log(address);
    if (formType === UPDATE_FORM) {
      this.setState({ formData: address });
    }
  }

  handleSubmit = e => {
    this.setState({ saving: true });
    e.preventDefault();
    const { formType } = this.props;
    if (formType === UPDATE_FORM) {
      this.handleUpdateAddress();
    } else {
      this.handleCreateAddress();
    }
  };

  handleCreateAddress = () => {
    const { activeItem, userId } = this.props;
    const { formData } = this.state;
    authAxios
      .post(addressCreateUrl, {
        ...formData,
        user: userId,
        address_type: activeItem === 'billingAddress' ? 'B' : 'S'
      })
      .then(res => {
        this.setState({
          saving: false,
          success: true,
          formData: { default: false }
        });
        this.props.callback();
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  handleUpdateAddress = () => {
    const { activeItem, userId } = this.props;
    const { formData } = this.state;
    authAxios
      .put(addressUpdateUrl(formData.id), {
        ...formData,
        user: userId,
        address_type: activeItem === 'billingAddress' ? 'B' : 'S'
      })
      .then(res => {
        this.setState({
          saving: false,
          success: true,
          formData: { default: false }
        });
        this.props.callback();
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
    const { success, error, formData, saving } = this.state;
    return (
      <Form onSubmit={this.handleSubmit} success={success} error={error}>
        <Form.Input
          required
          name="street_address"
          placeholder="Street Address"
          onChange={this.handleChange}
          value={formData.street_address}
        />
        <Form.Input
          required
          name="city"
          placeholder="City"
          onChange={this.handleChange}
          value={formData.city}
        />
        <Form.Input
          required
          name="state"
          placeholder="State"
          onChange={this.handleChange}
          value={formData.state}
        />
        <Form.Input
          required
          name="zip"
          placeholder="Zip"
          onChange={this.handleChange}
          value={formData.zip}
        />
        <Form.Checkbox
          name="default"
          label="Make this the default address"
          onChange={this.handleToggleDefault}
          checked={formData.default}
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
