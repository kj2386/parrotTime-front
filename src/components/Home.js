import React from 'react';
import { Container, Dropdown, Header, Menu } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../store/actions/auth';
import { fetchCart } from '../store/actions/cart';
import ParrotList from './ParrotList';

class Home extends React.Component {
  componentDidMount() {
    this.props.fetchCart();
  }

  render() {
    const { authenticated, cart, loading } = this.props;
    console.log(cart);
    return (
      <div>
        <Header size="huge">Parrot Time</Header>
        <Menu inverted>
          <Container>
            <Link to="/">
              <Menu.Item header>Home</Menu.Item>
            </Link>

            <Menu.Menu  position="right">
              {authenticated ? (
                <React.Fragment>
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
                      <Dropdown.Item icon="arrow right" text="Checkout" onClick={() => this.props.history.push('/order-summary')} />
                    </Dropdown.Menu>
                  </Dropdown>
                  <Menu.Item header onClick={() => this.props.logout()}>
                    Logout
                  </Menu.Item>
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
            </Menu.Menu>
          </Container>
        </Menu>
        <ParrotList />

        {this.props.children}
      </div>
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
  )(Home)
);
