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
