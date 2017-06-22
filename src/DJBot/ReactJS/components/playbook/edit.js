var React = require("react");
var PropTypes = React.PropTypes;
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;
var GenericTable = require("../genericTable");
var ShowMessage = require("../message");

import {Button, Confirm, Header, Grid, Icon, Input, Menu, Segment, Table} from "semantic-ui-react";


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
      url: '/api/task/delete',
      dataType: 'json',
      type: 'POST',
      data: {key: this.props.task.key},
      success: function(data) {
        this.props.load();
        this.props.updateMessage(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/task/delete', status, err.toString());
      }.bind(this)
    });
  },
  taskEdit: function(){
    this.context.router.push({
      pathname: "/task/edit",
      query: {
        key: this.props.task.key,
      }
    });
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
                    onClick={this.taskEdit} />
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

var PlaybookEdit = React.createClass({
  propTypes: {
    name: PropTypes.string,
    description: PropTypes.string,
    tasks: PropTypes.array,
    changeName: PropTypes.func.isRequired,
    changeDescription: PropTypes.func.isRequired,
    saveAction: PropTypes.func.isRequired
  },
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getDefaultProps: function(){
    return ({
      transparent: true,
      tasks: []
    });
  },
  componentWillReceiveProps: function(nextProps){
    var tasks = nextProps.tasks.map(function(task, i){
      return <Task key={i} task={task}
      updateMessage={this.props.updateMessage}
      load={this.props.load} />;
    }, this);
    this.setState({tasksList: tasks});
  },
  getInitialState: function(){
    return({messageMode: 10,
            messageText: '',
            taskList: [],
           });
  },
  addTask: function(){
    this.props.saveAction(true);
  },
  save: function(){
    this.props.saveAction();
  },
  updateMessage: function(data){
    this.setState(data);
  },
  render: function(){
    const tableHeader = [
        <Table.HeaderCell key={1} width={7}>Task Name</Table.HeaderCell>,
      <Table.HeaderCell key={2} width={1}>Edit</Table.HeaderCell>,
      <Table.HeaderCell key={3} width={1}>Order</Table.HeaderCell>,
      <Table.HeaderCell key={4} width={1}>Remove</Table.HeaderCell>,
    ];
    return (
      <div>
        <ShowMessage mode={this.state.messageMode} text={this.state.messageText} />
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
        <GenericTable header={tableHeader}
                      data={this.state.tasksList}
                      length={this.props.tasks.length}
                      description="Tasks"
                      footer={2}
                      />

        <Grid centered padded>
          <Button circular as={Link} color="green" icon="add circle"
                  onClick={this.addTask} />
        </Grid>
        <Grid padded>
          <Button basic color="green" icon="save"
                  content="Save" onClick={this.save} />
        </Grid>

      </div>
    );
  }
});

module.exports = PlaybookEdit;
