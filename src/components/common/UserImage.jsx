import React from 'react';
import PropTypes from 'prop-types';
import {Helper} from './../../utils/helper';

const Userimage = props => {

  return (
    <>
    {props.src &&
      <img
        id={props.id}
        className={props.className}
        src={props.src}
        alt={props.altText}
      />
    }
    {!props.src &&
    <div className="member-initialname">
      <label className={props.className}>{props.name ? Helper.getIntialName(props.name) : ''}</label>
    </div>
    }
    </>
  )
}

Userimage.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  src: PropTypes.string,
  size: PropTypes.string,
  altText: PropTypes.string,
  name: PropTypes.string
};
Userimage.defaultProps = {
  className: '',
  id: '',
  src: '',
  altText: 'Image'
};

export default Userimage;
