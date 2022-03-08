import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  SETTINGS_SAVED,
  SETTINGS_PAGE_UNLOADED,
  LOGOUT,
  LOGIN_PAGE_UNLOADED
} from '../constants/actionTypes';


const SettingsForm = (props) => {
  const [setting, setSetting] = React.useState({
    image: "",
    username: "",
    bio: "",
    email: "",
    password: ""
  })

  const updateState = (e) => {
    setSetting({ ...setting, [e.target.name]: e.target.value })
  }

  const submitForm = (e) => {
    e.preventDefault();

    const user = Object.assign({}, setting);

    if (!user.password) {
      delete user.password;
    }

    props.onSubmitForm(user);
  }

  React.useEffect(() => {
    setSetting({
      ...setting,
      image: props.currentUser.image,
      userName: props.currentUser.userName,
      bio: props.currentUser.bio,
      email: props.currentUser.email,
      password: props.currentUser.password,
    })
  }, [props.currentUser])

  return (
    <form onSubmit={submitForm}>
      <fieldset>

        <fieldset className="form-group">
          <input
            className="form-control"
            type="text"
            name="image"
            placeholder="URL of profile picture"
            value={setting.image}
            onChange={updateState} />
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="text"
            placeholder="Username"
            name="username"
            value={setting.username}
            onChange={updateState} />
        </fieldset>

        <fieldset className="form-group">
          <textarea
            className="form-control form-control-lg"
            rows="8"
            placeholder="Short bio about you"
            name="bio"
            value={setting.bio}
            onChange={updateState}>
          </textarea>
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="email"
            placeholder="Email"
            name="email"
            value={setting.email}
            onChange={updateState} />
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="password"
            placeholder="New Password"
            name="password"
            value={setting.password}
            onChange={updateState} />
        </fieldset>

        <button
          className="btn btn-lg btn-primary pull-xs-right"
          type="submit"
        // disabled={this.state.inProgress}
        >
          Update Settings
        </button>

      </fieldset>
    </form>
  );
}


const Settings = () => {
  const dispatch = useDispatch();
  const { settings: globalSettings, common: globalCommon } = useSelector(state => state);

  const onSubmitForm = (user) => {
    dispatch({ type: SETTINGS_SAVED, payload: agent.Auth.save(user) })
  }

  const onLogout = () => {
    dispatch({ type: LOGOUT })
  }


  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">

            <h1 className="text-xs-center">Your Settings</h1>

            <ListErrors errors={globalSettings.errors}></ListErrors>

            <SettingsForm
              currentUser={globalCommon.currentUser}
              onSubmitForm={onSubmitForm} />

            <hr />

            <button
              className="btn btn-outline-danger"
              onClick={onLogout}>
              Or click here to logout.
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;