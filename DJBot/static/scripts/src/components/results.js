var React = require("react");
var PropTypes = React.PropTypes;

var Description = React.createClass({
    render: function(){
        return(
                <p><div className="ui black basic label">{this.props.name}</div>{this.props.value}</p>
        );
    }
});

var Facts = React.createClass({
    render: function(){
        return(
                <div>
                <Description name="Hostname" value={this.props.ansible_facts.ansible_hostname} />
                <Description name="Distribution" value={this.props.ansible_facts.ansible_distribution} />
                <Description name="Arch" value={this.props.ansible_facts.ansible_machine} />
                <Description name="Cores" value={this.props.ansible_facts.ansible_processor_cores} />
                <Description name="Memory" value={this.props.ansible_facts.ansible_memtotal_mb.toString()} />
                <Description name="Memory Free" value={this.props.ansible_facts.ansible_memfree_mb.toString()} />
                </div>

        );
    }
});


var TaskSegment = React.createClass({
    render: function(){
	return(
		<div className="ui segment">
		{this.props.data}
		</div>
	);
    }
});


var ResultItem = React.createClass({
    render: function(){
	return(
		<div className="item" data-tab={this.props.tab}>
		{this.props.name}
	    </div>
	);
    }
});


function Results(props){
  var executionResults = '';
  var executionNames = '';
  var keys = '';
  if (props.results.length > 0){
    executionNames = props.results.map(function(result, i){
      keys = props.keys[i];
      return <ResultItem key={i} name={result.name} tab={keys}/>;
    });
    executionResults = props.results.map(function(result, i){
      keys = props.keys[i];
      return <ResultContent key={i} name={result.name} tab={keys}/>;
    });
  }
  return(
    <div>
	<div className="ui sixteen wide column">
	      <input type="hidden" name="result" />
	      <i className="dropdown icon"></i>
	      <span className="text">Select Results</span>
	      <div className="menu">
		{executionNames}
	      </div>
	    <div className="ui animated fade blue button" tabindex="0" onClick={props.resultsReload}>
	      <div className="hidden content">update</div>
	      <div className="visible content">
	      </div>
	    </div>
	  {executionResults}
	</div>
    </div>
  );
};


Results.propTypes = {
  results: PropTypes.array.isRequired,
  resultsReload: PropTypes.func.isRequired,
};

module.exports = Results;
