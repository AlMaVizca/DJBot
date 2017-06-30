var React = require('react');
import { Accordion, Button, Grid, Header, Item, Modal, Segment, Select} from 'semantic-ui-react';

var Modules = React.createClass({
  componentWillReceiveProps: function(nextProps){
    if(nextProps.modules){
      this.modules = nextProps.modules.map(function(module){
        return {key: module, text: module, value: module}
      });
      this.setState({modules: this.modules});
      if(this.modules.length > 0){
        this.setState({disabled: false,
                      placeholder: "Select Module in " + nextProps.category_name
                     });
      }
    }
  },
  getInitialState: function(){
    return({modules: [],
            disabled: true,
           });
  },
  render: function(){
    return(
      <Select placeholder={this.state.placeholder} search floating item
              scrolling options={this.state.modules}
              disabled={this.state.disabled}
              onChange={this.props.selectModule}/>
    );
  }
});


var Categories = React.createClass({
  componentDidMount: function(){
    this.props.loadCategories();
  },
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
      <Select placeholder='Select Category' search floating item
              scrolling options={this.state.categories}
              onChange={this.props.selectCategory}/>
    );
  }
});

var Requirements = React.createClass({
  componentWillReceiveProps: function(nextProps){
    if(nextProps.requirements){
      this.requirements = nextProps.requirements.map(function(req){
        return <Item.Content>req</Item.Content>
      });
      this.setState({requirements: this.requirments})
    }

  },
  getInitialState: function(){
    return({requirements: ''})
  },
  render: function(){
    return(
      <Item>
        {this.state.requirements}
      </Item>
    );
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
    this.options = this.options.map(function(option){
      return <Item.Content>{option}</Item.Content>
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


var Docs = React.createClass({
  render:function(){
    return(
      <div>
        <Header as="h3" textAlign="centered">
          {this.props.docs.module}
        </Header>
        <Grid width={9}>
        <Grid.Row>
          <Grid.Column width={14}>

            {this.props.docs.short_description}
          </Grid.Column>
          <Grid.Column width={1} textAlign="right">
            <Modal trigger={<Button icon="info circular" color="blue"
                                    inverted circular />} >
              <Modal.Header> {this.props.docs.module}</Modal.Header>
              <Modal.Content>
                <ListOptions options={this.props.docs.description}/>
              </Modal.Content>
            </Modal>
          </Grid.Column>
        </Grid.Row>
        <Grid.Column width={12}>

        </Grid.Column>
        <Grid.Column width={3}>
          <Requirements requirements={this.props.docs.requirements}/>
        </Grid.Column>
        <Grid.Row>
          <Grid.Column>
          </Grid.Column>
          <Grid.Column>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      </div>
    );
  }
});

var Examples = React.createClass({
  componentWillReceiveProps: function(nextProps){
    if(nextProps.examples){
      this.examples = nextProps.examples.map(function(example){
        return {title: example.name,
                content: example.name}
      });
    }
    this.setState({examples: this.examples});
  },
  getInitialState: function(){
    return ({ examples: []});
  },
  render: function(){
    return(
      <Accordion panels={this.state.examples} styled />
    );
  }
});

var TaskDocs = React.createClass({
  render: function(){
    return(
      <Grid.Column width={10}>
        <Header content="Module Docs" />
        Please select a module to see the documentation
        <Segment.Group>
          <Segment raised>
            <Categories categories={this.props.categories}
                        loadCategories={this.props.loadCategories}
                        selectCategory={this.props.selectCategory}
                        />
            <Modules category_name={this.props.category_name}
                     modules={this.props.modules}
                     selectModule={this.props.selectModule}
                     />
          </Segment>
          <Segment>
            {this.props.module_doc.module ? (
              <Docs docs={this.props.module_doc} />
            ) : (
              <div>
                Please select a category and after a module to see his docs
              </div>
            )}
      </Segment>
        <Segment>
        <Header as="h4">Examples</Header>
        <Examples examples={this.props.module_doc.examples}
                  name={this.props.module_doc.module}/>
        </Segment>
        </Segment.Group>
      </Grid.Column>
    )
  }
});

module.exports = TaskDocs;
