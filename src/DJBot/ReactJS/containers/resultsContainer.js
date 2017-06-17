var React = require("react");
var Results = require("../components/results");

var ResultsContainer = React.createClass({
  getInitialState: function(){
    return({results: [],
            result:{
              item: 1,
              username: 'a',
              playbook: 'b',
              room: 'c',
              datetime: 'd',
              loading: true,
            }
           });
  },
  componentDidMount: function() {
    this.resultsReload();
  },
  resultsReload: function(){
    $.ajax({
      url: "/api/action/results",
      dataType: 'json',
      cache: false,
      success: function(data) {
	this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
	console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  resultGet: function(item){
    $.ajax({
      url: "/api/action/result",
      dataType: 'json',
      type: "POST",
      data: {
        key: item
      },
      success: function(data) {
        data['loading'] = false;
	this.setState({result: data});
      }.bind(this),
      error: function(xhr, status, err) {
	console.error("api/action/result", status, err.toString());
      }.bind(this)
    });
  },
  render: function(){
    return(
      <Results results={this.state.results}
               result={this.state.result}
               resultGet={this.resultGet}/>
    );
  }
});

module.exports = ResultsContainer;
