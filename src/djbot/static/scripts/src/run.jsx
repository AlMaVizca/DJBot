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
	    <div className="ui bottom attached tab" data-tab="run">
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
