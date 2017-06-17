var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

import { Grid, Header, Icon, Segment } from 'semantic-ui-react';

var Dashboard = React.createClass({
  render: function () {
    return (
      <Grid centered columns="equal" textAlign="center" divided>
        <Grid.Row stretched>
          <Grid.Column>
            <Segment textAlign="center" name="Playbooks"
                     as={Link} to="/playbooks">
              <Icon name="play" size="big" />
              <Icon name="book" size="big" />
              <Header>Playbooks</Header>
              {this.props.playbooks > 1 ? (
                <p>There are {this.props.playbooks} available.</p>
              ) : (
                <p>There is {this.props.playbooks} available.</p>
              )}
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign="center" name="Inventory"
                     as={Link} to="/inventory">
              <Icon name="sitemap" size="big" />
              <Header>Inventory</Header>
              {this.props.inventory > 1 ? (
                <p>There are {this.props.inventory} units.</p>
              ) : (
                <p>There is {this.props.inventory} unit.</p>
              )}

            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign="center" name="Results"
                     as={Link} to="/results">
              <Icon name="wordpress forms" size="big" />
              <Header>Results</Header>
              {this.props.results > 1 ? (
                <p>There were {this.props.results} executions.</p>
              ) : (
                <p>There was {this.props.results} execution.</p>
              )}
            </Segment>
          </Grid.Column>

        </Grid.Row>
      </Grid>
    )
  }
});

module.exports = Dashboard;
