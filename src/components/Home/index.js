import Banner from './Banner';
import MainView from './MainView';
import React from 'react';
import Tags from './Tags';
import agent from '../../agent';
import { connect, useSelector, useDispatch } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';

const Promise = global.Promise;

const Home = (props) => {
  const dispatch = useDispatch()
  const { common, home } = useSelector(state => state);

  const onClickTag = (tag, pager, payload) => {
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload })
  }

  React.useEffect(() => {
    const tab = common.token ? 'feed' : 'all';
    const articlesPromise = common.token ? agent.Articles.feed : agent.Articles.all;

    dispatch({ type: HOME_PAGE_LOADED, tab, articlesPromise, payload: Promise.all([agent.Tags.getAll(), articlesPromise()]) });

    return () => { dispatch({ type: HOME_PAGE_UNLOADED }) }
  }, [])

  return (
    <div className="home-page">
      <Banner token={common.token} appName={common.appName} />
      <div className="container page">
        <div className="row">
          <MainView />
          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <Tags
                tags={home.tags}
                onClickTag={onClickTag} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;
