var React = require('react');
import {Button, Divider, Grid, Header, Icon, Input, Label, Modal, Segment} from 'semantic-ui-react';


var AskPass = React.createClass({
  getInitialState: function(){
    return({modal: false})
  },
  getDefaultProps: function(){
    return({
      content: '',
      width: 16,
    })
  },
  open: function(){
    this.setState({modal: true});
  },
  close: function(){
    this.setState({modal: false})
  },
  sshCopy: function(){
    this.props.sshCopy();
    this.close();
  },
  render: function(){
    return(
      <Grid.Column width={this.props.width}>
        <Grid.Row>
          <Segment basic loading={this.props.loading}>
            <Modal closeIcon='close' open={this.state.modal}
                   trigger={<Button basic color="olive"
                                      floated="right"
                                      onClick={this.open}>
                            Copy SSH key
                   </Button>}
            onClose={this.close} >

              <Header>
                <Icon name='exclamation' color="yellow" />
                Connection password
              </Header>
              <Modal.Content>
                <p>DJBot needs the password of the user {this.props.user} to add the public key. It will be in ram just for a second. </p>
                <Label basic color="black">
                  Password:
                </Label>
                <Input type="password"
                       onChange={this.props.changeOption}
                       name="password" value={this.props.password} />
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={this.sshCopy} color='green'>
                  <Icon name='checkmark' /> Done
                </Button>
              </Modal.Actions>
            </Modal>
            <Header as="h1">{this.props.name}</Header>
            <Divider />
          </Segment>
        </Grid.Row>
        <Grid.Row>
          <Segment basic loading={this.props.loading}>
            {this.props.content}
          </Segment>
        </Grid.Row>
      </Grid.Column>
    )
  }
});

module.exports = AskPass;
