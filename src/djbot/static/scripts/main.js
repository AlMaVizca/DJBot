var Main = React.createClass({
    render: function() {
	return (
		<div className="ui main container">
		<Menu />
		<Settings />
		<Blackboard />
		<Tasks />
		<Run />
		<Results />				
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
		<div className="item active" data-tab="settings">
		
		<Icon className="settings" /> Settings
	    </div>
		<div className="item" data-tab="roommap">
		<Icon className="sitemap" /> Room Map
	    </div>
		<div className="item" data-tab="tasks">
		<Icon className="tasks" /> Tasks
		</div>
		<div className="item" data-tab="run">
		    <Icon className="terminal" /> Run
		</div>
		<div className="item" data-tab="results">
		    <Icon className="mail outline" /> Results
		</div>

	    </div>
	)
    }
});



var Room = React.createClass({
    render: function(){
	var Button = Semantify.Button;
	var Form = Semantify.Form;
	var Field = Semantify.Field;
	var Fields = Semantify.Fields;
	var Grid = Semantify.Grid;
	var Header = Semantify.Header;
	var Input = Semantify.Input;
	var Label = Semantify.Label;
	var Modal = Semantify.Modal;
	return (
	<Modal className={this.props.classRoom} init={this.props.modal}>
	<Header className="inverted grey">{this.props.name}</Header>
		<Grid className="center aligned">
		<Form>
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Name
		</Label>
		<input placeholder={this.props.room.name} type="text" onChange={this.props.changeName} defaultValue={this.props.room.changeName} />

	    </div>
		</Input>
		</Field>
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Machines
		</Label>
		<input placeholder={this.props.room.machines} type="text" onChange={this.props.changeMachines} defaultValue={this.props.room.machines} />
		</div>
		</Input>
		</Field>
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Network
		</Label>
		<input placeholder={this.props.room.network} type="text" onChange={this.props.changeNetwork} defaultValue={this.props.room.network} />
		</div>
		</Input>
		</Field>
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Netmask
		</Label>
		<input placeholder={this.props.room.netmask} type="text" onChange={this.props.changeNetmask} defaultValue={this.props.room.netmask} />
		</div>
		</Input>
		</Field>
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Proxy
		</Label>
		<input placeholder={this.props.room.proxy} type="text" onChange={this.props.changeProxy} defaultValue={this.props.room.netmask} />
		</div>
		</Input>
		</Field>
		</Form>
		</Grid>		
		<Grid>
		<div className="right aligned column">
		<Button className="inverted red basic cancel">Cancel</Button>
		<Button className="inverted green basic active approve">Save</Button>
		</div>

		</Grid>
		</Modal>
	);
    }
    
});

var RoomItem = React.createClass({
    editRoom: function(){
	$('.basic.room').modal({
	    closable  : false,
	    onDeny    : function(){

	    },
	    onApprove : function() {

	    }
	}).modal('toggle');
    },
    render: function(){
	var Icon = Semantify.Icon;
	var roomName = Math.random().toString(36).substring(7);
    return(
	    <tr>
	    <td><RoomName name={this.props.room.name} /></td>
	    <td><Machines machines={this.props.room.machines}/></td>
	    <td><Network network={this.props.room.network}/></td>
	    <td><Netmask netmask={this.props.room.netmask} /></td>
	    <td><Proxy proxy={this.props.room.proxy} /></td>
	    <td><div className="ui animated fade blue button" tabindex="0" onClick={this.editRoom}>
	      <div className="hidden content">Edit</div>
	       <div className="visible content">
	        <Icon className="edit"/>
	       </div>
	      </div>
	    </td>
	    <Room name={this.props.room.name} classRoom={roomName} room={this.props.room} />
	    </tr>
    );
}});

var Settings = React.createClass({
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
    handleSettingsSubmit: function(settings){
    	$.ajax({
	    url: "/api/room/add",
	    dataType: 'json',
	    type: 'POST',
	    data: settings,
	    success: function(data) {
		this.setState({message: data["message"]});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error("/api/room/add", status, err.toString());
	    }.bind(this)
	});
    },	    
    getInitialState: function() {
	return ({rooms: [{settings: { name: 'loading...',
			  network: '192.168.1.1',
			  netmask: '24',
			  proxy: '0.0.0.0',
			   machines: '0',
			   key: 999,
				    }}], 
		 newRoom: {settings: { name: 'name',
			  network: '0.0.0.0',
			  netmask: '0',
			  proxy: '0.0.0.0',
			   machines: '0',
			   key: 999,
				    }}});
    },
    handleMachinesChange: function(e) {
        this.setState({machines: e.target.value});
    },
    handleNameChpange: function(e) {
        this.setState({name: e.target.value});
    },
    handleNetworkChange: function(e) {
        this.setState({network: e.target.value});
    },
    handleNetmaskChange: function(e) {
        this.setState({netmask: e.target.value});
    },
    handleProxyChange: function(e) {
        this.setState({proxy: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var name = this.state.name.trim();
        var machines = this.state.machines.trim();
	var network = this.state.network.trim();
	var netmask = this.state.netmask.trim();
	var proxy = this.state.proxy.trim();
	var key = this.state.key.trim();
        if (!name || !machines || !network || !netmask || !proxy || !id) {
	    return;
	}
	this.onSettingsSubmit({"name": name, "machines": machines, "network": network, "netmask": netmask, "proxy": proxy, "id": key});
    },
    componentDidMount: function() {
	this.loadRooms();
    },
    addRoom: function(){
	$('.add.basic.modal').modal({
	    closable  : false,
	    onDeny    : function(){

	    },
	    onApprove : function() {

	    }
	}).modal('toggle');
    },
    render: function(){
	var Table = Semantify.Table;
	var Icon = Semantify.Icon;
	var Grid = Semantify.Grid;
	var Button = Semantify.Button;
	var classRoom = classNames('add', 'basic');
	return(
		<div className="ui bottom attached tab active" data-tab="settings">
		<h1>Rooms </h1>
		<Table className="blue">
		<thead>
		<tr>
		<th className="five wide">
		<Icon className="sitemap"/>Name</th>
		<th className="one wide">Machines</th>
		<th className="four wide">
		<Icon className="sitemap"/>Network</th>
		<th className="one wide">Netmask</th>
		<th className="four wide">
		<Icon className="at"/>Proxy</th>
		<th className="one wide"></th>
		</tr>
		</thead>
		<tbody>
		{this.state.rooms.map(function(room){
		    return <RoomItem key={room.key} room={room} />;
		})}
	    </tbody>
		</Table>
		<Grid className="centered">
		<Button className="icon circular green" onClick={this.addRoom}>
		<Icon className="add circle icon" />
		<Room name="Add Room" room={this.state.newRoom} classRoom={classRoom} />
	        </Button>
		</Grid>
		</div>
	);
    }
});


var Blackboard = React.createClass({
    getInitialState: function() {
            return {active: true,
	    hosts: [] }
    },

    componentDidMount: function() {
	this._onClick();
    },
    _onClick: function(){
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
    render: function(){
	var Button = Semantify.Button;
	var roomNodes = this.state.hosts.map(function(host) {
	    return (
		<RoomCard hostname={host.hostname} lsb={host.lsb} key={host.id} />

	    );
	        });
	return(
	    <div className="ui bottom attached tab" data-tab="roommap">
	    <Button className="discover" color="red" onClick={this._onClick} active={this.state.active}>Discover</Button>
	    <div className="ui cards three column inverted grid" id="sortable">
		{roomNodes}
	    </div>
	    </div>
	);
    }
});


var ModuleArgs = React.createClass({
    render: function(){
	var Card = Semantify.Card;
	var Label = Semantify.Label;
	var Input = Semantify.Input;
	return(
	    <Card>
		<Label className="blue" type="div">
		{this.props.option}
		</Label>
		<Input>
		{this.props.value}
	    </Input>
	    </Card>
	);
    }
});


var ModuleItem = React.createClass({
    render: function(){
	return(
		<div className="item" data-tab={this.props.keyname}>
		{this.props.name}
		</div>
	);
    }
});

var ModuleContent = React.createClass({
    render: function(){
	return(
	<div className="ui tab segment" data-tab={this.props.module.keyname}>
	   {this.props.module.options.map(function(option){
	    return <ModuleArgs key={option.key} option={option.name} value={option.value} />;
	   })}
	 </div>
	);
    }
});


var TaskItem = React.createClass({
    render: function(){
	return(
		<div className="item" data-tab={this.props.name}>
		{this.props.name}
		</div>
	);
    }
});
var TaskContent = React.createClass({
    componentDidMount: function() {
	$('.module.ui .item').tab();
    },

    render: function(){
	var Grid = Semantify.Grid;
	var Menu = Semantify.Menu;
	var Icon = Semantify.Icon;	
	return(
	<div className="ui tab segment" data-tab={this.props.task.name}>
	 <Grid>
	  <div className="four wide column">
	   <Menu className="vertical tabular fluid module">
	    {this.props.task.modules.map(function(module){
	     return <ModuleItem key={module.key} name={module.name} keyname={module.keyname}/>;
	     })}
	    <Icon className="add circle" />
           </Menu>
	  </div>
	  <div className="twelve wide stretched column">
	   {this.props.task.modules.map(function(module){
	    return <ModuleContent key={module.key} module={module} />;
	   })}
	  </div>
	 </Grid>
       </div>
	);
    }
});



var Tasks = React.createClass({
    getInitialState: function() {
        return {tasks : [{ key: 1, name: 'update debian', modules: [{ key :1, keyname: 'uno', name: 'apt', options: [{ key: 1, name: 'update_cache', value: 'yes', },{ key: 2, name: 'upgrade', value: 'yes', }]}]},
			 { key: 2, name: 'install docker', modules: [{ key :1, keyname:'dos', name: 'apt', options: [{ key: 1, name: 'image', value: 'krahser/djbot', }]}, { key :2, keyname:'tres', name: 'command', options: [{ key: 1, name: 'dd', value: 'yes', }]}]}]}
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
    componentDidMount: function() {
	$('.vertical.tabular .item').tab();
    },
    render: function(){
	var Grid = Semantify.Grid;
	var Icon = Semantify.Icon;	
	var Menu = Semantify.Menu;
	return(
	<div className="ui bottom attached tab" data-tab="tasks">
	<Grid>
	 <div className="four wide column">
	  <Menu className="vertical tabular fluid">
	   {this.state.tasks.map(function(task){
	       return <TaskItem key={task.key} name={task.name} />;
	   })}
	   <Icon className="add circle" />
          </Menu>
	</div>
	<div className="twelve wide stretched column">
	  {this.state.tasks.map(function(task){
	      return <TaskContent key={task.key} task={task} />;
	  })}
	</div>
	</Grid>
      </div>
	);
    }
});


var Run = React.createClass({
    getInitialState: function() {
        return {data : ""}
    },
    componentDidMount: function() {
    },

    render: function(){
	var Segment = Semantify.Segment;
	var Steps = Semantify.Steps;
        var Step = Semantify.Step;
	return(
	    <div className="ui bottom attached tab" data-tab="run">
		<Steps className="fluid top attached">
		    <Step active={true}>What we are doing?</Step>
		    <Step disabled={true}>Where we are working?</Step>
		    <Step disabled={true}>When we do it?</Step>
		</Steps>
		<Segment>
		</Segment>
	    </div>
	);
    }
});



var ResultItem = React.createClass({
    render: function(){    
	return(
		<div className="item" data-tab={this.props.room.name}>
		{this.props.room.name}
	    </div>
	);
    }
});
var ResultContent = React.createClass({
    render: function(){
	var Icon = Semantify.Icon;
	return(
                <div className="ui tab segment" data-tab={this.props.room.name}>
		{this.props.room.result}
	    <Icon className="Trash"/> Clean Registry
	    </div>
	);
    }
});




var Results = React.createClass({
    getInitialState: function() {
        return {results : [{ name: "biol", result: "ok", key: 1},
			   { name: "otra", result: "fail", key: 2}]}
    },
    componentDidMount: function() {
	$('.results.ui .item').tab();
    },
    render: function(){
	var Grid = Semantify.Grid;
	var Menu = Semantify.Menu;
	return(
	<div className="ui grid bottom attached tab" data-tab="results">
		<Grid>
		<div className="four wide column">
	    	 <Menu className="vertical tabular fluid results">
		{this.state.results.map(function(room){
		    return <ResultItem key={room.key} room={room} />;
		})}
		 </Menu>
		</div>
		<div className="twelve wide stretched column">
		{this.state.results.map(function(room){
		    return <ResultContent key={room.key} room={room} />;
		})}
	    </div>
		</Grid>
        </div>
	);
    }
});

var RoomName = React.createClass({
   render: function(){
       var Field = Semantify.Field;
       var Input = Semantify.Input;
       return(
	    <Field>
	       <Input className="fluid">
	       {this.props.name}
         	</Input>
	    </Field>
	    );
	    }
	    });
	    
var Machines = React.createClass({
    render: function(){
	var Field = Semantify.Field;
       var Input = Semantify.Input;
	return(
	    <Field>
	    <Input className="fluid">
		{this.props.machines}
	    </Input>
		</Field>
	);
    }	    
});


var Network = React.createClass({
    render: function(){
       var Field = Semantify.Field;
       var Input = Semantify.Input;
       return(
	       <Field>
	       <Input className="fluid">
	       {this.props.network}
	       </Input>
	       </Field>
       );
       
   }
});


var Netmask = React.createClass({
    render: function(){
       var Field = Semantify.Field;
       var Input = Semantify.Input;
       return(
	       <Field>
	       <Input className="fluid">
	       {this.props.netmask}
	       </Input>
		</Field>
       );
    }
});

var Proxy = React.createClass({
    render: function(){
	var Field = Semantify.Field;
	var Input = Semantify.Input;
	return(
		<Field>
		<Input className="fluid">
		{this.props.proxy}
		</Input>
		</Field>
	);
    }
});


	    


		
var RoomCard = React.createClass({
    render: function(){
	var Icon = Semantify.Icon;
	return(
	    <div className="ui card ui-state-default">
		<div>
		<Icon className="desktop" />
		{this.props.hostname}
		</div>
		<div>
		{this.props.memory}
		</div>
		<div>
		{this.props.devices}
		</div>
		<div>
		{this.props.lsb}
		</div>
	    </div>
	)
    }
});

ReactDOM.render(
     <Main />,
     document.getElementById('content')
 );
 
