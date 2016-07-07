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
		<div className="ui message">
		<p>{this.props.message}</p>
		</div>
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
		Password
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
		<Button className="inverted green basic active approve" onClick={this.props.userSave}>Save</Button>
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

	document.getElementById('newpass').value='';
	document.getElementById('oldpass').value='';
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
	return {key: 999, username: "", email: "", old: "", password:"", replypw:"", admin: true, message: ''}
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
		<User username={this.state.username} email={this.state.email} key={this.state.key} userSave={this.userSave} changeName={this.changeName} changeEmail={this.changeEmail} message={this.state.message}/>
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

