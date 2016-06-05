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
	var Button = Semantify.Button;
	var Icon = Semantify.Icon;
	var Input = Semantify.Input;
	return(
		<div className="add module item">
		<Input>
		<input placeholder={this.props.moduleName} type="text" onChange={this.props.moduleChange} defaultValue={this.props.moduleName} />
		<Button className="icon green" onClick={this.props.moduleAdd}>
		<Icon className="add" />
		</Button>
		</Input>
		</div>
	);
    }
});

var ModuleItem = React.createClass({
    moduleDelete: function(){
	console.log(this.props);
	this.props.moduleUpdate(this.props.modKey);
	this.props.moduleDelete();
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
    render: function(){
	var options = [];
	if (this.props.module.options){
	    options = this.props.module.options.map(function(option){
	    return <ModuleArgs key={option.key} option={option.name} value={option.value} />;
	});
	}
	return(
		<div className="ui tab segment" data-tab={this.props.keyname}>
		{options}
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
		<Input>
		<input placeholder={this.props.taskName} type="text" onChange={this.props.changeTaskName} defaultValue={this.props.taskName} />
		<Button className="icon green" onClick={this.props.addTask}>
		<Icon className="add" />
		</Button>
		</Input>
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
	return {moduleName: '', moduleKey: 0}
    },
    componentDidMount: function() {
	$('.module.ui .item').tab();
    },
    moduleAdd: function(){
	console.log('add module');
	var url = '/api/task/' + this.props.task.key + '/add'
        $.ajax({
	    url: url,
	    type: 'POST',
	    dataType: 'json',
	    data: {module: this.state.moduleName},
	    success: function(data) {
	        this.setState({message: data["message"]});
		console.log(this.state.message);
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error(url, status, err.toString());
	    }.bind(this)
	});
	this.props.loadTasks()
    },
    moduleDelete: function(){
	var url = '/api/task/' + this.props.task.key + '/delete'
	console.log(this.state.moduleKey);
        $.ajax({
	    url: url,
	    type: 'POST',
	    dataType: 'json',
	    data: {key: this.state.moduleKey},
	    success: function(data) {
	        this.setState({message: data["message"]});
		console.log(this.state.message);
	    }.bind(this),
	    error: function(xhr, status, err) {
	        console.error(url, status, err.toString());
	    }.bind(this)
	});
	this.setState({moduleKey: -1});
	this.props.loadTasks()
    },
    moduleUpdate: function(key){
	this.setState({moduleKey: key});
    },
    moduleChange: function(e) {
	this.setState({moduleName: e.target.value});
    },
    componentWillReceiveProps: function(){
	var keys = [];
	if (this.props.task.modules){
	for(var i=0;i< this.props.task.modules.length;i++){
	    keys.push(Math.random().toString(36).substring(7));
	}
	this.modules = this.props.task.modules.map(function(module, i){
	    var keyname = keys[i];
	    return <ModuleItem {...this.props} key={i} modkey={module.key} name={module.name} keyname={keyname} moduleUpdate={this.moduleUpdate} moduleDelete={this.moduleDelete}/>;}, this);
	this.moduleArgs = this.props.task.modules.map(function(module, i){
	    var keyname = keys[i];
	    return <ModuleContent {...this.props} key={module.key}
	    module={module} keyname={keyname} moduleDelete={this.moduleDelete}/>;}, this);
	    $('.module.ui .item').tab();
	}},
    render: function(){
	var Button = Semantify.Button;
	var Grid = Semantify.Grid;
	var Icon = Semantify.Icon;
	var Menu = Semantify.Menu;
	var Row = Semantify.Row;	
	var keys = [];
	if (this.props.task.modules){
	for(var i=0;i< this.props.task.modules.length;i++){
	    keys.push(Math.random().toString(36).substring(7));
	}
	    console.log(keys);
	var modules = this.props.task.modules.map(function(module, i){
	    var keyname = keys[i];
	    return <ModuleItem {...this.props} key={i} modkey={module.key} name={module.name} keyname={keyname} moduleDelete={this.moduleDelete} moduleUpdate={this.moduleUpdate}/>;}, this);
	var moduleArgs = this.props.task.modules.map(function(module, i){
	    var keyname = keys[i];
	    return <ModuleContent {...this.props} key={module.key}
	    module={module} keyname={keyname} />;}, this);
	}
	return(
	<div className="ui tab segment" data-tab={this.props.task.name}>
	 <Grid>
	  <div className="four wide column">
		<Menu className="vertical tabular fluid module">
		{modules}
	    	<Row>
		<Module taskName={this.props.taskName} moduleChange={this.moduleChange} moduleAdd={this.moduleAdd}/>
		</Row>
		</Menu>
		</div>
		<div className="twelve wide stretched column">
		{moduleArgs}
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
	<div className="ui bottom attached tab active" data-tab="tasks">
	<Grid>
	 <div className="four wide column">
	  <Menu className="vertical tabular fluid">
		{tasks}
		<Row>
		<Task taskName={this.props.taskName} changeTaskName={this.props.changeTaskName} addTask={this.props.addTask}/>
	    </Row>
          </Menu>
	</div>
	<div className="twelve wide stretched column">
		{modules}
	    </div>
	</Grid>
      </div>
	);
    }
});
