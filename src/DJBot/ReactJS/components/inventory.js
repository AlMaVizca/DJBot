var React = require("react");

import {Button, Card, Grid, Header, Icon, Link, Segment, Steps, Step} from "semantic-ui-react";

var Host = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },
  edit: function(){
    this.context.router.push({
      pathname: "/inventory/host",
      query: {
        id: this.props.id,
      }
    });
  },
  play: function(){
    this.context.router.push({
      pathname: "/play",
      query: {
        host: this.props.id,
      }
    });
  },
  render: function(){
    return(
      <Card>
        <Card.Content>
          <Button basic floated="right" icon="play"
                  onClick={this.play} color="green" />
          <Button basic floated="right" icon="edit"
                  onClick={this.edit} color="blue" />
          <Icon name="cube" />
          <Card.Header>
            {this.props.name}
          </Card.Header>
        </Card.Content>
        <Card.Content extra>
          <div>
            Ip:
            {this.props.ip}
          </div>
          <div>
            Note:
            {this.props.note}
          </div>
        </Card.Content>
      </Card>
    );
  }
});


var Room = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },
  edit: function(){
    this.context.router.push({
      pathname: "/inventory/room",
      query: {
        id: this.props.id,
      }
    });
  },
  play: function(){
    this.context.router.push({
      pathname: "/play",
      query: {
        room: this.props.id,
      }
    });
  },
  render: function(){
    return(
      <Card>
        <Card.Content>
          <Button basic floated="right" icon="play"
                  onClick={this.play} color="green" />
          <Button basic floated="right" icon="edit"
                  onClick={this.edit} color="blue" />
          <Icon name="cubes" />
          <Card.Header>
            {this.props.name}
          </Card.Header>
        </Card.Content>
        <Card.Content extra>
          <div>
            Machines:
            {this.props.machines}
          </div>
          <div>
            Network:
            {this.props.network}/{this.props.netmask}
          </div>
        </Card.Content>
      </Card>
    );
  }
});

var Inventory = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },
  getInitialState: function(){
    return({rooms: [],
            hosts: [],
           })
  },
  componentWillReceiveProps: function(nextProps){
    const rooms = nextProps.roomList.map(function(room){
      return (<Room name={room.name} key={room.key} id={room.key}
              network={room.network} netmask={room.netmask}
              machines={room.machines} />);
    });
    const hosts = nextProps.hostList.map(function(host){
      return (<Host name={host.name} key={host.key} id={host.key}
              ip={host.ip} note={host.note} />);
    });

    this.setState({rooms: rooms,
                   hosts: hosts
                  });
  },
  roomAdd: function(){
    this.context.router.push({
      pathname: "/inventory/room",
    });
  },
  hostAdd: function(){
    this.context.router.push({
      pathname: "/inventory/host",
    });
  },
  render: function(){
    return(
      <Grid>
        <Grid.Row textAlign="center">
          <Header as="h1">Inventory</Header>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column  width={16}>
            <Button color="green" basic floated="right" as={Link} onClick={this.hostAdd}>
              <Icon name="add" /> Host
            </Button>
            <Button color="green" basic floated="right" as={Link} onClick={this.roomAdd}>
              <Icon name="add" /> Room
            </Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3">Hosts</Header>
            <Card.Group>
              {this.state.hosts}
            </Card.Group>
            <Header as="h3">Rooms</Header>
            <Card.Group>
              {this.state.rooms}
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>

    );
  }
});

module.exports = Inventory;
