var ModuleArgs = React.createClass({
    parameterDelete: function(){
	this.props.parameterDelete(this.props.parameterKey);
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
    render: function(){
	var Table = Semantify.Table;
	var options = [];
	if (this.props.module.options){
	    options = this.props.module.options.map(function(option, i){
		return <ModuleArgs key={i} option={option.name} value={option.value} parameterKey={option.key} parameterDelete={this.props.parameterDelete}/>;}, this);
	}
	return(
		<div className="ui tab segment" data-tab={this.props.keyname}>
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
    taskDelete: function(){
	console.log(this.props);
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
		<div className="item" data-tab={this.props.name}>
		<Button className="icon red basic" onClick={this.taskDelete}>
		<Icon className="trash" />
		</Button>
		{this.props.name}
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
    parameterAdd: function(){
	var url = '/api/task/' + this.props.task.key + '/parameter/add'
        $.ajax({
	    url: url,
	    type: 'POST',
	    dataType: 'json',
	    data: {parameter: this.state.parameter, value: this.state.value, modulekey: this.state.moduleKey},
	    success: function(data) {
	        this.setState({message: data["message"]});
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error(url, status, err.toString());
	    }.bind(this)
	});
	this.props.tasksReload()
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
    parameterChange: function(e) {
	this.setState({parameter: e.target.value});
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
	    module={module} keyname={keyname} moduleUpdate={this.moduleUpdate} parameterDelete={this.parameterDelete}/>;}, this);
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
	var moduleParameters = this.props.task.modules.map(function(module, i){
	    keyname = this.state.keys[i];
	    return <ModuleContent {...this.props} key={module.key} moduleUpdate={this.moduleUpdate} parameterDelete={this.parameterDelete} module={module} keyname={keyname} />;}, this);
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
		{moduleParameters}
	    	<div className='row'>
		<div className="ui segment">
		<Input>
	    	<input placeholder={this.state.parameter} type="text" onChange={this.parameterChange} />
		</Input>
		<Input>
	    	<input placeholder={this.state.value} type="text" onChange={this.valueChange} />
		</Input>
		</div>
		</div>
		<Button className="icon basic green" onClick={this.parameterAdd}>
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
	    return <TaskItem key={i} name={task.name} task={task} tasksReload={this.props.tasksReload} />;
	}, this);
	this.modules = this.props.tasks.map(function(task, i){
	    return <TaskContent tasksReload={this.props.tasksReload} key={i} task={task} />;
	}, this);
    },
    render: function(){
	var Grid = Semantify.Grid;
	var Menu = Semantify.Menu;
	var Row = Semantify.Row;
	var tasks = this.props.tasks.map(function(task, i){
	    return <TaskItem key={i} name={task.name} task={task} tasksReload={this.props.tasksReload}/>;
	}, this);
	var modules = this.props.tasks.map(function(task, i){
	      return <TaskContent key={i} task={task} tasksReload={this.props.tasksReload} />;
	}, this);
	return(
	<div className="ui bottom attached tab" data-tab="tasks">
	<Grid>
	 <div className="four wide column">
	  <Menu className="vertical tabular fluid">
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
