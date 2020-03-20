import React from 'react';
import { Header } from 'semantic-ui-react';
import ParrotList from './ParrotList';
import Nav from './Nav';

class Home extends React.Component {
  render() {
    return (
      <div>
        <Header size="huge">Parrot Time</Header>
        <Nav />
        <ParrotList />

        {this.props.children}
      </div>
    );
  }
}

export default Home;
