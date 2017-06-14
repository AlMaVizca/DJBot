var React = require("react");
var Results = require("../components/results");

var ResultsContainer = React.createClass({
  getInitialState: function(){
    return({results: []});
  },
  componentDidMount: function() {
    this.resultsReload();
  },
  resultsReload: function(){
    $.ajax({
      url: "/api/results",
      dataType: 'json',
      cache: false,
      success: function(data) {
	this.setState({results: data["results"]});
      }.bind(this),
      error: function(xhr, status, err) {
	console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function(){
    return(
      <Results results={this.state.results} />
    );
  }
});

module.exports = ResultsContainer;
