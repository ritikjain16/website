import { FolderOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import React from 'react'
import { Redirect } from 'react-router-dom'
import UmsSmsSelector from '../../components/UmsSmsSelector'
import countryAndState from '../../constants/CountryAndStates'
import {
  ADMIN, AUDITOR, AUDIT_ADMIN, BDE,
  BDE_ADMIN,
  CMS, CMS_ADMIN, CMS_VIEWER,
  CONTENT_MAKER, COURSE_MAKER,
  MENTOR, POST_SALES, PRE_SALES, SALES_EXECUTIVE, SCHOOL_ADMIN,
  SMS, TRANSFORMATION_ADMIN, TRANSFORMATION_TEAM, UMS, UMS_ADMIN, UMS_VIEWER
} from '../../constants/roles'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import roleToSystemMap from '../Login/roleToSystemMap'
import { getUmsBlocks, getSmsBlock } from './rolesToRouteMap'
import UserDashboardStyle from './UserDashboard.style'

const { Option } = Select
class UserDashboard extends React.Component {
  componentWillMount() {
    if (!localStorage.getItem('country')) localStorage.setItem('country', 'all')
    localStorage.removeItem('block')
    const savedRole = getDataFromLocalStorage('login.role')
    if (!localStorage.getItem('type')) {
      if (savedRole === ADMIN || savedRole === MENTOR || savedRole === UMS_ADMIN ||
        savedRole === UMS_VIEWER || savedRole === SALES_EXECUTIVE || savedRole === PRE_SALES ||
        savedRole === POST_SALES || savedRole === AUDIT_ADMIN || savedRole === AUDITOR) {
        localStorage.setItem('type', UMS)
      } else if (savedRole === CMS_ADMIN || savedRole === CMS_VIEWER) {
        localStorage.setItem('type', CMS)
      } else if (savedRole === TRANSFORMATION_ADMIN || savedRole === TRANSFORMATION_TEAM) {
        localStorage.setItem('type', UMS)
      } else if (savedRole === SCHOOL_ADMIN || savedRole === BDE || savedRole === BDE_ADMIN) {
        localStorage.setItem('type', SMS)
      }
    }
  }
  renderBoxes = () => {
    const savedRole = getDataFromLocalStorage('login.role')
    const allowedRoles = roleToSystemMap[savedRole]
    if ((savedRole === CMS_ADMIN || savedRole === CMS_VIEWER) && allowedRoles.includes(CMS)) {
      return (
        <UserDashboardStyle>
          <UserDashboardStyle.IconContainer to='/dashboard' >
            <FolderOutlined
              style={{
                fontSize: 100,
                color: 'white'
              }}
            />
          </UserDashboardStyle.IconContainer>
          <UserDashboardStyle.TextContainer>
            <UserDashboardStyle.Text>CMS</UserDashboardStyle.Text>
          </UserDashboardStyle.TextContainer>
        </UserDashboardStyle>
      )
    } else if ((savedRole === TRANSFORMATION_ADMIN || savedRole === TRANSFORMATION_TEAM)
      && allowedRoles.includes(UMS)) {
      return this.renderUmsBoxes()
    }
    return this.renderUmsBoxes()
  }
  renderUmsBoxes = () => {
    const savedRole = getDataFromLocalStorage('login.role')
    const allowedRoles = getUmsBlocks(savedRole)
    return allowedRoles.map(({ blockName, routes, Icon, withUpdatedDesign }) => {
      if (withUpdatedDesign) {
        return (
          <UserDashboardStyle>
            <UserDashboardStyle.BlockContainer
              onClick={() => localStorage.setItem('block', blockName)}
              to={routes[0].route}
            >
              <Icon
                style={{
                  fontSize: 100,
                  color: '#8C61CB'
                }}
              />
              <UserDashboardStyle.BetaTag>BETA</UserDashboardStyle.BetaTag>
            </UserDashboardStyle.BlockContainer>
            <UserDashboardStyle.TextContainer>
              <UserDashboardStyle.Label>{blockName}</UserDashboardStyle.Label>
            </UserDashboardStyle.TextContainer>
          </UserDashboardStyle>
        )
      }
      return (
        <UserDashboardStyle>
          <UserDashboardStyle.IconContainer onClick={() => localStorage.setItem('block', blockName)} to={routes[0].route} >
            <Icon
              style={{
                fontSize: 100,
                color: 'white'
              }}
            />
          </UserDashboardStyle.IconContainer>
          <UserDashboardStyle.TextContainer>
            <UserDashboardStyle.Text>{blockName}</UserDashboardStyle.Text>
          </UserDashboardStyle.TextContainer>
        </UserDashboardStyle>
      )
    })
  }
  handleCountryChange = (value) => {
    localStorage.setItem('country', value)
  }
  renderSmsBoxes = () => getSmsBlock().map(({ blockName, routes }) => (
    <UserDashboardStyle>
      <UserDashboardStyle.IconContainer onClick={() => localStorage.setItem('block', blockName)} to={routes[0].route} >
        <FolderOutlined
          style={{
            fontSize: 100,
            color: 'white'
          }}
        />
      </UserDashboardStyle.IconContainer>
      <UserDashboardStyle.TextContainer>
        <UserDashboardStyle.Text>{blockName}</UserDashboardStyle.Text>
      </UserDashboardStyle.TextContainer>
    </UserDashboardStyle>
  ))
  renderCmsBoxes = () => (
    <UserDashboardStyle>
      <UserDashboardStyle.IconContainer to='/dashboard' >
        <FolderOutlined
          style={{
            fontSize: 100,
            color: 'white'
          }}
        />
      </UserDashboardStyle.IconContainer>
      <UserDashboardStyle.TextContainer>
        <UserDashboardStyle.Text>CMS</UserDashboardStyle.Text>
      </UserDashboardStyle.TextContainer>
    </UserDashboardStyle>
  )

  renderCourseMakerBox = () => (
    <UserDashboardStyle>
      <UserDashboardStyle.IconContainer to='/addCourse' >
        <FolderOutlined
          style={{
            fontSize: 100,
            color: 'white'
          }}
        />
      </UserDashboardStyle.IconContainer>
      <UserDashboardStyle.TextContainer>
        <UserDashboardStyle.Text>{COURSE_MAKER}</UserDashboardStyle.Text>
      </UserDashboardStyle.TextContainer>
    </UserDashboardStyle>
  )

  renderContentMakerBox = () => (
    <UserDashboardStyle>
      <UserDashboardStyle.IconContainer to='/content-video' >
        <FolderOutlined
          style={{
            fontSize: 100,
            color: 'white'
          }}
        />
      </UserDashboardStyle.IconContainer>
      <UserDashboardStyle.TextContainer>
        <UserDashboardStyle.Text>{CONTENT_MAKER}</UserDashboardStyle.Text>
      </UserDashboardStyle.TextContainer>
    </UserDashboardStyle>
  )

  render() {
    const type = localStorage.getItem('type')
    const savedRole = getDataFromLocalStorage('login.role')
    const allowedType = roleToSystemMap[savedRole]
    if (savedRole === TRANSFORMATION_TEAM || savedRole === TRANSFORMATION_ADMIN) {
      const redirectRoute = '/ums/dashboard'
      return <Redirect to={redirectRoute} />
    }
    if (savedRole === PRE_SALES || savedRole === POST_SALES
      || savedRole === AUDIT_ADMIN || savedRole === AUDITOR) {
      const redirectRoute = '/audit'
      return <Redirect to={redirectRoute} />
    }
    if (savedRole === BDE || savedRole === BDE_ADMIN) {
      const redirectRoute = '/bde-management'
      return <Redirect to={redirectRoute} />
    }
    return (
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          width: 'auto',
          justifyContent: 'center',
          position: 'absolute',
          top: '11px',
          right: '329px'
        }}
        >
          {allowedType.length > 1 && <UmsSmsSelector />}
          <UserDashboardStyle.Dropdown
            placeholder='Select Country'
            defaultValue={localStorage.getItem('country')}
            onChange={this.handleCountryChange}
          >
            {
              [{ countryValue: 'all', country: 'All' }, ...countryAndState].map((country) => (
                <Option key={country.countryValue} value={country.countryValue}>
                  {country.country}
                </Option>
              ))
            }
          </UserDashboardStyle.Dropdown>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
        >
          {type === UMS && this.renderBoxes()}
          {type === SMS && this.renderSmsBoxes()}
          {type === CMS && this.renderCmsBoxes()}
          {type === COURSE_MAKER && this.renderCourseMakerBox()}
          {type === CONTENT_MAKER && this.renderContentMakerBox()}
        </div>
      </div>
    )
  }
}

export default UserDashboard
