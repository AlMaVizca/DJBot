var React = require("react");
var PropTypes = React.PropTypes;


var ResultItem = React.createClass({
    render: function(){
	return(
		<div className="item" data-tab={this.props.tab}>
		{this.props.name}
	    </div>
	);
    }
});


var ModulePopup = React.createClass({
  componentWillReceiveProps: function(nextProps){
    this.keys = Object.keys(nextProps.args);
    if (this.keys){
      this.parameters = this.keys.map(function(prop,i){
	if (nextProps.args[prop] != null){
	  this.value = nextProps.args[prop].toString();
	  return <Description key={i} name={prop} value={this.value} />
	}
      },this);
      this.setState({parameters: this.parameters})
    }
  },
  getInitialState: function(){
    return ({parameters: []})
  },
  render: function(){
    return(
      <div>
	{this.state.parameters}
      </div>
    );
  }
});


function Results(props){
  return(
    <div>
      #TODO
    </div>
  );
};


Results.propTypes = {
  results: PropTypes.array.isRequired,
};

module.exports = Results;
