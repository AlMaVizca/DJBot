var React = require("react");
var ReactDom = require("react-dom");

// var Blackboard = require("./blackboard");
// var Result = require("./result");
// var Rooms = require("./rooms");
// var Run = require("./run");
// var Settings = require("./settings");
// var Tasks = require("./tasks");

var Users = require("./users");



var Main = React.createClass({
    getInitialState: function() {
        return {tasks : [{ key: 0, name: 'your connection is not working', modules: [{ key :1, name: 'failed', options: [{ key: 1, name: "let's hand some work", value: 'yeah!', }]}]}], rooms: [{name:'your conecction is not working', machines: 0, network: '127.0.0.1', netmask:'24'}], results: [], user: {}, users:[]}},
    roomsReload: function() {
        $.ajax({
	    url: "/api/room/",
	    dataType: 'json',
	    cache: false,
	    success: function(data) {
	        this.setState({rooms: data["rooms"]});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	    }.bind(this)
	});
    },
    tasksReload: function() {
        $.ajax({
	    url: "/api/task/",
	    dataType: 'json',
	    cache: false,
	    success: function(data) {
	        this.setState({tasks: data["tasks"]});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	    }.bind(this)
	});
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
    usersReload: function(){
	$.ajax({
	    url: "/api/user",
	    dataType: 'json',
	    cache: false,
	    success: function(data) {
		this.setState({users: data["users"]});
		this.setState({user: data["user"]});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error("/api/user", status, err.toString());
	    }.bind(this)
	});
    },
    discover: function(){
        $.ajax({
	    url: "/api/room/discover",
	    dataType: 'json',
	    type: 'get',
	    success: function(data) {
	        this.setState({active: false});
	        this.setState({hosts: data['hosts']});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error("/api/room/discover", status, err.toString());
	    }.bind(this)
	});
    },
    componentDidMount: function() {
	this.roomsReload();
	this.tasksReload();
	this.resultsReload();
	this.usersReload();
    },
    render: function() {
	var Grid = Semantify.Grid;
	return (
		<div className="ui main container">
		<Grid className="right aligned">
		<div className="fluid wide column">
		</div>
		</Grid>
		<Menu />
		<Users user={this.state.user} users={this.state.users} usersReload={this.usersReload}/>
		<Settings roomsReload={this.roomsReload} rooms={this.state.rooms}/>
		<Blackboard rooms={this.state.rooms}/>
		<Tasks tasks={this.state.tasks} tasksReload={this.tasksReload}/>
		<Run rooms={this.state.rooms} tasks={this.state.tasks}/>
		<Results results={this.state.results} resultsReload={this.resultsReload}/>
		</div>
	);
    }
});
var Menu = React.createClass({
    componentDidMount: function() {
	$('.tabular.menu .item').tab();
    },
    componentWillReceiveProps: function(){
	var Icon = Semantify.Icon;
    },
    render: function() {
	var Icon = Semantify.Icon;
        return (
	    	<div className="ui tabular  menu">
	    	<div className="item" data-tab="users">
		<div><Icon className="users"/> Users</div>
	    </div>
		<div className="item" data-tab="settings">
		<Icon className="sitemap" /> Rooms</div>
		<div className="item" data-tab="tasks">
		<Icon className="tasks" /> Tasks
	    </div>
		<div className="item active" data-tab="run">
		<Icon className="terminal" /> Execution
		</div>
		<div className="item" data-tab="results">
		<Icon className="mail outline" /> Results
	    </div>
	    </div>
	)
    }
});





ReactDOM.render(
     <Main />,
     document.getElementById('content')
 );
