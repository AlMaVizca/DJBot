var React = require("react");

var Task = require("../../components/playbook/task");

var TaskContainer = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  changeName: function(e){
    this.setState({taskName: e.target.value});
  },
  componentWillMount: function(){
    var query = this.props.location.query;
    this.setState({id: query.id});
  },
  getInitialState: function(){
    return({
      taskName: "",
      saveAction: this.taskNew
    });
  },
  taskNew: function(){
    $.ajax({
      url: "/api/task/new",
      dataType: "json",
      type: "POST",
      data: {
        playbookId: this.state.id,
        name: this.state.taskName
      },
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/task/new", status, err.toString());
      }.bind(this)
    });
    this.context.router.push({
      pathname: "/playbook/edit",
      query: {
        id: this.state.id
      }
    });
  },
  render: function(){
    return (
        <Task header={this.props.route.header}
              name={this.state.taskName}
              changeName={this.changeName}
              description={this.state.playbookDescription}
              changeDescription={this.changeDescription}
              saveAction={this.state.saveAction}
              />
    );
  }
});

module.exports = TaskContainer;
