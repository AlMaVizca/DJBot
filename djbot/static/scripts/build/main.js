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
	return {active: [true, false,false], rooms:[], tasks:[]}
    },
    componentDidMount: function() {
    },
    nextStep: function(){
	if (this.state.active[0]){
	    this.setState({active: [false, true, false]});
	    return
	}else if (this.state.active[1]){
	    this.setState({active: [false, false, true]});
	    return
	} else {
	    this.setState({active: [true, false, false]});
	}
	this.runAdd();
	$('.ui.checkbox').checkbox('uncheck')
	this.roomsClear();
	this.tasksClear();
    },
    roomsClear: function(){
	console.log('yit');
	this.setState({rooms: []});
    },
    tasksClear: function(){
	this.setState({tasks: []});
    },
    runAdd: function(){
	$.ajax({
	    url: "/api/run",
	    dataType: 'json',
	    type: 'POST',
	    data: {tasks: this.state.tasks, rooms: this.state.rooms },
	    success: function(data) {
	        this.setState({message: data["message"]});
		console.log(this.state.message);
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	    }.bind(this)
	});
	this.setState({rooms: []});
    },
    reset: function(){
	this.setState({active: [true, false,false]});
    },
    roomList: function(key){
	var rooms = this.state.rooms;
	var index = rooms.indexOf(key);
	if ( index != -1){
	    rooms.splice(index,1);
	}else{
	    rooms.splice(index,0,key);
	}
	this.setState({rooms: rooms});
    },
    taskList: function(key){
	var tasks = this.state.tasks;
	var index = tasks.indexOf(key);
	if ( index != -1){
	    tasks.splice(index,1);
	}else{
	    tasks.splice(index,0,key);
	}
	this.setState({tasks: tasks});
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
		<SelectRooms active={this.state.active[0]} next={this.nextStep} rooms={this.props.rooms} edit={this.roomList}/>
		<SelectTask active={this.state.active[1]} next={this.nextStep} tasks={this.props.tasks} reset={this.reset} edit={this.taskList}/>
		<Schedule active={this.state.active[2]} next={this.nextStep} reset={this.reset} listRooms={this.state.rooms} listTasks={this.state.tasks} rooms={this.props.rooms} tasks={this.props.tasks}/>
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
    getInitialState: function(){
	return {name: "Room name", network: '127.0.0.0', netmask: '24', machines: '1'}
    },
    roomCancel: function(){
	$('.add.basic').modal({closable: true}).modal('hide');
	return true
    },
    roomSave: function(){
        var name = this.state.name.trim();
        var machines = this.state.machines;
	var network = this.state.network.trim();
	var netmask = this.state.netmask.trim();
	
        if (!name || !machines || !network || !netmask){
	    console.log('Missing value');
	    return;
	}
	var room = {name: name, machines: machines, network: network, netmask: netmask};
	var result = '';
	$.ajax({
	    url: "/api/room/add",
	    dataType: 'json',
	    type: 'POST',
	    data: room,
	    success: function(data) {
		result = data["message"];
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error("/api/room/add", status, err.toString());
	    }.bind(this)
	});
	this.props.roomsReload();
	$('.add.basic').modal({closable: true}).modal('hide');
    },
    resetState: function(){
	this.setState({name: "Room name", network: '127.0.0.0', netmask: '24', machines: '1'});
    },
    changeName: function(e) {
	this.setState({name: e.target.value});
    },
    changeNetwork: function(e) {
	this.setState({network: e.target.value});
    },
    changeNetmask: function(e) {
	this.setState({netmask: e.target.value});
    },
    changeMachines: function(e) {
	this.setState({machines: e.target.value});
    },
    componentWillReceiveProps: function(){
	this.resetState();
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
	return (
		<Modal className='add basic' init={this.props.modal}>
		<Header className="inverted grey">{this.state.name}</Header>
		<Grid className="center aligned">
		<Form>
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Name
	    </Label>
		<input placeholder={this.state.name} type="text" onChange={this.changeName} />
	    </div>
		</Input>
		</Field>
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Machines
	    </Label>
		<input placeholder={this.state.machines} type="text" onChange={this.changeMachines} />
		</div>
		</Input>
		</Field>
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Network
		</Label>
		<input placeholder={this.state.network} type="text" onChange={this.changeNetwork} />
		</div>
		</Input>
		</Field>
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Netmask
	    </Label>
		<input placeholder={this.state.netmask} type="text" onChange={this.changeNetmask} />
		</div>
		</Input>
		</Field>
		</Form>
		</Grid>		
		<Grid>
		<div className="right aligned column">
		<Button className="inverted red basic cancel" onClick={this.roomCancel}>Cancel</Button>
		<Button className="inverted green basic active approve" onClick={this.roomSave}>Save</Button>
		</div>
		</Grid>
		</Modal>
	);
    }
    
});

var RoomItem = React.createClass({
    roomDelete: function(){
	$.ajax({
	    url: "/api/room/delete",
	    dataType: 'json',
	    type: 'POST',
	    data: {key: this.props.room.key},
	    success: function(data) {
		this.setState({message: data["message"]});
		console.log(this.state.message);
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error("/api/room/delete", status, err.toString());
	    }.bind(this)
	});
	this.props.roomsReload();
    },
    render: function(){
	var Icon = Semantify.Icon;
    return(
	    <tr>
	    <td><RoomName name={this.props.room.name} /></td>
	    <td><Machines machines={this.props.room.machines}/></td>
	    <td><Network network={this.props.room.network}/></td>
	    <td><Netmask netmask={this.props.room.netmask} /></td>
	    <td>
	    <RemoveButton roomDelete={this.roomDelete} key={this.props.room.key} />
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
		<Button className="inverted red basic circular" onClick={this.props.roomDelete}><Icon className="inverted red circle trash"/></Button>
		</div>
		</Grid>
	);
    }});	


var Settings = React.createClass({
    componentDidMount: function(){
    },
    roomAdd: function(){
	$('.add.basic').modal({closable: false,
			 onApprove: function () {
			     console.log('Approve');
			 },
			 onHide: function(){
			     return false
			 },
			 onShow: function(){
			 },
			      }).modal('toggle');
	
    },
    componentWillReceiveProps: function(){
	this.rooms = this.props.rooms.map(function(room,i){
		 return <RoomItem roomsReload={this.props.roomReload} key={i} keyRoom={room.key} room={room}/>;
		},this);
    },
    render: function(){
	var Table = Semantify.Table;
	var Icon = Semantify.Icon;
	var Grid = Semantify.Grid;
	var Button = Semantify.Button;
	var rooms = this.props.rooms.map(function(room,i){
	    return <RoomItem roomsReload={this.props.roomsReload} key={i} keyRoom={room.key} room={room}/>;
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
		<th className="one wide"></th>
		</tr>
		</thead>
		<tbody>
		{rooms}
	    </tbody>
		</Table>
		<Grid className="centered">
		<Button className="icon circular green" onClick={this.roomAdd}>
		<Room name="Add Room" roomsReload={this.props.roomsReload} />
		<Icon className="add circle icon" />
	        </Button>
		</Grid>
		</div>
	);
    }
});

var ModuleArgs = React.createClass({
    parameterDelete: function(){
	this.props.parameterDelete(this.props.parameterKey);
    },
    componentWillReceiveProps: function(){
    },
    render: function(){
	var Button = Semantify.Button;
	var Icon = Semantify.Icon;
	return(
		<tr>
		<td>{this.props.option}</td>
	    	<td>{this.props.value}</td>
		<td>
		<Button className="icon red basic" onClick={this.parameterDelete}>
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
    getInitialState: function(){
	return {parameter: '', value:''}
    },
    componentDidMount: function(){
	this.props.moduleUpdate(this.props.module.key);
    },
    componentWillReceiveProps: function(){
	var options = [];
	if (this.props.module.options){
	    options = this.props.module.options.map(function(option, i){
		return <ModuleArgs key={i} option={option.name} value={option.value} parameterKey={option.key} parameterDelete={this.props.parameterDelete}/>;}, this);
	}
    },
    parameterAdd: function(){
	this.props.parameterAdd(this.props.module.key, this.state.parameter, this.state.value);
    },
    parameterChange: function(e) {
	this.setState({parameter: e.target.value});
    },
    valueChange: function(e) {
	this.setState({value: e.target.value});
    },
    render: function(){
	var Button = Semantify.Button;
	var Icon = Semantify.Icon;	
	var Input = Semantify.Input;
	var Table = Semantify.Table;
	
	console.log(this.props);
	var options = [];
	if (this.props.module.options){
	    options = this.props.module.options.map(function(option, i){
		return <ModuleArgs key={i} option={option.name} value={option.value} parameterKey={option.key} parameterDelete={this.props.parameterDelete}/>;}, this);
	}
	var argClasses = classNames('ui', 'tab', 'segment');
	if (this.props.key == 1){
	    argClasses = classNames(argClasses, 'active')
	}
	return(
		<div className={argClasses} data-tab={this.props.keyname}>
		<Table className="blue">
		<thead>
		<tr>
		<th className="two wide">Parameter</th>
		<th className="two wide">Value</th>
		<th className="one wide"></th>
		</tr>
		</thead>
		<tbody>

	    {options}
	        <tr>
		<td>
		<Input className="fluid">
	    	<input placeholder={this.state.parameter} type="text" onChange={this.parameterChange} />
		</Input>
		</td>
		<td>
		<Input className="fluid">
	    	<input placeholder={this.state.value} type="text" onChange={this.valueChange} />
		</Input>
		</td>
		<td>
		<Button className="icon basic green" onClick={this.parameterAdd}>
		<Icon className="add" />
		</Button>
		</td>
		</tr>
	    </tbody>
		</Table>
	    </div>
	);
    }
});

var Task = React.createClass({
    getInitialState: function(){
	return { taskName: '' }	
    },
    taskAdd: function(){
	var name = this.state.taskName.trim();
	if (!name){
	    return;
	}
	$.ajax({
	    url: "/api/task/add",
	    dataType: 'json',
	    type: 'POST',
	    data: {taskName: name},
	    success: function(data) {
	        this.setState({message: data["message"]});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	    }.bind(this)
	});
	this.setState({taskName: ''});
	this.props.tasksReload();
    },
    taskChangeName: function(e) {
	this.setState({taskName: e.target.value});
    },
    render: function(){
	var Button = Semantify.Button;
	var Icon = Semantify.Icon;
	var Input = Semantify.Input;
	return(
		<div className="add task item">
		<div className="row">
		<Input>
		<input placeholder={this.state.taskName} type="text" onChange={this.taskChangeName}  />
		</Input>
		</div>
		<Button className="icon basic green" onClick={this.taskAdd}>
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
    componentWillReceiveProps: function(){
	$('.vertical.tabular .item').tab();
    },
    taskDelete: function(){
	$.ajax({
	    url: "/api/task/delete",
	    dataType: 'json',
	    type: 'POST',
	    data: {key: this.props.task.key},
	    success: function(data) {
		this.setState({message: data["message"]});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error("/api/task/delete", status, err.toString());
	    }.bind(this)
	});
	this.props.tasksReload();	
    },
    render: function(){
	var Button = Semantify.Button;
	var Icon = Semantify.Icon;
	return(
		<div className="item blue" data-tab={this.props.tab}>
		<div className="ui grid">
		<div className="row middle aligned content">
		<Button className="icon red basic" onClick={this.taskDelete}>
		<Icon className="trash" />
		</Button>
		<span>{this.props.name}</span>
		</div>
		</div>		
		</div>
	);
    }
});
var TaskContent = React.createClass({
    getInitialState: function(){
	return {moduleName: '', moduleKey: 0, parameter: 'Parameter', value: 'Value', keys: []}
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
	this.props.tasksReload()
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
	this.props.tasksReload()
    },
    parameterAdd: function(moduleKey, parameter, value){
	var url = '/api/task/' + this.props.task.key + '/parameter/add'
        $.ajax({
	    url: url,
	    type: 'POST',
	    dataType: 'json',
	    data: {parameter: parameter, value: value, modulekey: moduleKey},
	    success: function(data) {
	        this.setState({message: data["message"]});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error(url, status, err.toString());
	    }.bind(this)
	});
	console.log(this.state.message);
	this.props.tasksReload();
    },
    parameterDelete: function(parameterKey){
	var url = '/api/task/' + this.props.task.key + '/parameter/delete'
        $.ajax({
	    url: url,
	    type: 'POST',
	    dataType: 'json',
	    data: {key: parameterKey},
	    success: function(data) {
	        this.setState({message: data["message"]});
		console.log(this.state.message);
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error(url, status, err.toString());
	    }.bind(this)
	});
	this.props.tasksReload();
    },
    moduleUpdate: function(moduleKey){
	this.setState({moduleKey: moduleKey});
    },
    moduleChange: function(e) {
	this.setState({moduleName: e.target.value});
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
	    module={module} keyname={keyname} moduleUpdate={this.moduleUpdate} parameterDelete={this.parameterDelete} parametarAdd={this.parameterAdd}/>;}, this);
	    $('.module.ui .item').tab();
	}},
    render: function(){
	var Button = Semantify.Button;
	var Fields = Semantify.Fields;
	var Field = Semantify.Field;
	var Grid = Semantify.Grid;
	var Header = Semantify.Header;	
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
	var moduleParameters = this.props.task.modules.map(function(module, i){
	    keyname = this.state.keys[i];
	    return <ModuleContent key={module.key} moduleUpdate={this.moduleUpdate} parameterDelete={this.parameterDelete} parameterAdd={this.parameterAdd} module={module} keyname={keyname} />;}, this);
	}
	return(
	<div className="ui tab segment" data-tab={this.props.tab}>
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
		<Header>Parameters</Header>
		{moduleParameters}
	  </div>
	 </Grid>
       </div>
	);
    }
});



var Tasks = React.createClass({
    getInitialState: function(){
	return {keys: []}
    },
    componentDidMount: function(){
	if (this.props.tasks){
	var keys = []
	for(var i=0;i< this.props.tasks.length+10;i++){
	    keys.push(Math.random().toString(36).substring(4));
	}
	this.setState({keys: keys})
	}

    },
    componentWillReceiveProps: function(){
	var keys = ''
	this.tasks = this.props.tasks.map(function(task, i){
	    keys = this.state.keys[i];
	    return <TaskItem key={i} name={task.name} task={task} tasksReload={this.props.tasksReload} tab={keys}/>;
	}, this);
	this.modules = this.props.tasks.map(function(task, i){
	    keys = this.state.keys[i];
	    return <TaskContent tasksReload={this.props.tasksReload} key={i} task={task} tab={keys}/>;
	}, this);
    },
    render: function(){
	var Grid = Semantify.Grid;
	var Header = Semantify.Header;
	var Menu = Semantify.Menu;
	var Row = Semantify.Row;
	var keys ='';
	var tasks = this.props.tasks.map(function(task, i){
	    keys = this.state.keys[i];
	    return <TaskItem key={i} name={task.name} task={task} tasksReload={this.props.tasksReload} tab={keys}/>;
	}, this);
	var modules = this.props.tasks.map(function(task, i){
	    keys = this.state.keys[i];
	    return <TaskContent key={i} task={task} tasksReload={this.props.tasksReload} tab={keys}/>;
	}, this);
	return(
	<div className="ui bottom attached tab" data-tab="tasks">
	<Grid>
	 <div className="four wide column">
	  <Menu className="vertical tabular fluid tasks">
	  	<Header>Tasks</Header>
		{tasks}
		<Row>
		<Task tasksReload={this.props.tasksReload}/>
	    </Row>
          </Menu>
	</div>
	<div className="eleven wide stretched column">
	     <Header>Modules</Header>
		{modules}
	    </div>
	</Grid>
      </div>
	);
    }
});

var Main = React.createClass({
    getInitialState: function() {
        return {tasks : [{ key: 0, name: 'your connection is not working', modules: [{ key :1, name: 'failed', options: [{ key: 1, name: "let's hand some work", value: 'yeah!', }]}]}], rooms: [{name:'your conecction is not working', machines: 0, network: '127.0.0.1', netmask:'24'}], results: [] }},
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
    render: function() {
	var Icon = Semantify.Icon;
        return (
		<div className="ui tabular  menu">
		<div className="item" data-tab="settings">
		<Icon className="settings" /> Rooms</div>
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
 
