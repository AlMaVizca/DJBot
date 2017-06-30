var React = require("react");
var Dashboard = require("../components/dashboard");

var DashboardContainer = React.createClass({
  getInitialState: function(){
    return({
      playbooks: 0,
      inventory: 0,
      results: 0,
    })
  },
  componentDidMount: function() {
    $.ajax({
      url: "/api/settings/main",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/settings/main", status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
          <Dashboard playbooks={this.state.playbooks}
                     inventory={this.state.inventory}
                     results={this.state.results}/>
    );
  }
});

module.exports = DashboardContainer;
