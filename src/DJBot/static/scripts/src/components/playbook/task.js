var React = require("react");
var ShowMessage = require("../message");

import { Button, Divider, Form, Grid, Header, Input, Segment, Select} from 'semantic-ui-react';

var Task = React.createClass({
  getDefaultProps: function(){
    return ({
      transparent: true,
    });
  },
  getInitialState: function(){
    return ({
      messageMode: 10,
      messageText: "",
      moduleOptions: [
        {key:"apt", value:"apt", text:"apt"},
        {key:"docker", value:"docker", text:"docker"}
      ]
    });
  },
  render: function(){
    return(
      <div>
        <ShowMessage mode={this.state.messageMode}
                     text={this.state.messageText}/>
        <Grid centered>
          <Grid.Column width={7}>
            <Header content="Task Definition" />
            A task is a special configuration of a module
            <Segment.Group>
              <Segment textAlign="left" raised attached>
                <Input fluid transparent={this.props.transparent}
                       type="text" name="name" value={this.props.taskName}
                       label={{ribbon: true, color: "blue",
                       content: "Task Name"}}
                       placeholder="Write the name of the task"
                       onChange={this.props.changeName} />
              </Segment>
              <Segment>
                <Select search fluid placeholder="Select the module..."
                        options={this.state.moduleOptions} />
              </Segment>
              <Segment padded="very">
                Please select a module, and you will see the parameters
              </Segment>
              <Segment>
                Parameter to the task
              </Segment>
            </Segment.Group>
            <Button basic color="green" fluid icon="save"
                    attached="bottom" content="Save" />

          </Grid.Column>
          <Grid.Column width={9}>
            <Header content="Module Docs" />
            Please select a module to see the documentation
            <Segment basic>

            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
});

module.exports = Task;
