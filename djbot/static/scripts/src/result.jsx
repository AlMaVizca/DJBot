var ResultItem = React.createClass({
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
	return { data: 'Your connection is not working!'}
    },
    componentDidMount: function(){
	this.getResult();
    },
    componentWillReceiveProps: function(){
	this.getResult();
    },
    getResult: function(){
    	$.ajax({
	    url: "/api/results",
	    dataType: 'json',
	    type: 'POST',
	    dataType: 'json',
	    data: {result: this.props.name},
	    success: function(data) {
	        this.setState({ok: data["result"]["ok"]});
		this.setState({failed: data["result"]["failed"]});
		this.setState({unreachable: data["result"]["unreachable"]});
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
		Results
		</Segment>
		<Segment className="green">
		{JSON.stringify(this.state.ok, null, 2)}
	    </Segment>
		<Segment className="red">
		{JSON.stringify(this.state.failed, null, 2)}
		</Segment>
		<Segment className="yellow">
		{JSON.stringify(this.state.unreachable, null, 2)}
	    </Segment>
		</div>
	);
    }
});


var Results = React.createClass({
    getInitialState: function(){
	return({keys:[]});
    },
    componentDidMount: function() {
	this.props.resultsReload();
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
    componentWillReceiveProps: function(){
	var keys = '';
	if (this.props.results){
	    var executionNames = this.props.results.map(function(result, i){
		keys = this.state.keys[i];
		return <ResultItem key={i} name={result.name} tab={keys}/>;
	    }, this);
	    var executionResults = this.props.results.map(function(result, i){
		keys = this.state.keys[i];
		return <ResultContent key={i} name={result.name} tab={keys}/>;
	    }, this);
	}
	$('.results.tabular .item').tab()
	$('.results.dropdown').dropdown();
	
    },
    render: function(){
	var Dropdown = Semantify.Dropdown;
	var Grid = Semantify.Grid;
	var Menu = Semantify.Menu;
	
	var keys = '';
	if (this.props.results){
	    var executionNames = this.props.results.map(function(result, i){
		keys = this.state.keys[i];
		return <ResultItem key={i} name={result.name} tab={keys}/>;
	    }, this);
	    var executionResults = this.props.results.map(function(result, i){
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
		<span className="text">Select results</span>
		<div className="menu">
		{executionNames}
	    </div>
	    </Dropdown>
		
		</Menu>
		{executionResults}
		</div>
	    </Grid>
		</div>
	);
    }
});

