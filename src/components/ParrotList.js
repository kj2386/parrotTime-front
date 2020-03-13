import React from 'react';
import {
  Button,
  Card,
  Container,
  Dimmer,
  Icon,
  Image,
  Loader,
  Message,
  Segment
} from 'semantic-ui-react';
import axios from 'axios';
import { parrotListUrl } from '../constants';


class ParrotList extends React.Component {
  state = {
    loading: false,
    error: null,
    data: []
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(parrotListUrl)
      .then(res => {
        this.setState({ data: res.data, loading: false });
      })
      .catch(error => {
        this.setState({ error: error, loading: false });
      });
  }

  render() {
    const { data, error, loading } = this.state;
    return (
      <Container>
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
        <Card.Group>
          {data.map(parrot => {
            return (
              <Card key={parrot.id}>
                <Card.Content>
                  <Image src={parrot.gif_url} />
                </Card.Content>

                <Card.Content>
                  <Card.Header as="a">{parrot.name}</Card.Header>
                  <Card.Description>${parrot.price}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button primary icon labelPosition="right">
                    Add to Cart
                    <Icon name="cart plus" />
                  </Button>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
      </Container>
    );
  }
}

export default ParrotList;
