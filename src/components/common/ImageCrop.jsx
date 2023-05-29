import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal'
import Cropper from 'react-easy-crop'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import getCroppedImg from '../../utils/cropImage'

const ImageCrop = props => {

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [cropShape, setCropShape] = useState("round")
  const [aspect, setAspect] = useState(1)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixelsData) => {
    setCroppedAreaPixels(croppedAreaPixelsData)
  }, []);

  useEffect(() => {
    if(props.show === true) {
      setZoom(1);
    }

    if(props.cropShape && props.cropShape === "rectangle") {
      setCropShape("rect");
      setAspect(2 / 1);
    }

  }, [props.show]);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImageData = await getCroppedImg(
        props.image,
        croppedAreaPixels
      )
      props.onCropCompleted(croppedImageData);
    } catch(e) {
      console.log(e);
    }
  }, [croppedAreaPixels]);

  const onCropCancelled = () => {
    if(props.onCropCancelled) {
      props.onCropCancelled();
    }
  };

  return (
    <Modal size="lg" backdrop="static" show={ props.show } onHide={ () => '' } aria-labelledby="example-modal-sizes-title-lg" >
      <Modal.Body>
        <div className="modal-header justify-content-between">
          <div>
            <h4 className="modal-title d-flex align-items-center">
              Crop Image
            </h4>
          </div>
        </div>
        <div className="modal-body" style={ { height: 330 } }>
          <Cropper
            image={ props.image }
            crop={ crop }
            zoom={ zoom }
            cropShape={ cropShape }
            aspect={ aspect }
            onCropChange={ setCrop }
            onCropComplete={ onCropComplete }
            onZoomChange={ setZoom }
          />
          <Slider
            min={ 1 }
            max={ 3 }
            tooltip={ false }
            step={ 0.1 }
            value={ zoom }
            onChange={ zoomData => setZoom(zoomData) }
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={ () => onCropCancelled() } className="btn btn-medium btn-secondary md-box btn-submit mr-4">Cancel</button>
        <button
          type="button"
          className={ `btn btn-medium md-box btn-submit btn-green float-right` }
          onClick={ showCroppedImage }
        >Crop</button>
      </Modal.Footer>
    </Modal>
  )
}

ImageCrop.propTypes = {
  image: PropTypes.string,
  show: PropTypes.bool,
  onCropCompleted: PropTypes.func,
  onCropCancelled: PropTypes.func,
};
ImageCrop.defaultProps = {
  image: '',
  show: false,
};

export default ImageCrop;
