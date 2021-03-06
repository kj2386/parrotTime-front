import React from 'react';
import { Route } from 'react-router-dom';
import Hoc from './hoc/Hoc';

import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import OrderSummary from './components/OrderSummary';
import Checkout from './components/Checkout';
import Profile from './components/Profile';

const BaseRouter = () => (
  <Hoc>
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/order-summary" component={OrderSummary} />
    <Route path="/checkout" component={Checkout} />
    <Route path="/profile" component={Profile} />
    <Route exact path="/" component={Home} />
  </Hoc>
);

export default BaseRouter;
