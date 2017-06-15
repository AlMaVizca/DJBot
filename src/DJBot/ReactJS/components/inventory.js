var React = require("react");

import {Button, Card, Grid, Header, Icon, Link, Segment, Steps, Step} from "semantic-ui-react";

// var ItemList = React.createClass({
//     componentDidMount: function() {
//         $('.ui.checkbox').checkbox();
//     },
//     updateList: function(e){
//         this.props.edit(this.props.elementKey);
//     },
//     render: function(){
//         var Checkbox = Semantify.Checkbox;
//         var Icon = Semantify.Icon;
//         var Label = Semantify.Label;
//         return(
//             <tr>
//                 <td>
//                 <div className="ui checkbox" onClick={this.updateList}>
//                 <input name="select" type="checkbox"/>
//                 </div>
//                 </td>
//                 <td>{this.props.element.name}
//                 </td>
//                 </tr>
//         );
//     }});


// var CheckList = React.createClass({
//     componentWillReceiveProps: function(){
//         var elements = '';
//         if (this.props.elements){
//             var elements = this.props.elements.map(function(element, i){
//                 return <ItemList key={i} element={element} edit={this.props.edit} elementKey={element.key}/>;
//             },this);
//         }
//     },
//     render: function(){
//         var elements = this.props.elements.map(function(element, i){
//                            return <ItemList key={i} element={element} elementKey={element.key} edit={this.props.edit}/>;
//         }, this);
//         return(<div>
//                 <Table className="blue">
//                 <thead>
//                 <tr>
//                 <th className="two wide">Checklist</th>
//                 <th className="Ten wide">Name</th>
//                 </tr>
//                 </thead>
//                <tbody>
//                {elements}
//                </tbody>
//                </Table>
//                </div>
// );
// }});

// var SelectTask  = React.createClass({
//         render: function(){
//             var Button = Semantify.Button;
//             var Grid = Semantify.Grid;
//             var Icon = Semantify.Icon;
//             var Segment = Semantify.Segment;
//             var classTask = classNames('ui', 'attached', 'tab');
//             if (this.props.active) classTask = classNames(classTask, 'active');
//             return(<div className={classTask} data-tab='what'>
//                    <Segment>
//                    <CheckList elements={this.props.tasks} edit={this.props.edit} />
//                    <Grid className="right aligned">
//                    <div className="sixteen wide column">
//                    <div className="ui animated fade red button" tabindex="0" onClick={this.props.reset}>
//                    <div className="hidden content">back</div>
//                    <div className="visible content">
//                    <Icon className="angle double left"/>
//                    </div>
//                    </div>
//                    <div className="ui animated fade green button" tabindex="0" onClick={this.props.next}>
//                    <div className="hidden content">next</div>
//                    <div className="visible content">
//                    <Icon className="angle right"/>
//                    </div>
//                    </div>
//                    </div>
//                    </Grid>
//                    </Segment>
//                    </div>
//                   );
// }});
// var SelectRooms  = React.createClass({
//         render: function(){
//             var Button = Semantify.Button;
//             var Grid = Semantify.Grid;
//             var Icon = Semantify.Icon;
//             var Segment = Semantify.Segment;
//             var classTask = classNames('ui', 'attached', 'tab');
//             if (this.props.active) classTask = classNames(classTask, 'active');
//             return(<div className={classTask} data-tab='where'>
//                    <Segment>
//                    <CheckList elements={this.props.rooms} edit={this.props.edit}/>
//                    <Grid className="right aligned">
//                    <div className="sixteen wide column">
//                    <div className="ui animated fade green button" tabindex="0" onClick={this.props.next}>
//                    <div className="hidden content">next</div>
//                    <div className="visible content">
//                    <Icon className="angle right"/>
//                    </div>
//                    </div>
//                    </div>
//                    </Grid>
//                    </Segment>
//                    </div>
//                   );
// }});

// var Schedule  = React.createClass({
//     getInitialState: function(){
//         return {datetime: "22:48 2016/6/2" }
//     },
//     componentDidMount: function(){

//     },
//     render: function(){
//         if (this.props.active) classTask = classNames(classTask, 'active');
//         return(<div className={classTask} data-tab='when'>
//                <Segment>
//                <Grid>
//                <div className="five wide column">
//                <Header className="second">Rooms</Header>
//                {this.props.rooms.map(function(room){
//                    if (listRooms.indexOf(room.key) != -1 ){
//                        return <RoomName key={room.key} name={room.name}/>;
//                    }
//                })}
//                </div>
//                <div className="five wide column ">
//                <Header className="second"> Tasks </Header>
//                {this.props.tasks.map(function(room){
//                        if (listTasks.indexOf(room.key) != -1 ){
//                            return <RoomName key={room.key} name={room.name}/>;                 }
//                })}
//                </div>
//                </Grid>
//                    <Grid className="right aligned">
//                <div className="sixteen wide column">
//                <div className="ui animated fade red button" tabindex="0" onClick={this.props.reset}>
//                    <div className="hidden content">back</div>
//                <div className="visible content">
//                <Icon className="angle double left"/>
//                </div>
//                    </div>
//                <div className="ui animated fade blue button" tabindex="0" onClick={this.props.next}>
//                    <div className="hidden content">run</div>
//                <div className="visible content">
//                <Icon className="terminal"/>
//                </div>
//                </div>
//                    </div>
//                </Grid>
//                </Segment>
//                </div>
//               );
//     }});

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
    return({rooms: []})
  },
  componentWillReceiveProps: function(nextProps){
    const rooms = nextProps.roomList.map(function(room){
      return (<Room name={room.name} key={room.key} id={room.key}
              network={room.network} netmask={room.netmask}
              machines={room.machines} />);
    });
    this.setState({rooms: rooms});
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
    //   <Button color="green" basic floated="right" as={Link} onClick={this.hostAdd}>
    //   <Icon name="add" /> Host
    // </Button>
  },
  render: function(){
    return(
      <Grid>
        <Grid.Row textAlign="center">
          <Header as="h1">Inventory</Header>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column  width={16}>
              <Button color="green" basic floated="right" as={Link} onClick={this.roomAdd}>
                <Icon name="add" /> Room
              </Button>
          </Grid.Column>
        </Grid.Row>
        <Card.Group>
          {this.state.rooms}
        </Card.Group>
      </Grid>

    );
  }
});

module.exports = Inventory;
