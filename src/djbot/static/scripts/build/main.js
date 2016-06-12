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
	console.log(this.state.listRooms);
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
		    <Step active={this.state.active[2]} data-tab='when'>Confirm</Step>
		</Steps>
		<Segment className='action'>
		<SelectRooms active={this.state.active[0]} next={this.nextStep} rooms={this.props.rooms} reset={this.reset} edit={this.roomList}/>
		<SelectTask active={this.state.active[1]} next={this.nextStep} tasks={this.props.tasks} edit={this.taskList}/>
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
	this.props.edit(this.props.elementKey);
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
    componentWillReceiveProps: function(){
	var elements = '';
	if (this.props.elements){
	    var elements = this.props.elements.map(function(element, i){
		return <ItemList key={i} element={element} edit={this.props.edit} elementKey={element.key}/>;
	    },this);
	}
    },
    render: function(){
	var Icon = Semantify.Icon;
	var Table = Semantify.Table;
	var elements = this.props.elements.map(function(element, i){
			   return <ItemList key={i} element={element} elementKey={element.key} edit={this.props.edit}/>;
	}, this);
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
	       {elements}
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
	var classRoom = '.' + this.props.classRoom;
	this.props.editRoom('remove');
	$(classRoom).modal('hide');
	console.log(classRoom);
    },
    saveRoom: function(){
	var classRoom = '.' + this.props.classRoom;
	console.log(classRoom);
	$(classRoom).modal('hide');
	$('.add.basic').modal({closable: true}).modal('hide');
	this.props.editRoom('save');
	return true
    },
    cancelRoom: function(){
	var classRoom = '.' + this.props.classRoom;
	console.log(classRoom);
	$(classRoom).modal('hide');
	$('.add.basic').modal({closable: true}).modal('hide');
	console.log('cancel');
	return true
    },
    render: function(){
	var Button = Semantify.Button;
	var Form = Semantify.Form;
	var Field = Semantify.Field;
	var Grid = Semantify.Grid;
	var Header = Semantify.Header;
	var Icon = Semantify.Icon;
	var Input = Semantify.Input;
	var Label = Semantify.Label;
	var Modal = Semantify.Modal;
	var classRoom = classNames(this.props.classRoom, 'basic');
	var deleteButton = (this.props.roomKey != 999);
	return (
		<Modal className={classRoom} init={this.props.modal}>
		<Header className="inverted grey">{this.props.name}</Header>
		<RemoveButton deleteRoom={this.deleteRoom} deleteButton={deleteButton}/>
		<Grid className="center aligned">
		<Form>
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Name
	    </Label>
		<input placeholder={this.props.room.name} type="text" onChange={this.props.changeName} defaultValue={this.props.room.name} />
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
		<input placeholder={this.props.room.proxy} type="text" onChange={this.props.changeProxy} defaultValue={this.props.room.proxy} />
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
    showEditRoom: function(){
	this.props.updateStateRoom(this.props.room);
	var classRoom = classNames('.', this.props.classRoom);
	classRoom = classRoom.replace(/ /g,'');
	$(classRoom).modal('toggle');
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
	    <td><div className="ui animated fade blue button" tabindex="0" onClick={this.showEditRoom}>
	      <div className="hidden content">Edit</div>
	       <div className="visible content">
	        <Icon className="edit"/>
	       </div>
	      </div>
	    <Room {...this.props} roomKey={this.props.room.key}/>
	    </td>
	    </tr>
    );
}});


var RemoveButton = React.createClass({
    render: function(){
	var Button = Semantify.Button;
	var Grid = Semantify.Grid;
	var Icon = Semantify.Icon;
    	return(
		<Grid className="right aligned">
		<div className="right aligned column">
		{this.props.deleteButton && <Button className="inverted red basic circular" onClick={this.props.deleteRoom}><Icon className="inverted red circle trash"/></Button>}
		</div>
		</Grid>
	);
    }});	


var Settings = React.createClass({
    getInitialState: function(){
	return {newRoom: { name: "Add Room", network: '0.0.0.0', netmask: '0',proxy: '0.0.0.0', machines: '0', key: 999, keys:[]}}
    },
    componentDidMount: function(){
	var keys = []
	for(var i=0;i< this.props.rooms.length+10;i++){
	    keys.push(Math.random().toString(36).substring(4));
	}
	this.setState({keys: keys})
    },
    addRoom: function(){
	this.props.updateStateRoomKey(999)
	$('.add.basic').modal({closable: false,
			 onApprove: function () {
			     console.log('Approve');
			 },
			 onHide: function(){
			     console.log('hidden');
			     return false
			 },
			 onShow: function(){
			     console.log('shown');
			 },
			}).modal('toggle');
    },
    componentWillReceiveProps: function(){
	var syncTab ='';
	this.rooms = this.props.rooms.map(function(room,i){
	    syncTab = this.state.keys[i];
		 return <RoomItem {...this.props} key={i} keyRoom={room.key} room={room} classRoom={syncTab}/>;
		},this);
    },
    render: function(){
	var Table = Semantify.Table;
	var Icon = Semantify.Icon;
	var Grid = Semantify.Grid;
	var Button = Semantify.Button;
	var syncTab = '';
	var rooms = this.props.rooms.map(function(room,i){
	    syncTab = this.state.keys[i];
		 return <RoomItem {...this.props} key={i} keyRoom={room.key} room={room} classRoom={syncTab}/>;
		},this);
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
		{rooms}
	    </tbody>
		</Table>
		<Grid className="centered">
		<Button className="icon circular green" onClick={this.addRoom}>
		<Icon className="add circle icon" />
		<Room {...this.props} name="Add Room" classRoom="add" editRoom={this.props.editRoom} room={this.state.newRoom}/>
	        </Button>
		</Grid>
		</div>
	);
    }
});

var ModuleArgs = React.createClass({
    argumentDelete: function(){
	this.props.argumentDelete(this.props.argumentKey);
    },
    render: function(){
	var Button = Semantify.Button;
	var Icon = Semantify.Icon;
	return(
		<tr>
		<td>{this.props.option}</td>
	    	<td>{this.props.value}</td>
		<td>
		<Button className="icon red basic" onClick={this.argumentDelete}>
		<Icon className="trash" />
		</Button>
		</td>
	    </tr>
	);
    }
});


var Module = React.createClass({
    render: function(){
	var Button = Semantify.Button;
	var Fields = Semantify.Fields;
	var Field = Semantify.Field;	
	var Icon = Semantify.Icon;
	var Input = Semantify.Input;
	
	return(
		<div className="add module item">
		<div className="row">
		<Input>
		<input placeholder={this.props.moduleName} type="text" onChange={this.props.moduleChange} defaultValue={this.props.moduleName} />
		</Input>
		</div>
		<Button className="icon basic green" onClick={this.props.moduleAdd}>
		<Icon className="add" />
		</Button>
		</div>
	);
    }
});

var ModuleItem = React.createClass({
    moduleDelete: function(){
	this.props.moduleDelete(this.props.modkey);
    },
    componentDidMount: function(){
	$('.module.ui .item').tab();
    },
    render: function(){
	var Button = Semantify.Button;
	var Icon = Semantify.Icon;
	return(
		<div className="module item" data-tab={this.props.keyname}>
		<Button className="icon red basic" onClick={this.moduleDelete}>
		<Icon className="trash" />
		</Button>
		{this.props.name}
		</div>
	);
    }
});

var ModuleContent = React.createClass({
    componentDidMount: function(){
	this.props.moduleUpdate(this.props.module.key);
    },
    render: function(){
	var Table = Semantify.Table;
	var options = [];
	if (this.props.module.options){
	    options = this.props.module.options.map(function(option, i){
		return <ModuleArgs key={i} option={option.name} value={option.value} argumentKey={option.key} argumentDelete={this.props.argumentDelete}/>;}, this);
	}
	return(
		<div className="ui tab segment" data-tab={this.props.keyname}>
		<Table className="blue">
		<thead>
		<tr>
		<th className="two wide">Argument</th>
		<th className="two wide">Value</th>
		<th className="one wide"></th>
		</tr>
		</thead>
		<tbody>

	    {options}
	    </tbody>
		</Table>
	    </div>
	);
    }
});

var Task = React.createClass({
    render: function(){
	var Button = Semantify.Button;
	var Icon = Semantify.Icon;
	var Input = Semantify.Input;
	return(
		<div className="add task item">
		<div className="row">
		<Input>
		<input placeholder={this.props.taskName} type="text" onChange={this.props.changeTaskName}  />
		</Input>
		</div>
		<Button className="icon basic green" onClick={this.props.addTask}>
		<Icon className="add" />
		</Button>
		</div>
	);
    }
});

var TaskItem = React.createClass({
    componentDidMount: function(){
	$('.vertical.tabular .item').tab();
    },
    deleteTask: function(){
	this.props.updateStateTask(this.props.task);
	this.props.deleteTask();
    },
    render: function(){
	var Button = Semantify.Button;
	var Icon = Semantify.Icon;
	return(
		<div className="item" data-tab={this.props.name}>
		<Button className="icon red basic" onClick={this.deleteTask}>
		<Icon className="trash" />
		</Button>
		{this.props.name}
		</div>
	);
    }
});
var TaskContent = React.createClass({
    getInitialState: function(){
	return {moduleName: '', moduleKey: 0, argument: 'Argument', value: 'Value', keys: []}
    },
    componentDidMount: function() {
	$('.module.ui .item').tab();
	if (this.props.task.modules){
	var keys = []
	for(var i=0;i< this.props.task.modules.length+10;i++){
	    keys.push(Math.random().toString(36).substring(4));
	}
	this.setState({keys: keys})
	}

    },
    moduleAdd: function(){
	var url = '/api/task/' + this.props.task.key + '/module/add'
        $.ajax({
	    url: url,
	    type: 'POST',
	    dataType: 'json',
	    data: {module: this.state.moduleName},
	    success: function(data) {
	        this.setState({message: data["message"]});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error(url, status, err.toString());
	    }.bind(this)
	});
	this.props.loadTasks()
    },
    moduleDelete: function(moduleKey){
	var url = '/api/task/' + this.props.task.key + '/module/delete'
        $.ajax({
	    url: url,
	    type: 'POST',
	    dataType: 'json',
	    data: {key: moduleKey},
	    success: function(data) {
	        this.setState({message: data["message"]});
		console.log(this.state.message);
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error(url, status, err.toString());
	    }.bind(this)
	});
	this.setState({moduleKey: moduleKey});
	this.props.loadTasks()
    },
    argumentAdd: function(){
	var url = '/api/task/' + this.props.task.key + '/argument/add'
        $.ajax({
	    url: url,
	    type: 'POST',
	    dataType: 'json',
	    data: {argument: this.state.argument, value: this.state.value, modulekey: this.state.moduleKey},
	    success: function(data) {
	        this.setState({message: data["message"]});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error(url, status, err.toString());
	    }.bind(this)
	});
	this.props.loadTasks()
    },
    argumentDelete: function(argumentKey){
	var url = '/api/task/' + this.props.task.key + '/argument/delete'
        $.ajax({
	    url: url,
	    type: 'POST',
	    dataType: 'json',
	    data: {key: argumentKey},
	    success: function(data) {
	        this.setState({message: data["message"]});
		console.log(this.state.message);
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error(url, status, err.toString());
	    }.bind(this)
	});
	this.props.loadTasks();
    },
    moduleUpdate: function(moduleKey){
	this.setState({moduleKey: moduleKey});
    },
    moduleChange: function(e) {
	this.setState({moduleName: e.target.value});
    },
    argumentChange: function(e) {
	this.setState({argument: e.target.value});
    },
    valueChange: function(e) {
	this.setState({value: e.target.value});
    },
    componentWillReceiveProps: function(){
	if (this.props.task.modules){
	    var keyname = '';
	this.modules = this.props.task.modules.map(function(module, i){
	    keyname = this.state.keys[i];
	    return <ModuleItem {...this.props} key={i} modKey={module.key}
	    name={module.name} keyname={keyname} moduleDelete={this.moduleDelete} />;}, this);
	this.moduleArgs = this.props.task.modules.map(function(module, i){
	    keyname = this.state.keys[i];
	    return <ModuleContent {...this.props} key={i}
	    module={module} keyname={keyname} moduleUpdate={this.moduleUpdate} argumentDelete={this.argumentDelete}/>;}, this);
	}},
    render: function(){
	var Button = Semantify.Button;
	var Fields = Semantify.Fields;
	var Field = Semantify.Field;
	var Grid = Semantify.Grid;
	var Icon = Semantify.Icon;
	var Input = Semantify.Input;
	var Label = Semantify.Label;
	var Menu = Semantify.Menu;
	var Row = Semantify.Row;
	var Table = Semantify.Table;	
	var keyname = '';
	if (this.props.task.modules){
	var modules = this.props.task.modules.map(function(module, i){
	    keyname = this.state.keys[i];
	    return <ModuleItem {...this.props} key={i} modkey={module.key} name={module.name} keyname={keyname} moduleDelete={this.moduleDelete}/>;}, this);
	var moduleArgs = this.props.task.modules.map(function(module, i){
	    keyname = this.state.keys[i];
	    return <ModuleContent {...this.props} key={module.key} moduleUpdate={this.moduleUpdate} argumentDelete={this.argumentDelete} module={module} keyname={keyname} />;}, this);
	}
	return(
	<div className="ui tab segment" data-tab={this.props.task.name}>
	 <Grid>
	  <div className="six wide stretched column">
		<Menu className="vertical tabular fluid module">
		{modules}
	    	<Row>
		<Module taskName={this.props.taskName} moduleChange={this.moduleChange} moduleAdd={this.moduleAdd}/>
		</Row>
		</Menu>
		</div>
		<div className="eight wide stretched column">
		{moduleArgs}
	    	<div className='row'>
		<div className="ui segment">
		<Input>
	    	<input placeholder={this.state.argument} type="text" onChange={this.argumentChange} />
		</Input>
		<Input>
	    	<input placeholder={this.state.value} type="text" onChange={this.valueChange} />
		</Input>
		</div>
		</div>
		<Button className="icon basic green" onClick={this.argumentAdd}>
		<Icon className="add" />
		</Button>
	  </div>
	 </Grid>
       </div>
	);
    }
});



var Tasks = React.createClass({
    componentWillReceiveProps: function(){
	this.tasks = this.props.tasks.map(function(task, i){
	    return <TaskItem key={i} name={task.name} task={task} deleteTask={this.props.deleteTask} updateStateTask={this.props.updateStateTask}/>;
	}, this);
	this.modules = this.props.tasks.map(function(task, i){
	    return <TaskContent loadTasks={this.props.loadTasks} key={i} task={task} />;
	}, this);
    },
    render: function(){
	var Grid = Semantify.Grid;
	var Menu = Semantify.Menu;
	var Row = Semantify.Row;
	var tasks = this.props.tasks.map(function(task, i){
	    return <TaskItem key={i} name={task.name} task={task} deleteTask={this.props.deleteTask} updateStateTask={this.props.updateStateTask}/>;
	}, this);
	var modules = this.props.tasks.map(function(task, i){
	      return <TaskContent key={i} task={task} loadTasks={this.props.loadTasks} />;
	}, this);
	return(
	<div className="ui bottom attached tab" data-tab="tasks">
	<Grid>
	 <div className="four wide column">
	  <Menu className="vertical tabular fluid">
		{tasks}
		<Row>
		<Task taskName={this.props.taskName} changeTaskName={this.props.changeTaskName} addTask={this.props.addTask}/>
	    </Row>
          </Menu>
	</div>
	<div className="eleven wide stretched column">
		{modules}
	    </div>
	</Grid>
      </div>
	);
    }
});

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
 
