import React from 'react';
import agent from '../../agent';
import { connect, useDispatch } from 'react-redux';
import { DELETE_COMMENT } from '../../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
  onClick: (payload, commentId) =>
    dispatch({ type: DELETE_COMMENT, payload, commentId })
});

const DeleteButton = props => {

  const dispatch = useDispatch();

  const del = () => {
    const payload = agent.Comments.delete(props.slug, props.commentId);
    // props.onClick(payload, props.commentId);
    dispatch({ type: DELETE_COMMENT, payload, commentId: props.commentId })
  };

  if (props.show) {
    return (
      <span className="mod-options">
        <i className="ion-trash-a" onClick={del}></i>
      </span>
    );
  }
  return null;
};

export default connect(() => ({}), mapDispatchToProps)(DeleteButton);
