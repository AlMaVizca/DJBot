var React = require("react");

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

module.exports = Blackboard;
