var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var UsersContainer = require('../containers/usersContainer');
import { Button, Grid, Icon, Segment } from 'semantic-ui-react';

function Settings(){
  return(
    <Grid centered columns="equal" textAlign="center" divided>
      <Grid.Row stretched>
        <Grid.Column>
          <Segment name="users" as={Link} to="/settings/users">
            <Icon name="users"/>
            Users
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment name="rooms" as={Link} to="/settings/rooms">
            <Icon name="sitemap"/>
            Rooms
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment name="keys" as={Link} to="/settings/keys">
            <Icon name="qrcode"/>
            SSH Keys
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

module.exports = Settings;
