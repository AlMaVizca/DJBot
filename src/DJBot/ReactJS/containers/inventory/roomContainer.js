var React = require("react");
var Room = require("../../components/inventory/room");

var RoomContainer = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },
  getInitialState: function(){
    return {name: "",
            network: "",
            netmask: "",
            machines: "",
            gateway: "",
            user: "root",
            private_key: "id_rsa",
            keys: [],
            password: "",
            rows: 5,
            columns: 3,
            loading: true,
            hosts: {ok: {}, failed: {}, unreachable: {}},
           }
  },
  componentDidMount: function(){
    var query = this.props.location.query;
    this.keysGet();
    if(query.id){
      this.load(query.id);
      this.machines(query.id);
    }
  },
  save: function(){
    const name = this.state.name.trim();
    const machines = this.state.machines;
    const network = this.state.network.trim();
    const netmask = this.state.netmask.trim();
    const gateway = this.state.gateway.trim();
    const user = this.state.user.trim();
    const private_key = this.state.private_key.trim();

    if (!name || !machines || !network || !netmask || !gateway || !private_key || !user ){
      console.log('Missing value');
      return;
    }
    var room = {name: name, machines: machines, network: network, netmask: netmask, gateway: gateway, user: user, private_key: private_key};
    if(this.state.key)
      room['key'] = this.state.key;
    $.ajax({
      url: "/api/inventory/new",
      dataType: 'json',
      type: 'POST',
      data: room,
      success: function(data) {
        this.setState(data);
        this.machinesOn(data['room']);
      }.bind(this),
      error: function(xhr, status, err) {
	console.error("/api/inventory/new", status, err.toString());
      }.bind(this)
    });
  },
  goBack: function(id){
    this.context.router.goBack();
  },
  load: function(id){
    $.ajax({
      url: "/api/inventory/get",
      dataType: 'json',
      type: "POST",
      data: {
        key: id
      },
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  changeOption: function(e) {
    var data = {}
    data[e.target.name] = e.target.value;
    this.setState(data);
  },
  machines: function(id){
    $.ajax({
      url: "/api/inventory/get_machines",
      dataType: "json",
      type: "POST",
      data: {
        key: id
      },
      success: function(data) {
        if (data.hosts){
          data['loading']= false;
          this.setState(data);
        } else
          this.setState({loading: false});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/task/get", status, err.toString());
      }.bind(this)
    });
  },
  keysGet: function(){
    $.ajax({
      url: "/api/settings/keys",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/settings/keys", status, err.toString());
      }.bind(this)
    });
  },
  sshCopy: function(){
    $.ajax({
      url: "/api/inventory/copy",
      dataType: 'json',
      type: "POST",
      data: {
        key: this.state.key,
        password: this.state.password,
      },
      success: function(data) {
        data['password'] = '';
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({password: ''});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function(){
    return (
      <Room name={this.state.name}
            machines={this.state.machines}
            network={this.state.network}
            netmask={this.state.netmask}
            gateway={this.state.gateway}
            loading={this.state.loading}
            user={this.state.user}
            privateKey={this.state.private_key}
            keys={this.state.keys}
            columns={this.state.columns}
            rows={this.state.rows}
            hosts={this.state.hosts}
            changeOption={this.changeOption}
            sshCopy={this.sshCopy}
            save={this.save}
            back={this.goBack}
            />
    )
  }
 });


module.exports = RoomContainer;

