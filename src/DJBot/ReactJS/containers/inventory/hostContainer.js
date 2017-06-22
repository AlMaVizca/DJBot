var React = require('react');

var Host = require('../../components/inventory/host');

var HostContainer = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function(){
    return({
      key: 0,
      user: 'root',
      private_key: 'id_rsa',
      keys: [],
      name: '',
      ip: '',
      note: '',
      password: '',
      messageMode: -1,
      messageText: '',
      hosts: {}
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
  componentDidMount: function(){
    this.keysGet();
    var query = this.props.location.query;
    if(query.id){
      this.load(query.id);
      this.status(query.id);
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
        console.error("/api/inventory/host/get", status,
                      err.toString());
      }.bind(this)
    });
  },
  save: function(){
    $.ajax({
      url: "/api/inventory/host/new",
      dataType: 'json',
      type: 'POST',
      data: {
        key: this.state.key,
        name: this.state.name,
        ip: this.state.ip,
        user: this.state.user,
        private_key: this.state.private_key,
        note: this.state.note,
      },
      success: function(data) {
        this.status(this.state.key);
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/inventory/host/new", status,
                      err.toString());
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
        console.error('/api/inventory/host/delete', status,
                      err.toString());
      }.bind(this)
    });
  },
  status: function(id){
    $.ajax({
      url: "/api/inventory/host/info",
      dataType: 'json',
      type: 'POST',
      data: {key: id},
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/inventory/host/info", status,
                      err.toString());
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
        room: false,
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
  goBack: function(){
    this.context.router.goBack();
  },
  render: function(){
    return(
      <Host id={this.state.key}
            user={this.state.user}
            private_key={this.state.private_key}
            name={this.state.name}
            keys={this.state.keys}
            ip={this.state.ip}
            note={this.state.note}
            host={this.state.hosts}
            password={this.state.password}
            delete={this.delete}
            save={this.save}
            back={this.goBack}
            sshCopy={this.sshCopy}
            changeOption={this.changeOption}
            messageMode={this.state.messageMode}
            messageText={this.state.messageText}
            />
    );
  }
});

module.exports = HostContainer;
