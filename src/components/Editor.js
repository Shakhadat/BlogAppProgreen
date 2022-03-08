import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  ADD_TAG,
  EDITOR_PAGE_LOADED,
  REMOVE_TAG,
  ARTICLE_SUBMITTED,
  EDITOR_PAGE_UNLOADED,
  UPDATE_FIELD_EDITOR
} from '../constants/actionTypes';

const Editor = (props) => {

  const dispatch = useDispatch();
  const editorState = useSelector(state => state.editor);

  const updateFieldEvent = (key) => (e) => dispatch({ type: UPDATE_FIELD_EDITOR, key, value: e.target.value })

  const changeTitle = updateFieldEvent('title');
  const changeDescription = updateFieldEvent('description');
  const changeBody = updateFieldEvent('body');
  const changeTagInput = updateFieldEvent('tagInput');

  const watchForEnter = ev => {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      dispatch({ type: ADD_TAG })
    }
  }

  const removeTagHandler = tag => () => {
    dispatch({ type: REMOVE_TAG, tag })
  }

  const submitForm = ev => {
    ev.preventDefault();
    const article = {
      title: editorState.title,
      description: editorState.description,
      body: editorState.body,
      tagList: editorState.tagList
    };

    const slug = { slug: editorState.articleSlug };
    const promise = editorState.articleSlug ?
      agent.Articles.update(Object.assign(article, slug)) :
      agent.Articles.create(article);

    dispatch({ type: ARTICLE_SUBMITTED, payload: promise })
  };

  console.log("match", props.match.params.slug);

  React.useEffect(() => {
    if (props.match.params.slug) {
      dispatch({ type: EDITOR_PAGE_LOADED, payload: agent.Articles.get(props.match.params.slug) })
      // dispatch({ type: EDITOR_PAGE_UNLOADED });
    }
  }, [props.match.params.slug])


  React.useEffect(() => {
    if (props.match.params.slug) {
      dispatch({ type: EDITOR_PAGE_LOADED, payload: agent.Articles.get(props.match.params.slug) })
    }
    return () => {
      dispatch({ type: EDITOR_PAGE_UNLOADED })
    }
  }, [])


  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">

            <ListErrors errors={editorState.errors}></ListErrors>

            <form>
              <fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Article Title"
                    value={editorState.title}
                    onChange={changeTitle} />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="What's this article about?"
                    value={editorState.description}
                    onChange={changeDescription} />
                </fieldset>

                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows="8"
                    placeholder="Write your article (in markdown)"
                    value={editorState.body}
                    onChange={changeBody}>
                  </textarea>
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter tags"
                    value={editorState.tagInput}
                    onChange={changeTagInput}
                    onKeyUp={watchForEnter} />

                  <div className="tag-list">
                    {
                      (editorState.tagList || []).map(tag => {
                        return (
                          <span className="tag-default tag-pill" key={tag}>
                            <i className="ion-close-round"
                              onClick={removeTagHandler(tag)}>
                            </i>
                            {tag}
                          </span>
                        );
                      })
                    }
                  </div>
                </fieldset>

                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="button"
                  disabled={editorState.inProgress}
                  onClick={submitForm}>
                  Publish Article
                </button>

              </fieldset>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;
