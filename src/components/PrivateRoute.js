import React from 'react';
import PropTypes from 'prop-types';
import {Route, Redirect} from 'react-router-dom';
import {Helper} from '../utils/helper';

const redirectToLogin = () => {
  Helper.setReferrerURL();
  return <Redirect to='/login' />
}

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={(props) => (
    localStorage.getItem('is_login')
      ? <Component {...props} />
      : redirectToLogin()
  )} />
)

PrivateRoute.propTypes = {
  path: PropTypes.string,
};
PrivateRoute.defaultProps = {
  path: '',
};

export default PrivateRoute
