var Room = React.createClass({
    deleteRoom: function(){
	var classRoom = '.' + this.props.classRoom;
	this.props.editRoom('remove');
	$(classRoom).modal('hide');
	console.log(classRoom);
    },
    saveRoom: function(){
	var classRoom = '.' + this.props.classRoom;
	console.log(classRoom);
	$(classRoom).modal('hide');
	$('.add.basic').modal({closable: true}).modal('hide');
	this.props.editRoom('save');
	return true
    },
    cancelRoom: function(){
	var classRoom = '.' + this.props.classRoom;
	console.log(classRoom);
	$(classRoom).modal('hide');
	$('.add.basic').modal({closable: true}).modal('hide');
	console.log('cancel');
	return true
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
	var classRoom = classNames(this.props.classRoom, 'basic');
	var deleteButton = (this.props.roomKey != 999);
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
	$(classRoom).modal('toggle');
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
	    <Room {...this.props} roomKey={this.props.room.key}/>
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
    getInitialState: function(){
	return {newRoom: { name: "Add Room", network: '0.0.0.0', netmask: '0',proxy: '0.0.0.0', machines: '0', key: 999, keys:[]}}
    },
    componentDidMount: function(){
	var keys = []
	for(var i=0;i< this.props.rooms.length+10;i++){
	    keys.push(Math.random().toString(36).substring(4));
	}
	this.setState({keys: keys})
    },
    addRoom: function(){
	this.props.updateStateRoomKey(999)
	$('.add.basic').modal({closable: false,
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
	var syncTab ='';
	this.rooms = this.props.rooms.map(function(room,i){
	    syncTab = this.state.keys[i];
		 return <RoomItem {...this.props} key={i} keyRoom={room.key} room={room} classRoom={syncTab}/>;
		},this);
    },
    render: function(){
	var Table = Semantify.Table;
	var Icon = Semantify.Icon;
	var Grid = Semantify.Grid;
	var Button = Semantify.Button;
	var syncTab = '';
	var rooms = this.props.rooms.map(function(room,i){
	    syncTab = this.state.keys[i];
		 return <RoomItem {...this.props} key={i} keyRoom={room.key} room={room} classRoom={syncTab}/>;
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
		<Room {...this.props} name="Add Room" classRoom="add" editRoom={this.props.editRoom} room={this.state.newRoom}/>
	        </Button>
		</Grid>
		</div>
	);
    }
});
