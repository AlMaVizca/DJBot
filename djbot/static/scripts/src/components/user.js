var React = require("react");
var PropTypes = React.PropTypes;
import { Button, Form, Grid, Input, Header, Segment } from "semantic-ui-react";

var User = React.createClass({
  propTypes: {
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    changeEmail: PropTypes.func.isRequired,
    newPassword: PropTypes.func.isRequired,
    oldPassword: PropTypes.func.isRequired,
    saveAction : PropTypes.func.isRequired
  },
  getInitialState: function(){
    return ({checkPassword:''})
  },
  checkPassword: function(e){
        this.setState({checkPassword: e.target.value});
  },
  render: function(){
    return(
      <div>
        <Header as="h1">User Profile</Header>
        <Grid centered>
          <Grid.Column width={5}>
            <Segment textAlign="left" reised>
              <Form onSubmit={this.props.saveAction}>
                <Form.Field disabled control={Input} label="Username"
                            value={this.props.username}
                            placeholder={this.props.username} type="text"
                            onChange={this.props.changeName} />
                <Form.Field required control={Input} label="Email"
                            value={this.props.email} control={Input}
                            placeholder={this.props.email} type="text"
                            onChange={this.props.changeEmail} />
                <Form.Field required label="Old Password" type="password"
                            control={Input}
                            onChange={this.props.oldPassword} />
                <Form.Field label="New Password" type="password"
                            control={Input}
                            onChange={this.props.newPassword} />
                <Form.Field label="Reply Password"
                            type="password" control={Input}
                            onChange={this.checkPassword} />
                <Form.Field>
                  <Button basic color="green" fluid icon="save"
                          type="submit" content="Save"/>
                </Form.Field>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    )}
})

module.exports = User;
