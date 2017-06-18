var React = require('react');
var ShowMessage = require("../message");
var Machine = require("../forms/machine");

import { Button, Form, Grid, Header, Input, Segment} from 'semantic-ui-react';

var Host = React.createClass({
  render: function(){
    return(
      <div>
        <Header icon="user" content="Add new host" />
        <Grid centered>
          <Grid.Column width={5}>
            <Segment textAlign="left" raised attached>
              <ShowMessage mode={this.props.messageMode}
                           text={this.props.messageText}/>
              <Machine name={this.props.name}
                       ip={this.props.ip}
                       note={this.props.note}
                       changeOption={this.props.changeOption}
                       />
            </Segment>
            <Button basic color="green" fluid icon="save"
                    attached="bottom" content="Save"
                    onClick={this.props.save} />
          </Grid.Column>
        </Grid>
      </div>

    )
  }
});

module.exports = Host;
