import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'
import { get } from 'lodash'
import { Table } from '../../../../components/StyledComponents'
import { MENTEE } from '../../../../constants/roles'
import UsersTableHead from './UsersTableHead'
import UsersTableRow from './UsersTableRow'

class UsersTable extends Component {
    getColumnTemplate = (role) => {
      if (role === MENTEE) {
        return '38px minmax(160px, 1.3fr) minmax(210px, 1.7fr) 42px 80px 130px minmax(230px, 3.2fr) minmax(230px, 3.2fr) 150px 115px;'
      }
      return '50px repeat(3, minmax(185px, 1.2fr));'
    }

    render() {
      const loadingIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />
      if (
        this.props.loadingAssignMentorInfo ||
        this.props.loadingMentorInfo ||
        this.props.loadingMenteeInfo
      ) {
        return (
          <Table>
            <div style={{ padding: '10px' }}>{loadingIcon}</div>
          </Table>
        )
      }

      return (
        <Table style={{ overflowY: 'auto' }}>
          <UsersTableHead
            minWidth={this.props.currentRole === MENTEE ? '1405px' : '700px'}
            columnsTemplate={this.getColumnTemplate(this.props.currentRole)}
            role={this.props.currentRole}
          />
          {
                this.props.users ?
                    this.props.users.map((user) => {
                      if ((this.props.country === 'all' || get(user, 'country') === this.props.country)
                        && (get(user, 'role') === this.props.currentRole)) {
                        return (
                          <UsersTableRow
                            minWidth={this.props.currentRole === MENTEE ? '1405px' : '700px'}
                            columnsTemplate={this.getColumnTemplate(this.props.currentRole)}
                            role={this.props.currentRole}
                            {...user}
                            coursesList={this.props.coursesList}
                            openSendSessionModal={this.props.openSendSessionModal}
                            userInfoKeys={this.props.userInfoKeys}
                            currentRole={this.props.currentRole}
                            mentorMenteeSessionObj={this.props.mentorMenteeSessionObj}
                            mentors={this.props.mentors}
                            notification={this.props.notification}
                            updateAssignedMentor={
                              (id, newMentorSessionId, menteeSessionId, topicId,
                                date, time, course) =>
                                    this.props.updateAssignedMentor(
                                      id, newMentorSessionId, menteeSessionId,
                                      topicId, date, time, course
                                    )
                            }
                            updateCurrMenteeSessionId={
                                (sessionId) => this.props.updateCurrMenteeSessionId(sessionId)
                            }
                            updateLinkedMentorId={(
                                  mentorId,
                                  status,
                                  sessionId
                                ) => this.props.updateLinkedMentorId(mentorId, status, sessionId)
                            }
                            visible={this.props.visible}
                          />
                        )
                      }

                      return <div />
                    }) :
                    <div />
            }
        </Table>
      )
    }
}

UsersTable.propTypes = {
  currentRole: PropTypes.string.isRequired,
  users: PropTypes.shape([]),
  mentors: PropTypes.shape([]).isRequired,
  userInfoKeys: PropTypes.shape({}).isRequired,
  mentorMenteeSessionObj: PropTypes.shape({}).isRequired,
  notification: PropTypes.shape({}).isRequired,
  updateAssignedMentor: PropTypes.func.isRequired,
  updateCurrMenteeSessionId: PropTypes.func.isRequired,
  updateLinkedMentorId: PropTypes.func.isRequired
}

UsersTable.defaultProps = {
  users: []
}

export default UsersTable
