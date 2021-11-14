import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import getDataFromLocalStorage from './utils/extract-from-localStorage'
import { TRANSFORMATION_TEAM, TRANSFORMATION_ADMIN } from './constants/roles'
import { checkAllowedRoutes } from './pages/UserDashboard/rolesToRouteMap'

const PrivateRoute = ({ component: Component, componentName, hasLogin, path, ...rest }) => {
  const savedRole = getDataFromLocalStorage('login.role')
  const transformationTeamComponents = ['UmsDashboard', 'SlotsInfo']
  const transformationAdminComponents = ['UmsDashboard', 'CompletedSessions', 'SlotsInfo']
  return (
    <Route
      {...rest}
      render={props => {
        if (hasLogin) {
          if (
            (savedRole === TRANSFORMATION_TEAM &&
              transformationTeamComponents.findIndex(component => component === componentName) ===
                -1) ||
            (savedRole === TRANSFORMATION_ADMIN &&
              transformationAdminComponents.findIndex(component => component === componentName) ===
                -1)
          ) {
            return (
              <Redirect
                to={{
                  pathname: '/ums/dashboard'
                }}
              />
            )
          } else if (savedRole &&
            savedRole !== TRANSFORMATION_TEAM && savedRole !== TRANSFORMATION_ADMIN
            && !checkAllowedRoutes(path)) {
            return <Redirect to='/' />
          }
          return <Component {...props} />
        }
        return (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: '/' }
            }}
          />
        )
      }}
    />
  )
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.shape({}).isRequired,
  hasLogin: PropTypes.bool.isRequired
}

export default connect(state => ({
  hasLogin: state.login.hasLogin
}))(PrivateRoute)
