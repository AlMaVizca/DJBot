var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

import { Grid, Icon, Segment } from 'semantic-ui-react';

function Settings(){
  return(
    <Grid centered columns="equal" textAlign="center" divided>
      <Grid.Row stretched>
        <Grid.Column>
          <Segment textAlign="center" name="users"
                   as={Link} to="/settings/users">
            <Icon name="users" size="huge" />
            <p>Users</p>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment textAlign="center" name="keys"
                   as={Link} to="/settings/keys">
            <Icon name="qrcode" size="huge" />
            <p>SSH Keys</p>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

module.exports = Settings;
