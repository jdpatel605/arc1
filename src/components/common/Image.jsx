import React from 'react';
import PropTypes from 'prop-types';
import noImageSmall from '../../assets/icons/images/no-image-sm.png';
import noImageMedium from '../../assets/icons/images/no-image-md.jpg';
import noImageGroup from '../../assets/icons/images/camera.png';

const Image = props => {

  const noImageAlias = e => {

    if(props.size === 'group') {
      e.target.src = noImageGroup;
    } else if(props.size === 'medium') {
      e.target.src = noImageMedium;
    } else {
      e.target.src = noImageSmall;
    }

  }

  return (
    <img
      id={props.id}
      className={props.className}
      onError={noImageAlias}
      src={props.src ? props.src : ''}
      alt={props.altText}
    />
  )
}

Image.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  src: PropTypes.string,
  size: PropTypes.string,
  altText: PropTypes.string
};
Image.defaultProps = {
  className: '',
  id: '',
  src: '',
  altText: 'Image'
};

export default Image;
