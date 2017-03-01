var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;
var IndexRoute = ReactRouter.IndexRoute;

var Dashboard = require("../components/dashboard");
var Settings = require("../components/settings");
var Keys = require("../components/keys");


var Main = require('../containers/main');


var Blackboard = require("../containers/blackboard");

var Results = require("../containers/resultsContainer");
var Run = require("../containers/run");

var PlaybookEdit = require("../containers/playbook/editContainer");
var Playbooks = require("../containers/playbooksContainer");


var UserContainer = require("../containers/userContainer");
var UsersContainer = require("../containers/usersContainer");
var UserNew = require("../components/user/new");

var TaskEdit = require("../containers/playbook/taskContainer");

var routes = (
  <Router history={hashHistory}>
    <Route path='/' component={Main}>
      <IndexRoute component={Settings} />
      <Route path='/blackboard' component={Blackboard} />
      <Route path='/run' component={Run} />
      <Route path='/results' component={Results} />

      <Route path='/settings' component={Settings} />
      <Route path='/settings/userNew' component={UserNew} />
      <Route path='/settings/user' component={UserContainer} />
      <Route path='/settings/users' component={UsersContainer} />
      <Route path='/settings/keys' component={Keys} />
      <Route path='/settings/rooms' component={Keys} />

      <Route path='/playbook/edit'
             component={PlaybookEdit} header="Edit" />
      <Route path='/playbook/new' component={PlaybookEdit} header="New" />
      <Route path='/playbooks' component={Playbooks} />


      <Route path='/task/edit' component={TaskEdit} header="Edit" />
      <Route path='/task/new' component={TaskEdit} header="New" />

    </Route>
  </Router>
);

module.exports = routes;
