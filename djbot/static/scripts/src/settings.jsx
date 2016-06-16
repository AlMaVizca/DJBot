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
