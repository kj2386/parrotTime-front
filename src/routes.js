import React from 'react';
import { Route } from 'react-router-dom';
import Hoc from './hoc/Hoc';

import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';

const BaseRouter = () => (
  <Hoc>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route exact path="/" component={Home} />
  </Hoc>
);

export default BaseRouter;
