var React = require("react");
var Results = require("../components/results");

var ModulePopup = React.createClass({
  componentWillReceiveProps: function(){
    this.keys = Object.keys(this.props.args);
    if (this.keys){
      this.parameters = this.keys.map(function(prop,i){
	if (this.props.args[prop] != null){
	  this.value = this.props.args[prop].toString();
	  return <Description key={i} name={prop} value={this.value} />
	}
      },this);
    }
  },
  render: function(){
    var keys = Object.keys(this.props.args);
    var parameters = '';
    var value;
    if (keys){
      this.parameters = keys.map(function(prop,i){
	if (this.props.args[prop] != null ){
	  this.value = this.props.args[prop];
	  return <Description key={i} name={prop} value={this.value} />
	}
      },this);
    }
    return(
      <div>
	{this.parameters}
      </div>
    );
  }
});


var TaskCard = React.createClass({
  componentDidMount: function(){
    $('.results.item').popup({
      inline   : true,
      hoverable: true,
      delay: {
	hide: 200
      }
    });
  },
  componentWillReceiveProps: function(){
    if (this.props.changed){
      this.color = classNames('yellow');
    }
    this.color = classNames(this.color, 'column');
    if (this.props.ansible_facts){
      this.facts = <Facts ansible_facts={this.props.ansible_facts} />;
    }
    if (this.props.invocation.module_args){
      this.module_args = <ModulePopup module_args={this.props.invocation.module_args} />;
    }
  },
  render: function(){
    var module_args = '';
    var facts;
    var color = classNames('green');
    if (this.props.changed){
      this.color = classNames('yellow');
    }
    this.color = classNames(color, 'column');

    if (this.props.ansible_facts){
      this.facts = <Facts ansible_facts={this.props.ansible_facts} />;
    }

    if (this.props.invocation.module_args){
      this.module_args = <ModulePopup args={this.props.invocation.module_args} />;
    }

    return(
      <div className="ui segment grid">
	<div className="column">
	  <div className="results item">
	    {this.props.invocation.module_name}
	  </div>
	  <div className="ui flowing popup top left transition hidden">
	    <div className="ui five wide column divided left aligned grid">
	      {this.module_args}
	      {this.facts}

	    </div>
	  </div>
	</div>
      </div>
    );
  }
});


var ComputerCard = React.createClass({
  componentWillReceiveProps: function(){
    if (Array.isArray(this.props.computer)){
      this.msg = this.props.computer.map(function(task,i){
	this.inv = task.invocation;
	this.index=i;
	if (this.inv.module_name == 'setup'){this.index=100}
	return <TaskCard invocation={task.invocation} changed={task.changed} ansible_facts={task.ansible_facts} key={this.index}/>;
      }, this);
    }
  },
  render: function(){
    var Card = Semantify.Card;
    var Header = Semantify.Header;
    var index;
    var inv;
    var msg;
    if (this.props.computer.msg){msg = <TaskSegment data={this.props.computer.msg} />;}
    if (this.props.computer.module_stdout){msg = <TaskSegment data={this.props.computer.module_stdout} />;}
    if (Array.isArray(this.props.computer)){
      msg = this.props.computer.map(function(task,i){
	this.inv = task.invocation;
	this.index=i;
	if (this.inv.module_name == 'setup'){this.index=100}
	return <TaskCard key={i} invocation={task.invocation} changed={task.changed} ansible_facts={task.ansible_facts} key={this.index}/>;
      },this);
    }
    return(
      <div className="column">
	<Card>
	  <Header>{this.props.keyName}</Header>
	  <div className="ui segments">
	    {msg}
	  </div>
	</Card>
      </div>
    );
  }
});


var ComputerList =  React.createClass({
  componentWillReceiveProps: function(){
    this.computers = Object.keys(this.props.computers);
    this.keys = Object.keys(this.props.computers)
    this.computers = this.keys.map(function(key,i){
      this.computer = this.props.computers[key];
      return <ComputerCard key={i} computer={this.computer} keyName={key} />
    }, this);

  },
  render: function(){
    var Grid = Semantify.Grid;
    var keys = Object.keys(this.props.computers)
    var computer;
    var computers = keys.map(function(key,i){
      computer = this.props.computers[key];
      return <ComputerCard key={i} computer={computer} keyName={key} />
    }, this);
    return(
      <Grid className="centered equal width">
	{computers}
      </Grid>
    );
  }
});




var ResultContent = React.createClass({
  getInitialState: function(){
    return({aResult: { ok: '', failed: '', unreachable:'', datetime:''}});
  },
  componentDidMount: function(){
    this.getResult();
  },
  getResult: function(){
    $.ajax({
      url: "/api/results",
      dataType: 'json',
      type: 'POST',
      data: {result: this.props.name},
      success: function(data) {
	this.setState({aResult: data});
      }.bind(this),
      error: function(xhr, status, err) {
	console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function(){
    var Card = Semantify.Card;
    var Icon = Semantify.Icon;
    var Segment = Semantify.Segment;
    return(
      <div className="ui tab segments" data-tab={this.props.tab}>
	<Segment>
	  Results - Date: {this.state.aResult.datetime}
	</Segment>
	<Segment className="green">
	  <ComputerList computers={this.state.aResult.ok} />
	</Segment>
	<Segment className="red">
	  <ComputerList computers={this.state.aResult.failed} />
	</Segment>
	<Segment className="yellow">
	  <ComputerList computers={this.state.aResult.unreachable} />
	</Segment>
      </div>
    );
  }
});


var ResultsContainer = React.createClass({
  getInitialState: function(){
    return({keys:[], results: []});
  },
  componentDidMount: function() {
    this.resultsReload();
    if (this.state.results){
      var keys = []
      for(var i=0;i< this.state.results.length+10;i++){
	keys.push(Math.random().toString(36).substring(4));
      }
      this.setState({keys: keys})
    }
    $('.results.tabular .item').tab()
    $('.results.dropdown').dropdown();
  },
  resultsReload: function(){
    $.ajax({
      url: "/api/results",
      dataType: 'json',
      cache: false,
      success: function(data) {
	this.setState({results: data["results"]});
      }.bind(this),
      error: function(xhr, status, err) {
	console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function(){
    return(
      <Results
        results={this.state.results}
        keys={this.state.keys}
        resultsReload={this.resultsReload}
        />
    );
  }
});

module.exports = ResultsContainer;
