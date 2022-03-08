import agent from '../agent';
import Header from './Header';
import React from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { APP_LOAD, REDIRECT } from '../constants/actionTypes';
import { Route, Switch } from 'react-router-dom';
import Article from '../components/Article';
import Editor from '../components/Editor';
import Home from '../components/Home';
import Login from '../components/Login';
import Profile from '../components/Profile';
import ProfileFavorites from '../components/ProfileFavorites';
import Register from '../components/Register';
import Settings from '../components/Settings';
import { store } from '../store';
import { push } from 'react-router-redux';

const App = (props) => {
  const dispatch = useDispatch();
  const commonState = useSelector(state => {
    return state.common
  });

  React.useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
    }
    dispatch({ type: APP_LOAD, payload: agent.Auth.current(), token, skipTracking: true });
  }, [])

  React.useEffect(() => {
    if (commonState.redirectTo) {
      // dispatch(commonState.redirectTo);
      // store.dispatch(commonState.redirectTo)
      props.history.push(commonState.redirectTo)
      dispatch({ type: REDIRECT });
    }
  }, [commonState.redirectTo])

  if (commonState.appLoaded) {
    return (
      <div>
        <Header
          appName={commonState.appName}
          currentUser={commonState.currentUser} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/editor/:slug" component={Editor} />
          <Route path="/editor" component={Editor} />
          <Route path="/article/:id" component={Article} />
          <Route path="/settings" component={Settings} />
          <Route path="/@:username/favorites" component={ProfileFavorites} />
          <Route path="/@:username" component={Profile} />
        </Switch>
      </div>
    );
  }
  return (
    <div>
      <Header
        appName={commonState.appName}
        currentUser={commonState.currentUser} />
    </div>
  );
}
export default App;
