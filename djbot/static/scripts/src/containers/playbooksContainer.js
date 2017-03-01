var React = require("react");
var PropTypes = React.PropTypes;

var Playbooks = require("../components/playbooks");

var PlaybooksContainer = React.createClass({
  getInitialState: function(){
    return ({
      taskName: "",
      taskDescription: "",
      taskId: "",
      playbooks: []
      });
  },
  componentDidMount: function(){
    this.playbooksLoad();
  },
  playbooksLoad: function() {
    $.ajax({
      url: "/api/playbooks",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/playbooks", status, err.toString());
      }.bind(this)
    });
  },
  updateMessage: function(data){
    this.setState(data);
  },
  render: function(){
    return(
      <Playbooks playbooks={this.state.playbooks}
                 load={this.playbooksLoad}
                 messageMode={this.state.messageMode}
                 messageText={this.state.messageText}
                 updateMessage={this.updateMessage}
                 />
    );
  }
});


module.exports = PlaybooksContainer;
