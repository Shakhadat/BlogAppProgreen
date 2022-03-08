import ArticleMeta from './ArticleMeta';
import CommentContainer from './CommentContainer';
import React from 'react';
import agent from '../../agent';
import { connect, useSelector, useDispatch } from 'react-redux';
import marked from 'marked';
import { ARTICLE_PAGE_LOADED, ARTICLE_PAGE_UNLOADED } from '../../constants/actionTypes';


const Article = (props) => {
  const dispatch = useDispatch();
  const { article: globalArticle, common: globalCommon } = useSelector(state => state);

  React.useEffect(() => {
    dispatch({
      type: ARTICLE_PAGE_LOADED, payload: Promise.all([
        agent.Articles.get(props.match.params.id),
        agent.Comments.forArticle(props.match.params.id)
      ])
    })

    return () => {
      dispatch({ type: ARTICLE_PAGE_UNLOADED })
    }
  }, [])

  if (!globalArticle.article) {
    return null;
  }

  const markup = { __html: marked(globalArticle.article.body, { sanitize: true }) };
  const canModify = globalCommon.currentUser && globalCommon.currentUser.username === globalArticle.article.author.username;

  return (
    <div className="article-page">

      <div className="banner">
        <div className="container">

          <h1>{globalArticle.article.title}</h1>
          <ArticleMeta
            article={globalArticle.article}
            canModify={canModify} />

        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-xs-12">
            <div dangerouslySetInnerHTML={markup}></div>
            <ul className="tag-list">
              {
                globalArticle.article.tagList.map(tag => {
                  return (
                    <li
                      className="tag-default tag-pill tag-outline"
                      key={tag}>
                      {tag}
                    </li>
                  );
                })
              }
            </ul>

          </div>
        </div>

        <hr />

        <div className="article-actions">
        </div>

        <div className="row">
          <CommentContainer
            comments={globalArticle.comments || []}
            errors={globalArticle.commentErrors}
            slug={props.match.params.id}
            currentUser={globalCommon.currentUser} />
        </div>
      </div>
    </div>
  );
}


export default Article;
