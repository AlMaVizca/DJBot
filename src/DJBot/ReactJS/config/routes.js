var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;
var IndexRoute = ReactRouter.IndexRoute;

var Main = require('../containers/main');

var Dashboard = require("../containers/dashboardContainer");

var Settings = require("../components/settings");
var Keys = require("../containers/keysContainer");
var UserContainer = require("../containers/userContainer");
var UsersContainer = require("../containers/usersContainer");
var UserNew = require("../components/user/new");


var Playbooks = require("../containers/playbooksContainer");
var PlaybookEdit = require("../containers/playbook/editContainer");
var TaskEdit = require("../containers/playbook/taskContainer");

var Inventory = require("../containers/inventoryContainer");
var Room = require("../containers/inventory/roomContainer");
var Host = require("../containers/inventory/hostContainer");

var Play = require("../containers/playContainer");


var Results = require("../containers/resultsContainer");

var routes = (
  <Router history={hashHistory}>
    <Route path='/' component={Main}>
      <IndexRoute component={Dashboard} />
      <Route path='/Dashboard' component={Dashboard} />

      <Route path='/results' component={Results} />

      <Route path='/settings' component={Settings} />
      <Route path='/settings/userNew' component={UserNew} />
      <Route path='/settings/user' component={UserContainer} />
      <Route path='/settings/users' component={UsersContainer} />
      <Route path='/settings/keys' component={Keys} />

      <Route path='/playbooks' component={Playbooks} />
      <Route path='/playbook/edit'
             component={PlaybookEdit} header="Edit" />
      <Route path='/playbook/new' component={PlaybookEdit}
             header="New" />
      <Route path='/task/edit' component={TaskEdit} header="Edit" />
      <Route path='/task/new' component={TaskEdit} header="New" />

      <Route path='/inventory' component={Inventory} />
      <Route path='/inventory/room' component={Room} />
      <Route path='/inventory/host' component={Host} />

      <Route path='/play' component={Play} />

    </Route>
  </Router>
);

module.exports = routes;
