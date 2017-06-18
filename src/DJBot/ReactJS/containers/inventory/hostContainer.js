var React = require('react');

var Host = require('../../components/inventory/host');

var HostContainer = React.createClass({
  getInitialState: function(){
    return({
      key: 0,
      name: '',
      ip: '',
      note: '',
      messageMode: -1,
      messageText: '',
    });
  },
  componentDidMount: function(){
    var query = this.props.location.query;
    if(query.id){
      this.load(query.id);
    }
  },
  changeOption: function(e) {
    var data = {}
    data[e.target.name] = e.target.value;
    this.setState(data);
  },
  load: function(id){
    $.ajax({
      url: "/api/inventory/host/get",
      dataType: 'json',
      type: 'POST',
      data: {key: id},
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/playbook/all", status, err.toString());
      }.bind(this)
    });
  },
  save: function(){
    $.ajax({
      url: "/api/inventory/host/new",
      dataType: 'json',
      type: 'POST',
      data: {
        name: this.state.name,
        ip: this.state.ip,
        note: this.state.note,
      },
      success: function(data) {
        if(data['status'])
          this.context.router.goBack();
        else
          this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/playbook/all", status, err.toString());
      }.bind(this)
    });
  },
  delete: function(){
    $.ajax({
      url: '/api/inventory/host/delete',
      dataType: 'json',
      type: 'POST',
      data: {key: this.state.key},
      success: function(data) {
        if(data['status'])
          this.context.router.goBack();
        else
          this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/playbook/delete', status, err.toString());
      }.bind(this)
    });
  },
  render: function(){
    return(
      <Host id={this.state.key}
            name={this.state.name}
            ip={this.state.ip}
            note={this.state.note}
            changeOption={this.changeOption}
            messageMode={this.state.messageMode}
            messageText={this.state.messageText}
            />
    );
  }
});

module.exports = HostContainer;
