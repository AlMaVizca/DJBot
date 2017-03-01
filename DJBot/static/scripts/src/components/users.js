var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var PropTypes = React.PropTypes;

import { Button, Checkbox, Confirm, Form, Grid, Header, Icon, Input, Modal, Segment, Table } from 'semantic-ui-react';

var UserList = React.createClass({
  componentWillReceiveProps: function(){
    this.users = this.props.users.map(function(user,i){
      return <UserItem key={i} id={user.key} admin={user.admin}
      username={user.username} email={user.email}
      usersLoad={this.props.usersLoad}/>;
    }, this);
  },
  passSave: function(){
    $.ajax({
      url: '/api/user/change_password',
      dataType: 'json',
      type: 'POST',
      data: {key: this.state.key, password: newpass, old: oldpass},
      success: function(data) {
        this.setState({message: data['message']});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/user/change_password',
                      status, err.toString());
      }.bind(this)
    });
  },
  render: function(){
    var users = this.props.users.map(function(user,i){
      return <UserItem key={i} id={user.key} admin={user.admin}
      username={user.username} email={user.email}
      usersLoad={this.props.usersLoad}/>;
    },this);
    return(
      <Table.Body>
        {users}
      </Table.Body>
    );
  }
});

var UserItem = React.createClass({
  cancelConfirmation: function(){
    this.setState({open: false})
  },
  changeAdmin: function(){
    $.ajax({
      url: '/api/user/change_admin',
      dataType: 'json',
      type: 'POST',
      data: {key: this.props.id},
      success: function(data) {
        this.setState({message: data['message']});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/user/change_admin', status, err.toString());
      }.bind(this)
    });
    this.props.usersLoad();
  },
  getInitialState: function(){
    return {
      open: false
    }
  },
  openConfirmation: function(){
    this.setState({open: true});
  },
  userEdit: function(){
  },
  userDelete: function(){
    this.setState({open: false});
    $.ajax({
      url: '/api/user/delete',
      dataType: 'json',
      type: 'POST',
      data: {key: this.props.id},
      success: function(data) {
        this.setState({message: data['message']});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/user/delete', status, err.toString());
      }.bind(this)
    });
    this.props.usersLoad();
  },
  render: function(){
    var confirmationText = "Do you want to delete user " + this.props.username + "?";
    return(
      <Table.Row>
        <Table.Cell>
          <Checkbox checked={this.props.admin}
                    onChange={this.changeAdmin} />
        </Table.Cell>
        <Table.Cell>
          {this.props.username}
        </Table.Cell>
        <Table.Cell>
          {this.props.email}
        </Table.Cell>
        <Table.Cell>
          <Button basic color="blue" icon="edit"
                  onClick={this.userEdit}/>
        </Table.Cell>
        <Table.Cell>
          <Button color="red" icon="remove user"
                  onClick={this.openConfirmation}/>
          <Confirm open={this.state.open}
                   content={confirmationText}
                   onConfirm={this.userDelete}
                   onCancel={this.cancelConfirmation}
                   confirmButton="Yes"
                   cancelButton="No"
                   />
        </Table.Cell>
      </Table.Row>
    );
  }
});


function Users(props){
  return(
    <div>
      <Header as="h1">Users List</Header>
      <Segment>
        <Table color="blue" striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Admin</Table.HeaderCell>
              <Table.HeaderCell>Username</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Edit</Table.HeaderCell>
              <Table.HeaderCell>Remove</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
            <UserList users={props.users} usersLoad={props.usersLoad}/>
        </Table>
      </Segment>
      <Grid centered>
        <Button circular as={Link} color="green" icon="add user"
                to="/settings/userNew"/>
      </Grid>
    </div>
  )
};

Users.propTypes = {
  users: PropTypes.array,
  usersLoad: PropTypes.func.isRequired,
}

module.exports = Users;
