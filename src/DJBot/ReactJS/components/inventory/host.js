var React = require('react');
var ShowMessage = require("../message");
var Machine = require("../forms/machine");

var AskPass = require("../askPass");
var AnsibleResults = require("../ansibleResults");

import { Button, Form, Grid, Header, Input, Segment} from 'semantic-ui-react';

var Host = React.createClass({
  getInitialState: function(){
    return({host: '',
            keys:[]});
  },
  componentWillReceiveProps: function(nextProps){
    const keys = nextProps.keys.map(function(key){
        return {key: key, value: key, text: key}
    });
    var host =''
    if(nextProps.host.ok)
      host = <AnsibleResults ok={nextProps.host.ok}
    failed={nextProps.host.failed}
    unreachable={nextProps.host.unreachable}
    tasks={nextProps.host.tasks}
      />;

    this.setState({keys: keys,
                   host: host})
  },
  render: function(){
    return(
      <div>
        <Button floated="right" basic
                onClick={this.props.back}>
          Go Back
        </Button>
        <Header icon="user" content="Add new host" />
        <ShowMessage mode={this.props.messageMode}
                     text={this.props.messageText}/>
        <Grid>
          <Grid.Row>
          <Grid.Column width={6}>
            <Segment textAlign="left" raised attached>
              <Machine name={this.props.name}
                       user={this.props.user}
                       private_key={this.props.private_key}
                       keys={this.state.keys}
                       ip={this.props.ip}
                       note={this.props.note}
                       changeOption={this.props.changeOption}
                       />
            </Segment>
            <Button basic color="green" fluid icon="save"
                    attached="bottom" content="Save"
                    onClick={this.props.save} />
          </Grid.Column>
          <AskPass
            width={10}
            name="Info"
            user={this.props.user}
            password={this.props.password}
            changeOption={this.props.changeOption}
            sshCopy={this.props.sshCopy}
            content={this.state.host}
            />
          </Grid.Row>
        </Grid>
      </div>

    )
  }
});

module.exports = Host;
