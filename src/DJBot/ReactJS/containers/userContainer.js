var React = require("react");
var User = require("../components/user/user");

var UserContainer = React.createClass({
  getInitialState: function(){
    return ({
      key: 999,
      username: "",
      email: "",
      old: "",
      password: "",
      messageMode: 10,
      messageText: ''
    });
  },
  componentDidMount: function(){
    this.userLoad();
  },
  changeUsername: function(e) {
    this.setState({username: e.target.value});
  },
  changeEmail: function(e) {
    this.setState({email: e.target.value});
  },
  changeOldPassword: function(e) {
    this.setState({old: e.target.value});
  },
  changePassword: function(e) {
    this.setState({password: e.target.value});
  },
  userLoad: function(){
    $.ajax(
      {
        url:'/api/user',
        dataType: 'json',
        success: function(data){
          this.setState(data);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('/api/user', status, err.toString());
        }.bind(this)
      });
  },
  userSave: function(e, {formData}){
    var user = {
      key: this.state.key,
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      old: this.state.old
    };
    $.ajax(
      {
        url: '/api/user/change',
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
    this.setState({old: "", password: ""});
    this.userLoad();
  },
  render: function() {
    return (
      <User
        username = {this.state.username}
        email = {this.state.email}
        password = {this.state.password}
        old = {this.state.old}
        messageMode = {this.state.messageMode}
        messageText = {this.state.messageText}
        changeEmail = {this.changeEmail}
        changePassword = {this.changePassword}
        changeOldPassword = {this.changeOldPassword}
        saveAction = {this.userSave}
        />
    )
  }
});

module.exports = UserContainer;
