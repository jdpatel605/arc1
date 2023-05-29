import { combineReducers } from "redux";
import user from './user';
import group from './group';
import errors from './errors';
import response from './response';
import organizations from './organizations';
import organization from './organization';
import events from './events';
import notification from './notification';
import discover from './discover';
import profile from './profile';
import open from './open';
import adminGroup from './adminGroup';
import adminEvent from './adminEvent';

export default combineReducers({
  user,
  group,
  errors,
  organizations,
  response,
  organization,
  events,
  notification,
  discover,
  profile,
  open,
  adminGroup,
  adminEvent
});
