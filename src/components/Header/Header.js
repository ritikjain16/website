/* eslint-disable no-console */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import requiredIf from 'react-required-if'
import { Link, Redirect } from 'react-router-dom'
import { Select } from 'antd'
import Head from './Header.style'
import ChangePasswordEmulator from './ChangePassword'
// import countries from '../../constants/countryNames'
import UmsSmsSelector from '../UmsSmsSelector'
import nameFormat from '../../utils/name-to-alphabet'
import { BDE, TRANSFORMATION_ADMIN, TRANSFORMATION_TEAM, BDE_ADMIN } from '../../constants/roles'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import countryAndState from '../../constants/CountryAndStates'

/**
 * responsible for rendering main header
 * @param {Object} props
 * @returns {React.ReactElement}
 */

const { Option } = Select

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      changePasswordVisible: false,
      switchToUMS: false,
      switchToCMS: false,
      switchToSMS: false,
      country: localStorage.getItem('country')
    }
  }
  componentDidMount = () => {
    const { title } = this.props
    if (title && typeof title === 'string') {
      document.title = `TMS-${process.env.REACT_APP_NODE_ENV} | ${title}`
    } else {
      document.title = `TMS-${process.env.REACT_APP_NODE_ENV}`
    }
    window.addEventListener('storage', () => {
      if (localStorage.getItem('country') !== this.state.country) {
        this.setState({
          country: localStorage.getItem('country')
        })
      }
    })
  }
  componentDidUpdate() {
    const { hasLogin, history } = this.props
    if (hasLogin === false) {
      history.push()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('storage', () => {
      if (localStorage.getItem('country') !== this.state.country) {
        this.setState({
          country: localStorage.getItem('country')
        })
      }
    })
  }

  handleCountryChange = (value) => {
    this.setState({
      country: value
    })
    localStorage.setItem('country', value)
    window.dispatchEvent(new Event('storage'))
  }

  showChangePasswordView = () => {
    this.setState({
      changePasswordVisible: true
    })
  }

  closeChangePasswordModal = () => {
    this.setState({
      changePasswordVisible: false
    })
  }

  shouldNotRedirectDirectly = systemViewPrivileges => {
    if (systemViewPrivileges && systemViewPrivileges.length > 1) {
      return true
    }
    return false
  }

  menu = onLogout => (
    <Head.Menu>
      <Head.Menu.Item key='0' onClick={() => this.showChangePasswordView()}>
        <span>Change Password</span>
      </Head.Menu.Item>
      <Head.Menu.Item key='1'>
        <Link to='/user-profile'>
          <span>Profile</span>
        </Link>
      </Head.Menu.Item>
      <Head.Menu.Item key='2' onClick={onLogout}>
        <span>Log Out</span>
      </Head.Menu.Item>
    </Head.Menu>
  )

  renderMenuOptions = (
    history,
    height,
    shouldBack,
    logout,
    title,
    name,
    backRoute,
    showCountryDropdown,
    showTypeSelector = true,
    hideTypeSelector,
    username,
    hideCountrySelector,
  ) => (
    <div>
      <Head height={height}>
        <Head.Flex>
          {shouldBack && (
            <Head.Wrapper>
              <Head.BackIcon
                type='arrow-left'
                onClick={() => {
                  // static check for audit page
                  if (title === 'Audit') {
                    history.goBack()
                  } else {
                    history.push(backRoute)
                  }
                }}
              />
            </Head.Wrapper>
          )}
          <Head.Title>{title}</Head.Title>
        </Head.Flex>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {
            !hideTypeSelector && showTypeSelector && (
              <UmsSmsSelector showSelector />
            )
          }
          {
            showCountryDropdown && !hideCountrySelector
              ? (
                <Head.Select
                  placeholder='Select Country'
                  onChange={this.handleCountryChange}
                  backgroundColor='#3f4e63'
                  color='#fff'
                  defaultValue={localStorage.getItem('country')}
                  value={this.state.country}
                >
                  {
                    [{ countryValue: 'all', country: 'All' }, ...countryAndState].map((country) => (
                      <Option key={country.countryValue} value={country.countryValue}>
                        {country.country}
                      </Option>
                    ))
                  }
                </Head.Select>
              ) : <div />
          }
          <div>{name}</div>
          <Head.Dropdown overlay={this.menu(logout)} trigger={['click']}>
            <Head.Wrapper>
              <Head.UserImage>{name ? nameFormat(name) : nameFormat(username)}</Head.UserImage>
            </Head.Wrapper>
          </Head.Dropdown>
        </div>
      </Head>
      <ChangePasswordEmulator
        visible={this.state.changePasswordVisible}
        onCancel={() => this.closeChangePasswordModal()}
      />
    </div>
  )

  render() {
    const {
      history,
      height,
      shouldBack,
      logout,
      title,
      name,
      backRoute,
      showCountryDropdown,
      showTypeSelector,
      username
    } = this.props
    if (this.state.switchToUMS) {
      const redirectRoute = '/ums/dashboard'
      return <Redirect to={redirectRoute} />
    }

    if (this.state.switchToCMS) {
      const redirectRoute = '/'
      return <Redirect to={redirectRoute} />
    }

    if (this.state.switchToSMS) {
      const redirectRoute = '/sms/dashboard'
      return <Redirect to={redirectRoute} />
    }
    const savedRole = getDataFromLocalStorage('login.role')
    const hideTypeSelector = savedRole === TRANSFORMATION_ADMIN ||
      savedRole === TRANSFORMATION_TEAM || savedRole === BDE
    // if we want to hide countrySelector or other roles, we can specify here as above
    const hideCountrySelector = savedRole === TRANSFORMATION_TEAM || savedRole === BDE_ADMIN
    return this.renderMenuOptions(
      history,
      height,
      shouldBack,
      logout,
      title,
      name,
      backRoute,
      showCountryDropdown,
      showTypeSelector,
      hideTypeSelector,
      username,
      hideCountrySelector
    )
  }
}

Header.defaultProps = {
  backRoute: null
}

Header.propTypes = {
  /** Decides whether should or not render back button */
  shouldBack: PropTypes.bool.isRequired,
  /** Text for the Title */
  title: PropTypes.string.isRequired,
  /** The height of the Header */
  height: PropTypes.string.isRequired,
  /** User's Name */
  name: PropTypes.string.isRequired,
  /** If user has login or not? */
  hasLogin: PropTypes.bool.isRequired,
  /** React router's history prop */
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  loginType: PropTypes.string.isRequired,
  showSwitchOptionToSMSOrUMS: PropTypes.bool.isRequired,
  /** route to push onclick on the back button, required only if shoulBack prop is true */
  backRoute: requiredIf(PropTypes.string, props => props.shouldBack === true),
  /** dispatches logout action */
  logout: PropTypes.func.isRequired,
  showSwitchOptionToUMS: PropTypes.bool.isRequired,
  showSwitchOptionToCMS: PropTypes.bool.isRequired,
  showSwitchOptionToSMS: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired
}

export default Header
