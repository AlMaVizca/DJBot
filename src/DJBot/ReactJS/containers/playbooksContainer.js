var React = require("react");
var PropTypes = React.PropTypes;

var Playbooks = require("../components/playbooks");

var PlaybooksContainer = React.createClass({
  getInitialState: function(){
    return ({
      playbooks: [],
      messageMode: -1,
      messageText: '',
      });
  },
  componentDidMount: function(){
    this.playbooksLoad();
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
  playbookDelete: function(key){
    this.setState({open: false});
    $.ajax({
      url: '/api/playbook/delete',
      dataType: 'json',
      type: 'POST',
      data: {key: key},
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/playbook/delete', status, err.toString());
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
                 playbookDelete={this.playbookDelete}
                 />
    );
  }
});


module.exports = PlaybooksContainer;
