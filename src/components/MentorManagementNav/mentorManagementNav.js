import React, { Component } from 'react'
import { Steps } from 'antd'
import { Link } from 'react-router-dom'
import MentorManagementNavStyle from './mentorManagementNav.style'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import { TRANSFORMATION_TEAM, TRANSFORMATION_ADMIN } from '../../constants/roles'

class MentorManagementNav extends Component {
  render() {
    const savedRole = getDataFromLocalStorage('login.role')
    const { current, totalCount, userId } = this.props
    const { Step } = Steps
    const { StyledSteps } = MentorManagementNavStyle
    return (
      <div>
        <StyledSteps
          type='navigation'
          current={current}
          // onChange={this.onChange}
          className='site-navigation-steps'
        >
          <Step
            status='process'
            title={
              <Link to={userId ? `/ums/completedSessions/${userId}` : '/ums/completedSessions'}>Mentee Sessions {current === 0 && `(${!totalCount ? 0 : totalCount})`}</Link>
            }
          />
          <Step
            status='process'
            title={
              <Link to={userId ? `/ums/mentor-sales-dashboard/${userId}` : '/ums/mentor-sales-dashboard'}>
                Sales Dashboard {current === 1 && `(${!totalCount ? 0 : totalCount})`}
              </Link>
            }
          />
          {
          (savedRole !== TRANSFORMATION_TEAM && savedRole !== TRANSFORMATION_ADMIN) &&
          <Step
            status='process'
            title={<Link to={userId ? `/ums/mentor-conversion/${userId}` : '/ums/mentor-conversion'}>Conversions {current === 2 && `(${!totalCount ? 0 : totalCount})`}</Link>}
          />
          }
        </StyledSteps>
      </div>
    )
  }
}

export default MentorManagementNav
