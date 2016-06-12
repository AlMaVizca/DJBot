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
