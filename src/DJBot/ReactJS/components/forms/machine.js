var React = require("react");
var PropTypes = React.PropTypes;

import { Form, Input, TextArea } from "semantic-ui-react";

var Machine = React.createClass({
  render: function(){
    return (
      <Form>
        <Form.Field required control={Input} label="Name"
                    name="name" value={this.props.name}
                    placeholder='name' type="text"
                    onChange={this.props.changeOption} />

        <Form.Field required control={Input} label="Ip"
                    value={this.props.ip} name="ip"
                    placeholder="192.168.0.1" type="text"
                    onChange={this.props.changeOption} />

        <Form.Field label="Note" type="note"
                    value={this.props.note} name="note"
                    control={TextArea}
                    onChange={this.props.changeOption} />
      </Form>
    );
  }
});

module.exports = Machine;
