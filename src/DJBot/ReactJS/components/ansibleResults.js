var React = require('react')
import {Card, Header, Segment} from 'semantic-ui-react'


var Facts = React.createClass({
  render: function(){
    return(
      <div>
        <p><label>Hostname:</label>={this.props.ansible_facts.ansible_hostname} </p>
        <p><label>Distribution:</label>={this.props.ansible_facts.ansible_distribution} </p>
        <p><label>Arch:</label>={this.props.ansible_facts.ansible_machine} </p>
        <p><label>Cores:</label>={this.props.ansible_facts.ansible_processor_cores} </p>
        <p><label>Memory:</label>={this.props.ansible_facts.ansible_memtotal_mb.toString()} </p>
        <p><label>Memory Free:</label>={this.props.ansible_facts.ansible_memfree_mb.toString()} </p>
      </div>
    );
  }
});


var TaskCard = React.createClass({
  componentDidMount: function(){
    this.update(this.props);
  },
  update: function(props){
    if (props.ansible_facts)
      this.setState({facts: <Facts ansible_facts={props.ansible_facts} /> });
  },
  getInitialState: function(){
    return({ facts: ''})
  },
  render: function(){
    return(
      <Card.Content>
        <Card.Header>
            {this.props.invocation.module_name}
        </Card.Header>
        <Card.Description>
              {this.state.facts}
        </Card.Description>
      </Card.Content>
    );
  }
});

var Task = React.createClass({
  render: function(){
    return(
      <Card.Content extra>
        {this.props.data}
      </Card.Content>
    );
  }
});


var ComputerCard = React.createClass({
  componentWillReceiveProps: function(nextProps){
    this.update(nextProps.computer);
  },
  componentDidMount: function(){
    this.update(this.props.computer);
  },
  update: function(computer){
    if (Array.isArray(computer)){
      const msg = computer.map(function(task,i){
        if (task.invocation.fact_path){console.log('here is the setup')}
        return <TaskCard invocation={task.invocation} changed={task.changed} ansible_facts={task.ansible_facts} key={i}/>;
      });
      this.setState({msg: msg});
    }
    if (computer.msg)
      this.setState({msg: <Task data={computer.msg} />});
    if (computer.module_stdout)
      this.setState({msg: <Task data={computer.module_stdout} />});
  },
  getInitialState: function(){
    return({msg: ''});
  },
  render: function(){
    return(
      <Card>
        <Card.Content>
          <Card.Header>{this.props.ip}</Card.Header>
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
      return <ComputerCard key={i} computer={computer} ip={ip} />
    });
    this.setState({computers: computersList});
  },
  getInitialState: function(){
    return({computers: []})
  },
  render: function(){
    return(
      <Segment color={this.props.color}>
        <Card.Group>
          {this.state.computers}
          </Card.Group>
      </Segment>
    );
  }
});


var AnsibleResults = React.createClass({
  componentWillReceiveProps: function(nextProps){
    var computers = []
    if (Object.keys(nextProps.failed).length > 0)
      computers = [<ComputerList key={1} color="red" computers={nextProps.failed} />]

    if(Object.keys(nextProps.unreachable).length > 0)
      computers = computers.concat([<ComputerList key={2} color="yellow" computers={nextProps.unreachable} />]);

    if(Object.keys(nextProps.ok).length > 0)
      computers = computers.concat([<ComputerList key={3} color="green" computers={nextProps.ok} />]);

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
