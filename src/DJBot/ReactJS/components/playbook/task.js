var React = require("react");

import { Accordion, Button, Form, Grid, Header, Icon, Input, Item, Modal, Segment, Select} from 'semantic-ui-react';


var Parameter = React.createClass({
  componentDidMount: function(){
    this.loadParams(this.props.param, this.props.name, this.props.value);
  },
  componentWillReceiveProps: function(nextProp){
    this.loadParams(nextProp.param, nextProp.name, nextProp.value);
  },
  loadParams: function(param, name, value){
    this.newInput = <Input fluid name={name} placeholder=''
                           onChange={this.props.changeConfiguration}
                           value={value} />
    if(param['default']){
      this.newInput = <Input fluid name={name} placeholder={param['default']}
                             onChange={this.props.changeConfiguration}
                             value={value} />
    }
    if(param['choices']){
      this.options = param['choices'].map(function(opt){
        return {key: opt, text: opt, value: opt}
      });
      if(value == undefined){
        value = param['default'];
      }
      this.newInput =  <Select fluid name={name} options={this.options}
                               onChange={this.props.changeConfiguration}
                               value={value} />
    }
    this.setState({input: this.newInput });

  },
  getInitialState: function(){
    return({input: ''});
  },
  render: function(){
    return(
      <div>
        {this.state.input}
      </div>
    )
  }
});

var ListOptions = React.createClass({
  componentDidMount: function(){
    this.loadOptions(this.props.options)
  },
  componentWillReceiveProps: function(nextProps){
    if(nextProps.options){
      this.loadOptions(nextProps.options)
    }
  },
  loadOptions: function(options){
    if (options instanceof Array){
      this.options = options;
    }
    else{
      this.options = Object.keys(options)
    }
    this.options = this.options.map(function(option, i){
      return <Item.Content key={i}>{option}</Item.Content>
    });
    this.setState({options: this.options})
  },
  getInitialState: function(){
    return({options: ''})
  },
  render: function(){
    return(
      <Item>
        {this.state.options}
      </Item>
    );
  }
});

var AnExample = React.createClass({
  componentDidMount: function(){
    this.update(this.props.parameters);
  },
  componentWillReceiveProps: function(nextProps){
    this.update(nextProps.parameters);
  },
  function(variable){

  },
  update: function(parameters){
    this.keys = Object.keys(parameters);
    this.exampleCode = this.keys.map(function(conf, i){
      var value = parameters[conf];
      if (function(value){return value === false || value === true}){
        value = value.toString();
      }
      return <p key={i}> <b>{conf}:</b> <i>{value}</i></p>
    });
    this.setState({exampleCode: this.exampleCode});
  },
  getInitialState: function(){
    return({exampleCode: ''});
  },
  render: function(){
    return(
      <Accordion>
        <Accordion.Title>
          <Icon name='dropdown' />
          {this.props.name}
        </Accordion.Title>
        <Accordion.Content>
          <Segment padded='very'>
            {this.state.exampleCode}
          </Segment>
        </Accordion.Content>
      </Accordion>
    );
  }
});

var Examples = React.createClass({
  componentDidMount: function(){
    this.update(this.props);
  },
  componentWillReceiveProps: function(nextProps){
    this.update(nextProps);
  },
  update: function(props){
    this.examples = props.examples.map(function(example, i){
      return <AnExample key={i} name={example.name}
                        module={props.module}
                        parameters={example[props.module]} />
    });
    this.setState({examples: this.examples});
  },
  getInitialState: function(){
    return({
      examples: '',
    });
  },
  render: function(){
    return(
      <Accordion>
        <Accordion.Title>
          <Header as="h3" textAlign="left" >
            Examples
            <Icon name='dropdown' /></Header>
        </Accordion.Title>
        <Accordion.Content>
          <Segment raised color='blue'>
            {this.state.examples}
          </Segment>
        </Accordion.Content>
        </Accordion>
    );
  }
});


var Parameters = React.createClass({
  componentWillReceiveProps: function(nextProps){
    if(nextProps.moduleDoc.options){
      this.keys = Object.keys(nextProps.moduleDoc.options)
      this.parameters = this.keys.map(function(param, i){
        return (
          <Grid.Row key={i} >
            <Grid.Column width={5}>
              <Form.Field required={nextProps.moduleDoc.options[param]['required']}>
                <label>{param}</label>
                <Parameter param={nextProps.moduleDoc.options[param]}
                           changeConfiguration={this.props.changeConfiguration} name={param} value={this.props.configuration[param]} />
              </Form.Field>
            </Grid.Column>
            <Grid.Column width={11}>
              {nextProps.moduleDoc.options[param]['description']}
            </Grid.Column>
          </Grid.Row>
        )
      }, this);
      this.setState({parameters: this.parameters});
    }
  },
  getInitialState: function(){
    return ({
      parameters: "Please select a module and you will see here the parms"
    })
  },
  render: function(){
    return(
      <Segment padded>
        {this.props.moduleDoc.module &&
          <Grid width={16}>
              <Grid.Row>
                  <Grid.Column>
                      <Header as="h2" textAlign="center">
                          {this.props.moduleDoc.module}
                        </Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={14}>
                        {this.props.moduleDoc.short_description}
                      </Grid.Column>
                      <Grid.Column width={1} textAlign="right">
                          <Modal trigger={<Button icon="info"
                                                    color="blue"
                                                    inverted
                                                    />} >
                              <Modal.Header> {this.props.moduleDoc.module}</Modal.Header>
                                <Modal.Content>
                                    <ListOptions options={this.props.moduleDoc.description}/>
                                  </Modal.Content>
                            </Modal>
                        </Grid.Column>
                  </Grid.Row>
            </Grid>
          }
          <Form>
            {this.props.moduleDoc.examples &&
              <Examples examples={this.props.moduleDoc.examples}
                        module={this.props.moduleDoc.module} />
              }
              <Segment padded raised>
                <Grid columns={2}>

                  {this.state.parameters}
                </Grid>
              </Segment>
          </Form>
      </Segment>
    );
  }
});

var Categories = React.createClass({
  componentWillReceiveProps: function(nextProps){
    this.categories = nextProps.categories.map(function(category){
      return {key: category, text: category, value: category}
    });

    this.setState({categories: this.categories})
  },
  getInitialState: function(){
    return({categories: []});
  },
  render: function(){
    return(
      <Select placeholder='All' search floating item
              scrolling options={this.state.categories}
              onChange={this.props.selectCategory}/>
    );
  }
});

var Task = React.createClass({
  getDefaultProps: function(){
    return ({
      transparent: true,
    });
  },
  getInitialState: function(){
    return ({
      modules: [],
    });
  },
  componentWillReceiveProps: function(nextProp){
    if (nextProp.modules){
      const options = nextProp.modules.map(function(module){
        return {key: module, value: module, text: module}
      });
      this.setState({modules: options});
    }
    if (nextProp.module != this.props.module){
      this.props.getModule(nextProp.module);
    }
  },
  selectModule: function(e, module){
    this.props.getModule(module['value']);
    this.props.cleanConfiguration();
  },
  render: function(){
    const header = this.props.header + ' Task';
    return(
      <Grid centered>
        <Grid.Row>
        <Grid.Column width={16}>
          <Header content={header} />
          A task is a special configuration of a module
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={10}>
            <Segment loading={this.props.loading}
                     textAlign="left" raised attached>
              <Input fluid transparent={this.props.transparent}
                     type="text" value={this.props.name}
                     label={{ribbon: true, color: "blue",
                     content: "Task Name"}}
                     placeholder="Write the name of the task"
                     onChange={this.props.changeName} />
            </Segment>
          </Grid.Column>
          <Grid.Column width={6}>
           Choose a category to see the modules available
            <Categories categories={this.props.categories}
                        selectCategory={this.props.selectCategory}
                        />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Segment loading={this.props.loading}>
              <label> Module </label>
              <Select search fluid placeholder="Select the module..."
                      options={this.state.modules}
                      value={this.props.module}
                      onChange={this.selectModule} />
            </Segment>
            <Parameters moduleDoc={this.props.moduleDoc}
                        configuration={this.props.configuration}
                        changeConfiguration={this.props.changeConfiguration} />
            <Segment>
              #TODO: Parameter to the task
              when, ignore_errors, register
            </Segment>
        <Button basic color="green" fluid icon="save"
                attached="bottom" content="Save"
                onClick={this.props.saveAction}/>
        </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
});

module.exports = Task;
