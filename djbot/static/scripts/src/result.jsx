var ResultItem = React.createClass({
    render: function(){    
	return(
		<div className="item" data-tab={this.props.room.name}>
		{this.props.room.name}
	    </div>
	);
    }
});
var ResultContent = React.createClass({
    render: function(){
	var Icon = Semantify.Icon;
	return(
                <div className="ui tab segment" data-tab={this.props.room.name}>
		{this.props.room.data}
	    <Icon className="Trash"/> Clean Registry
	    </div>
	);
    }
});




var Results = React.createClass({
    componentDidMount: function() {
	$('.results.ui .item').tab();
    },
    getInitialState: function(){
	return({results : [{ name: "biol", data: "ok", key: 1}, { name: "otra", data: "fail", key: 2}]});
    }, 
    render: function(){
	var Grid = Semantify.Grid;
	var Menu = Semantify.Menu;
	return(
	<div className="ui grid bottom attached tab" data-tab="results">
		<Grid>
		<div className="four wide column">
	    	 <Menu className="vertical tabular fluid results">
		{this.state.results.map(function(room){
		    return <ResultItem key={room.key} room={room} />;
		})}
		 </Menu>
		</div>
		<div className="twelve wide stretched column">
		{this.state.results.map(function(room){
		    return <ResultContent key={room.key} room={room} />;
		})}
	    </div>
		</Grid>
        </div>
	);
    }
});

