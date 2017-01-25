var React = require('react');
var PropTypes = React.PropTypes;

var Message = React.createClass({
  propTypes: {
    text: PropTypes.string,
  },
  render: function(){
    return (
      <div className="ui message">
        <p>{this.props.text}</p>
      </div>
    )
  }
});


module.exports = Message;
