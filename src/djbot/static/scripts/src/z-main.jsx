var Main = React.createClass({
    getInitialState: function() {
        return {tasks : [{ key: 1, name: 'update debian', modules: [{ key :1, name: 'apt', options: [{ key: 1, name: 'update_cache', value: 'yes', },{ key: 2, name: 'upgrade', value: 'yes', }]}]}, { key: 2, name: 'install docker', modules: [{ key :1, name: 'apt', options: [{ key: 1, name: 'image', value: 'krahser/djbot', }]}, { key :2, name: 'command', options: [{ key: 1, name: 'dd', value: 'yes', }]}]}], rooms: [], name: 'name', network: '0.0.0.0', netmask: '0',proxy: '0.0.0.0', machines: '0', roomKey: 999, taskName: 'New task', taskKey: 999 }},
    updateStateRoom: function(room){
	console.log('updateState');
	console.log(room);
	this.setState({roomKey: room.key});
	this.setState({name: room.name});
	this.setState({network: room.network});
	this.setState({netmask: room.netmask});
	this.setState({machines: room.machines});
	this.setState({proxy: room.proxy});
    },
    updateStateRoomKey: function(key){
	this.setState({roomKey: key});
    },
    updateStateTask: function(task){
	this.setState({taskName: task.name});
	this.setState({taskKey: task.key});
    },
    changeName: function(e) {
	this.setState({name: e.target.value});
    },
    changeTaskName: function(e) {
	this.setState({taskName: e.target.value});
    },
    changeNetwork: function(e) {
	this.setState({network: e.target.value});
    },
    changeNetmask: function(e) {
	this.setState({netmask: e.target.value});
    },
    changeProxy: function(e) {
	this.setState({proxy: e.target.value});
    },
    changeMachines: function(e) {
	this.setState({machines: e.target.value});
    },
    loadRooms: function() {
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
    loadTasks: function() {
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
    editRoom: function(action){
	console.log(action);
	switch (action){
	case 'save':
	    this.handleRoomSubmit();
	case 'remove':
	    this.handleRoomDelete();
	}
	this.loadRooms();
    },
    addTask: function(){
	var name = this.state.taskName.trim();
	if (!name){
	    return;
	}
	$.ajax({
	    url: "/api/task/add",
	    dataType: 'json',
	    type: 'POST',
	    data: {taskName: this.state.taskName},
	    success: function(data) {
	        this.setState({message: data["message"]});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	    }.bind(this)
	});
	this.loadTasks();
    },
    deleteTask: function(){
	$.ajax({
	    url: "/api/task/delete",
	    dataType: 'json',
	    type: 'POST',
	    data: {key: this.state.taskKey},
	    success: function(data) {
		this.setState({message: data["message"]});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error("/api/task/delete", status, err.toString());
	    }.bind(this)
	});
	this.loadTasks();	
    },
    handleSettingsSubmit: function(room){
	console.log(room);
	$.ajax({
	    url: "/api/room/add",
	    dataType: 'json',
	    type: 'POST',
	    data: room,
	    success: function(data) {
		this.setState({message: data["message"]});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error("/api/room/add", status, err.toString());
	    }.bind(this)
	});
    },
    handleRoomDelete: function(){
	var key = this.state.roomKey;
	console.log(key);
	$.ajax({
	    url: "/api/room/delete",
	    dataType: 'json',
	    type: 'POST',
	    data: {key: key},
	    success: function(data) {
		this.setState({message: data["message"]});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error("/api/room/add", status, err.toString());
	    }.bind(this)
	});
    },
    handleRoomSubmit: function() {
        var name = this.state.name.trim();
        var machines = this.state.machines;
	var network = this.state.network.trim();
	var netmask = this.state.netmask.trim();
	var proxy = this.state.proxy.trim();
	var key = this.state.roomKey;
	
        if (!name || !machines || !network || !netmask || !proxy || !key){
	    console.log('algo falta');
	    return;
	}
	this.handleSettingsSubmit({name: name, machines: machines, network: network, netmask: netmask, proxy: proxy, key: key});
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
	    this.loadRooms();
	    this.loadTasks();
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
		<Settings {...this.state} updateStateRoom={this.updateStateRoom} rooms={this.state.rooms} editRoom={this.editRoom} changeName={this.changeName} changeNetwork={this.changeNetwork} changeNetmask={this.changeNetmask} changeProxy={this.changeProxy} changeMachines={this.changeMachines} updateStateRoomKey={this.updateStateRoomKey}/>
		<Blackboard rooms={this.state.rooms}/>
		<Tasks tasks={this.state.tasks} taskName={this.state.taskName} changeTaskName={this.changeTaskName} addTask={this.addTask} updateStateTask={this.updateStateTask} deleteTask={this.deleteTask} loadTasks={this.loadTasks}/>
		<Run rooms={this.state.rooms} tasks={this.state.tasks}/>
		<Results rooms={this.state.rooms}/>
		</div>
	);
    }
});
var Menu = React.createClass({
    componentDidMount: function() {
	$('.tabular.menu .item').tab();
    },
    render: function() {
	var Icon = Semantify.Icon;
        return (
		<div className="ui tabular  menu">
		<div className="item" data-tab="settings">
		
		<Icon className="settings" /> Settings
	    </div>
		<div className="item" data-tab="roommap">
		<Icon className="sitemap" /> Room Map
	    </div>
		<div className="item" data-tab="tasks">
		<Icon className="tasks" /> Tasks
		</div>
		<div className="item active" data-tab="run">
		    <Icon className="terminal" /> Run
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
 
