var React = require("react");
var PropTypes = React.PropTypes;
import { Form, Input } from "semantic-ui-react";

var userNew = React.createClass({
  propTypes: {
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    changeUsername: PropTypes.func.isRequired,
    changeEmail: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
  },
  checkPassword: function(e){
    this.setState({checkPassword: e.target.value});
  },
  render: function(){
    return (
      <Form>
        <Form.Field required control={Input} label="Username"
                    name="Username" value={this.props.username}
                    placeholder='Username...' type="text"
                    onChange={this.props.changeUsername} />

        <Form.Field required control={Input} label="Email"
                    value={this.props.email} name="email"
                    placeholder="user@domain.mail" type="text"
                    key="email"
                    onChange={this.props.changeEmail} />

        <Form.Field required label="New Password" type="password"
                    value={this.props.password}
                    control={Input} name="newPassword"
                    key="password"
                    onChange={this.props.changePassword} />

        <Form.Field required label="Reply Password" name="rptPassword"
                    type="password" control={Input}
                    key="rptPassword"
                    onChange={this.checkPassword} />
      </Form>
    );
  }
});

module.exports = userNew;
