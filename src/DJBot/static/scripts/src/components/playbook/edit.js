var React = require("react");
var PropTypes = React.PropTypes;
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var ShowMessage = require("../message");

import {Button, Header, Grid, Icon, Input, Menu, Segment, Table} from "semantic-ui-react";


var Task = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  cancelConfirmation: function(){
    this.setState({open: false});
  },
  getInitialState: function(){
    return ({
      open: false
    });
  },
  openConfirmation: function(){
    this.setState({open: true});
  },
  taskDelete: function(){
    this.setState({open: false});
    $.ajax({
      url: '/api/playbook/delete',
      dataType: 'json',
      type: 'POST',
      data: {key: this.props.playbook.key},
      success: function(data) {
        this.props.updateMessage(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/playbook/delete', status, err.toString());
      }.bind(this)
    });
    this.props.load();
  },
  render: function(){
    var confirmationText = "Do you want to delete task " + this.props.task.name + "?";
    return(
        <Table.Row>
          <Table.Cell>
            {this.props.task.name}
          </Table.Cell>
          <Table.Cell>
            <Button color="blue" icon="edit"
                    onClick={this.editPlaybook} />
          </Table.Cell>

          <Table.Cell>
          </Table.Cell>

          <Table.Cell>
            <Button color="red" icon="remove"
                    onClick={this.openConfirmation}/>
            <Confirm open={this.state.open}
                     content={confirmationText}
                     onConfirm={this.taskDelete}
                     onCancel={this.cancelConfirmation}
                     confirmButton="Yes"
                     cancelButton="No"
                     />
          </Table.Cell>
        </Table.Row>
    );
  }
});

var TaskList = React.createClass({
  componentDidMount: function(){
  },
  componentWillReceiveProps: function(nextProps){
    this.generateList(nextProps);
  },
  getInitialState: function(){
    return ({taskList: []});
  },
  generateList: function(nextProps){
    this.tasks = nextProps.tasks.map(function(task, i){
      return <Task key={i} task={task}
                       updateMessage={this.props.updateMessage}
                       load={this.props.load}/>;
    }, this);
    this.setState({tasksList: this.tasks});
  },
  render: function(){
    return (
      <Table.Body>
        {this.state.tasksList}
      </Table.Body>
    );
  }

});

var PlaybookEdit = React.createClass({
  propTypes: {
    name: PropTypes.string,
    description: PropTypes.string,
    tasks: PropTypes.array,
    changeName: PropTypes.func.isRequired,
    changeDescription: PropTypes.func.isRequired,
    saveAction: PropTypes.func.isRequired
  },
  getDefaultProps: function(){
    return ({
      transparent: true,
      tasks: []
    });
  },
  render: function(){
    return (
      <div>
        <Header>{this.props.header} Playbook </Header>
        <Input fluid transparent={this.props.transparent}
               type="text" name="name" value={this.props.name}
               label={{ribbon: true, color: "blue",
               content: "Playbook Name"}}
               placeholder="Write the name of the playbook"
               onChange={this.props.changeName} />

        <Input fluid transparent={this.props.transparent}
               type="text" name="description"
               value={this.props.description}
               label={{ribbon: true, color: "blue",
               content: "Playbook Description"}}
               placeholder="Please write a short functional description"
               onChange={this.props.changeDescription}
               />

        <Segment>
          <Table color="blue" striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={7}>Task Name</Table.HeaderCell>
              <Table.HeaderCell width={1}>Edit</Table.HeaderCell>
              <Table.HeaderCell width={1}>Order</Table.HeaderCell>
              <Table.HeaderCell width={1}>Remove</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <TaskList tasks={this.props.tasks} />

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell>
                <Input fluid icon="search"
                       placeholder="Search by name..."  />
              </Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.tasks.length} Tasks
              </Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell width={2}>
                <Menu floated="right" pagination>
                  <Menu.Item as="a" icon>
                    <Icon name="left chevron" />
                  </Menu.Item>

                  <Menu.Item as="a">1</Menu.Item>

                  <Menu.Item as="a" icon>
                    <Icon name="right chevron" />
                  </Menu.Item>
                </Menu>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
          </Table>
          <Grid centered padded>
            <Button circular as={Link} color="green" icon="add circle"
                    to="/task/new" />
          </Grid>
        </Segment>
        <Grid padded>
          <Button basic color="green" icon="save"
                  content="Save" onClick={this.props.saveAction} />
        </Grid>

      </div>
    );
  }
});

module.exports = PlaybookEdit;
