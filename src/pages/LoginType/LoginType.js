/* eslint-disable no-console */
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import UserOutlined from '@ant-design/icons/UserOutlined'
import FolderOutlined from '@ant-design/icons/FolderOutlined'
import ClusterOutlined from '@ant-design/icons/ClusterOutlined'
import { Select } from 'antd'
import LoginTypeCard from './LoginType.style'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import roleToSystemMap from '../../pages/Login/roleToSystemMap'
import {
  UMS,
  CMS,
  SMS,
  TRANSFORMATION_ADMIN,
  TRANSFORMATION_TEAM
} from '../../constants/roles'

const { Option } = Select
const countries = [
  { id: 'india', name: 'India' },
  { id: 'usa', name: 'United States' }
]

class LoginType extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirectToCMS: false,
      redirectToUMS: false,
      redirectToSMS: false,
    }
  }

  componentDidMount() {
    localStorage.setItem('country', 'india')
  }

    activateRedirectToCMS = () => {
      this.setState({
        redirectToCMS: true
      })
    }

    activateRedirectToUMS = () => {
      this.setState({
        redirectToUMS: true
      })
    }

    activateRedirectToSMS = () => {
      this.setState({
        redirectToSMS: true
      })
    }

    handleCountryChange = (value) => {
      localStorage.setItem('country', value)
    }

    render() {
      const savedRole = getDataFromLocalStorage('login.role')

      if (savedRole === TRANSFORMATION_TEAM || savedRole === TRANSFORMATION_ADMIN) {
        const redirectRoute = '/ums/dashboard'
        return <Redirect to={redirectRoute} />
      }

      if (this.state.redirectToCMS) {
        const redirectRoute = '/'
        return <Redirect to={redirectRoute} />
      }

      if (this.state.redirectToUMS) {
        const redirectRoute = '/ums/dashboard'
        return <Redirect to={redirectRoute} />
      }

      if (this.state.redirectToSMS) {
        const redirectRoute = '/sms/completedSessions'
        return <Redirect to={redirectRoute} />
      }
      const allowedRoles = roleToSystemMap[getDataFromLocalStorage('login.role')]

      return (
        <LoginTypeCard.MainContainer>
          <LoginTypeCard.LoginTypeCardsContainer>
            {
              allowedRoles.includes(CMS)
                ? (
                  <LoginTypeCard>
                    <LoginTypeCard.IconContainer onClick={() => this.activateRedirectToCMS()}>
                      <FolderOutlined
                        style={{
                          fontSize: 100,
                          color: 'white'
                        }}
                      />
                    </LoginTypeCard.IconContainer>
                    <LoginTypeCard.TextContainer>
                      <LoginTypeCard.Text>CMS</LoginTypeCard.Text>
                    </LoginTypeCard.TextContainer>
                  </LoginTypeCard>
                ) : <div />
            }
            {
              allowedRoles.includes(UMS)
                ? (
                  <LoginTypeCard onClick={() => this.activateRedirectToUMS()}>
                    <LoginTypeCard.IconContainer>
                      <UserOutlined
                        style={{
                            fontSize: 100,
                            color: 'white'
                          }}
                      />
                    </LoginTypeCard.IconContainer>
                    <LoginTypeCard.TextContainer>
                      <LoginTypeCard.Text>UMS</LoginTypeCard.Text>
                    </LoginTypeCard.TextContainer>
                  </LoginTypeCard>
                ) : <div />
            }
            {
              allowedRoles.includes(SMS)
                ? (
                  <LoginTypeCard onClick={() => this.activateRedirectToSMS()}>
                    <LoginTypeCard.IconContainer>
                      <ClusterOutlined
                        style={{
                          fontSize: 100,
                          color: 'white'
                        }}
                      />
                    </LoginTypeCard.IconContainer>
                    <LoginTypeCard.TextContainer>
                      <LoginTypeCard.Text>SMS</LoginTypeCard.Text>
                    </LoginTypeCard.TextContainer>
                  </LoginTypeCard>
                ) : <div />
            }
          </LoginTypeCard.LoginTypeCardsContainer>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
            <LoginTypeCard.Dropdown
              placeholder='Select Country'
              onChange={this.handleCountryChange}
            >
              {
              countries.map((country) => (
                <Option key={country.id} value={country.id}>
                  {country.name}
                </Option>
              ))
            }
            </LoginTypeCard.Dropdown>
          </div>
        </LoginTypeCard.MainContainer>
      )
    }
}

export default LoginType
