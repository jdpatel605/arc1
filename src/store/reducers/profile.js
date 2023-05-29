import {profileTypes} from '../actions/types';

const defaultState = {
  loader: false,
  timeLoader: false,
  errorPasswordMessage: '',
  errorPhoneMessage: '',
  errorEmailMessage: '',
  successPasswordMessage: '',
  successPhoneMessage: '',
  successEmailMessage: '',
  profileErrorMessage: '',
  errorMessage: '',
  successMessage: '',
  updateFlagLoading: false,
  updatePassFlagLoading: false,
  updatePhoneFlagLoading: false,
  updateEmailFlagLoading: false,
  checkPhoneOTPError: '',
  checkPhoneOTPSuccess: '',
  checkPhoneFlagLoading: false,
  profile: [],
  singleProfile: [],
  country: [],
  timezone: [],
  updateProfile: [],
  currentTimeZone: [],
  errors: [],
};

export default (state, {type, payload}) => {
  if(typeof state === 'undefined') {
    return defaultState;
  }

  switch(type) {

    // Get User Profile Data
    case profileTypes.GET_PROFILE_REQUEST:
      return {...state, loader: true, profile: [], profileErrorMessage: ''};
    case profileTypes.GET_PROFILE_SUCCESS:
      return {...state, loader: false, profile: payload};
    case profileTypes.GET_PROFILE_FAILED:
      return {...state, loader: false, errorMessage: payload.message};

    // Get Country Data
    case profileTypes.GET_COUNTRY_REQUEST:
      return {...state, loader: true};
    case profileTypes.GET_COUNTRY_SUCCESS:
      return {...state, loader: false, country: payload};
    case profileTypes.GET_COUNTRY_FAILED:
      return {...state, loader: false, errorMessage: payload.message};

    // Update profile data
    case profileTypes.UPDATE_PROFILE_REQUEST:
      return {...state, loader: true, updateFlagLoading: true, updateProfile: '', profileErrorMessage: ''};
    case profileTypes.UPDATE_PROFILE_SUCCESS:
      return {...state, loader: false, updateFlagLoading: false, updateProfile: payload, profileErrorMessage: ''};
    case profileTypes.UPDATE_PROFILE_FAILED:
      return {...state, loader: false, updateFlagLoading: false, profileErrorMessage: payload};

    // Update password data
    case profileTypes.UPDATE_PASSWORD_REQUEST:
      return {...state, loader: true, updatePassFlagLoading: true, errorPasswordMessage: '', successPasswordMessage: ''};
    case profileTypes.UPDATE_PASSWORD_SUCCESS:
      return {...state, loader: false, updatePassFlagLoading: false, updatePassword: payload, successPasswordMessage: payload};
    case profileTypes.UPDATE_PASSWORD_FAILED:
      return {...state, loader: false, updatePassFlagLoading: false, errorPasswordMessage: payload};

    // Update phone data
    case profileTypes.UPDATE_PHONE_REQUEST:
      return {...state, loader: true, updatePhoneFlagLoading: true, errorPhoneMessage: '', successPhoneMessage: ''};
    case profileTypes.UPDATE_PHONE_SUCCESS:
      return {...state, loader: false, updatePhoneFlagLoading: false, updatePhone: payload, successPhoneMessage: payload};
    case profileTypes.UPDATE_PHONE_FAILED:
      return {...state, loader: false, updatePhoneFlagLoading: false, errorPhoneMessage: payload};

    // Check phone OTP data
    case profileTypes.CHECK_PHONE_OTP_REQUEST:
      return {...state, loader: true, checkPhoneFlagLoading: true, checkPhoneOTPError: '', checkPhoneOTPSuccess: ''};
    case profileTypes.CHECK_PHONE_OTP_SUCCESS:
      return {...state, loader: false, checkPhoneFlagLoading: false, checkPhoneOTPSuccess: payload};
    case profileTypes.CHECK_PHONE_OTP_FAILED:
      return {...state, loader: false, checkPhoneFlagLoading: false, checkPhoneOTPError: payload};
    case profileTypes.CHECK_PHONE_OTP_UPDATE:
      return {...state, checkPhoneOTPError: ''};

    // Update phone data
    case profileTypes.UPDATE_EMAIL_REQUEST:
      return {...state, loader: true, updateEmailFlagLoading: true, errorEmailMessage: '', successEmailMessage: ''};
    case profileTypes.UPDATE_EMAIL_SUCCESS:
      return {...state, loader: false, updateEmailFlagLoading: false, updateEmail: payload, successEmailMessage: payload};
    case profileTypes.UPDATE_EMAIL_FAILED:
      return {...state, loader: false, updateEmailFlagLoading: false, errorEmailMessage: payload};

    // Get Timezone Data
    case profileTypes.GET_TIMEZONE_REQUEST:
      return {...state, loader: true, timeLoader: false};
    case profileTypes.GET_TIMEZONE_SUCCESS:
      return {...state, loader: false, timeLoader: true, timezone: payload};
    case profileTypes.GET_TIMEZONE_FAILED:
      return {...state, loader: false, timeLoader: false, errorMessage: payload.message};

    // Get Single profile
    case profileTypes.SINGLE_PROFILE_REQUEST:
      return {...state, loader: true};
    case profileTypes.SINGLE_PROFILE_SUCCESS:
      return {...state, loader: false, singleProfile: payload};
    case profileTypes.SINGLE_PROFILE_FAILED:
      return {...state, loader: false, errorMessage: payload.message};

    // Get current user time zone
    case profileTypes.CURRENT_USER_TIMEZONE_REQUEST:
      return {...state, loader: true};
    case profileTypes.CURRENT_USER_TIMEZONE_SUCCESS:
      return {...state, loader: false, currentTimeZone: payload};
    case profileTypes.CURRENT_USER_TIMEZONE_FAILED:
      return {...state, loader: false, errorMessage: payload.message};
    default:
      return state;
  }
}
