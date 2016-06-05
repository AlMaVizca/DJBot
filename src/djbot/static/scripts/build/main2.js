var RoomChoice = React.createClass({
    render: function(){
	var Icon = Semantify.Icon;
	return(
		<div className="item" data-value={this.props.keyname}>
		<Icon className="sitemap"/>{this.props.name}
		</div>
	)
}
});

var Blackboard = React.createClass({
    componentDidMount: function() {
	$('.ui.dropdown')
	    .dropdown();
    },
    getInitialState: function() {
	return {hosts: [ {hostname: 'localhost', lsb: 'lsb', id: 2}]};
    },	
    render: function(){
	var Button = Semantify.Button;
	var Grid = Semantify.Grid;
	var Label = Semantify.Label;
	var roomNodes = this.state.hosts.map(function(host) {
	    return (
		<RoomCard hostname={host.hostname} lsb={host.lsb} key={host.id} />

	    );
	});
	var keys = [];
	for(var i=0;i< this.props.rooms.length;i++){
	    keys += Math.random().toString(36).substring(7);
	}

	return(
		<div className="ui bottom attached tab" data-tab="roommap">
		<Grid>
		<div className="ui sixteen wide column">
		 <div className="ui fluid selection dropdown">
		  <input type="hidden" name="user" />
		  <i className="dropdown icon"></i>
		  <div className="default text">Select a Room</div>
		  <div className="menu">
		   {this.props.rooms.map(function(room, i){
		    return <RoomChoice key={room.key} name={room.name} keuname={keys[i]}/>;
		    })}
		</div>
		</div>
		</div>
		<div className="ui fifteen wide center aligned column">
		<Label>Blackboard</Label>
		</div>
		<div className="one wide column">
		<Button className="discover" color="red" onClick={this._onClick} active={this.state.active}>Discover</Button>
		</div>
	    <div className="ui cards three column inverted grid" id="sortable">
		


	    </div>
		</Grid>
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
		{this.props.room.data}
	    <Icon className="Trash"/> Clean Registry
	    </div>
	);
    }
});




var Results = React.createClass({
    componentDidMount: function() {
	$('.results.ui .item').tab();
    },
    getInitialState: function(){
	return({results : [{ name: "biol", data: "ok", key: 1}, { name: "otra", data: "fail", key: 2}]});
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
var Run = React.createClass({
    getInitialState: function(){
	return {active: [true, false,false], listRooms:[], listTasks:[]}
    },
    componentDidMount: function() {
    },
    nextStep: function(){
	if (this.state.active[0]){
	    this.setState({active: [false, true, false]});
	}else if (this.state.active[1]){
	    this.setState({active: [false, false, true]});
	} else {
	    this.setState({active: [true, false, false]});
	}
    },
    reset: function(){
	this.setState({active: [true, false,false]});
    },
    roomList: function(key){
	var rooms = this.state.listRooms;
	var index = rooms.indexOf(key);
	if ( index != -1){
	    rooms.splice(index,1);
	}else{
	    rooms.splice(index,0,key);
	}
	this.setState({listRooms: rooms});
    },
    taskList: function(key){
	var tasks = this.state.listTasks;
	var index = tasks.indexOf(key);
	if ( index != -1){
	    tasks.splice(index,1);
	}else{
	    tasks.splice(index,0,key);
	}
	this.setState({listTasks: tasks});
    },
    render: function(){
	var Segment = Semantify.Segment;
	var Steps = Semantify.Steps;
        var Step = Semantify.Step;
	return(
	    <div className="ui bottom attached tab active" data-tab="run">
		<Steps className="fluid top attached">
		    <Step active={this.state.active[0]} data-tab='where'>Where are we working?</Step>
		    <Step active={this.state.active[1]} data-tab='what'>What are we doing?</Step>
		    <Step active={this.state.active[2]} data-tab='when'>When do it?</Step>
		</Steps>
		<Segment className='action'>
		<SelectTask active={this.state.active[0]} next={this.nextStep} tasks={this.props.tasks} edit={this.taskList}/>
		<SelectRooms active={this.state.active[1]} next={this.nextStep} rooms={this.props.rooms} reset={this.reset} edit={this.roomList}/>
		<Schedule active={this.state.active[2]} next={this.nextStep} reset={this.reset} listRooms={this.state.listRooms} listTasks={this.state.listTasks} rooms={this.props.rooms} tasks={this.props.tasks}/>
		</Segment>
	    </div>
	);
    }
});

var ItemList = React.createClass({
    componentDidMount: function() {
	$('.ui.checkbox').checkbox();
    },
    updateList: function(e){
	this.props.edit(this.props.element.key);
    },
    render: function(){
	var Checkbox = Semantify.Checkbox;
	var Icon = Semantify.Icon;
	var Label = Semantify.Label;
	return(
	    <tr>
		<td>
		<div className="ui checkbox toggle" onClick={this.updateList}>
		<input name="select" type="checkbox"/>
		</div>
	        </td>
		<td>{this.props.element.name}
	        </td>
		</tr>
	);
    }});


var CheckList = React.createClass({
    render: function(){
	var Icon = Semantify.Icon;
	var Table = Semantify.Table;
	var callback = this.props.edit;
	return(<div>
		<Table className="blue">
		<thead>
		<tr>
		<th className="two wide">Add to work</th>
		<th className="Ten wide">
		<Icon className="sitemap"/>Name</th>
		</tr>
		</thead>
	        <tbody>
	       {this.props.elements.map(function(element){
		       return <ItemList key={element.key} element={element} edit={callback} />;
	       })}
	       </tbody>
	       </Table>
	       </div> 
);
}});

var SelectTask  = React.createClass({
	render: function(){
	    var Button = Semantify.Button;
	    var Grid = Semantify.Grid;
	    var Icon = Semantify.Icon;
	    var Segment = Semantify.Segment;
	    var classTask = classNames('ui', 'attached', 'tab');
	    if (this.props.active) classTask = classNames(classTask, 'active');
	    return(<div className={classTask} data-tab='what'>
		   <Segment>
		   <CheckList elements={this.props.tasks} edit={this.props.edit} />
		   <Grid className="right aligned">
		   <div className="sixteen wide column">
		   <div className="ui animated fade green button" tabindex="0" onClick={this.props.next}>
		   <div className="hidden content">next</div>
		   <div className="visible content">
	           <Icon className="angle right"/>
		   </div>
		   </div>
		   </div>
		   </Grid>
		   </Segment>
		   </div>
		  );
}});
var SelectRooms  = React.createClass({
	render: function(){
	    var Button = Semantify.Button;
	    var Grid = Semantify.Grid;
	    var Icon = Semantify.Icon;
	    var Segment = Semantify.Segment;
	    var classTask = classNames('ui', 'attached', 'tab');
	    if (this.props.active) classTask = classNames(classTask, 'active');
	    return(<div className={classTask} data-tab='where'>
		   <Segment>
		   <CheckList elements={this.props.rooms} edit={this.props.edit}/>
		   <Grid className="right aligned">
		   <div className="sixteen wide column">
		   <div className="ui animated fade red button" tabindex="0" onClick={this.props.reset}>
		   <div className="hidden content">reset</div>
		   <div className="visible content">
	           <Icon className="angle double left"/>
		   </div>
		   </div>
		   <div className="ui animated fade green button" tabindex="0" onClick={this.props.next}>
		   <div className="hidden content">next</div>
		   <div className="visible content">
	           <Icon className="angle right"/>
		   </div>
		   </div>
		   </div>
		   </Grid>
		   </Segment>
		   </div>
		  );
}});

var Schedule  = React.createClass({
    getInitialState: function(){
	return {datetime: "22:48 2016/6/2" }
    },
    componentDidMount: function(){
	$('#datetimepicker').datetimepicker();
    },
    render: function(){
	var Card = Semantify.Card;
	var Button = Semantify.Button;
	var Grid = Semantify.Grid;
	var Header = Semantify.Header;
	var Icon = Semantify.Icon;
	var Segment = Semantify.Segment;
	var classTask = classNames('ui', 'attached', 'tab');
	var listRooms = this.props.listRooms;
	var listTasks = this.props.listTasks;
	if (this.props.active) classTask = classNames(classTask, 'active');
	return(<div className={classTask} data-tab='when'>
	       <Segment>
	       <Grid>
	       <div className="five wide column">
	       <Header className="second">Rooms</Header>
	       {this.props.rooms.map(function(room){
		   if (listRooms.indexOf(room.key) != -1 ){
		       return <RoomName key={room.key} name={room.name}/>;
		   }
	       })}
	       </div>
	       <div className="five wide column ">
	       <Header className="second"> Tasks </Header>
	       {this.props.tasks.map(function(room){
		       if (listTasks.indexOf(room.key) != -1 ){
			   return <RoomName key={room.key} name={room.name}/>;		       }
	       })}
	       </div>
	       <div className="five wide column ">
	       <Header className="second">Schedule</Header>
	       <input type="text" name="datetimepicker" id="datetimepicker"/>
	       </div>
	       </Grid>
		   <Grid className="right aligned">
	       <div className="sixteen wide column">
	       <div className="ui animated fade red button" tabindex="0" onClick={this.props.reset}>
		   <div className="hidden content">reset</div>
	       <div className="visible content">
	       <Icon className="angle double left"/>
	       </div>
		   </div>
	       <div className="ui animated fade blue button" tabindex="0" onClick={this.props.next}>
		   <div className="hidden content">Run</div>
	       <div className="visible content">
	       <Icon className="terminal"/>
	       </div>
	       </div>
		   </div>
	       </Grid>
	       </Segment>
	       </div>
	      );
    }});
var Room = React.createClass({
    deleteRoom: function(){
	console.log('delete Room');
	console.log(this.props);
	this.props.editRoom('remove' ,this.props.room)
	var classRoom = '.' + this.props.classRoom;
	$(classRoom).modal('toggle');
    },
    saveRoom: function(){
	console.log('save Room');
	this.props.editRoom('save' ,this.props.room)
	var classRoom = '.' + this.props.classRoom;
	$(classRoom).modal('toggle');
    },
    cancelRoom: function(){
	console.log('cancel Room');
	var classRoom = '.' + this.props.classRoom;
	$(classRoom).modal('toggle');
    },
    render: function(){
	var Button = Semantify.Button;
	var Form = Semantify.Form;
	var Field = Semantify.Field;
	var Fields = Semantify.Fields;
	var Grid = Semantify.Grid;
	var Header = Semantify.Header;
	var Icon = Semantify.Icon;
	var Input = Semantify.Input;
	var Label = Semantify.Label;
	var Modal = Semantify.Modal;
	var classRoom = classNames(this.props.classRoom, 'basic')
	var deleteButton = (this.props.name != 'name');
	return (
	<Modal className={classRoom} init={this.props.modal}>
	<Header className="inverted grey">{this.props.name}</Header>
	{ if (deleteButton){
	    return <RemoveButton deleteRoom={this.deleteRoom} />

	}}
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
		<Button className="inverted red basic cancel" onClick={this.cancelRoom}>Cancel</Button>
		<Button className="inverted green basic active approve" onClick={this.saveRoom}>Save</Button>
		</div>

		</Grid>
		</Modal>
	);
    }
    
});

var RoomItem = React.createClass({
    editRoom: function(){
	console.log('RoomItem');
	console.log(this.props);
	var classRoom = '.' + this.props.classRoom;
	$(classRoom).modal({
	    closable: false,
	    onDeny    : function(){
            console.log('deny');
	    console.log(this.props);    
	    },
	    onApprove : function() {
	    console.log('aprove');
	    console.log(this.props);
	    }
	}).modal('toggle');
    },
    render: function(){
	var Icon = Semantify.Icon;
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
	    <Room name={this.props.room.name} classRoom={this.props.classRoom} room={this.props.room} editRoom={this.editRoom}/>
	    </td>
	    </tr>
    );
}});

var Settings = React.createClass({
    addRoom: function(action, room){
	console.log('settings');
	console.log(action);
	console.log(room);
	$('.add.basic').modal({
	    closable  : false
	}).modal('toggle');
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var name = this.props.name.trim();
        var machines = this.props.machines.trim();
	var network = this.props.network.trim();
	var netmask = this.props.netmask.trim();
	var proxy = this.props.proxy.trim();
	var key = this.props.key.trim();
        if (!name || !machines || !network || !netmask || !proxy || !id) {
	    return;
	}
	this.handleSettingsSubmit({"name": name, "machines": machines, "network": network, "netmask": netmask, "proxy": proxy, "id": key});
    },
    render: function(){
	var Table = Semantify.Table;
	var Icon = Semantify.Icon;
	var Grid = Semantify.Grid;
	var Button = Semantify.Button;
	return(
		<div className="ui bottom attached tab" data-tab="settings">
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
		 {this.props.rooms.map(function(room){
		 var syncTab = Math.random().toString(36).substring(7);
		 return <RoomItem key={room.key} room={room} classRoom={syncTab}/>;
		})}
	    </tbody>
		</Table>
		<Grid className="centered">
		<Button className="icon circular green" onClick={this.addRoom}>
		<Icon className="add circle icon" />
		<Room name="Add Room" room={this.props.newRoom} classRoom="add basic" editRoom={this.addRoom} />
	        </Button>
		</Grid>
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


var Module = React.createClass({
    render: function(){
	return(
		<div className="item">
		{this.props.name}
		</div>
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
	<div className="ui tab segment" data-tab={this.props.keyname}>
	   {this.props.module.options.map(function(option){
	    return <ModuleArgs key={option.key} option={option.name} value={option.value} />;
	   })}
	 </div>
	);
    }
});

var Task = React.createClass({
    render: function(){
	return(
		<div className="item">
		{this.props.name}
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
	var Button = Semantify.Button;
	var Grid = Semantify.Grid;
	var Icon = Semantify.Icon;
	var Menu = Semantify.Menu;
	var keys = [];
	for(var i=0;i< this.props.task.modules.length;i++){
	    keys += Math.random().toString(36).substring(7);
	}
	return(
	<div className="ui tab segment" data-tab={this.props.task.name}>
	 <Grid>
	  <div className="four wide column">
	   <Menu className="vertical tabular fluid module">
	    {this.props.task.modules.map(function(module, i){
	      var keyname = keys[i];
	     return <ModuleItem key={module.key} name={module.name} keyname={keyname}/>;
	     })}
	     <div className="item">
	     <Button className="fuild icon green" onClick={this.addTask}>
	      <Icon className="add" />
	      <Task name="Add Task" task=''/>
	     </Button>
	    </div>
           </Menu>
	  </div>
	  <div className="twelve wide stretched column">
	   {this.props.task.modules.map(function(module, i){
	      var keyname = keys[i];
	    return <ModuleContent key={module.key} module={module} keyname={keyname} />;
	   })}
	  </div>
	 </Grid>
       </div>
	);
    }
});



var Tasks = React.createClass({
    componentDidMount: function() {
	$('.vertical.tabular .item').tab();
    },
    render: function(){
	var Button = Semantify.Button;
	var Grid = Semantify.Grid;
	var Icon = Semantify.Icon;	
	var Menu = Semantify.Menu;
	var Row = Semantify.Row;
	return(
	<div className="ui bottom attached tab" data-tab="tasks">
	<Grid>
	 <div className="four wide column">
	  <Menu className="vertical tabular fluid">
	   {this.props.tasks.map(function(task){
	       return <TaskItem key={task.key} name={task.name} />;
	   })}
	   <div className="item">
	    <Row>
	    <Button className="fluid icon green" onClick={this.addModule}>
	     <Icon className="add" />
	     <Module name="Add module" module=''/>
	    </Button>
	    </Row>
	   </div>
          </Menu>
	</div>
	<div className="twelve wide stretched column">
	  {this.props.tasks.map(function(task){
	      return <TaskContent key={task.key} task={task} />;
	  })}
	</div>
	</Grid>
      </div>
	);
    }
});
var Main = React.createClass({
    getInitialState: function() {
        return {tasks : [{ key: 1, name: 'update debian', modules: [{ key :1, name: 'apt', options: [{ key: 1, name: 'update_cache', value: 'yes', },{ key: 2, name: 'upgrade', value: 'yes', }]}]}, { key: 2, name: 'install docker', modules: [{ key :1, name: 'apt', options: [{ key: 1, name: 'image', value: 'krahser/djbot', }]}, { key :2, name: 'command', options: [{ key: 1, name: 'dd', value: 'yes', }]}]}], rooms: [{ name: 'local', network: '127.0.0.1', netmask: '8', proxy: '0.0.0.0', machines: '0', key: 999,}], newRoom: {name: 'name', network: '0.0.0.0', netmask: '0',proxy: '0.0.0.0', machines: '0', key: 999 }}},
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
    handleMachinesChange: function(e) {
        this.setState({machines: e.target.value});
    },
    handleNameChange: function(e) {
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
		<Settings rooms={this.state.rooms} newRoom={this.state.newRoom}/>
		<Blackboard rooms={this.state.rooms}/>
		<Tasks tasks={this.state.tasks}/>
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
 
