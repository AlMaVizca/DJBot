var Description = React.createClass({
    render: function(){
	return(
		<p><div className="ui black basic label">{this.props.name}</div>{this.props.value}</p>
	);
    }
});

var Facts = React.createClass({
    render: function(){
	return(
		<div>
		<Description name="Hostname" value={this.props.ansible_facts.ansible_hostname} />
		<Description name="Distribution" value={this.props.ansible_facts.ansible_distribution} />
		<Description name="Arch" value={this.props.ansible_facts.ansible_machine} />
		<Description name="Cores" value={this.props.ansible_facts.ansible_processor_cores} />
		<Description name="Memory" value={this.props.ansible_facts.ansible_memtotal_mb.toString()} />
		<Description name="Memory Free" value={this.props.ansible_facts.ansible_memfree_mb.toString()} />
		</div>
		
	);
    }
});

var ModulePopup = React.createClass({
    componentWillReceiveProps: function(){
	this.keys = Object.keys(this.props.module_args);
	if (this.keys){
	    this.parameters = this.keys.map(function(prop,i){
	    if (this.props.module_args[prop] != null){
		this.value = this.props.module_args[prop].toString();
		return <Description key={i} name={prop} value={this.value} />
	    }
	},this);
	}
    },
    render: function(){
	var keys = Object.keys(this.props.module_args);
	var parameters;
	var value;
	if (this.keys){
	    this.parameters = this.keys.map(function(prop,i){
		if (this.props.module_args[prop] != null ){
		    this.value = this.props.module_args[prop];
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
	    color = classNames('yellow');
	}
	color = classNames(color, 'column');

	if (this.props.ansible_facts){
	    facts = <Facts ansible_facts={this.props.ansible_facts} />;
	}
	if (this.props.module_args){
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

var TaskSegment = React.createClass({
    render: function(){
	return(
		<div className="ui segment">
		{this.props.data}
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


var ResultItem = React.createClass({
    componentWillReceiveProps: function(){
    },
    render: function(){    
	return(
		<div className="item" data-tab={this.props.tab}>
		{this.props.name}
	    </div>
	);
    }
});

var ResultContent = React.createClass({
    getInitialState: function(){
    },
    componentDidMount: function(){
    },
    componentWillReceiveProps: function(){
    },
    render: function(){
	var Card = Semantify.Card;
	var Icon = Semantify.Icon;
	var Segment = Semantify.Segment;
	return(
                <div className="ui tab segments" data-tab={this.props.tab}>
		<Segment>
		Results - Date: {this.props.aResult.datetime}
		</Segment>
		<Segment className="green">
		<ComputerList computers={this.props.aResult.ok} />
	    </Segment>
		<Segment className="red">
		<ComputerList computers={this.props.aResult.failed} />
		</Segment>
		<Segment className="yellow">
		<ComputerList computers={this.props.aResult.unreachable} />
	    </Segment>
		</div>
	);
    }
});


var Results = React.createClass({
    getInitialState: function(){
	return({keys:[], aResult: { ok: '', failed: '', unreachable:'', datetime:''}});
    },
    componentDidMount: function() {
	if (this.props.results){
	    var keys = []
	    for(var i=0;i< this.props.results.length+10;i++){
	    keys.push(Math.random().toString(36).substring(4));
	    }
	    this.setState({keys: keys})
	}
	$('.results.tabular .item').tab()
	$('.results.dropdown').dropdown();
    },
    getResult: function(name){
    	$.ajax({
	    url: "/api/results",
	    dataType: 'json',
	    type: 'POST',
	    dataType: 'json',
	    data: {result: name},
	    success: function(data) {
		this.setState({aResult: data});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	    }.bind(this)
	});
    },
    componentWillReceiveProps: function(){
	var keys = '';
	if (this.props.results.length > 0){
	    this.executionNames = this.props.results.map(function(result, i){
		keys = this.state.keys[i];
		return <ResultItem key={i} name={result.name} tab={keys}/>;
	    }, this);
	    this.executionResults = this.props.results.map(function(result, i){
		keys = this.state.keys[i];
		this.getResult(result.name);
		return <ResultContent key={i} name={result.name} tab={keys} results={this.state.aResult}/>;
	    }, this);
	}
	$('.results.tabular .item').tab()
	$('.results.dropdown').dropdown();
	
    },
    render: function(){
	var Button = Semantify.Button;
	var Dropdown = Semantify.Dropdown;
	var Icon = Semantify.Icon;
	var Grid = Semantify.Grid;
	var Menu = Semantify.Menu;
	var executionResults = '';
	var executionNames = '';
	var keys = '';
	if (this.props.results.length > 0){
	    this.executionNames = this.props.results.map(function(result, i){
		keys = this.state.keys[i];
		return <ResultItem key={i} name={result.name} tab={keys}/>;
	    }, this);
	    this.executionResults = this.props.results.map(function(result, i){
		keys = this.state.keys[i];
		return <ResultContent key={i} name={result.name} tab={keys}/>;
	    }, this);
	}
	return(
	<div className="ui grid bottom attached tab" data-tab="results">
		<Grid>
		<div className="ui sixteen wide column">
		<Menu>
		<Dropdown className="fluid results tabular">
		<input type="hidden" name="result" />
		<i className="dropdown icon"></i>
		<span className="text">Select Results</span>
		<div className="menu">
		{executionNames}
	    </div>
	    </Dropdown>

		<div className="ui animated fade blue button" tabindex="0" onClick={this.props.resultsReload}>
		<div className="hidden content">update</div>
		<div className="visible content">
		<Icon className="history"/>
		</div>
		</div>
	    </Menu>
		{executionResults}
	    </div>
	    </Grid>
		</div>
	);
    }
});

