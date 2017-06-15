var React = require("react");

var Task = require("../../components/playbook/task");

var ShowMessage = require("../../components/message");
import { Grid } from 'semantic-ui-react';

var TaskContainer = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
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
    this.getCategories();
    var query = this.props.location.query;
    if(query.pbId) this.setState({id: query.pbId});
    if(query.key){
      this.setState({loading: true,
                     key: query.key,
                     saveAction: this.saveTask});
      this.loadTask(query.key);
    }
  },
  getInitialState: function(){
    return({
      messageMode: 10,
      messageText: "",
      taskName: "",
      saveAction: this.newTask,
      categories: [],
      category: "All",
      moduleDoc: "No module selected",
      modules: [],
      loading: false,
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
  getModule: function(module){
    $.ajax({
      url: 'api/task/module',
      type: "POST",
      dataType: 'json',
      data: {name: module},
      success: function(data) {
        this.setState({moduleDoc: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/task/module", status, err.toString());
      }.bind(this)
    });
  },
  getModules: function(){
    $.ajax({
      url: '/api/task/modules',
      type: "GET",
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/task/modules", status, err.toString());
      }.bind(this)
    });
  },
  cleanConfiguration: function(){
    this.setState({ configuration: {}});
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
    confs['key'] = this.state.id;
    confs['task'] = this.state.taskName;
    confs['module'] = this.state.moduleDoc.module;
    $.ajax({
      url: "/api/task/add",
      dataType: "json",
      type: "POST",
      data: confs,
      success: function(data) {
        this.context.router.goBack();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/task/add", status, err.toString());
      }.bind(this)
    });
  },
  saveTask: function(){
    var confs = this.configurationAsList();
    confs['key'] = this.state.key;
    confs['task'] = this.state.taskName;
    confs['module'] = this.state.moduleDoc.module;
    $.ajax({
      url: "/api/task/save",
      dataType: "json",
      type: "POST",
      data: confs,
      success: function(data) {
        this.context.router.goBack();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/task/save", status, err.toString());
      }.bind(this)
    });
  },
  loadTask: function(key){
    $.ajax({
      url: "/api/task/get",
      dataType: "json",
      type: "POST",
      data: {
        key: key
      },
      success: function(data) {
        this.setState({
          taskName: data.name,
          module: data.module,
          configuration: data.options,
          loading: false,
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
          data['category'] = category['value'];
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
              module={this.state.module}
              getModule={this.getModule}
              moduleDoc={this.state.moduleDoc}

              categories={this.state.categories}
              category={this.state.category}
              selectCategory={this.selectCategory}

              configuration={this.state.configuration}
              changeConfiguration={this.changeConfiguration}
              cleanConfiguration={this.cleanConfiguration}

              loading={this.state.loading}
              />
      </div>
    );
  }
});

module.exports = TaskContainer;
