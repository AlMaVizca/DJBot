var React = require("react");
var Play = require("../components/play");

var PlayContainer = React.createClass({
  componentWillMount: function(){
    var query = this.props.location.query;
    this.playbooksLoad();

    if (query.room){
      this.roomLoad(query.room);
      this.machinesOn(query.room);
    }
    if (query.host){
      this.hostLoad(query.host);
    }
  },
  getInitialState: function(){
    return({key: -1,
            name:'',
            playbooks:[],
            hosts: [],
            loading: true,
            isRoom: true,
           });
  },
  machinesOn: function(id){
    $.ajax({
      url: "/api/inventory/get_machines",
      dataType: "json",
      type: "POST",
      data: {
        key: id
      },
      success: function(data) {
        if (Object.keys(data.hosts.ok).length > 0)
        this.setState({
          hosts: Object.keys(data.hosts.ok),
          loading: false,
        })
        else
          this.setState({loading: false});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/task/get", status, err.toString());
      }.bind(this)
    });
  },
  hostLoad: function(id){
    $.ajax({
      url: "/api/inventory/host/info",
      dataType: 'json',
      type: 'POST',
      data: {key: id},
      success: function(data) {
        data['loading'] = false;
        // Change the data for compatibility
        data['info'] = data['hosts'];
        data['hosts'] = Object.keys(data.hosts.ok);
        data['isRoom'] = false;
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/inventory/host/info", status,
                      err.toString());
      }.bind(this)
    });
  },
  roomLoad: function(id){
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
  playbooksLoad: function() {
    $.ajax({
      url: "/api/playbook/all",
      dataType: 'json',
      cache: true,
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/playbook/all", status, err.toString());
      }.bind(this)
    });
  },
  play: function(room, playbook){
    $.ajax({
      url: "/api/action/run",
      dataType: 'json',
      type: "POST",
      data: {
        key: room,
        playbook: playbook,
        isRoom: this.state.isRoom
      },
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/action/run", status, err.toString());
      }.bind(this)
    });
  },
  render: function(){
    return(
      <Play name={this.state.name}
            id={this.state.key}
            network={this.state.network}
            netmask={this.state.netmask}
            machines={this.state.machines}
            hosts={this.state.hosts}
            isRoom={this.state.isRoom}
            playbooks={this.state.playbooks}
            messageMode={this.state.messageMode}
            messageText={this.state.messageText}
            play={this.play}
            loading={this.state.loading}
            />
    );
  }
});

module.exports = PlayContainer;
