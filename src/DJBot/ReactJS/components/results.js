var React = require("react");
var PropTypes = React.PropTypes;
var GenericTable = require("./genericTable");
import { Button, Grid, Header, Icon, Segment, Table } from 'semantic-ui-react';

var AnsibleResults = require("./ansibleResults");


var Result = React.createClass({
  render: function(){
    return(
      <Segment basic loading={this.props.result.loading}>
        <Grid>
          <Grid.Row textAlign="center">
            <Grid.Column>
              <Button floated="right" basic
                      onClick={this.props.goBack}>
                Go Back
              </Button>
              <Header as="h3">
                User {this.props.result.username} ran {this.props.result.playbook} at  {this.props.result.room} on {this.props.result.datetime}.
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <AnsibleResults
                ok={this.props.result.ok}
                failed={this.props.result.failed}
                unreachable={this.props.result.unreachable}
                tasks={this.props.result.tasks}
                />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
});


var ResultItem = React.createClass({
  showResult: function(){
    this.props.showResult(this.props.item)
  },
  render: function(){
    return(
      <Table.Row onClick={this.showResult}>
        <Table.Cell>
          {this.props.username}
        </Table.Cell>
        <Table.Cell>
          {this.props.playbook}
        </Table.Cell>
        <Table.Cell>
          {this.props.room}
        </Table.Cell>
        <Table.Cell>
          {this.props.datetime}
        </Table.Cell>
      </Table.Row>
    );
  }
});


var Results = React.createClass({
  componentWillReceiveProps: function(nextProps){
    var results = nextProps.results.map(function(aResult, i){
      return <ResultItem key={i} item={i} username={aResult.username}
      playbook={aResult.playbook} room={aResult.room}
      datetime={aResult.datetime} showResult={this.showResult} />
    }, this);
    this.setState({results: results,
                   length: results.length});
  },
  getInitialState: function(){
    return({
      results: [],
      length: 0,
      table: true,
    });
  },
  showTable: function(){
    this.setState({table: true});
  },
  showResult: function(item){
    this.props.resultGet(item);
    this.setState({table: false});
  },
  render: function(){
    const tableHeader = [
        <Table.HeaderCell key={1} width={4}>User</Table.HeaderCell>,
      <Table.HeaderCell key={2} width={4}>ran playbook</Table.HeaderCell>,
      <Table.HeaderCell key={3} width={4}>at room</Table.HeaderCell>,
      <Table.HeaderCell key={4} width={4}>on date</Table.HeaderCell>,
    ];
    return(
      <Grid>
        <Grid.Row>
          <Header>Results</Header>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {this.state.table ? (
              <GenericTable header={tableHeader}
                            data={this.state.results}
                            length={this.state.length}
                            showResult={this.showResult}
                            description="Executions"
                            singleLine={true} selectable={true}/>
            ):(
              <Result result={this.props.result}
                      goBack={this.showTable}/>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
});


Results.propTypes = {
  results: PropTypes.array.isRequired,
};

module.exports = Results;
