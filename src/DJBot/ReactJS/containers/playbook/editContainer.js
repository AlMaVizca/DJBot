var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var PlaybookEdit = require("../../components/playbook/edit");

var PlaybookEditContainer = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  changeDescription: function(e){
    this.setState({playbookDescription: e.target.value});
  },
  changeName: function(e){
    this.setState({playbookName: e.target.value});
  },
  componentWillMount: function(){
    var query = this.props.location.query;
    if (query.id){
      this.loadPlaybook(query.id);
    }
  },
  clearTask: function(){
    this.setState({
      playbookDescription: "",
      playbookName: "",
      playbookId: "",
      tasks: []
    });
  },
  loadPlaybook: function(id){
    $.ajax({
      url: "/api/playbook/get",
      dataType: "json",
      type: "POST",
      data: {
        key: id
      },
      success: function(data) {
        if(data.messageMode){
          this.context.router.push("/playbooks");
          return;
        }
        this.setState({
          playbookId: data.key,
          playbookName: data.name,
          playbookDescription: data.description,
          tasks: data.tasks,
          saveAction: this.playbookSave
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/playbook/get", status, err.toString());
      }.bind(this)
    });
  },
  load: function(){
    this.loadPlaybook(this.state.playbookId);
  },
  getInitialState: function(){
    return({
      playbookDescription: "",
      playbookName: "",
      playbookId: "",
      tasks: [],
      saveAction: this.playbookNew
    });
  },
  playbookNew: function(){
    $.ajax({
      url: "/api/playbook/new",
      dataType: "json",
      type: "POST",
      data: {
        name: this.state.playbookName,
        description: this.state.playbookDescription
      },
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/playbook/new", status, err.toString());
      }.bind(this)
    });
    this.context.router.push("/playbooks");
  },
  playbookSave: function(){
    $.ajax({
      url: "/api/playbook/save",
      dataType: "json",
      type: "POST",
      data: {
        key: this.state.playbookId,
        name: this.state.playbookName,
        description: this.state.playbookDescription
      },
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/playbook/save", status, err.toString());
      }.bind(this)
    });
    this.context.router.push("/playbooks");
  },
  render: function(){
    return (
      <PlaybookEdit header={this.props.route.header}
                    id={this.state.playbookId}
                    name={this.state.playbookName}
                    changeName={this.changeName}
                    description={this.state.playbookDescription}
                    changeDescription={this.changeDescription}
                    saveAction={this.state.saveAction}
                    tasks={this.state.tasks}
                    load={this.load} />
    );
  }
});


module.exports = PlaybookEditContainer;
