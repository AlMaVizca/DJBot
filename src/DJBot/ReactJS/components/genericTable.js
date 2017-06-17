var React = require('react');

import {Icon, Input, Menu, Segment, Table} from "semantic-ui-react";

var GenericTable = React.createClass({
  getDefaultProps: function(){
    return ({
      singleLine: false,
      selectable: false,
    });
  },
  render: function(){
    return(
      <Segment raised>
        <Table color="blue" striped singleLine={this.props.singleLine}
               selectable={this.props.selectable}>
          <Table.Header>
            <Table.Row>
              {this.props.header}
            </Table.Row>
          </Table.Header>
          <Table.Body>
          {this.props.data}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="2">
                {this.props.length} {this.props.description}
                <Input fluid icon="search" placeholder="Search..."  />

              </Table.HeaderCell>
              <Table.HeaderCell colSpan="2">
                <Menu floated="right" pagination>
                  <Menu.Item as="a" icon>
                    <Icon name="left chevron" />
                  </Menu.Item>

                  <Menu.Item as="a">1</Menu.Item>

                  <Menu.Item as="a" icon>
                    <Icon name="right chevron" />
                  </Menu.Item>
                </Menu>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Segment>
    );
  }
});

module.exports = GenericTable;
