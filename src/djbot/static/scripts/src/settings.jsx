var Room = React.createClass({
    deleteRoom: function(){
	var classRoom = '.' + this.props.classRoom;
	$(classRoom).modal('hide');
	this.props.editRoom('remove');
    },
    saveRoom: function(){
	var classRoom = '.' + this.props.classRoom;
	$(classRoom).modal('hide');
	$('.add').modal({closable: true,
			 onHide: function(){
			     console.log('hidden');
			 },
			}).modal('hide');
	this.props.editRoom('save');
	return true
    },
    cancelRoom: function(){
	console.log(this.props);
	var classRoom = '.' + this.props.classRoom;
	$(classRoom).modal('hide');
	$('.add').modal('hide');
	return true
    },
    render: function(){
	var Button = Semantify.Button;
	var Form = Semantify.Form;
	var Field = Semantify.Field;
	var Fields = Semantify.Fields;
	var Grid = Semantify.Grid;
	var Header = Semantify.Header;
	var Icon = Semantify.Icon;
	var Input = Semantify.Input;
	var Label = Semantify.Label;
	var Modal = Semantify.Modal;
	var classRoom = classNames(this.props.classRoom, 'basic');
	var deleteButton = (this.props.keyRoom != 999);
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
	$(classRoom).modal({closable: false}).modal('toggle');
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
	    <Room {...this.props} keyRoom={this.props.room.keyRoom}/>
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
    componentDidMount: function(){
    },
    addRoom: function(){
	var newRoom = { name: "Add Room", network: '0.0.0.0', netmask: '0',proxy: '0.0.0.0', machines: '0', keyRoom: 999};
	this.props.updateStateRoom(newRoom);
	$('.add').modal({closable: false,
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
	this.rooms = this.props.rooms.map(function(room,i){
		 var syncTab = Math.random().toString(36).substring(7);
		 return <RoomItem {...this.props} key={i} keyRoom={room.keyRoom} room={room} classRoom={syncTab}/>;
		},this);
    },
    render: function(){
	var Table = Semantify.Table;
	var Icon = Semantify.Icon;
	var Grid = Semantify.Grid;
	var Button = Semantify.Button;
	var editRoom = this.props.editRoom;
	var rooms = this.props.rooms.map(function(room,i){
		 var syncTab = Math.random().toString(36).substring(7);
		 return <RoomItem {...this.props} key={i} keyRoom={room.keyRoom} room={room} classRoom={syncTab}/>;
		},this);
	var newRoom = { name: "Add Room", network: '0.0.0.0', netmask: '0',proxy: '0.0.0.0', machines: '0', keyRoom: 999};

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
		<Room {...this.props} name="Add Room" classRoom="add basic" editRoom={editRoom} room={newRoom}/>
	        </Button>
		</Grid>
		</div>
	);
    }
});
