import React, {useEffect, useState, useRef} from "react";
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Spinner from './../spinner';
import OtpInput from '../otp-input';
import {checkPhoneOTPRequest, checkPhoneOTPUpdate} from '../../store/actions';

const ConfirmOTP = props => {
  const dispatch = useDispatch();
  const {checkPhoneFlagLoading, checkPhoneOTPError, checkPhoneOTPSuccess} = useSelector(({profile}) => profile);
  const [otpValue, setOTP] = useState('');
  const [formFilled, setFormFilled] = useState(false);
  const [confirmDisabled, setConfirmDisabled] = useState(true);

  const hideCreateModel = (e) => {
    setOTP('');
    dispatch(checkPhoneOTPUpdate([]));
    props.hide(false);
  }

  const otpChanged = (otp) => {
    setOTP(otp.toUpperCase());
    if(otp.length === 6) {
      setFormFilled(true);
      setConfirmDisabled(false);
      const data = {otp: otp.toUpperCase()};
      dispatch(checkPhoneOTPRequest(data));
    }
    else {
      setFormFilled(false);
      setConfirmDisabled(true);
    }
  }

  useEffect(() => {
    setOTP('');
    props.hide(false);
  }, [checkPhoneOTPSuccess])

  useEffect(() => {
    console.log(checkPhoneOTPError);
  }, [checkPhoneOTPError])

  return (
    <>
      <Modal size="sm" show={props.show} backdrop="static" onHide={hideCreateModel}
        aria-labelledby="example-modal-sizes-title-sm" className="confirmOTP">
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-sm" className="modal-title text-center w-100">
            <h1>Enter Code</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You should receive a 6 digit code via text message (SMS), please enter it below.</p>
          <div className=''>
            <OtpInput
              onChange={otp => otpChanged(otp)}
              numInputs={6}
              inputStyle="form-control"
              containerStyle="form-group enter-code"
              isInputNum={true}
              value={otpValue}
              hasErrored={false}
              errorStyle="error"
              shouldAutoFocus={true}
            />
          </div>
          {checkPhoneOTPError &&
            <div className={`error-sec m-1 invalid-login msg-${checkPhoneOTPError.type}`}>
              <span className="error" >{checkPhoneOTPError.message}</span>
            </div>
          }
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <button type="button" className="btn bg-black-900 md-box btn-medium clr-white" onClick={hideCreateModel}>Cancel</button>
          <button type="button" disabled={confirmDisabled} className={`btn btn-green md-box btn-medium ${formFilled ? "btn-green" : "btn-gray-500"}`}>Submit { checkPhoneFlagLoading && <Spinner /> }</button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
ConfirmOTP.propTypes = {
  show: PropTypes.bool,
  hide: PropTypes.func,
};
ConfirmOTP.defaultProps = {
  show: false,
};
export default ConfirmOTP;
