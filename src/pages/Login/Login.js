import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import Card from './Login.style'
import LoginForm from './components/LoginForm'
import roleToSystemMap from './roleToSystemMap'
import store from '../../reducers'
import { updateHasLogin } from '../../actions/login'
import {
  UMS,
  CMS,
  ADMIN,
  MENTOR,
  UMS_ADMIN,
  UMS_VIEWER,
  TRANSFORMATION_ADMIN,
  TRANSFORMATION_TEAM
} from '../../constants/roles'

/**
 * Responsible for rendering login page
 * @returns {React.ReactElement}
 */
class Login extends Component {
  componentDidUpdate(prevProps) {
    /**
     * Every time redux store's is update Login component is
     * also updated, and runs this componentDidUpdate subsequently
     * then it checks whether error is empty, if not, it checks
     * whether error is different than previous time, as if it is same
     * then it means error prop is not the one which is updated.
     * Only and only, if error is different, push notification with error.
     */
    const { error, notification } = this.props
    if (error !== null && error !== '') {
      if (error !== prevProps.error) {
        notification.error({
          message: error
        })
      }
    }
  }
  componentDidMount = () => {
    document.title = `TMS-${process.env.REACT_APP_NODE_ENV} | Login`
  }
  handleLogin = () => {
    const { username, password, login } = this.props
    login(username, password)
  }

  hasLoginAccess = (systemViewPrivileges) => {
    if (systemViewPrivileges && systemViewPrivileges.length > 0) {
      return true
    }

    return false
  }

  shouldRedirectDirectly = (systemViewPrivileges) => {
    if (systemViewPrivileges && systemViewPrivileges.length > 1) {
      return false
    }
    return true
  }

  getRedirectDirectlyPage = (systemViewPrivileges) => {
    let redirectRoute = ''
    const userRole = this.props.role
    if (systemViewPrivileges[0] === UMS) {
      if (userRole === ADMIN || userRole === UMS_ADMIN || userRole === UMS_VIEWER) {
        redirectRoute = '/ums/dashboard'
      } else if (userRole === MENTOR) {
        redirectRoute = '/ums/sessions'
      }
    } else if (systemViewPrivileges[0] === CMS) {
      redirectRoute = '/'
    }
    return redirectRoute
  }

  render() {
    const hasLoginAccess = this.props.role
      ? this.hasLoginAccess(roleToSystemMap[this.props.role])
      : true
    if (!hasLoginAccess) {
      store.dispatch(updateHasLogin(false))
    }
    if (this.props.hasLogin) {
      if (hasLoginAccess) {
        if (localStorage && !localStorage.getItem('country')) {
          localStorage.setItem('country', 'all')
        }
        const { role } = this.props
        if (role && role === TRANSFORMATION_ADMIN || role === TRANSFORMATION_TEAM) {
          if (localStorage && !localStorage.getItem('type')) {
            localStorage.setItem('type', UMS)
          }
        }
        const { state } = this.props.location
        const shouldRedirectDirectly = this.shouldRedirectDirectly(roleToSystemMap[this.props.role])
        if (shouldRedirectDirectly) {
          const redirectRoute = this.getRedirectDirectlyPage(roleToSystemMap[this.props.role])
          return <Redirect to={redirectRoute} />
        }
        return state && state.from ? <Redirect to={state.from} /> : this.props.history.goBack()
      }
    }
    return (
      <div>
        <Card.Container>
          <Card>
            <Card.Head>
              <Card.CircleBG />
              <Card.LogoWrapper>
                <img src='images/logo.png' alt='Tekie Logo' />
                <Card.AppText>Tekie Admin</Card.AppText>
              </Card.LogoWrapper>
            </Card.Head>
            <Card.Body>
              {
                !hasLoginAccess
                    ? <Card.NoLoginAccess>No Login Access!</Card.NoLoginAccess>
                    : <div />
              }
              <LoginForm
                {...this.props}
                handleLogin={this.handleLogin}
              />
            </Card.Body>
          </Card>
        </Card.Container>
      </div>
    )
  }
}

Login.defaultProps = {
  error: ''
}

Login.propTypes = {
  /** username form username input */
  username: PropTypes.string.isRequired,
  /** password from password input */
  password: PropTypes.string.isRequired,
  /** true if user is logging in */
  isLoggingIn: PropTypes.bool.isRequired,
  /** checks whether user has logged in or not? */
  hasLogin: PropTypes.bool.isRequired,
  /** Error in User Login */
  error: PropTypes.string,
  /** action for logging user in */
  login: PropTypes.func.isRequired,
  /** action for updating username in redux store */
  updateUsername: PropTypes.func.isRequired,
  /** action for updateing password in redux store */
  updatePassword: PropTypes.func.isRequired,
  /** react router's state */
  location: PropTypes.shape({
    state: PropTypes.shape({
      from: PropTypes.shape({})
    })
  }).isRequired,
  /** notification object provided by antd's form */
  notification: PropTypes.shape({}).isRequired
}

export default Login
