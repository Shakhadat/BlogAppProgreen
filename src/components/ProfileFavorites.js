// import { mapStateToProps } from './Profile';
// import Profile from './Profile';
import React from 'react';
import { Link } from 'react-router-dom';
import agent from '../agent';
import { connect, useDispatch, useSelector } from 'react-redux';
import ArticleList from './ArticleList';

import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED
} from '../constants/actionTypes';



const EditProfileSettings = props => {
  if (props.isUser) {
    return (
      <Link
        to="/settings"
        className="btn btn-sm btn-outline-secondary action-btn">
        <i className="ion-gear-a"></i> Edit Profile Settings
      </Link>
    );
  }
  return null;
};

const FollowUserButton = props => {
  if (props.isUser) {
    return null;
  }

  let classes = 'btn btn-sm action-btn';
  if (props.user.following) {
    classes += ' btn-secondary';
  } else {
    classes += ' btn-outline-secondary';
  }

  const handleClick = ev => {
    ev.preventDefault();
    if (props.user.following) {
      props.unfollow(props.user.username)
    } else {
      props.follow(props.user.username)
    }
  };

  return (
    <button
      className={classes}
      onClick={handleClick}>
      <i className="ion-plus-round"></i>
      &nbsp;
      {props.user.following ? 'Unfollow' : 'Follow'} {props.user.username}
    </button>
  );
};

const Tabs = (props) => {
  return (
    <ul className="nav nav-pills outline-active">
      <li className="nav-item">
        <Link
          className="nav-link"
          to={`/@${props.profile.username}`}>
          My Articles
        </Link>
      </li>

      <li className="nav-item">
        <Link
          className="nav-link active"
          to={`/@${props.profile.username}/favorites`}>
          Favorited Articles
        </Link>
      </li>
    </ul>
  );
}

const Profile = (props) => {
  const dispatch = useDispatch();
  const { articleList: globalArticleList, common: globalCommon, profile: globalProfile } = useSelector(state => state);

  const onFollow = (username) => {
    dispatch({
      type: FOLLOW_USER,
      payload: agent.Profile.follow(username)
    })
  }

  const onUnfollow = (username) => {
    dispatch({
      type: UNFOLLOW_USER,
      payload: agent.Profile.unfollow(username)
    })
  }

  const isFavorite = props.location.pathname.split("/").includes("favorites");

  React.useEffect(() => {

    dispatch({
      type: PROFILE_PAGE_LOADED, pager: page => agent.Articles.favoritedBy(props.match.params.username, page), payload: Promise.all([
        agent.Profile.get(props.match.params.username),
        agent.Articles.favoritedBy(props.match.params.username)
      ])
    })

    return () => {
      dispatch({ type: PROFILE_PAGE_UNLOADED })
    }

  }, [])


  const profile = globalProfile;
  if (!profile) {
    return null;
  }

  const isUser = globalCommon.currentUser && globalProfile.username === globalCommon.currentUser.username;


  return (
    <div className="profile-page">

      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">

              <img src={profile.image} className="user-img" alt={profile.username} />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>

              <EditProfileSettings isUser={isUser} />
              <FollowUserButton
                isUser={isUser}
                user={profile}
                follow={onFollow}
                unfollow={onUnfollow}
              />

            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <Tabs profile={profile} activeFavorite={isFavorite} />
            </div>
            <ArticleList
              pager={globalArticleList.pager}
              articles={globalArticleList.articles}
              articlesCount={globalArticleList.articlesCount}
              state={globalArticleList.currentPage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

