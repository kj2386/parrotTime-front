import React from 'react';
import { Container, Dropdown, Menu, MenuItem } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../store/actions/auth';
import { fetchCart } from '../store/actions/cart';

class Nav extends React.Component {
  componentDidMount() {
    this.props.fetchCart();
  }
  render() {
    const { authenticated, cart, loading } = this.props;
    return (
      <Menu inverted>
        <Container>
          <Link to="/">
            <Menu.Item header>Home</Menu.Item>
          </Link>

          {authenticated ? (
            <React.Fragment>
              <Menu.Menu position="right">
                <Link to="/profile">
                  <MenuItem>Profile</MenuItem>
                </Link>
                <Dropdown
                  icon="cart"
                  loading={loading}
                  text={`${cart !== null ? cart.order_parrots.length : 0} `}
                  pointing
                  className="link item"
                >
                  <Dropdown.Menu>
                    {cart &&
                      cart.order_parrots.map(order_parrot => {
                        return (
                          <Dropdown.Item key={order_parrot.id}>
                            {order_parrot.quantity} x {order_parrot.parrot}
                          </Dropdown.Item>
                        );
                      })}
                    {cart && cart.order_parrots.length < 1 ? (
                      <Dropdown.Item>No parrots in your cart</Dropdown.Item>
                    ) : null}

                    <Dropdown.Divider />
                    <Dropdown.Item
                      icon="arrow right"
                      text="Checkout"
                      onClick={() => this.props.history.push('/order-summary')}
                    />
                  </Dropdown.Menu>
                </Dropdown>
                <Menu.Item header onClick={() => this.props.logout()}>
                  Logout
                </Menu.Item>
              </Menu.Menu>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Link to="/login">
                <Menu.Item header>Login</Menu.Item>
              </Link>
              <Link to="/signup">
                <Menu.Item header>Signup</Menu.Item>
              </Link>
            </React.Fragment>
          )}
        </Container>
      </Menu>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
    loading: state.cart.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout()),
    fetchCart: () => dispatch(fetchCart())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Nav)
);
