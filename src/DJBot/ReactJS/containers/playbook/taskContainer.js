var React = require("react");

var Task = require("../../components/playbook/task");
var TaskDocs = require("../../components/playbook/taskDocs");
var ShowMessage = require("../../components/message");
import { Grid } from 'semantic-ui-react';

var TaskContainer = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  changeConfiguration: function(e, configuration){
    var updateConf = this.state.configuration
    updateConf[configuration['name']] = configuration['value'];
    this.setState({configuration: updateConf});
  },
  changeName: function(e){
    this.setState({taskName: e.target.value});
  },
  componentDidMount: function(){
    this.getModules();
    var query = this.props.location.query;
    this.setState({id: query.pbId,
                   key: query.key});
    console.log(this.state.key);
    if(this.state.key){
      this.loadTask();
    }
  },
  getInitialState: function(){
    return({
      messageMode: 10,
      messageText: "",
      taskName: "",
      saveAction: this.newTask,
      categories: [],
      moduleDoc: "No module selected",
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
  configurationAsList: function(){
    var keys = Object.keys(this.state.configuration);
    var aConfig = {};
    var configuration = keys.map(function(key, i){
      aConfig['configuration-'+i+'-option'] = key;
      aConfig['configuration-'+i+'-value'] = this.state.configuration[key];
    }, this);
    return aConfig;
  },
  newTask: function(){
    var confs = this.configurationAsList();
    confs['playbook'] = this.state.id;
    confs['task'] = this.state.taskName;
    confs['module'] = this.state.moduleDoc.module;
    $.ajax({
      url: "/api/task/add",
      dataType: "json",
      type: "POST",
      data: confs,
      success: function(data) {
        this.context.router.push({
          pathname: "/playbook/edit",
          query: {
            id: this.state.id
          }
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/task/add", status, err.toString());
      }.bind(this)
    });
  },
  loadTask: function(){
    console.log('LoadTask');
    $.ajax({
      url: "/api/task/get",
      dataType: "json",
      type: "POST",
      data: {
        key: this.state.key
      },
      success: function(data) {
        console.log(data);
        this.setState({

        })
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/task/get", status, err.toString());
      }.bind(this)
    });
  },
  selectCategory: function(e, category){
    if (category['value'] != "All" ) {
      $.ajax({
        url: '/api/task/category',
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
        this.setState({moduleDoc: data, configuration: {}});
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
              moduleDoc={this.state.moduleDoc}
              categories={this.state.categories}
              loadCategories={this.getCategories}
              selectCategory={this.selectCategory}
              changeConfiguration={this.changeConfiguration}
              />
      </div>
    );
  }
});

module.exports = TaskContainer;
