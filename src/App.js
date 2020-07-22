import React, { Component } from 'react'
import {connect} from 'react-redux';
import {Route, Switch, Redirect, withRouter } from 'react-router-dom';
import {authCheckState} from './store/actions/auth'
import classes from './App.module.css';

import Layout from './hoc/Layout';

import asyncComponent from './hoc/asyncComponent/asyncComponent'
import SignIn from './containers/SignIn/SignIn';
import Home from './containers/Home/Home';
import Team from './containers/Team/Team';
import Match from './containers/Match/Match';
import Logout from './containers/SignIn/Logout/Logout';
import NotFound from './containers/404/NotFound';

import Dashboard from './containers/Admin/dashboard';
import Players from './containers/Admin/Players/Players';
import Matches from './containers/Admin/Matches/Matches';
import AddEditMatch from './containers/Admin/Matches/AddEditMatch/AddEditMatch';
import AddEditPlayer from './containers/Admin/Players/AddEditPlayer/AddEditPlayer';

const asyncAuth = asyncComponent(() => {
  return import('./containers/SignIn/SignIn')
});

class App extends Component {
  componentDidMount() {
    console.log('token: ', this.props.token);
    console.log('token Storage: ', this.props);
    console.log('isAuthenticated: ', this.props.isAuthenticated);
    this.props.onAuthCheckState();
  }

  render() {
    let routes = (
      <Switch>
        <Route path='/sign_in' component={SignIn} />
        <Route path='/the_team' component={Team} />
        <Route path='/the_matches' component={Match} />
        <Route exact path='/' component={Home}/>
        <Route component={NotFound}/>
      </Switch>
    );


    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path='/log_out' component={Logout} />
          <Route path='/the_team' component={Team} />
          <Route path='/the_matches' component={Match} />
          <Route path='/admin_matches/edit_match/' exact component={AddEditMatch} />
          <Route path='/admin_matches/edit_match/:id' exact component={AddEditMatch} />
          <Route path='/admin_matches/' exact component={Matches} />
          <Route path='/admin_players/edit_player/' exact component={AddEditPlayer} />
          <Route path='/admin_players/edit_player/:id' exact component={AddEditPlayer} />
          <Route path='/admin_players' exact component={Players} />
          <Route path='/dashboard' component={Dashboard} />
          <Route exact path='/' component={Home}/>
          <Redirect to='/dashboard' />
          <Route component={NotFound}/>
        </Switch>
      );
    }

    return (
      <Layout>
        {routes}
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  console.log('state: ', state );
  return {
      isAuthenticated: state.auth.token !== null,
      authRedirectPath: state.auth.authRedirectPath,
      token: state.auth.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuthCheckState: () => dispatch(authCheckState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
