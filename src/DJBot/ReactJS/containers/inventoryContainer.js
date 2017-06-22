var React = require("react");
var Inventory = require("../components/inventory")

var InventoryContainer = React.createClass({
  getInitialState: function(){
    return {rooms:[],
            tasks:[],
            hosts:[],
           }
  },
  runAdd: function(){
    $.ajax({
      url: "/api/run",
      dataType: 'json',
      type: 'POST',
      data: {tasks: this.state.tasks,
             rooms: this.state.rooms },
	success: function(data) {
	  this.setState({message: data["message"]});
	}.bind(this),
      error: function(xhr, status, err) {
	console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  inventoryGet: function(){
    $.ajax({
      url: "/api/inventory/all",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState(data);
        // rooms and hosts
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

  componentDidMount: function(){
    this.inventoryGet();
  },
  render: function(){
    return(
      <Inventory roomList={this.state.rooms}
                 hostList={this.state.hosts} />
    );
  }
});


module.exports = InventoryContainer;
