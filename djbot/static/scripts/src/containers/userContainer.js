var React = require("react");
var User = require("../components/user");
var axios = require("axios");

var UserContainer = React.createClass({
  getInitialState: function(){
    return {key: 999, username: "", email: "", old: "", password: ""};
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
  userLoad: function(){
    var _this = this;
    axios.get('/api/user')
      .then(function(response){
        _this.setState(response.data);
        })
      .catch(function(error){
        console.log(error);
      });
  },
  userSave: function(){
    var old = $('#old').val().trim();
    var password = $('#password').val().trim();
    var replypw =$('#replyPassword').val().trim();
    if (!password || !replypw || !old){
      console.log('Missing value');
      return;
    }
    if (password != replypw){
      console.log('Password missmatch');
      return;
    }
    var user = {key: this.state.key, username: this.state.username, email: email, password: password, old: old};
    var result = '';
    $.ajax({
      url: '/api/user/change',
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
  },
  render: function() {
    return (
      <User
        username = {this.state.username}
        email = {this.state.email}
        changeEmail = {this.changeEmail}
        saveAction = {this.userSave}
        />
    )
  }
});

module.exports = UserContainer;
