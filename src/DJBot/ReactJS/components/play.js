var React = require("react");
var ShowMessage = require("./message");

import {Button, Card, Grid, Header, Icon, Segment} from 'semantic-ui-react';

var Playbook = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },
  play: function(){
    this.props.play(this.props.room, this.props.id);
  },
  render: function(){
    return(
      <Card>
        <Card.Content>
          <Button basic floated="right" icon="play"
                  disabled={this.props.disabled}
                  onClick={this.play} color="green" />
          <Icon name="play" />
          <Icon name="book" />
          <Card.Header>
            {this.props.name}
          </Card.Header>
        </Card.Content>
        <Card.Content extra>
            {this.props.description}
        </Card.Content>
      </Card>
    );
  }
});


var Play = React.createClass({
  componentWillReceiveProps: function(nextProps){
    const playbooks = nextProps.playbooks.map(function(playbook, i){
      return (<Playbook name={playbook.name} key={i} id={playbook.key}
              room={nextProps.id} play={nextProps.play}
              description={playbook.description}
              disabled={this.props.disabled} />);
    }, this);
    const hosts = nextProps.hosts.map(function(host, i){
      return (<div key={i}>{host}</div>);
    }, this);

    this.setState({playbooks: playbooks,
                   hosts: hosts});
  },
  getInitialState: function(){
    return({
      playbooks: [],
    })
  },
  render: function(){
    return(
      <Grid>
        <Grid.Row>
        <ShowMessage mode={this.props.messageMode} text={this.props.messageText} />
        <Header as="h1">Working with {this.props.name}</Header>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={10}>
            <Segment basic loading={this.props.loading}>
              <p>This room was setup for {this.props.machines} machines.</p>
              <p>There is {this.props.hosts.length} machines available on the network {this.props.network}/{this.props.netmask}.</p>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            {this.state.hosts}
          </Grid.Column>
        </Grid.Row>
        <Card.Group>
          {this.state.playbooks}
        </Card.Group>
      </Grid>
    );
  }
});

module.exports = Play;
