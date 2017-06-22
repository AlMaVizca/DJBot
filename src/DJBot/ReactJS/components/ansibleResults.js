var React = require('react')
import {Accordion, Card, Header, Message, Progress, Label, Segment} from 'semantic-ui-react'

var Facts = React.createClass({
  render: function(){
    var memory_avg = this.props.ansible_facts.ansible_memfree_mb * 100;
    memory_avg /= this.props.ansible_facts.ansible_memtotal_mb;
    memory_avg = 100 - memory_avg;
    memory_avg = memory_avg.toFixed(0)
    var color = "green"
    if (memory_avg < 75 & memory_avg > 50 )
      color = "yellow"
    if (memory_avg > 75)
      color = "red"
    return(
      <Segment color="blue">
        <p><label>Hostname:</label>={this.props.ansible_facts.ansible_hostname} </p>
        <p><label>Distribution:</label>={this.props.ansible_facts.ansible_distribution} </p>
        <p><label>Arch:</label>={this.props.ansible_facts.ansible_machine} </p>
        <p><label>Cores:</label>={this.props.ansible_facts.ansible_processor_cores} </p>
        <Progress color={color}
                  percent={memory_avg}
                  size='small' progress>
          Memory:{Math.round(this.props.ansible_facts.ansible_memtotal_mb/1024).toString()} Gb
        </Progress>
      </Segment>
    );
  }
});


var TaskCard = React.createClass({
  componentDidMount: function(){
    var facts = '';
    var stdout = '';
    if (this.props.ansible_facts)
      facts = <Facts ansible_facts={this.props.ansible_facts} />;

    if(this.props.stdout){
      var color = 'green';
      if(this.props.changed)
        color='yellow';
      if(this.props.failed)
        color='grey';
      const keys = Object.keys(this.props.module.action.args)
      var args = keys.map(function(key, i){
        return key + ": " + this.props.module.action.args[key];
      }, this);
      const panel = [{
        key: 'panel-' + this.props.moduleItem,
        title: <Label color={color}> {this.props.module.action.module}</Label>,
        content: (
          <Message
            color={color}
            header='Standard Output'
            list={args}
            content={this.props.stdout}
            />
        ),
      }];

      const stdout_lines = <Accordion panels={panel} />;
      stdout = stdout_lines;
    }
    this.setState({facts: facts,
                   stdout: stdout,
                  });
  },
  getInitialState: function(){
    return({ facts: '',
             stdout: '',
           })
  },
  render: function(){
    return(
      <Card.Content>
        <Card.Header>
          {this.props.module.name}
        </Card.Header>
        <Card.Description>
          {this.state.facts}
          {this.state.stdout}
        </Card.Description>
      </Card.Content>
    );
  }
});


var ComputerCard = React.createClass({
  componentDidMount: function(){
    if (Array.isArray(this.props.computer)){
      const msg = this.props.computer.map(function(task,i){
        return <TaskCard changed={task.changed} ansible_facts={task.ansible_facts}  stdout={task.stdout_lines} key={i} module={this.props.tasks.modules[i]} moduleItem={i} />;
      }, this);
      this.setState({msg: msg});
    }
    if (this.props.computer.failed)
      this.setState({msg: <TaskCard failed={true} stdout={this.props.computer.msg} module={this.props.tasks.modules[0]} />});
    if (this.props.computer.unreachable)
      this.setState({msg: this.props.computer.msg})
  },
  getInitialState: function(){
    return({msg: ''});
  },
  render: function(){
    return(
      <Card fluid>
        <Card.Content>
          <Card.Header>{this.props.ip}</Card.Header>
            {this.props.tasks.name}
        </Card.Content>
        <Card.Content extra>
          {this.state.msg}
        </Card.Content>
      </Card>
    );
  }
});


var ComputerList =  React.createClass({
  componentWillReceiveProps: function(nextProps){
    this.makeList(nextProps.computers);
  },
  componentDidMount: function(){
    this.makeList(this.props.computers);
  },
  makeList: function(computers){
    const keys = Object.keys(computers);
    const computersList = keys.map(function(ip,i){
      const computer = computers[ip];
      return <ComputerCard key={i} computer={computer} ip={ip} tasks={this.props.tasks} />
    }, this);
    this.setState({computers: computersList,
                   number: keys.length});
  },
  getInitialState: function(){
    return({computers: [],
            number: 0})
  },
  render: function(){
    return(
      <Segment color={this.props.color}>
        <Header as="h3">
          {this.state.number} hosts with status {this.props.status}.
        </Header>
        <Card.Group>
          {this.state.computers}
        </Card.Group>
      </Segment>
    );
  }
});


var AnsibleResults = React.createClass({
  componentDidMount: function(){
    this.update(this.props);
  },
  componentWillReceiveProps: function(nextProps){
    this.update(nextProps);
  },
  update: function(nextProps){
    var computers = []
    if (Object.keys(nextProps.failed).length > 0)
      computers.push(<ComputerList key={1} color="red" computers={nextProps.failed} status="failed" tasks={nextProps.tasks} />);

    if(Object.keys(nextProps.unreachable).length > 0)
      computers.push(<ComputerList key={2} color="yellow" computers={nextProps.unreachable} status="unreachable" tasks={nextProps.tasks} />);

    if(Object.keys(nextProps.ok).length > 0)
      computers.push(<ComputerList key={3} color="green" computers={nextProps.ok} status="ok" tasks={nextProps.tasks} />);

    this.setState({computers: computers});
  },
  getInitialState: function(){
    return({
      computers: []
    })
  },
  render: function(){
    return(
      <div>
        {this.state.computers}
      </div>
    );
  }
});

module.exports = AnsibleResults;
