import AuthService from '../../services/AuthService';
import { setUsersData, setCurrentUser, logoutUser, getErrors, getResponse, getTimezone, getTermsofservice } from "./actionCreators";
import { Helper } from '../../utils/helper';
import { messages } from '../../utils/messages';
import { Logger } from './../../utils/logger';
const fileLocation = "src\\store\\actions\\auth.js";

/**
 * Login user action
 */
export const loginUser = (state, history) => dispatch => {
    AuthService.login(state.email, state.password).then(res => {
        const error = res;
        var errMsg;
        if (error?.status === 200) {
            const data = res.data;
            console.log(data);
            localStorage.setItem('is_login', true);
            localStorage.setItem('accessToken', data.jwt);
            localStorage.setItem('email', data.user.email);
            localStorage.setItem('organization_id', data.user.home_organization ? data.user.home_organization.identifier : null);
            localStorage.setItem('organization_name', data.user.home_organization ? data.user.home_organization.name : null);
            localStorage.setItem('organization_status', data.user.home_organization ? data.user.home_organization.status : null);
            localStorage.setItem('identifier', data.user.identifier);
            localStorage.setItem('current_identifier', data.user.identifier);
            localStorage.setItem('name', data.user.name);
            localStorage.setItem('time_zone', data.user.time_zone);
            localStorage.setItem("user_list", JSON.stringify(data.administerable_organizations));
            localStorage.setItem("user_role", 'member');
            dispatch(setUsersData(data));
            dispatch(setCurrentUser(data));
            const getReferrerURL = Helper.getReferrerURL(true);
            const isReload = localStorage.getItem('reload');
            history.push(getReferrerURL);
            if (isReload) {
                localStorage.removeItem('reload');
                window.location = getReferrerURL
            }
        }
        else if (error?.status === 422) {
            const rdata = error?.message;
            if (rdata.type === 'unauthorized') {
                errMsg = ['You appear to have an invalid email/password.']
            } else if (rdata.type === 'expectation_failed') {
                errMsg = [rdata.message]
            } else if (rdata.type === 'locked') {
                history.push('/confirm', { responce: rdata, email: state.email, mobile_phone_number: rdata.mobile_phone_number, from: 'SIGNIN' });
            } else {
                errMsg = [messages.somethingWentWrong];
            }
        } else {
            errMsg = [messages?.somethingWentWrong];
        }
        dispatch(getErrors({
            errors: errMsg
        }));
    }).catch(err => {
        Logger.error({ fileLocation, err, trace: 'loginUser' })
        var errMsg = [messages?.somethingWentWrong];
        dispatch(getErrors({
            errors: errMsg
        }));
    });

}

/**
 * Logout action
 */
export const logout = (history) => dispatch => {
    AuthService.logout();
    dispatch(logoutUser());
    history.push('/')
    window.location.reload();
}
export const resetError = (resp = false) => dispatch => {
    if (!resp) {
        dispatch(getErrors({ errors: [] }));
    } else {
        dispatch(getResponse({}));
    }
}

/**
 * Register user action
 */
export const registerUser = (data, history) => dispatch => {

    const phoneNumber = data.phone_number.replace(/[- )(]/g, '');
    const fullPhoneNumber = data.country_code + phoneNumber;
    const postData = {
        name: data.name,
        country: data.country,
        time_zone: data.timezone,
        mobile_phone_number: fullPhoneNumber,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        organization_code: data.org_ode,
        accepted_tos: data.termsCheck,
        visibility: 'public',
    };
    AuthService.register(postData).then(res => {
        const error = res;
        var errMsg;
        if (error?.status === 200) {
            history.push('/confirm', { responce: res, email: data.email, mobile_phone_number: fullPhoneNumber, from: 'SIGNUP' });
        }
        else if (error?.status === 422) {
            const rdata = error?.message;
            errMsg = [rdata.message];
        } else {
            errMsg = [messages?.somethingWentWrong];
        }
        dispatch(getErrors({
            errors: errMsg
        }));
    }).catch(err => {
        Logger.error({ fileLocation, err, trace: 'registerUser' })
        var errMsg = [messages?.somethingWentWrong];
        dispatch(getErrors({
            errors: errMsg
        }));
    })
}
/**
 * Country list action
 */
export const countryList = (data) => dispatch => {

    AuthService.countries(data).then(res => {
        const error = res;
        console.log(res);
        var errMsg;
        if (error?.status === 200) {
            dispatch(getResponse({
                options: res.data
            }));
        }
        else if (error?.status === 422) {
            const rdata = error?.message;
            errMsg = [rdata.message];
        } else {
            errMsg = [messages?.somethingWentWrong];
        }
        dispatch(getErrors({
            errors: errMsg
        }));
    }).catch(err => {
        Logger.error({ fileLocation, err, trace: 'countryList' })
        var errMsg = [messages?.somethingWentWrong];
        dispatch(getErrors({
            errors: errMsg
        }));
    });
}
/**
 * Timezone list action
 */
export const timezoneList = (data) => dispatch => {
    AuthService.timezone(data).then(res => {
        const error = res;
        var errMsg;
        if (error?.status === 200) {
            dispatch(getTimezone({ timezone: res.data }));
        }
        else if (error?.status === 422) {
            const rdata = error?.message;
            errMsg = [rdata.message];
        } else {
            errMsg = [messages?.somethingWentWrong];
        }
        dispatch(getErrors({
            errors: errMsg
        }));
    }).catch(err => {
        Logger.error({ fileLocation, err, trace: 'timezoneList' })
        var errMsg = [messages?.somethingWentWrong];
        dispatch(getErrors({
            errors: errMsg
        }));
    });
}
/**
 * Confirm otp for registration action
 */
export const confirmOtp = (data, history) => dispatch => {

    AuthService.confirmOtp(data).then((res) => {
        const error = res;
        var errMsg;
        if (error?.status === 200) {
            history.push('/thankyou');
        }
        else if (error?.status === 422) {
            const rdata = error?.message;
            errMsg = [messages.invalidCode];
        } else {
            errMsg = [messages?.somethingWentWrong];
        }
        dispatch(getErrors({
            errors: errMsg
        }));
    }).catch(err => {
        Logger.error({ fileLocation, err, trace: 'confirmOtp' })
        var errMsg = [messages?.somethingWentWrong];
        dispatch(getErrors({
            errors: errMsg
        }));
    });
}
/**
 * Send otp for forgot password
 */
export const sendForgotPasswordOtp = (data, history) => dispatch => {

    AuthService.sendForgotPasswordOtp(data).then(res => {
        const error = res;
        var errMsg;
        if (error?.status === 200) {
            history.push('/confirm', { ...data, mobile_phone_number: res.data.mobile_phone_number, from: 'FORGOT_PASSWORD' });
        }
        else if (error?.status === 422) {
            const rdata = error?.message;
            if (rdata.type === 'not_found') {
                errMsg = ["No account was found with this email."];
            } else {
                errMsg = [rdata.message];
            }
        } else {
            errMsg = [messages?.somethingWentWrong];
        }
        dispatch(getErrors({
            errors: errMsg
        }));
    }).catch(err => {
        Logger.error({ fileLocation, err, trace: 'sendForgotPasswordOtp' })
        var errMsg = [messages?.somethingWentWrong];
        dispatch(getErrors({
            errors: errMsg
        }));
    });
}
/**
 * resend otp for registration/forgot password action
 */
export const resendOtp = (data) => dispatch => {

    AuthService.resendOtp(data).then((res) => {
        const error = res;
        var errMsg;
        if (error?.status === 200) {
            dispatch(getErrors({ errors: [] }));
            dispatch(getResponse({
                sent: true
            }))
        }
        else if (error?.status === 422) {
            const rdata = error?.message;
            errMsg = [rdata.message];
        } else {
            errMsg = [messages?.somethingWentWrong];
        }
        dispatch(getErrors({
            errors: errMsg
        }));
    }).catch(err => {
        Logger.error({ fileLocation, err, trace: 'resendOtp' })
        var errMsg = [messages?.somethingWentWrong];
        dispatch(getErrors({
            errors: errMsg
        }));
    });
}
/**
 * verify otp for forgot password action
 */
export const verifyPasswordOtp = (data, history) => dispatch => {

    AuthService.verifyPasswordOtp(data).then(res => {
        const error = res;
        var errMsg;
        if (error?.status === 200) {
            dispatch(getErrors({ errors: [] }));
            history.push('/reset-password', { 'reset_password_token': res.data.reset_password_token });
        }
        else if (error?.status === 422) {
            const rdata = error?.message;
            errMsg = [messages.invalidCode];
        } else {
            errMsg = [messages?.somethingWentWrong];
        }
        dispatch(getErrors({
            errors: errMsg
        }));
    }).catch(err => {
        Logger.error({ fileLocation, err, trace: 'verifyPasswordOtp' })
        var errMsg = [messages?.somethingWentWrong];
        dispatch(getErrors({
            errors: errMsg
        }));
    });
}
/**
 * verify otp for forgot password action
 */
export const resetPassword = (data, history) => dispatch => {

    AuthService.passwordReset(data).then((res) => {
        const error = res;
        var errMsg;
        if (error?.status === 200) {
            history.push('/')
        }
        else if (error?.status === 422) {
            const rdata = error?.message;
            errMsg = [rdata.message];
        } else {
            errMsg = [messages?.somethingWentWrong];
        }
        dispatch(getErrors({
            errors: errMsg
        }));
    }).catch(err => {
        Logger.error({ fileLocation, err, trace: 'resetPassword' })
        var errMsg = [messages?.somethingWentWrong];
        dispatch(getErrors({
            errors: errMsg
        }));
    });
}

/**
 * get terms of service
 */
export const termsofservice = () => dispatch => {

    AuthService.termsofservice().then(res => {
        const error = res;
        var errMsg;
        if (error?.status === 200) {
            dispatch(getTermsofservice({ termsofservice: res.data }));
        }
        else if (error?.status === 422) {
            const rdata = error?.message;
            errMsg = [rdata.message];
        } else {
            errMsg = [messages?.somethingWentWrong];
        }
        dispatch(getErrors({
            errors: errMsg
        }));
    }).catch(err => {
        Logger.error({ fileLocation, err, trace: 'termsofservice' })
        var errMsg = [messages?.somethingWentWrong];
        dispatch(getErrors({
            errors: errMsg
        }));
    });
}
