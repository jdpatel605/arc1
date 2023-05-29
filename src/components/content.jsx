import React from "react";
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';

const Content = (props) => {

  const {isAuthenticated} = useSelector(state => state.user)
  return (
    <div className={`content`}>
      {props.children}
    </div>
  );
}

Content.propTypes = {
  children: PropTypes.array,
};

export default Content;
