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
	    dataType: 'json',
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


var Results = React.createClass({
    getInitialState: function(){
	return({keys:[]});
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
    componentWillReceiveProps: function(){
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
		{this.executionNames}
	    </div>
	    </Dropdown>

		<div className="ui animated fade blue button" tabindex="0" onClick={this.props.resultsReload}>
		<div className="hidden content">update</div>
		<div className="visible content">
		<Icon className="history"/>
		</div>
		</div>
	    </Menu>
		{this.executionResults}
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
	    <div className="ui bottom attached tab active " data-tab="run">
		<Steps className="fluid top attached">
		    <Step active={this.state.active[0]} data-tab='where'>Rooms<br/>Where are you working?</Step>
		    <Step active={this.state.active[1]} data-tab='what'>Tasks <br/>What are you doing?</Step>
		    <Step active={this.state.active[2]} data-tab='when'>Confirmation <br/> Are you sure?</Step>
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
		<div className="ui checkbox" onClick={this.updateList}>
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
		<th className="two wide">Checklist</th>
		<th className="Ten wide">Name</th>
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
		   <div className="hidden content">back</div>
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
		   <div className="hidden content">back</div>
	       <div className="visible content">
	       <Icon className="angle double left"/>
	       </div>
		   </div>
	       <div className="ui animated fade blue button" tabindex="0" onClick={this.props.next}>
		   <div className="hidden content">run</div>
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
	$('.room.basic').modal({closable: true}).modal('hide');
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
	$('.room.basic').modal({closable: true}).modal('hide');
	this.resetState()
    },
    resetState: function(){
	this.setState({name: "Room Name", network: '127.0.0.0', netmask: '24', machines: '1'});
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
		<Modal className='room basic' init={this.props.modal}>
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
    togglePopup: function(){
	$('.visible.button').popup('toggle');
    },
    componentDidMount: function(){
	$('.button.red').popup({on: 'click', inline: true});
    },
    render: function(){
	var Button = Semantify.Button;
	var Grid = Semantify.Grid;
	var Icon = Semantify.Icon;
    	return(
		<Grid className="right aligned">
		<div className="right aligned column">
		<Button className="inverted red basic circular"><Icon className="inverted red circle trash"/></Button>
		<div className="ui fluid popup top left transition hidden">
		<div className="ui one column divided center aligned grid">
		<div className="">Are you sure?</div>
		<div className="">
		<Button className="blue" onClick={this.togglePopup}>No</Button>
		</div>
		<div className="">
		<Button className="red" onClick={this.props.roomDelete}>Yes</Button>
		</div>		
		</div>
		</div>
		</div>
		</Grid>
	);
    }});	


var Settings = React.createClass({
    componentDidMount: function(){
    },
    roomAdd: function(){
	$('.room.basic').modal({closable: false,
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
		<th className="five wide">Name</th>
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
    componentDidMount: function(){
	$('.icon.red').popup({on: 'click', inline: true});
    },
    togglePopup: function(){
	$('.visible.button').popup('toggle');
    },
    render: function(){
	var Button = Semantify.Button;
	var Icon = Semantify.Icon;
	return(
		<tr>
		<td>{this.props.option}</td>
	    	<td>{this.props.value}</td>
		<td>
		<Button className="icon red basic">
		<Icon className="trash" /></Button>
		<div className="ui fluid popup top left transition hidden">
		<div className="ui one column divided center aligned grid">
		<div className="">Are you sure?</div>
		<div className="">
		<Button className="blue" onClick={this.togglePopup}>No</Button>
		</div>
		<div className="">
		<Button className="red" onClick={this.parameterDelete}>Yes</Button>
		</div>		
		</div>
		</div>
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
	$('.icon.red').popup({on: 'click', inline: true});
    },
    togglePopup: function(){
	$('.visible.button').popup('toggle');
    },
    render: function(){
	var Button = Semantify.Button;
	var Icon = Semantify.Icon;
	return(
		<div className="module item" data-tab={this.props.keyname}>
		<Button className="icon red basic">
		<Icon className="trash" /></Button>
		<div className="ui fluid popup top left transition hidden">
		<div className="ui one column divided center aligned grid">
		<div className="">Are you sure?</div>
		<div className="">
		<Button className="blue" onClick={this.togglePopup}>No</Button>
		</div>
		<div className="">
		<Button className="red" onClick={this.moduleDelete}>Yes</Button>
		</div>		
		</div>
		</div>

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
	
	var options = [];
	if (this.props.module.options){
	    options = this.props.module.options.map(function(option, i){
		return <ModuleArgs key={i} option={option.name} value={option.value} parameterKey={option.key} parameterDelete={this.props.parameterDelete}/>;}, this);
	}
	var argClasses = classNames('ui', 'tab');
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
	$('.icon.red').popup({on: 'click', inline: true});
    },
    componentWillReceiveProps: function(){
	$('.vertical.tabular .item').tab();
	$('.icon.red').popup({on: 'click', inline: true});
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
    togglePopup: function(){
	$('.visible.button').popup('toggle');
    },

    render: function(){
	var Button = Semantify.Button;
	var Icon = Semantify.Icon;
	return(
		<div className="item blue" data-tab={this.props.tab}>
		<div className="ui grid">
		<div className="row middle aligned content">
		<Button className="icon red basic">
		<Icon className="trash" /></Button>
		<div className="ui fluid popup top left transition hidden">
		<div className="ui one column divided center aligned grid">
		<div className="">Are you sure?</div>
		<div className="">
		<Button className="blue" onClick={this.togglePopup}>No</Button>
		</div>
		<div className="">
		<Button className="red" onClick={this.taskDelete}>Yes</Button>
		</div>		
		</div>
		</div>
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
	<div className="ui tab" data-tab={this.props.tab}>
	 <Grid>
		<div className="six wide stretched column">
		<Header>Modules</Header>
		<Menu className="vertical tabular fluid module">
		{modules}
	    	<Row>
		<Module taskName={this.props.taskName} moduleChange={this.moduleChange} moduleAdd={this.moduleAdd}/>
		</Row>
		</Menu>
		</div>
		<div className="eight wide stretched column">
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
		{modules}
	    </div>
	</Grid>
      </div>
	);
    }
});

var UserItem = React.createClass({
    userDelete: function(){
	$.ajax({
	    url: '/api/user/delete',
	    dataType: 'json',
	    type: 'POST',
	    data: {key: this.props.id},
	    success: function(data) {
		this.setState({message: data['message']});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error('/api/user/delete', status, err.toString());
	    }.bind(this)
	});
	this.props.usersReload();
    },
    userAdmin: function(){
	$.ajax({
	    url: '/api/user/change_admin',
	    dataType: 'json',
	    type: 'POST',
	    data: {key: this.props.id},
	    success: function(data) {
		this.setState({message: data['message']});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error('/api/user/change_admin', status, err.toString());
	    }.bind(this)
	});
	this.props.usersReload();
    },
    userEdit: function(){
	this.props.updateItem(this.props.id);
	$('.pass.add').modal({closable: false,}).modal('toggle');

    },
    componentDidMount: function(){
	this.classCheckbox = '.checkbox.'+this.props.username;
	if (this.props.admin){
	    $(this.classCheckbox).checkbox('check');
	}else{
	    $('.ui.checkbox').checkbox();
	}
	$('.icon.red').popup({on: 'click', inline: true});
    },
    componentWillReceiveProps: function(){
	this.classToggle = classNames('ui', 'checkbox', this.props.username);
	this.classCheckbox = '.checkbox.'+this.props.username;
	if (this.props.admin){
	    $(this.classCheckbox).checkbox('check');	    
	}else{
	    $('.ui.checkbox').checkbox();
	}
	$('.icon.red').popup({on: 'click', inline: true});
    },
    togglePopup: function(){
	$('.visible.button').popup('toggle');
    },
    render: function(){
	var Button = Semantify.Button;
	var Icon = Semantify.Icon;
	var classCheckbox;
	var classToggle = classNames('ui', 'checkbox', this.props.username)
	return(
		<tr>
		<td>
	    	<div className={classToggle} onClick={this.userAdmin}>
		<input name="select" type="checkbox"/>
		</div>
		</td>
		<td>
		{this.props.username}
	    </td>
		<td>{this.props.email}
	    </td>
		<td>
		<div className="right aligned column">
		<Button className="inverted blue basic" onClick={this.userEdit}><Icon className="blue edit"/></Button>
		</div>
		</td>
		<td>
		<div className="right aligned column">
		<Button className="inverted red basic circular"><Icon className="inverted red circle trash"/></Button>
		<div className="ui fluid popup top left transition hidden">
		<div className="ui one column divided center aligned grid">
		<div className="">Are you sure?</div>
		<div className="">
		<Button className="blue" onClick={this.togglePopup}>No</Button>
		</div>
		<div className="">
		<Button className="red" onClick={this.userDelete}>Yes</Button>
		</div>		
		</div>
		</div>

	    
		</div>
		</td>
		</tr>
	);
    }
});

var UserNew = React.createClass({
    getInitialState: function(){
	return {username: "", email: "", password:"", replypw:""}
    },
    userCancel: function(){
	$('.user.basic').modal({closable: true}).modal('toggle');
    },
    changeName: function(e) {
	this.setState({username: e.target.value});
    },
    changeEmail: function(e) {
	this.setState({email: e.target.value});
    },
    changePassword: function(e) {
	this.setState({password: e.target.value});
    },
    changeReplyPassword: function(e) {
	this.setState({replypw: e.target.value});
    },

    userSave: function(){
        var username = 	this.state.username.trim();
        var email = this.state.email.trim();
	var password = this.state.password.trim();
	var replypw = this.state.replypw.trim();

        if (!username || !email || !password || !replypw ){
	    console.log('Missing value');
	    return;
	}
	if (password != replypw){
	    console.log('Password missmatch');
	    return;
	}
	var user = { username: username, email: email, password: password};
	var result = '';
	$.ajax({
	    url: '/api/user/add',
	    dataType: 'json',
	    type: 'POST',
	    data: user,
	    success: function(data) {
		this.setState({message: data['message']});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error('/api/user/change', status, err.toString());
	    }.bind(this)
	});
	this.setState({username: ''});
	this.setState({email: ''});
	this.setState({password: ''});
	this.setState({replypw: ''});

	this.props.usersReload();

	$('.add.basic').modal({closable: true}).modal('hide');
    },
    render: function(){
	var Modal = Semantify.Modal;
	var Button = Semantify.Button;
	var Field = Semantify.Field;
	var Form = Semantify.Form;
	var Grid = Semantify.Grid;
	var Input = Semantify.Input;
	var Label = Semantify.Label;
	return(
		<Modal className="user add basic">
		<Grid className="center aligned">
		<Form>
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Username
	    </Label>
		<input id="username" defaultValue={this.state.username} placeholder={this.state.username} type="text" onChange={this.changeName} />
	    </div>
		</Input>
		</Field>
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Email
	    </Label>
		<input id="email" defaultValue={this.state.email} placeholder={this.state.email} type="text" onChange={this.changeEmail} />
		</div>
		</Input>
		</Field>
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Password
	    </Label>
		<input placeholder='' type="password" onChange={this.changePassword} />
		</div>
		</Input>
		</Field>
	    	<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Repeat Password
	    </Label>
		<input placeholder='' type="password" onChange={this.changeReplyPassword}/>
		</div>
		</Input>
		</Field>
		</Form>
		</Grid>		
		<Grid>
		<div className="right aligned column">
		<Button className="inverted red basic cancel" onClick={this.userCancel}>Cancel</Button>
		<Button className="inverted green basic active approve" onClick={this.userSave}>Save</Button>
		</div>
		</Grid>
	    </Modal>
	);
    }
});


var User = React.createClass({
    componentWillReceiveProps: function(){
    },
    render: function(){
	var Button = Semantify.Button;
	var Field = Semantify.Field;
	var Form = Semantify.Form;
	var Grid = Semantify.Grid;
	var Input = Semantify.Input;
	var Label = Semantify.Label;
	return(
		<div>
		<Grid className="center aligned">
		<Form>
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Username
	    </Label>
		<input id="username" defaultValue={this.props.username} placeholder={this.props.username} type="text" onChange={this.props.changeName} />
	    </div>
		</Input>
		</Field>
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Email
	    </Label>
		<input id="email" defaultValue={this.props.email} placeholder={this.props.email} type="text" onChange={this.props.changeEmail} />
		</div>
		</Input>
		</Field>
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Old Password
	    </Label>
		<input id="old" placeholder='' type="password" />
		</div>
		</Input>
		</Field>
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Passwordn
	    </Label>
		<input id="password" placeholder='' type="password" />
		</div>
		</Input>
		</Field>
	    	<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Repeat Password
	    </Label>
		<input id="replyPassword" placeholder='' type="password"/>
		</div>
		</Input>
		</Field>
		</Form>
		</Grid>		
		<Grid>
		<div className="right aligned column">
		<Button className="inverted green basic active approve" onClick={this.userSave}>Save</Button>
		</div>
		</Grid>
		</div>
	);
    }
});


var ButtonAdd = React.createClass({
    render: function(){
	var Button = Semantify.Button;
	var Grid = Semantify.Grid;
	var Icon = Semantify.Icon;
	return(
		<Grid className="centered">
		<Button className="icon circular green" onClick={this.props.userAdd}>
		<UserNew name="Add User" usersReload={this.props.usersReload} />
		<Icon className="add circle icon" />
	        </Button>
		</Grid>
	);
    }
});


var UserList = React.createClass({
    componentWillReceiveProps: function(){
	this.users = this.props.users.map(function(user,i){
	    return <UserItem key={i} id={user.key} admin={user.admin} username={user.username} email={user.email} updateItem={this.updateItem} usersReload={this.props.usersReload}/>;
	}, this);
    },
    userAdd: function(){
	$('.user.basic').modal({closable: false,
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
    passCancel: function(){
	$('.pass.add').modal({closable: true}).modal('toggle');
    },
    updateItem: function(key){
	this.setState({key: key})
    },
    passSave: function(){
	var newpass = $('#newpass').val();
	var oldpass = $('#oldpass').val();
	$.ajax({
	    url: '/api/user/change_password',
	    dataType: 'json',
	    type: 'POST',
	    data: {key: this.state.key, password: newpass, old: oldpass},
	    success: function(data) {
		this.setState({message: data['message']});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error('/api/user/change_password', status, err.toString());
	    }.bind(this)
	});

	document.getElementById('#newpass').value='';
	document.getElementById('#oldpass').value='';
	$('.pass.add').modal({closable: true}).modal('toggle');
    },
    render: function(){
	var Button = Semantify.Button;
	var Field = Semantify.Field;
	var Grid = Semantify.Grid;
	var Icon = Semantify.Icon;
	var Input = Semantify.Input;
	var Label = Semantify.Label;
	var Modal = Semantify.Modal;
	var Table = Semantify.Table;
	var users = this.props.users.map(function(user,i){
	    return <UserItem key={i} id={user.key} admin={user.admin} username={user.username} email={user.email} updateItem={this.updateItem}  usersReload={this.props.usersReload}/>;
	},this);
	return(
		<div>
		<Table className="blue">
		<thead>
		<tr>
		<th className="one wide">
		<Icon/>Admin</th>
		<th className="three wide">
		<Icon className="user"/>Username</th>
		<th className="three wide">
		<Icon className="sitemap"/>Email</th>
		<th className="one wide">
		<Icon/>Reset Password</th>
		<th className="one wide">
		<Icon/>Remove</th>
		</tr>
		</thead>
		<tbody>
		{this.users}
		</tbody>
		</Table>
		<ButtonAdd usersReload={this.props.usersReload} userAdd={this.userAdd}/>
		<Modal className="pass add basic">
		<Grid className="center aligned">
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		Your Password
	    </Label>
		<input id="oldpass" placeholder='' type="password" />
		</div>
		</Input>
		</Field>
		<Field>
		<Input>
		<div className="ui labeled input">
		<Label>
		New Password 
	    </Label>
		<input id="newpass" placeholder='' type="password" />
		</div>
		</Input>
		</Field>
	    </Grid>
		<Grid>
		<div className="right aligned column">
		<Button className="inverted red basic active cancel" onClick={this.passCancel}>Cancel</Button>
		<Button className="inverted green basic active approve" onClick={this.passSave}>Save</Button>
		</div>
		</Grid>
		</Modal>
	    </div>
	);
    }
});

var Users = React.createClass({
    getInitialState: function(){
	return {key: 999, username: "", email: "", old: "", password:"", replypw:"", admin: true}
    },
    updateUser: function(){
	if (this.props.user){
	    this.setState({admin: this.props.user.admin});
	    this.setState({username: this.props.user.username});
	    this.setState({email: this.props.user.email});
	    this.setState({key: this.props.user.key});
	}
    },
    componentDidMount: function(){
	this.props.usersReload();
	this.updateUser();
	$('.user.menu .item').tab();
    },
    componentWillReceiveProps: function(){
	this.updateUser();
	if (this.props.users){
	    this.users = <UserTabList users={this.props.users} usersReload={this.props.usersReload} />
		
	}
	$('.user.menu .item').tab();
    },
    changeAdmin: function(e) {
	this.setState({admin: e.target.value});
    },
    changeName: function(e) {
	this.setState({username: e.target.value});
    },
    changeEmail: function(e) {
	this.setState({email: e.target.value});
    },
    userSave: function(){
	var key = this.state.key;
        var username = 	this.state.username;
        var email = this.state.email;
	var old = $('#old').val().trim();
	var password = $('#password').val().trim();
	var replypw =$('#replyPassword').val().trim();

        if (!key || !username || !email || !password || !replypw || !old){
	    console.log('Missing value');
	    return;
	}
	if (password != replypw){
	    console.log('Password missmatch');
	    return;
	}

	var user = {key: key, username: username, email: email, password: password, old: old};
	var result = '';
	$.ajax({
	    url: '/api/user/change',
	    dataType: 'json',
	    type: 'POST',
	    data: user,
	    success: function(data) {
		this.setState({message: data['message']});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error('/api/user/change', status, err.toString());
	    }.bind(this)
	});
	this.props.usersReload();
	$('.add.basic').modal({closable: true}).modal('hide');
    },
    render: function() {
	var Grid = Semantify.Grid;
	var Menu = Semantify.Menu;
	var users;
	if (this.props.user.admin != null){
	    if(!this.props.user.admin){
		$('#userlist').remove();
	    }
	}
	if (this.props.users){
		users = <UserTabList users={this.props.users} usersReload={this.props.usersReload} />
	}
        return (
		<div className="ui bottom attached tab" data-tab="users">
		<h1>User Settings</h1>
		<Grid>
		<div className="four wide column">
		<Menu className="vertical tabular fluid user">
		  <div className="item active" data-tab="user">
		  My Profile
	    </div>
		<div id="userlist" className="item hidden" data-tab="userlist">User List</div>
		</Menu>
		</div>
	    	<div className="twelve wide stretched column">
		 <div className="ui attached tab active" data-tab="user">
		<User username={this.state.username} email={this.state.email} key={this.state.key} userSave={this.userSave} changeName={this.changeName} changeEmail={this.changeEmail} />
	    </div>
		{users}
		</div>
		</Grid>
		</div>
	)
    }
});

var UserTabList = React.createClass({
    componentWillReceiveProps: function(){
    },
    render: function(){
	return(
		<div className="ui attached tab" data-tab="userlist">
		<UserList users={this.props.users} usersReload={this.props.usersReload}/>
		</div>
	);
    }
});


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
 
