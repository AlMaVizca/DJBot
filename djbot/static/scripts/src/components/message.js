var React = require('react');
var PropTypes = React.PropTypes;
import { Message } from "semantic-ui-react";

var ShowMessage = React.createClass({
  propTypes: {
    mode: PropTypes.number,
    text: PropTypes.string
  },
  getInitialState: function(){
    return ({message: <Message hidden/>});
  },
  componentWillReceiveProps: function(){
    var message;
    switch(this.props.mode)
    {
      case 0: this.setState({message: <Message success>Changes saved</Message>});
      break;
      case 1: this.setState({message: <Message error>Wrong password</Message>});
      break;
      case 2: this.setState({message: <Message color="red">Failed to save changes</Message>});
      break;
      default: this.setState({message: <Message hidden/>});
      }
  },
  getDefaultProps: function() {
    return {
      mode: 10
    };
  },
  render: function(){
    return (
      <div>
        {this.state.message}
      </div>
    )
  }
});


module.exports = ShowMessage;
