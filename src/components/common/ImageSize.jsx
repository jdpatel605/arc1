import React from 'react';
import PropTypes from 'prop-types';
import noImageSmall from '../../assets/icons/images/no-image-sm.png';
import noImageGroup from '../../assets/icons/images/camera.png';

const ImageSize = props => {
  const imgElement = React.useRef(null);
  const noImageAlias = e => {
    e.target.src = props.size === 'group' ? noImageGroup : noImageSmall;
  }
  const handleOnLoaded = () => {
    const size = {
      width: imgElement.current.naturalWidth,
      height: imgElement.current.naturalHeight,
      element: imgElement.current,
    }
    // Callback once received the image dimensions
    props.onLoaded(size)
  }

  return (
    <img
      style={{display: 'none'}}
      ref={imgElement}
      onError={noImageAlias}
      src={props.src}
      alt=""
      onLoad={() => handleOnLoaded()}
    />
  )
}

ImageSize.propTypes = {
  size: PropTypes.string,
  src: PropTypes.string,
  onLoaded: PropTypes.func,
  altText: PropTypes.string,
};
ImageSize.defaultProps = {
  size: '',
  src: '',
  altText: '',
};

export default ImageSize;
