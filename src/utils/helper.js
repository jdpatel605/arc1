import { default as momentTz } from 'moment-timezone';

export const Helper = {
  setReferrerURL, getReferrerURL, getToken, authHeader, authHeaderByEvent, textLimit, minutesToHours,
  convertDateTz, formatDate, getTimeZone, formatDateTz, formatDateTimezone, getIntialName, setAudioVideoSettingsInStorage,
  getAudioVideoSettings, getAppEnv, appVersion, OSName, getMarketingUrl
}
const fallBackTimeZone = 'UTC';

/**
* Set referrer URL
*
*/
function setReferrerURL() {
  var url = new URL(window.location.href);
  url = url.pathname + url.search;
  if(url === '/login' || url === '/logout') {
    url = '/group';
  }
  let refUrl = localStorage.getItem('referrer_url');
  var currentURL = new URL(window.location.href);
  currentURL = currentURL.pathname.split('/');
  if(refUrl === null && currentURL && currentURL[1] !== 'admin') {
    localStorage.setItem('referrer_url', url);
  }
  else if(refUrl) {
    localStorage.setItem('referrer_url', url);
  }
}

/**
* Get referrer URL after login
*
* @param  Boolean remove
* @return URL
*/
function getReferrerURL(remove = false) {
  let url = localStorage.getItem('referrer_url');

  if(remove === true) {
    localStorage.removeItem('referrer_url');
  }

  return (url !== null && url.trim() !== '') ? url : '/events';
}

/**
* Get access token from local storage
*
* @param  Boolean remove
* @return Token
*/
function getToken() {
  return localStorage.getItem('accessToken');
}

/**
* Generate Axios header
*
* @return Auth Object
*/
function authHeader() {
  return { Authorization: getToken() }
}

/**
* Generate Axios header specifically for Event while call the group call API
*
* @param  String event id
* @return Auth Object for event
*/
function authHeaderByEvent(id) {
  // Get the access token based on event id stored in localStorage
  const token = localStorage.getItem(id);
  const finalToken = token !== null ? token : getToken()
  return {
    Authorization: finalToken
  }
}

/**
* Truncate text
*
* @param  String text to be truncated
* @param  Integer limit
* @return truncated text
*/
function textLimit(string = "", limit = 32) {

  if(string && string.length > 32) {
    const subString = string.substr(0, limit);
    return `${subString}...`;
  }
  return string;
}

/**
* Convert minutes into hours
*
* @param  Integer minutes
* @return truncated text
*/
function minutesToHours(minutes = 0) {

  if(minutes === 0) {
    return 0
  }

  const hours = Math.floor(minutes / 60);
  const totalMinutes = minutes % 60;
  if(hours === 0) {
    return totalMinutes;
  }
  return `${hours}:${totalMinutes}`;
}

/**
* Format the date and time based on session user's timezone
*
* @param  DateTime
* @param  Boolean whether to convert into moment object or not
*/
function convertDateTz(dateTime = '', isMoment = false) {

  const tz = getTimeZone();
  const tzOffSet = momentTz().tz(tz).format('Z');

  try {
    if(dateTime !== '') {
      const tempDate = dateTime.split(" ");
      const dateTimeString = [
        tempDate[0], 'T', tempDate[1], tzOffSet
      ].join('');

      return isMoment ? momentTz(dateTimeString).tz(tz) : dateTimeString;
    } else {
      const dateTimeString = [
        momentTz().format("YYYY-MM-DD"), 'T', momentTz().format("HH:mm:00"), tzOffSet
      ].join('');

      return isMoment ? momentTz(dateTimeString).tz(tz) : dateTimeString;
    }
  } catch(error) {
    return dateTime;
  }

}

/**
* Format the date and time
*
* @param  DateTime
* @return Formatted DateTime
*/
function formatDate(dateTime = '', format = 'YYYY-MM-DD HH:mm:ss') {

  const tz = getTimeZone();
  try {
    if(dateTime !== '') {
      return momentTz(dateTime).tz(tz).format(format);
    } else {
      // return current time
      return momentTz().tz(tz).format(format);
    }
  } catch(error) {
    return dateTime;
  }

}

/**
* Format the date and time
*
* @param  DateTime
* @return Formatted DateTime
*/
function formatDateTimezone(dateTime = '', format = 'YYYY-MM-DD HH:mm:ss') {

  const tz = getTimeZone();
  try {
    if(dateTime !== '') {
      const tzDate = momentTz(dateTime).tz(tz).format(format);
      return convertDateTz(tzDate);
    } else {
      // return current time
      const tzDate = momentTz().tz(tz).format(format);
      return convertDateTz(tzDate);
    }
  } catch(error) {
    return dateTime;
  }

}

/**
* Format the date and time
*
* @param  DateTime
* @return Formatted DateTime
*/
function formatDateTz(dateTime = '', format = 'YYYY-MM-DD HH:mm:ss') {

  try {
    if(dateTime !== '') {
      const newDateTime = dateTime.substr(0, 10) + " " + dateTime.substr(11, 8);
      return momentTz(newDateTime).format(format);
    } else {
      // return current time
      return momentTz().format(format);
    }
  } catch(error) {
    return dateTime;
  }

}

/**
* Get current timezone
*
* @return String timezone
*/
function getTimeZone() {

  const currentTimeZone = localStorage.getItem('time_zone');
  return currentTimeZone && currentTimeZone !== 'null' ? currentTimeZone : fallBackTimeZone;

}

/**
* Get intial name
*
* @return String name
*/
function getIntialName(name) {
  var initials = name.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  if(initials.length === 1) {
    initials = initials + initials
  }
  return initials
}
/**
* Set audio, video, speaker settings in local storage
*/
function setAudioVideoSettingsInStorage(key, val) {
  let old = localStorage.getItem('audioVideoSettings')
  if(old) {
    old = JSON.parse(old)
  } else {
    old = {}
  }
  old[key] = val
  localStorage.setItem('audioVideoSettings', JSON.stringify(old))
}
/**
* Get audio, video speaker setting from local storage
*
* @return String or Object
*/
function getAudioVideoSettings(key = null) {
  let setting = localStorage.getItem('audioVideoSettings')
  if(setting) {
    setting = JSON.parse(setting)
  }
  if(key !== null && setting) {
    if(key in setting) {
      setting = setting[key]
    } else {
      setting = null
    }
  }
  return setting
}

function getAppEnv() {

  const url = new URL(window.location.href);
  let envText = "";
  if(url.host === "localhost:8081") {
    envText = "dev";
  } else if(url.host === "app.arcapp.dev") {
    envText = "dev";
  } else if(url.host === "qa.arcapp.dev") {
    envText = "qa";
  } else if(url.host === "app.arcapp.site") {
    envText = "stage";
  } else if(url.host === "app.wearc.com") {
    envText = ""
  } else {
    envText = ""
  }

  return envText;
}

function getMarketingUrl() {

  const url = new URL(window.location.href);
  let marketingUrl = "";
  if(url.host === "localhost:8081") {
    marketingUrl = "https://arcapp.dev/register";
  } else if(url.host === "app.arcapp.dev") {
    marketingUrl = "https://arcapp.dev/register";
  } else if(url.host === "qa.arcapp.dev") {
    marketingUrl = "https://arcapp.dev/register";
  } else if(url.host === "app.arcapp.site") {
    marketingUrl = "https:arcapp.site/register";
  } else if(url.host === "app.wearc.com") {
    marketingUrl = "https://wearc.com/register"
  } else {
    marketingUrl = ""
  }

  return marketingUrl;
}

const APP_VERSION = "1.0.0";
function appVersion() {
  const url = new URL(window.location.href);
  let appName = "";

  if(url.host === "localhost:8081") {
    appName = "DEV";
  } else if(url.host === "app.arcapp.dev") {
    appName = "DEV";
  } else if(url.host === "qa.arcapp.dev") {
    appName = "QA";
  } else if(url.host === "app.arcapp.site") {
    appName = "STAGE";
  } else if(url.host === "app.wearc.com") {
    appName = "PRODUCTION"
  } else {
    appName = url.host
  }

  appName = `ARC-${appName}`;

  return {
    appName,
    appVersion: APP_VERSION,
    appFullName: `${appName}/${APP_VERSION}`
  }

}

function OSName() {

  var OSName = "Unknown";
  const userAgent = window.navigator.userAgent;

  if(userAgent.indexOf("Windows NT 10.0") != -1) OSName = "Windows 10";
  if(userAgent.indexOf("Windows NT 6.2") != -1) OSName = "Windows 8";
  if(userAgent.indexOf("Windows NT 6.1") != -1) OSName = "Windows 7";
  if(userAgent.indexOf("Windows NT 6.0") != -1) OSName = "Windows Vista";
  if(userAgent.indexOf("Windows NT 5.1") != -1) OSName = "Windows XP";
  if(userAgent.indexOf("Windows NT 5.0") != -1) OSName = "Windows 2000";
  if(userAgent.indexOf("Mac") != -1) OSName = "Mac/iOS";
  if(userAgent.indexOf("X11") != -1) OSName = "UNIX";
  if(userAgent.indexOf("Linux") != -1) OSName = "Linux";

  return OSName;
}