var React = require("react");
var PropTypes = React.PropTypes;
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

var ShowMessage = require("./message");
var GenericTable = require("./genericTable");

import {Button, Confirm, Grid, Header, Popup, Table} from "semantic-ui-react";

var Playbook = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  cancelConfirmation: function(){
    this.setState({open: false});
  },
  editPlaybook: function(){
    this.context.router.push({
      pathname: "/playbook/edit",
      query: {
        id: this.props.playbook.key,
      }
    });
  },
  getInitialState: function(){
    return ({
      open: false
    });
  },
  openConfirmation: function(){
    this.setState({open: true});
  },
  playbookDelete: function(){
    this.props.playbookDelete(this.props.playbook.key);
  },
  render: function(){
    var confirmationText = "Do you want to delete playbook " + this.props.playbook.name + "?";
    return(
        <Table.Row>
          <Table.Cell>
            {this.props.playbook.name}
          </Table.Cell>
          <Table.Cell>
            {this.props.playbook.description}
          </Table.Cell>
          <Table.Cell>
            <Button color="blue" icon="edit"
                    onClick={this.editPlaybook} />
          </Table.Cell>
          <Table.Cell>
            <Button color="red" icon="remove"
                    onClick={this.openConfirmation}/>
            <Confirm open={this.state.open}
                     content={confirmationText}
                     onConfirm={this.playbookDelete}
                     onCancel={this.cancelConfirmation}
                     confirmButton="Yes"
                     cancelButton="No"
                     />
          </Table.Cell>
        </Table.Row>
    );
  }
});

var Playbooks = React.createClass({
  componentWillReceiveProps: function(nextProps){
    var plays = nextProps.playbooks.map(function(playbook, i){
      return <Playbook key={i} playbook={playbook}
      updateMessage={this.props.updateMessage}
      playbookDelete={this.props.playbookDelete}
        />;
    }, this);
    this.setState({playbookList: plays});
  },
  getInitialState: function(){
    return ({playbookList: []});
  },
  render: function(){
    const tableHeader = [
      <Table.HeaderCell key={1} width={5}>Name</Table.HeaderCell>,
    <Table.HeaderCell key={2}>Description</Table.HeaderCell>,
    <Table.HeaderCell key={3} width={2}>Edit</Table.HeaderCell>,
    <Table.HeaderCell key={4} width={2}>Delete</Table.HeaderCell>,
  ];
    return (
      <div>
        <Header>Playbooks</Header>
        <ShowMessage mode={this.props.messageMode} text={this.props.messageText}/>
        <GenericTable header={tableHeader}
                      data={this.state.playbookList}
                      length={this.props.playbooks.length}
                      description="Playbooks"
                      footer={2}/>
        <Grid centered>
          <Popup
            trigger={<Button circular as={Link} color="green" icon="add circle" to="/playbook/new" />}
            content="Add playbook"
            />
        </Grid>
      </div>
    );
  }
});

module.exports = Playbooks;
