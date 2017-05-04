var React = require("react");
var Users = require("../components/users");


var UsersContainer = React.createClass({
  getInitialState: function(){
    return {users:[]}
  },
  usersLoad: function(){
    $.ajax(
      {
        url:'/api/user/users',
        dataType: 'json',
        success: function(data){
          this.setState(data);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('/api/user/users', status, err.toString());
        }.bind(this)
      });
  },
  componentDidMount: function(){
    this.usersLoad();
  },
  render: function() {
    return (
      <Users
        users = {this.state.users}
        usersLoad = {this.usersLoad}
        />
    )
  }
});

module.exports = UsersContainer;
