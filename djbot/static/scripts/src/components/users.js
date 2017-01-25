var React = require('react');
var PropTypes = React.PropTypes;
var User = require("./user");
import { Button, Icon, Segment } from 'semantic-ui-react';

var UserList = React.createClass({
  componentWillReceiveProps: function(){
    console.log(this.props);
    this.users = this.props.users.map(function(user,i){
      return <UserItem key={i} id={user.key} admin={user.admin} username={user.username} email={user.email} updateItem={this.updateItem} usersReload={this.props.usersReload}/>;
    }, this);
  },
  userAdd: function(){
    $('.user.basic').modal({closable: false,
                            onApprove: function () {
                              console.log('Approve');
                            },
                            onHide: function(){
                              return false
                            },
                            onShow: function(){
                            },
                           }).modal('toggle');
  },
  passCancel: function(){
    $('.pass.add').modal({closable: true}).modal('toggle');
  },
  updateItem: function(key){
    this.setState({key: key})
  },
  passSave: function(){
    var newpass = $('#newpass').val();
    var oldpass = $('#oldpass').val();
    $.ajax({
      url: '/api/user/change_password',
      dataType: 'json',
      type: 'POST',
      data: {key: this.state.key, password: newpass, old: oldpass},
      success: function(data) {
        this.setState({message: data['message']});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/user/change_password', status, err.toString());
      }.bind(this)
    });

    document.getElementById('newpass').value='';
    document.getElementById('oldpass').value='';
    $('.pass.add').modal({closable: true}).modal('toggle');
  },
  render: function(){
    var Button = Semantify.Button;
    var Field = Semantify.Field;
    var Grid = Semantify.Grid;
    var Icon = Semantify.Icon;
    var Input = Semantify.Input;
    var Label = Semantify.Label;
    var Modal = Semantify.Modal;
    var Table = Semantify.Table;
    console.log(this.props);
    var users = this.props.users.map(function(user,i){
      return <UserItem key={i} id={user.key} admin={user.admin} username={user.username} email={user.email} updateItem={this.updateItem}  usersReload={this.props.usersReload}/>;
    },this);
    return(
      <div>
        <Table className="blue">
          <thead>
            <tr>
              <th className="one wide">
                <Icon/>Admin</th>
              <th className="three wide">
                <Icon className="user"/>Username</th>
              <th className="three wide">
                <Icon className="sitemap"/>Email</th>
              <th className="one wide">
                <Icon/>Reset Password</th>
              <th className="one wide">
                <Icon/>Remove</th>
            </tr>
          </thead>
          <tbody>
            {this.users}
          </tbody>
        </Table>
        <ButtonAdd usersReload={this.props.usersReload} userAdd={this.userAdd}/>
        <Modal className="pass add basic">
          <Grid className="center aligned">
            <Field>
              <Input>
                <div className="ui labeled input">
                  <Label>
                    Your Password
                  </Label>
                  <input id="oldpass" placeholder='' type="password" />
                </div>
              </Input>
            </Field>
            <Field>
              <Input>
                <div className="ui labeled input">
                  <Label>
                    New Password
                  </Label>
                  <input id="newpass" placeholder='' type="password" />
                </div>
              </Input>
            </Field>
          </Grid>
          <Grid>
            <div className="right aligned column">
              <Button className="inverted red basic active cancel" onClick={this.passCancel}>Cancel</Button>
              <Button className="inverted green basic active approve" onClick={this.passSave}>Save</Button>
            </div>
          </Grid>
        </Modal>
      </div>
    );
  }
});


var UserNew = React.createClass({
  getInitialState: function(){
    return {username: "", email: "", password:"", replypw:""}
  },
  userCancel: function(){
    $('.user.basic').modal({closable: true}).modal('toggle');
  },
  changeName: function(e) {
    this.setState({username: e.target.value});
  },
  changeEmail: function(e) {
    this.setState({email: e.target.value});
  },
  changePassword: function(e) {
    this.setState({password: e.target.value});
  },
  changeReplyPassword: function(e) {
    this.setState({replypw: e.target.value});
  },

  userSave: function(){
    var username =  this.state.username.trim();
    var email = this.state.email.trim();
    var password = this.state.password.trim();
    var replypw = this.state.replypw.trim();

    if (!username || !email || !password || !replypw ){
      console.log('Missing value');
      return;
    }
    if (password != replypw){
      console.log('Password missmatch');
      return;
    }
    var user = { username: username, email: email, password: password};
    var result = '';
    $.ajax({
      url: '/api/user/add',
      dataType: 'json',
      type: 'POST',
      data: user,
      success: function(data) {
        this.setState({message: data['message']});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/user/change', status, err.toString());
      }.bind(this)
    });
    this.setState({username: ''});
    this.setState({email: ''});
    this.setState({password: ''});
    this.setState({replypw: ''});

    this.props.usersReload();

    $('.add.basic').modal({closable: true}).modal('hide');
  },
  render: function(){
    var Modal = Semantify.Modal;
    var Button = Semantify.Button;
    var Field = Semantify.Field;
    var Form = Semantify.Form;
    var Grid = Semantify.Grid;
    var Input = Semantify.Input;
    var Label = Semantify.Label;
    return(
      <Modal className="user add basic">
        <Grid className="center aligned">
          <Form>
            <Field>
              <Input>
                <div className="ui labeled input">
                  <Label>
                    Username
                  </Label>
                  <input id="username" defaultValue={this.state.username} placeholder={this.state.username} type="text" onChange={this.changeName} />
                </div>
              </Input>
            </Field>
            <Field>
              <Input>
                <div className="ui labeled input">
                  <Label>
                    Email
                  </Label>
                  <input id="email" defaultValue={this.state.email} placeholder={this.state.email} type="text" onChange={this.changeEmail} />
                </div>
              </Input>
            </Field>
            <Field>
              <Input>
                <div className="ui labeled input">
                  <Label>
                    Password
                  </Label>
                  <input placeholder='' type="password" onChange={this.changePassword} />
                </div>
              </Input>
            </Field>
            <Field>
              <Input>
                <div className="ui labeled input">
                  <Label>
                    Repeat Password
                  </Label>
                  <input placeholder='' type="password" onChange={this.changeReplyPassword}/>
                </div>
              </Input>
            </Field>
          </Form>
        </Grid>
        <Grid>
          <div className="right aligned column">
            <Button className="inverted red basic cancel" onClick={this.userCancel}>Cancel</Button>
            <Button className="inverted green basic active approve" onClick={this.userSave}>Save</Button>
          </div>
        </Grid>
      </Modal>
    );
  }
});




var ButtonAdd = React.createClass({
  render: function(){
    var Button = Semantify.Button;
    var Grid = Semantify.Grid;
    var Icon = Semantify.Icon;
    return(
      <Grid className="centered">
        <Button className="icon circular green" onClick={this.props.userAdd}>
          <UserNew name="Add User" usersReload={this.props.usersReload} />
          <Icon className="add circle icon" />
        </Button>
      </Grid>
    );
  }
});

var UserItem = React.createClass({
  userDelete: function(){
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
    this.props.usersReload();
  },
  userAdmin: function(){
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
    this.props.usersReload();
  },
  userEdit: function(){
    this.props.updateItem(this.props.id);
    $('.pass.add').modal({closable: false,}).modal('toggle');

  },
  componentDidMount: function(){
    this.classCheckbox = '.checkbox.'+this.props.username;
    if (this.props.admin){
      $(this.classCheckbox).checkbox('check');
    }else{
      $('.ui.checkbox').checkbox();
    }
    $('.icon.red').popup({on: 'click', inline: true});
  },
  componentWillReceiveProps: function(){
    this.classToggle = classNames('ui', 'checkbox', this.props.username);
    this.classCheckbox = '.checkbox.'+this.props.username;
    if (this.props.admin){
      $(this.classCheckbox).checkbox('check');
    }else{
      $('.ui.checkbox').checkbox();
    }
    $('.icon.red').popup({on: 'click', inline: true});
  },
  togglePopup: function(){
    $('.visible.button').popup('toggle');
  },
  render: function(){
    var Button = Semantify.Button;
    var Icon = Semantify.Icon;
    var classCheckbox;
    var classToggle = classNames('ui', 'checkbox', this.props.username)
    return(
      <tr>
        <td>
          <div className={classToggle} onClick={this.userAdmin}>
            <input name="select" type="checkbox"/>
          </div>
        </td>
        <td>
          {this.props.username}
        </td>
        <td>{this.props.email}
        </td>
        <td>
          <div className="right aligned column">
            <Button className="inverted blue basic" onClick={this.userEdit}><Icon className="blue edit"/></Button>
          </div>
        </td>
        <td>
          <div className="right aligned column">
            <Button className="inverted red basic circular"><Icon className="inverted red circle trash"/></Button>
            <div className="ui fluid popup top left transition hidden">
              <div className="ui one column divided center aligned grid">
                <div className="">Are you sure?</div>
                <div className="">
                  <Button className="blue" onClick={this.togglePopup}>No</Button>
                </div>
                <div className="">
                  <Button className="red" onClick={this.userDelete}>Yes</Button>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  }
});

function Users(props){
  return(
    <Segment>
          <UserList users={props.users} usersReload={props.usersReload} />
    </Segment>
  )
};

Users.propTypes = {
  message: PropTypes.string.isRequired,

  users: PropTypes.array,
  usersReload: PropTypes.func.isRequired,
}

module.exports = Users;
