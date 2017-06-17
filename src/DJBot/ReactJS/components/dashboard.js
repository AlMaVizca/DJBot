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
                There are {this.props.playbooks} available.
              ) : (
                There is {this.props.playbooks} available.
              )}
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign="center" name="Inventory"
                     as={Link} to="/inventory">
              <Icon name="sitemap" size="big" />
              <Header>Inventory</Header>
              {this.props.inventory > 1 ? (
                There are {this.props.inventory} units.
              ) : (
                There is {this.props.inventory} unit.
              )}

            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign="center" name="Results"
                     as={Link} to="/results">
              <Icon name="wordpress forms" size="big" />
              <Header>Results</Header>
              {this.props.results > 1 ? (
                There were {this.props.results} executions.
              ) : (
                There was {this.props.results} execution.
              )}
            </Segment>
          </Grid.Column>

        </Grid.Row>
      </Grid>
    )
  }
});

module.exports = Dashboard;
