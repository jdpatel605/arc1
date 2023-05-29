import axios from 'axios'
import history from "../history/history";
import AuthService from "../services/AuthService";
import { Helper } from '../utils/helper';

axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
}, function (error) {
    // Do something with response error

    var reqPath = (error.response.config.url).split('/').pop()
    if(error.response && error.response.status === 422) {
        if(reqPath !== 'login' && (error.response.data.type === 'unauthorized' || error.response.data.message.type === 'unauthorized')) {
            Helper.setReferrerURL()
            history.push('/login');
            AuthService.logout();
            window.location.reload();
        }
    }
    if(error.response.status === 403) {
        console.log("Redirection needed !");
    }

    // Trow errr again (may be need for some other catch)
    return Promise.reject(error);
});

axios.interceptors.request.use((config) => {

    let AppDetails = "";
    try {
        const appFullName = Helper.appVersion().appFullName;
        const OSName = Helper.OSName();
        AppDetails = `${appFullName} (${OSName})`;
    } catch(error) {

    }

    config.headers["App-Details"] = AppDetails;
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axios;
