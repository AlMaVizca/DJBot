var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var PropTypes = React.PropTypes;

var FormUserNew = require("../forms/userNew");
var ShowMessage = require("../message");

import { Button, Form, Grid, Header, Input, Segment} from 'semantic-ui-react';

var UserNew = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function(){
    return ({
      username: "",
      email: "",
      password:"",
      rptPassword: ""
    });
  },
  changeUsername: function(e) {
    this.setState({username: e.target.value});
  },
  changeEmail: function(e) {
    this.setState({email: e.target.value});
  },
  changePassword: function(e) {
    this.setState({password: e.target.value});
  },
  changeRptPassword: function(e){
    this.setState({rptPassword: e.target.value});
  },
  checkPassword: function(){
    if (this.state.rptPassword.length == this.state.password.length){
      if (this.state.rptPassword.trim() != this.state.password.trim()){
        this.setState({messageMode: 1, messageText: "Password mismatch"});
      }
      else this.userSave();
    }

  },
  userSave: function(){
    var user = {
      username: this.state.username.trim(),
      email: this.state.email.trim(),
      password: this.state.password.trim()
    };

    $.ajax({
      url: '/api/user/add',
      dataType: 'json',
      type: 'POST',
      data: user,
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/user/change', status, err.toString());
      }.bind(this)
    });

    this.setState({
      username: "",
      email: "",
      password:"",
      rptPassword: "",
    });
    this.context.router.push("/settings/users");
  },
  render: function(){
    return(
      <div>
        <Header icon="user" content="Add new user" />
        <Grid centered>
          <Grid.Column width={5}>
            <Segment textAlign="left" raised attached>
              <ShowMessage mode={this.state.messageMode}
                           text={this.state.messageText}/>
              <FormUserNew username={this.state.username}
                           email={this.state.email}
                           password={this.state.password}
                           changeUsername={this.changeUsername}
                           changeEmail={this.changeEmail}
                           changePassword={this.changePassword}
                           changeRptPassword={this.changeRptPassword} />
            </Segment>
            <Button basic color="green" fluid icon="save"
                    attached="bottom" content="Save"
                    onClick={this.checkPassword} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
});


module.exports = UserNew;
