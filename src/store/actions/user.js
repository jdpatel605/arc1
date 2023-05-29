import AuthService from "../../services/AuthService";
import history from "../../history/history";
import {setCurrentUser, getErrors, logoutUser, setUserOrgList} from "./actionCreators";
import {messages} from '../../utils/messages';

function profile(dispatch) {
    const token = AuthService.getToken();
    if(token) {
        AuthService.getProfile({token: token}).then(res => {
            const error = res;
            var errMsg;
            if(error?.status === 200) {
                dispatch(setCurrentUser(res.data));
            }
            else if(error?.status === 422) {
                const rdata = error?.message;
                if(rdata.type === 'unauthorized') {
                    dispatch(logoutUser());
                    history.push('/login');
                }
                else {
                    errMsg = [rdata.message];
                }
            } else {
                errMsg = [messages?.somethingWentWrong];
            }
            dispatch(getErrors({
                errors: errMsg
            }));
        }).catch(err => {
            var errMsg = [messages?.somethingWentWrong];
            dispatch(getErrors({
                errors: errMsg
            }));
        });
    }
}
/**
 * Get user profile based on token from class
 */
export function getProfile() {
    return dispatch => {
        return new Promise((resolve, reject) => {
            profile(dispatch);
            resolve();
        });
    }
}
/**
 * Get user profile based on token from hook
 */
export function getProfileUsingHook(dispatch) {

    profile(dispatch);

}
/**
 * Get user organizations
 */
export const getMyOrgs = (dispatch, params) => {
    dispatch(setUserOrgList({loading: true, data: {}, first: false}))
    const token = AuthService.getToken();
    if(token) {
        AuthService.getMyOrg({token: token, ...params}).then(resp => {
            const error = resp;
            var errMsg;
            if(error?.status === 200) {
                dispatch(setUserOrgList({loading: false, data: resp.data, first: false}));
            }
            else if(error?.status === 422) {
                const rdata = error?.message;
                if(rdata.type === 'unauthorized') {
                    dispatch(logoutUser());
                    history.push('/login');
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
            var errMsg = [messages?.somethingWentWrong];
            dispatch(getErrors({
                errors: errMsg
            }));
        });
    }
}
