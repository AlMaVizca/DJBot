var React = require("react");
var PropTypes = React.PropTypes;

import { Form, Input } from "semantic-ui-react";

var userNew = React.createClass({
  propTypes: {
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    rptPassword: PropTypes.string.isRequired,
    changeUsername: PropTypes.func.isRequired,
    changeEmail: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    checkPassword: PropTypes.func.isRequired
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
                    onChange={this.props.changeEmail} />

        <Form.Field required label="New Password" type="password"
                    value={this.props.password} name="password"
                    control={Input} name="newPassword"
                    onChange={this.props.changePassword} />

        <Form.Field required label="Reply Password" name="rptPassword"
                    type="password" control={Input}
                    value={this.props.rptPassword}
                    onChange={this.props.changeRptPassword} />
      </Form>
    );
  }
});

module.exports = userNew;
