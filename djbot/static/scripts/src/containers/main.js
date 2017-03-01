var React = require("react");
var Main = require("../components/main")

var MainContainer = React.createClass({
  getInitialState: function() {
    return {tasks : [{ key: 0, name: 'your connection is not working', modules: [{ key :1, name: 'failed', options: [{ key: 1, name: "let's hand some work", value: 'yeah!', }]}]}], rooms: [{name:'your conecction is not working', machines: 0, network: '127.0.0.1', netmask:'24'}], user: {}, users:[]}
    },
    // roomsReload: function() {
    //     $.ajax({
    //         url: "/api/room/",
    //         dataType: 'json',
    //         cache: false,
    //         success: function(data) {
    //             this.setState({rooms: data["rooms"]});
    //         }.bind(this),
    //         error: function(xhr, status, err) {
    //             console.error(this.props.url, status, err.toString());
    //         }.bind(this)
    //     });
    // },
    // discover: function(){
    //     $.ajax({
    //         url: "/api/room/discover",
    //         dataType: 'json',
    //         type: 'get',
    //         success: function(data) {
    //             this.setState({active: false});
    //             this.setState({hosts: data['hosts']});
    //         }.bind(this),
    //         error: function(xhr, status, err) {
    //             console.error("/api/room/discover", status, err.toString());
    //         }.bind(this)
    //     });
    // },
    // componentDidMount: function() {
    //     this.roomsReload();
    //     this.tasksReload();
    // },
    render: function() {
	return (
          <Main children={this.props.children} />
	);
    }
});

module.exports = MainContainer;
