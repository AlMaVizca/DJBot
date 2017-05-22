var React = require("react");

var Task = require("../../components/playbook/task");
var TaskDocs = require("../../components/playbook/taskDocs");
var ShowMessage = require("../../components/message");
import { Grid } from 'semantic-ui-react';

var TaskContainer = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  changeName: function(e){
    this.setState({taskName: e.target.value});
  },
  componentDidMount: function(){
    this.getModules();
  },
  componentWillMount: function(){
    var query = this.props.location.query;
    this.setState({id: query.id});
  },
  getInitialState: function(){
    return({
      messageMode: 10,
      messageText: "",
      taskName: "",
      saveAction: this.taskNew,
      categories: [],
      module_doc: "No module selected",
      modules: []
    });
  },
  getCategories: function(){
    $.ajax({
      url: 'api/task/categories',
      type: "GET",
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/task/categories", status, err.toString());
      }.bind(this)
    });
  },
    getModules: function(){
    $.ajax({
      url: 'api/task/modules',
      type: "GET",
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/task/modules", status, err.toString());
      }.bind(this)
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
  selectCategory: function(e, category){
    if (category['value'] != "All" ) {
      $.ajax({
        url: 'api/task/category',
        type: "POST",
        dataType: 'json',
        data: {name: category['value']},
        success: function(data) {
          this.setState(data);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error("/api/task/category", status, err.toString());
        }.bind(this)
      });
    }else{
      this.getModules();
    };
  },
  selectModule: function(e, module){
    $.ajax({
      url: 'api/task/module',
      type: "POST",
      dataType: 'json',
      data: {name: module['value']},
      success: function(data) {
        this.setState({module_doc: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/task/module", status, err.toString());
      }.bind(this)
    });
  },
  render: function(){
    return (
      <div>
        <ShowMessage mode={this.state.messageMode}
                     text={this.state.messageText}/>
        <Task header={this.props.route.header}
              name={this.state.taskName}
              changeName={this.changeName}
              description={this.state.playbookDescription}
              changeDescription={this.changeDescription}
              saveAction={this.state.saveAction}
              modules={this.state.modules}
              selectModule={this.selectModule}
              module_doc={this.state.module_doc}
              categories={this.state.categories}
              loadCategories={this.getCategories}
              selectCategory={this.selectCategory}
              />
      </div>
    );
  }
});

module.exports = TaskContainer;
