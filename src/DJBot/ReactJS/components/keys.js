var React = require('react');
var ShowMessage = require("./message");
var GenericTable = require("./genericTable");
import {Button, Confirm, Grid, Header, Icon, Input, Label, Modal, Popup, Table} from "semantic-ui-react";

var Key = React.createClass({
  getInitialState: function(){
    return ({
      open: false
    });
  },
  openConfirmation: function(){
    this.setState({open: true});
  },
  cancelConfirmation: function(){
    this.setState({open: false});
  },
  keyDelete: function(){
    this.props.keyDelete(this.props.name)
  },
  render: function(){
    var confirmationText = "Do you want to delete key " + this.props.name + "?";
    return(
        <Table.Row>
          <Table.Cell>
            {this.props.name}
          </Table.Cell>
          <Table.Cell>
            <Button color="red" icon="remove"
                    onClick={this.openConfirmation}/>
            <Confirm open={this.state.open}
                     content={confirmationText}
                     onConfirm={this.keyDelete}
                     onCancel={this.cancelConfirmation}
                     confirmButton="Yes"
                     cancelButton="No"
                     />
          </Table.Cell>
        </Table.Row>
    );
  }
})

var KeysManagement = React.createClass({
  componentWillReceiveProps: function(nextProps){
    const keys = nextProps.keys.map(function(key, i){
      return <Key key={i} name={key} keyDelete={this.props.keyDelete}/>;
    }, this);
    this.setState({keys: keys});
  },
  getInitialState: function(){
    return({
      modal: false,
      keys: []
    });
  },
  open: function(){
      this.setState({modal: true});
  },
  close: function(){
    this.setState({modal: false})
  },
  create: function(){
    this.close();
    this.props.create();
  },
  render: function(){
    const tableHeader = [
        <Table.HeaderCell key={1} width={14} >Name</Table.HeaderCell>,
      <Table.HeaderCell key={2} >Delete</Table.HeaderCell>,
    ];

    return(
      <div>
        <Header>Keys</Header>
        <ShowMessage mode={this.props.messageMode} text={this.props.messageText}/>
        <GenericTable header={tableHeader}
                      data={this.state.keys}
                      length={this.state.keys.length}
                      description="Keys" />
        <Grid centered>
          <Modal closeIcon='close' open={this.state.modal}
                 trigger={<Button basic color="green"
                                    onClick={this.open}>
                          Add SSH key
                 </Button>}
          onClose={this.close} >
            <Header>
              <Icon name='add' color="green" />
              Add SSH key
            </Header>
            <Modal.Content>
              <p> Here you are going to create a new ssh key. Please write a name. </p>
              <Label basic color="black">
                name:
              </Label>
              <Input type="text"
                     onChange={this.props.changeOption}
                     name="name" value={this.props.name} />
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.create} color='green'>
                <Icon name='checkmark' /> Done
              </Button>
            </Modal.Actions>
          </Modal>

        </Grid>
      </div>
    )
  }
});

module.exports = KeysManagement;
