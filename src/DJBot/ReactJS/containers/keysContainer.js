var React = require("react");
var Keys = require("../components/keys")


var KeysContainer = React.createClass({
  changeOption: function(e) {
    var data = {}
    data[e.target.name] = e.target.value;
    this.setState(data);
  },
  getInitialState: function(){
    return({
      name: '',
      keys: [],
    })
  },
  create: function(){
    $.ajax({
      url: "/api/settings/key_new",
      dataType: "json",
      type: "POST",
      data: {
        name: this.state.name
      },
      success: function(data) {
        data['name'] = '';
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/settings/key_new", status, err.toString());
      }.bind(this)
    });
  },
  keyDelete: function(name){
    $.ajax({
      url: "/api/settings/key_delete",
      dataType: "json",
      type: "POST",
      data: {
        name: name
      },
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/settings/key_delete", status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
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

  render: function(){
    return(
      <Keys name={this.state.name}
            changeOption={this.changeOption}
            create={this.create} keyDelete={this.keyDelete}
            keys={this.state.keys}/>
    );
  }
});

module.exports = KeysContainer;
