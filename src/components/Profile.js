import React from 'react'
import {Divider,Grid, Header, GridColumn} from 'semantic-ui-react'


class Profile extends React.Component {
    render() {
        return (
          <Grid>
            <Grid.Row>
              <GridColumn width={6}>
                  Menu
              </GridColumn>
              <GridColumn width={10}>
                  <Header>Profile</Header>
                  <Divider />
                  Content
              </GridColumn>
            </Grid.Row>
          </Grid>
        );
    }
}

export default Profile;