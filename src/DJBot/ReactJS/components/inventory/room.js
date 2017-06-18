var React = require("react");
import {Button, Card, Divider, Form, Grid, Header, Icon, Input, Label, Modal, Segment, Select} from 'semantic-ui-react';
var AnsibleResults = require("../ansibleResults");


var Room = React.createClass({
  componentWillReceiveProps: function(nextProps){
    const keys = nextProps.keys.map(function(key){
        return {key: key, value: key, text: key}
    });
    if(Object.keys(nextProps.hosts).length > 0){
    const hosts = <AnsibleResults ok={nextProps.hosts.ok}
      failed={nextProps.hosts.failed}
      unreachable={nextProps.hosts.unreachable}
      tasks={nextProps.hosts.tasks}
        />;

    this.setState({hosts: hosts,
                   keys: keys});
    }else{
      this.setState({keys: keys});
    }
  },
  getInitialState: function(){
    return({hosts:[],
            keys: [],
            modal: false})
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
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Button floated="right" basic
                    onClick={this.props.back}>
              Go Back
            </Button>

            <Header as="h1"> Room </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered>
          <Grid.Column width={14}>
            <Form>
              <Form.Group widths="equal">
                <Form.Field>
                  <label>
                    Name
                  </label>
                  <Input placeholder="How is the room called?"
                         type="text"
                         onChange={this.props.changeOption}
                         name="name" value={this.props.name} />
                </Form.Field>
                <Form.Field>
                  <label>
                    Machines
                  </label>
                  <Input placeholder="How many machines?" type="text"
                         onChange={this.props.changeOption}
                         name="machines" value={this.props.machines}/>
                </Form.Field>
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field>
                  <label>
                    Network
                  </label>
                  <Input placeholder="Which is the network?"
                         type="text"
                         onChange={this.props.changeOption}
                         name="network" value={this.props.network} />
                </Form.Field>
                <Form.Field>
                  <label>
                    Netmask
                  </label>
                  <Input placeholder="And the netmask?" type="text"
                         onChange={this.props.changeOption}
                         name="netmask" value={this.props.netmask} />
                </Form.Field>
                <Form.Field>
                  <label>
                    Gateway
                  </label>
                  <Input placeholder="Where is the gateway?"
                         type="text"
                         onChange={this.props.changeOption}
                         name="gateway" value={this.props.gateway} />
                </Form.Field>
                <Form.Field>
                  <label>
                    Remote user
                  </label>
                  <Input placeholder="Which user?"
                         type="text"
                         onChange={this.props.changeOption}
                         name="user" value={this.props.user} />
                </Form.Field>
                <Form.Field>
                  <label>
                    SSH key
                  </label>
                  <Select search placeholder="Which key?"
                          type="text"
                          onChange={this.props.changeOption}
                          options={this.state.keys}
                          name="privateKey"
                          value={this.props.privateKey} />
                </Form.Field>
              </Form.Group>
            </Form>
          </Grid.Column>
          <Grid.Column width={2}>
            <Button inverted color="green" floated="right"
                    onClick={this.props.save}>
              Save
            </Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as="h1">Computers</Header>
            <Divider />
            <Modal closeIcon='close' open={this.state.modal}
                   trigger={<Button basic color="olive"
                                      floated="right" loading={this.props.loading}
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
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Segment basic loading={this.props.loading}>
              {this.state.hosts}
            </Segment>
        </Grid.Row>
      </Grid>
    )
  }
});

module.exports = Room;
