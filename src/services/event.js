import axios from './axiosCommon';
import { API_URL } from '../config';
import { Helper } from './../utils/helper';
import { Logger } from './../utils/logger';

const fileLocation = "src\\services\\event.js";

export const eventServices = {
  createEvent, editEvent, myEventList, eventList, eventById, unsubscribeEvent, subscribeEvent, inviteMember,
  cancelInviteMember, memberList, hostList, participantsList, participantsInvitation, createBreakoutEvent,
  deleteEvent, ICSFileContent
}

function createEvent({ id, hostType, data }) {
  try {
    return axios.post(`${API_URL}events/${hostType}/${id}/create`, data, { headers: Helper.authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'createEvent' })
    return { status: 422, message }
  }
}

function editEvent({ id, data }) {
  try {
    let url = data.isAdmin ? `${API_URL}adminEvent/updatevent` : `${API_URL}events/${id}/update`;
    if (data.isAdmin) {
      return axios.put(url, data, { headers: Helper.authHeader() })
        .then(res => res.data)
        .catch(err => err.response.data);
    }
    else {
      return axios.patch(url, data, { headers: Helper.authHeader() })
        .then(res => res.data)
        .catch(err => err.response.data);
    }
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'editEvent' })
    return { status: 422, message }
  }
}

function deleteEvent({ id, recursion, type, isAdmin = false }) {
  try {
    return axios.post(`${API_URL}events/${id}/delete`, { recursion: recursion, type: type, isAdmin: isAdmin }, { headers: Helper.authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'deleteEvent' })
    return { status: 422, message }
  }
}

function myEventList({ page, search }) {
  try {
    return axios.get(`${API_URL}events/mine/${page}/${search}`, { headers: Helper.authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'myEventList' })
    return { status: 422, message }
  }
}

function eventList(id) {
  try {
    return axios.get(`${API_URL}organization/${id}/details`, { headers: Helper.authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'eventList' })
    return { status: 422, message }
  }
}

function subscribeEvent(id) {
  try {
    return axios.get(`${API_URL}events/${id}/subscribe`, { headers: Helper.authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'subscribeEvent' })
    return { status: 422, message }
  }
}
function unsubscribeEvent(id) {
  try {
    return axios.get(`${API_URL}events/${id}/unsubscribe`, { headers: Helper.authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'unsubscribeEvent' })
    return { status: 422, message }
  }
}

function eventById(id) {
  try {
    return axios.get(`${API_URL}events/${id}/extended`, { headers: Helper.authHeaderByEvent(id) })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'eventById' })
    return { status: 422, message }
  }
}

function createBreakoutEvent(data) {
  try {
    return axios.post(`${API_URL}events/${data.eventId}/breakout`, {}, { headers: Helper.authHeaderByEvent(data.eventId) })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'createBreakoutEvent' })
    return { status: 422, message }
  }
}

function inviteMember(data) {
  try {
    return axios.post(`${API_URL}events/${data.eventId}/invite`, data, { headers: Helper.authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'inviteMember' })
    return { status: 422, message }
  }
}
function cancelInviteMember(data) {
  try {
    return axios.delete(`${API_URL}events/${data.eventId}/cancel-invite`, data, { headers: Helper.authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'cancelInviteMember' })
    return { status: 422, message }
  }
}

function memberList({ id, page, search = 'search', attendance_status = "member", isAdmin = false }) {
  try {
    return axios.get(`${API_URL}events/member-list/${id}/${page}/${search == "" ? 'search' : search}/${isAdmin}/${attendance_status}`, { headers: Helper.authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'memberList' })
    return { status: 422, message }
  }
}

function hostList() {
  try {
    return axios.get(`${API_URL}events/hosts`, { headers: Helper.authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'hostList' })
    return { status: 422, message }
  }
}

function participantsList({ host, host_id, event_id, page, search }) {
  try {
    return axios.get(`${API_URL}events/participants/${host}/${host_id}/${event_id}/${page}?q=${search}`, { headers: Helper.authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'participantsList' })
    return { status: 422, message }
  }
}

function participantsInvitation({ type, data }) {
  try {
    return axios.post(`${API_URL}events/participants/invitation/${type}`, data, { headers: Helper.authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'participantsInvitation' })
    return { status: 422, message }
  }
}

function ICSFileContent({ id, type }) {
  try {
    return axios.get(`${API_URL}events/${id}/calendar/${type}`, { headers: Helper.authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'ICSFileContent' })
    return { status: 422, message }
  }
}
