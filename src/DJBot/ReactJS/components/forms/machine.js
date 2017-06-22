var React = require("react");
var PropTypes = React.PropTypes;

import { Form, Input, Select, TextArea } from "semantic-ui-react";

var Machine = React.createClass({
  render: function(){
    return (
      <Form>
        <Form.Field required control={Input} label="Name"
                    name="name" value={this.props.name}
                    placeholder='name' type="text"
                    onChange={this.props.changeOption} />

        <Form.Field required control={Input} label="Ip or Hostname"
                    value={this.props.ip} name="ip"
                    placeholder="192.168.0.1" type="text"
                    onChange={this.props.changeOption} />

        <Form.Field required control={Input} label="Remote user"
                    placeholder="Which user?" type="text"
                    onChange={this.props.changeOption}
                    name="user" value={this.props.user} />
        <Form.Field>
          <label>
            SSH key
          </label>
          <Select required search placeholder="Which key?"
                  type="text"
                  onChange={this.props.changeOption}
                  options={this.props.keys}
                  name="privateKey"
                  value={this.props.private_key} />
        </Form.Field>

        <Form.Field label="Note" type="note"
                    value={this.props.note} name="note"
                    control={TextArea} rows={4}
                    onChange={this.props.changeOption} />

      </Form>
    );
  }
});

module.exports = Machine;
