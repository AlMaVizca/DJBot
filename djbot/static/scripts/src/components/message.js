var React = require('react');
var PropTypes = React.PropTypes;
import { Message } from "semantic-ui-react";

var ShowMessage = React.createClass({
  propTypes: {
    mode: PropTypes.number,
    text: PropTypes.string
  },
  getInitialState: function(){
    return ({
      success: false,
      error: false,
      hidden: true
    });
  },
  componentWillReceiveProps: function(){
    switch(this.props.mode)
    {
      case 0: this.setState({
        success: true,
        error: false,
        hidden: false
      });
      break;
      case 1: this.setState({
        error: true,
        success: false,
        hidden: false
      });
      break;
      default: this.setState({hidden: true});
      }
  },
  getDefaultProps: function() {
    return {
      mode: 10
    };
  },
  render: function(){
    return (
      <Message error={this.state.error} success={this.state.success}
               hidden={this.state.hidden}>
        {this.props.text}
      </Message>
    )
  }
});


module.exports = ShowMessage;
