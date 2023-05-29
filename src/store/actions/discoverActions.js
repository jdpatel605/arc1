import {discoverTypes} from './types';

// Get all discover details
export const allDiscoverRequest = (string) => ({
  type: discoverTypes.ALL_DISCOVER_REQUEST,
  payload: string
});
export const allDiscoverSuccess = (data) => ({
  type: discoverTypes.ALL_DISCOVER_SUCCESS,
  payload: data
});
export const allDiscoverFailed = (data) => ({
  type: discoverTypes.ALL_DISCOVER_FAILED,
  payload: data
});
export const allDiscoverUpdate = data => ({
  type: discoverTypes.ALL_DISCOVER_UPDATE,
  payload: data
});

// Get default discover details
export const defaultDiscoverRequest = (data) => ({
  type: discoverTypes.DEFAULT_DISCOVER_REQUEST,
  payload: data
});
export const defaultDiscoverSuccess = (data) => ({
  type: discoverTypes.DEFAULT_DISCOVER_SUCCESS,
  payload: data
});
export const defaultDiscoverFailed = (data) => ({
  type: discoverTypes.DEFAULT_DISCOVER_FAILED,
  payload: data
});

// Get organization discover details
export const organizationDiscoverRequest = (string) => ({
  type: discoverTypes.ORG_DISCOVER_REQUEST,
  payload: string
});
export const organizationDiscoverSuccess = (data) => ({
  type: discoverTypes.ORG_DISCOVER_SUCCESS,
  payload: data
});
export const organizationDiscoverFailed = (data) => ({
  type: discoverTypes.ORG_DISCOVER_FAILED,
  payload: data
});

// Get group discover details
export const groupDiscoverRequest = (string) => ({
  type: discoverTypes.GRP_DISCOVER_REQUEST,
  payload: string
});
export const groupDiscoverSuccess = (data) => ({
  type: discoverTypes.GRP_DISCOVER_SUCCESS,
  payload: data
});
export const groupDiscoverFailed = (data) => ({
  type: discoverTypes.GRP_DISCOVER_FAILED,
  payload: data
});
export const groupDiscoverUpdate = data => ({
  type: discoverTypes.GRP_DISCOVER_UPDATE,
  payload: data
});

// Get event discover details
export const eventDiscoverRequest = (string) => ({
  type: discoverTypes.EVT_DISCOVER_REQUEST,
  payload: string
});
export const eventDiscoverSuccess = (data) => ({
  type: discoverTypes.EVT_DISCOVER_SUCCESS,
  payload: data
});
export const eventDiscoverFailed = (data) => ({
  type: discoverTypes.EVT_DISCOVER_FAILED,
  payload: data
});
export const eventDiscoverUpdate = (data) => ({
  type: discoverTypes.EVT_DISCOVER_UPDATE,
  payload: data
});

// Get people discover details
export const peopleDiscoverRequest = (string) => ({
  type: discoverTypes.PPL_DISCOVER_REQUEST,
  payload: string
});
export const peopleDiscoverSuccess = (data) => ({
  type: discoverTypes.PPL_DISCOVER_SUCCESS,
  payload: data
});
export const peopleDiscoverFailed = (data) => ({
  type: discoverTypes.PPL_DISCOVER_FAILED,
  payload: data
});
