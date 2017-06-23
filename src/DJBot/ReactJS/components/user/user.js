var React = require("react");
var PropTypes = React.PropTypes;
var ShowMessage = require("../utils/message");

import { Button, Form, Grid, Input, Header, Segment } from "semantic-ui-react";


var User = React.createClass({
  propTypes: {
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    old: PropTypes.string.isRequired,
    messageMode: PropTypes.number,
    messageText: PropTypes.string,
    changeEmail: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    changeOldPassword: PropTypes.func.isRequired,
    saveAction : PropTypes.func.isRequired
  },
  checkPassword: function(e){
    this.setState({checkPassword: e.target.value});
  },
  getInitialState: function(){
    return ({checkPassword: ''})
  },
  render: function(){
    return(
      <div>
        <Header as="h1">User Profile</Header>
        <ShowMessage mode={this.props.messageMode} text={this.props.messageText} />
        <Grid centered>
          <Grid.Column width={5}>
            <Segment textAlign="left" raised attached>
              <Form>
                <Form.Field disabled control={Input} label="Username"
                            name="Username" value={this.props.username}
                            placeholder={this.props.username} type="text"
                            onChange={this.props.changeName} />

                <Form.Field required control={Input} label="Email"
                            value={this.props.email} name="email"
                            placeholder={this.props.email} type="text"
                            onChange={this.props.changeEmail} />

                <Form.Field required label="Old Password" type="password"
                            control={Input} name="oldPassword"
                            value={this.props.old}
                            onChange={this.props.changeOldPassword} />

                <Form.Field label="New Password" type="password"
                            value={this.props.password}
                            control={Input} name="newPassword"
                            onChange={this.props.changePassword} />

                <Form.Field label="Reply Password" name="rptPassword"
                            type="password" control={Input}
                            onChange={this.checkPassword} />
              </Form>
            </Segment>
            <Button basic color="green" fluid icon="save"
                    attached="bottom" content="Save"
                    onClick={this.props.saveAction} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
});

module.exports = User;
