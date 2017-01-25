var React = require("react");
var axios = require("axios");
var Users = require("../components/users");


var UsersContainer = React.createClass({
  getInitialState: function(){
    return {message: '', users:[]}
  },
  usersLoad: function(){
    var _this = this;
    axios.get('/api/users')
      .then(function(response){
        _this.setState(response.data);
        })
      .catch(function(error){
        console.log(error);
      });
  },
  componentDidMount: function(){
    this.usersLoad();
  },
  render: function() {
    return (
      <Users
        message = {this.state.message}
        users = {this.state.users}
        usersReload = {this.usersReload}
        />
    )
  }
});

module.exports = UsersContainer;
