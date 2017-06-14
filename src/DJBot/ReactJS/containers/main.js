var React = require("react");
var Main = require("../components/main")

var MainContainer = React.createClass({
    render: function() {
	return (
          <Main children={this.props.children} />
	);
    }
});

module.exports = MainContainer;
