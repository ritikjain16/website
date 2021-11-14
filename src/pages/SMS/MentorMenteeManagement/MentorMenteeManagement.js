import React, { Component } from 'react'
import { Steps } from 'antd'
import { Link } from 'react-router-dom'
import getDataFromLocalStorage from '../../../utils/extract-from-localStorage'
import { TRANSFORMATION_ADMIN, TRANSFORMATION_TEAM } from '../../../constants/roles'

class MentorMenteeManagement extends Component {
  render() {
    const savedRole = getDataFromLocalStorage('login.role')
    const { current, totalCount } = this.props
    const { Step } = Steps
    return (
      <Steps
        current={current}
        style={{
          width: '100%',
          marginBottom: '20px',
        }}
      >
        <Step
          status='process'
          title={
            <Link to='/sms/completedSessions'>
              Mentee Sessions {current === 0 && `(${!totalCount ? 0 : totalCount})`}
            </Link>
          }
        />
        <Step
          status='process'
          title={
            <Link to='/sms/mentor-sales-dashboard'>
              Sales Dashboard {current === 1 && `(${!totalCount ? 0 : totalCount})`}
            </Link>
          }
        />
        {
          (savedRole !== TRANSFORMATION_TEAM || savedRole !== TRANSFORMATION_ADMIN) &&
          <Step
            status='process'
            title={
              <Link to='/sms/mentor-conversion'>
                Conversions {current === 2 && `(${!totalCount ? 0 : totalCount})`}
              </Link>
            }
          />
        }
      </Steps>
    )
  }
}

export default MentorMenteeManagement
