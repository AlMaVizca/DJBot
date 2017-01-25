var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
import { Icon, Input, Menu, Segment } from 'semantic-ui-react';

function Main(props){
  return (
    <div>
      <AppMenu />
      <div className="ui main container">
        {props.children}
      </div>
    </div>
  )
};


var AppMenu = React.createClass({
  getInitialState: function(){
    return({
      activeItem: 'home'
    })
  },
  handleItemClick: function(e, { name }){
    this.setState({ activeItem: name })
  },
  render: function() {
    const {activeItem} = this.state;
    return (
      <Segment inverted>
        <Menu inverted pointing secondary>
          <Menu.Item name="DJBot" active={activeItem === 'DJBot'} onClick={this.handleItemClick} as={Link} to="/"/>
          <Menu.Item name="settings" active={activeItem === 'settings'} onClick={this.handleItemClick} as={Link} to="/settings">
            <Icon name="settings" />
              Settings
          </Menu.Item>
          <Menu.Item name="tasks" active={activeItem === 'tasks'} onClick={this.handleItemClick} as={Link} to="/tasks" />
          <Menu.Item name="run" active={activeItem === 'run'} onClick={this.handleItemClick} as={Link} to="/run" />
          <Menu.Item name="results" active={activeItem === 'results'} onClick={this.handleItemClick} as={Link} to="/results" />
          <Menu.Menu position='right'>
            <Menu.Item name="profile" active={activeItem === 'profile'} onClick={this.handleItemClick} as={Link} to="/settings/user" />
            <Menu.Item name='logout' active={activeItem === 'logout'} as={Link} to="/logout" />
          </Menu.Menu>
        </Menu>
      </Segment>
    )
  }
});


module.exports = Main;
