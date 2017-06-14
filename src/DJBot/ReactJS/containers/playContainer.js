var React = require("react");
var Play = require("../components/play");

var PlayContainer = React.createClass({
  componentWillMount: function(){
    var query = this.props.location.query;
    if (query.room){
      this.roomLoad(query.room);
      this.machinesOn(query.room);
    }
    this.playbooksLoad();
  },
  getInitialState: function(){
    return({room: -1,
            name:'',
            playbooks:[],
            hosts: [],
            disabled: true,
            loading: true
           });
  },
  machinesOn: function(id){
        $.ajax({
      url: "/api/inventory/get_alive",
      dataType: "json",
      type: "POST",
      data: {
        key: id
      },
      success: function(data) {
        if (data.hosts.length > 0)
        this.setState({
          hosts: data['hosts'],
          disabled: false,
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
      cache: false,
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
        room: room,
        playbook: playbook,
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
            playbooks={this.state.playbooks}
            messageMode={this.state.messageMode}
            messageText={this.state.messageText}
            play={this.play}
            disabled={this.state.disabled}
            loading={this.state.loading}
            />
    );
  }
});

module.exports = PlayContainer;
