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
  componentDidMount: function(){
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
          saveAction: this.save
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
  redirect: function(key){
    if(key){
      this.context.router.push({
        pathname: "/task/new",
        query: {
          pbId: key,
            }
      });
    }else{
      this.context.router.push("/playbooks");
    }
  },
  playbookNew: function(addTask){
    $.ajax({
      url: "/api/playbook/new",
      dataType: "json",
      type: "POST",
      data: {
        name: this.state.playbookName,
        description: this.state.playbookDescription
      },
      success: function(data) {
        if(addTask)
          this.redirect(data['key']);
        else
          this.redirect();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/playbook/new", status, err.toString());
      }.bind(this)
    });
  },
  save: function(addTask){
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
        if(addTask)
          this.redirect(this.state.playbookId);
        else
          this.redirect();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/playbook/save", status, err.toString());
      }.bind(this)
    });
  },
  render: function(){
    return (
      <PlaybookEdit header={this.props.route.header}
                    id={this.state.playbookId}
                    name={this.state.playbookName}
                    changeName={this.changeName}
                    description={this.state.playbookDescription}
                    changeDescription={this.changeDescription}
                    save={this.save}
                    saveAction={this.state.saveAction}
                    tasks={this.state.tasks}
                    load={this.load} />
    );
  }
});


module.exports = PlaybookEditContainer;
