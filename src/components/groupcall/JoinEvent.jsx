import React, { useState, useEffect } from 'react';
import useValidator from 'simple-react-validator-hooks';
import loadingImage from '../../assets/icons/images/loading_event.gif'
import { useDispatch, useSelector } from 'react-redux';
import { guestJoinGroupEventRequest } from '../../store/actions/group';
import Loader from '../Loader';
import history from '../../history/history';
import PropTypes from 'prop-types';
import LoginHeader from "../includes/loginHeader";
import TestDevices from "./TestDevices";
import { Logger } from './../../utils/logger';

const fileLocation = "src\\components\\groupcall\\JoinEvent.jsx";

const JoinEvent = props => {
  const [validator, showValidationMessage] = useValidator();
  const dispatch = useDispatch();
  const [displayName, setDisplayName] = useState('');
  const [challengeValue, setChallengeValue] = useState('');
  const [challengeType, setChallengeType] = useState('email');
  const [eventJoinError, setEventJoinError] = useState(null);
  const [isValidForm, setValidForm] = useState(false);
  const [displayErrorClass, setDisplayErrorClass] = useState(false);
  const { loading, guestEventJoinData, guestEventJoinError } = useSelector(({ group }) => group);

  useEffect(() => {
    try {
      // Check for the token and challenge type
      const url = new URL(window.location.href);
      const challengeTypeFromUrl = url.searchParams.get('challenge_type') ? url.searchParams.get('challenge_type') : 'email';
      setChallengeType(challengeTypeFromUrl);
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:Mount' })
    }
  }, [])

  const handelJoinEvent = (e) => {
    try {
      e.preventDefault();
      setEventJoinError(null);
      if(validator.allValid()) {
        setValidForm(true);
        setDisplayErrorClass(false);
        // Check for the token and challenge type
        const jwt = props.match.params.jwt;
        const url = new URL(window.location.href);
        const challengeTypeValue = url.searchParams.get('challenge_type') ? url.searchParams.get('challenge_type') : 'email';
        // Generate the guest session and get the event id
        const payload = {
          challenge: challengeValue,
          challenge_type: challengeTypeValue,
          jwt,
          name: displayName
        }
        dispatch(guestJoinGroupEventRequest(payload));
      } else {
        setValidForm(false);
        setDisplayErrorClass(true);
        showValidationMessage(true);
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'handelJoinEvent' })
    }
  }

  // Hook when event data is being updated/changed
  useEffect(() => {
    try {
      // Check if the event is generated successfully
      if(guestEventJoinData.eventJoin) {
        const { eventData, eventJoin } = guestEventJoinData;
        const jwt = eventData.jwt;
        const channel = eventJoin.identifier;
        const user = eventData.user
        // Store the event data in local storage
        localStorage.setItem(channel, jwt);
        localStorage.setItem('guestUser', true);
        if(user) {
          localStorage.setItem('identifier', user.identifier);
        }
        // Push user to the group call screen
        history.push(`/event?e=${channel}`);
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:guestEventJoinData' })
    }
  }, [guestEventJoinData]);

  // Hook when error while joining the group
  useEffect(() => {
    try {
      // Check if any error while event joining
      if(guestEventJoinError.type) {
        setValidForm(false);
        setDisplayErrorClass(true);
        if(guestEventJoinError.type === "unauthorized") {
          setEventJoinError(`Looks like the wrong ${challengeType}. Try again.`);
        } else {
          setEventJoinError(guestEventJoinError.message);
        }
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:guestEventJoinError' })
    }
  }, [guestEventJoinError]);

  return (
    <>
      <LoginHeader />
      <div className="container">
        <div className="row">
          <div className="box-contain bg-black-900 mt-4 mb-5">
            <div className="text-center">
              <TestDevices />
              {
                !isValidForm &&
                <>
                  <div className="loading-img">
                    <svg xmlns="http://www.w3.org/2000/svg" width={ 36 } height={ 36 } viewBox="0 0 12 12">
                      <path fill="#95a1ac" fillRule="evenodd" d="M9 4h-.5V3C8.5 1.62 7.38.5 6 .5S3.5 1.62 3.5 3v1H3c-.55 0-1 .45-1 1v5c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 8.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM7.55 4h-3.1V3c0-.855.695-1.55 1.55-1.55.855 0 1.55.695 1.55 1.55v1z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="clr-white mt-2">Secure Waiting Room</h5>
                    <form className={ `form-sec ${displayErrorClass && 'was-validated'}` } noValidate method="POST" id="signin-form">
                      <div className="form-group w-100 text-left">
                        <div className="bg-black-500">
                          <input type="text" value={ displayName } onChange={ (e) => { setDisplayName(e.target.value); setEventJoinError(null)} } className="form-control" name="displayName" required minLength={ 4 } />
                          <label htmlFor="txtdisname" className="txt-label">Display Name</label>
                        </div>
                        { validator.message('displayName', displayName, 'required|min:4') }
                      </div>
                      <div className="form-group w-100 text-left">
                        <div className="bg-black-500">
                          <input type="text" value={ challengeValue } onChange={ (e) => { setChallengeValue(e.target.value); setEventJoinError(null)} } className="form-control" name="challengeValue" required />
                          <label htmlFor="challengeValue" className="txt-label">Enter { challengeType === 'email' ? 'email address' : 'phone' }</label>
                        </div>
                        {
                          challengeType === 'email'
                            ? validator.message('email', challengeValue, 'required|email')
                            : validator.message('phone', challengeValue, 'required')
                        }
                        {
                            eventJoinError && <div className="srv-validation-message">{ eventJoinError }</div>
                        }
                      </div>
                      
                      <div className="mt-3 btn-sec justify-content-center">
                        <a href="/" className="btn btn-medium bg-black-600 clr-red mr-1">Cancel</a>
                        <input type="button" onClick={ handelJoinEvent } className="btn btn-medium btn-submit btn-green ml-1" defaultValue="Join Now" />
                      </div>
                    </form>
                  </div>
                </>
              }
              {
                isValidForm &&
                <div className="mt-4">
                  <img src={ loadingImage } alt="connecting event" />
                  <h4 className="clr-white mt-2">Connecting…</h4>
                  <p>Get ready to be in the meeting.</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </>

  )
}
JoinEvent.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      jwt: PropTypes.string.isRequired
    })
  })
};
export default JoinEvent;