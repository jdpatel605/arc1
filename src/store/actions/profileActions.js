import {profileTypes} from './types';

// Get User Profile Data
export const getProfileRequest = (string) => ({
  type: profileTypes.GET_PROFILE_REQUEST,
  payload: string
});
export const getProfileSuccess = (data) => ({
  type: profileTypes.GET_PROFILE_SUCCESS,
  payload: data
});
export const getProfileFailed = (data) => ({
  type: profileTypes.GET_PROFILE_FAILED,
  payload: data
});

// Get Country Data
export const getCountryRequest = (string) => ({
  type: profileTypes.GET_COUNTRY_REQUEST,
  payload: string
});
export const getCountrySuccess = (data) => ({
  type: profileTypes.GET_COUNTRY_SUCCESS,
  payload: data
});
export const getCountryFailed = (data) => ({
  type: profileTypes.GET_COUNTRY_FAILED,
  payload: data
});

// Update profile data 
export const updateProfileRequest = (string) => ({
  type: profileTypes.UPDATE_PROFILE_REQUEST,
  payload: string
});
export const updateProfileSuccess = (data) => ({
  type: profileTypes.UPDATE_PROFILE_SUCCESS,
  payload: data
});
export const updateProfileFailed = (data) => ({
  type: profileTypes.UPDATE_PROFILE_FAILED,
  payload: data
});

// Update password data 
export const updatePasswordRequest = (string) => ({
  type: profileTypes.UPDATE_PASSWORD_REQUEST,
  payload: string
});
export const updatePasswordSuccess = (data) => ({
  type: profileTypes.UPDATE_PASSWORD_SUCCESS,
  payload: data
});
export const updatePasswordFailed = (data) => ({
  type: profileTypes.UPDATE_PASSWORD_FAILED,
  payload: data
});

// Get timezone data 
export const getTimezoneRequest = (string) => ({
  type: profileTypes.GET_TIMEZONE_REQUEST,
  payload: string
});
export const getTimezoneSuccess = (data) => ({
  type: profileTypes.GET_TIMEZONE_SUCCESS,
  payload: data
});
export const getTimezoneFailed = (data) => ({
  type: profileTypes.GET_TIMEZONE_FAILED,
  payload: data
});

// Update Phone data 
export const updatePhoneRequest = (string) => ({
  type: profileTypes.UPDATE_PHONE_REQUEST,
  payload: string
});
export const updatePhoneSuccess = (data) => ({
  type: profileTypes.UPDATE_PHONE_SUCCESS,
  payload: data
});
export const updatePhoneFailed = (data) => ({
  type: profileTypes.UPDATE_PHONE_FAILED,
  payload: data
});

// Check Phone OTP data 
export const checkPhoneOTPRequest = (string) => ({
  type: profileTypes.CHECK_PHONE_OTP_REQUEST,
  payload: string
});
export const checkPhoneOTPSuccess = (data) => ({
  type: profileTypes.CHECK_PHONE_OTP_SUCCESS,
  payload: data
});
export const checkPhoneOTPFailed = (data) => ({
  type: profileTypes.CHECK_PHONE_OTP_FAILED,
  payload: data
});
export const checkPhoneOTPUpdate = (data) => ({
  type: profileTypes.CHECK_PHONE_OTP_UPDATE,
  payload: data
});

// Update Email data
export const updateEmailRequest = (string) => ({
  type: profileTypes.UPDATE_EMAIL_REQUEST,
  payload: string
});
export const updateEmailSuccess = (data) => ({
  type: profileTypes.UPDATE_EMAIL_SUCCESS,
  payload: data
});
export const updateEmailFailed = (data) => ({
  type: profileTypes.UPDATE_EMAIL_FAILED,
  payload: data
});

// Get single profile data
export const singleProfileRequest = (string) => ({
  type: profileTypes.SINGLE_PROFILE_REQUEST,
  payload: string
});
export const singleProfileSuccess = (data) => ({
  type: profileTypes.SINGLE_PROFILE_SUCCESS,
  payload: data
});
export const singleProfileFailed = (data) => ({
  type: profileTypes.SINGLE_PROFILE_FAILED,
  payload: data
});

// Get current user time zone
export const currentUserTimezoneRequest = (string) => ({
  type: profileTypes.CURRENT_USER_TIMEZONE_REQUEST,
  payload: string
});
export const currentUserTimezoneSuccess = (data) => ({
  type: profileTypes.CURRENT_USER_TIMEZONE_SUCCESS,
  payload: data
});
export const currentUserTimezoneFailed = (data) => ({
  type: profileTypes.CURRENT_USER_TIMEZONE_FAILED,
  payload: data
});
