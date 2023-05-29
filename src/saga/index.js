import { all, fork } from 'redux-saga/effects'
import * as organizationSaga from './organization';
import * as groupsSaga from './groups';
import * as eventSaga from './event';
import * as notificationSaga from './notification';
import * as discoverSaga from './discover';
import * as adminUserSaga from './adminUsers';
import * as profileSaga from './profile';
import * as openSaga from './open';
import * as adminGroups from './adminGroups';
import * as adminEvents from './adminEvent';

export default function* rootSaga() {
  yield all([
    ...Object.values(organizationSaga),
    ...Object.values(groupsSaga),
    ...Object.values(eventSaga),
    ...Object.values(notificationSaga),
    ...Object.values(discoverSaga),
    ...Object.values(adminUserSaga),
    ...Object.values(profileSaga),
    ...Object.values(openSaga),
    ...Object.values(adminGroups),
    ...Object.values(adminEvents)
  ].map(fork));
}
