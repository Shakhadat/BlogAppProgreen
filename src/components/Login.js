import { Link } from 'react-router-dom';
import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  UPDATE_FIELD_AUTH,
  LOGIN,
  LOGIN_PAGE_UNLOADED
} from '../constants/actionTypes';


const Login = () => {
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth);

  const changeEmail = (e) => {
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value: e.target.value })
  }

  const changePassword = (e) => {
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value: e.target.value })
  }

  const submitForm = (email, password) => e => {
    e.preventDefault();
    dispatch({ type: LOGIN, payload: agent.Auth.login(email, password) })
  }

  React.useEffect(() => {
    // return () => {
    //   dispatch({ type: LOGIN_PAGE_UNLOADED })
    // }
  }, [])

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">

          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign In</h1>
            <p className="text-xs-center">
              <Link to="/register">
                Need an account?
              </Link>
            </p>

            <ListErrors errors={authState.errors} />

            <form onSubmit={submitForm(authState.email, authState.password)}>
              <fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    value={authState.email}
                    onChange={changeEmail} />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    value={authState.password}
                    onChange={changePassword} />
                </fieldset>

                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={authState.inProgress}>
                  Sign in
                </button>

              </fieldset>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
