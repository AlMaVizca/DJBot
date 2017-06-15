var React = require("react");
var PropTypes = React.PropTypes;
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

var ShowMessage = require("./message");

import {Button, Confirm, Grid, Header, Icon, Input, Menu, Popup, Segment, Table} from "semantic-ui-react";

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

var PlaybookList = React.createClass({
  componentDidMount: function(){
    this.props.load();
  },
  componentWillReceiveProps: function(nextProps){
    this.generateList(nextProps);
  },
  getInitialState: function(){
    return ({playbookList: []});
  },
  generateList: function(nextProps){
    this.plays = nextProps.playbooks.map(function(playbook, i){
      return <Playbook key={i} playbook={playbook}
                       updateMessage={this.props.updateMessage}
                       load={this.props.load}/>;
    }, this);
    this.setState({playbookList: this.plays});
  },
  render: function(){
    return (
      <Table.Body>
        {this.state.playbookList}
      </Table.Body>
    );
  }

});

function Playbooks(props){
  return (
    <div>
      <Header>Playbooks</Header>
      <ShowMessage mode={props.messageMode} text={props.messageText}/>
      <Segment raised>
	<Table color="blue" striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={5}>Name</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell width={2}>Edit</Table.HeaderCell>
              <Table.HeaderCell width={2}>Delete</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <PlaybookList playbooks={props.playbooks} load={props.load}
                        updateMessage={props.updateMessage}/>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell>
                {props.playbooks.length} Playbooks
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Input fluid icon="search" placeholder="Search by name or description..."  />
              </Table.HeaderCell>
              <Table.HeaderCell colSpan="2">
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
      </Segment>
      <Grid centered>
        <Popup
          trigger={<Button circular as={Link} color="green" icon="add circle" to="/playbook/new" />}
          content="Add playbook"
          />
      </Grid>
    </div>
  );
};

module.exports = Playbooks;
