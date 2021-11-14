/* eslint-disable no-console */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'
import { sortBy, get } from 'lodash'
import { fromJS } from 'immutable'
import MainModal from '../../../../components/MainModal'
import UsersTable from '../UsersTable'
import { MENTOR, MENTEE } from '../../../../constants/roles'
import hs from '../../../../utils/scale'
import fetchAssignMentorInfo from '../../../../actions/slots/fetchAssignMentorInfo'
import { filterKey } from '../../../../utils/data-utils'
import deleteMentorMenteeSession from '../../../../actions/sessions/deleteMentorMenteeSession'
import addMentorMenteeSession from '../../../../actions/sessions/addMentorMenteeSession'
import SlotsInfoStyle from '../../SlotsInfo.style'

class UsersInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mentorMenteeSessionObj: {},
      assigningMentor: false,
      loadingAssignMentorInfo: false,
      updatingAssignedMentor: false,
      newMentorMenteeSessionInfo: {},
      currMenteeSessionId: '',
      newlyAddedMentorMenteeSessions: [],
      linkedMentorIdsArr: [],
      newAssignedMentorMenteeSession: [],
      updatingSessionId: '',
      allMentors: [],
      mentorsArray: []
    }
  }

  getFinalStatus = (prevStatus, currStatus, key, statusType) => (
    (
      prevStatus && currStatus &&
            (
              prevStatus.toJS()[key] &&
                !prevStatus.toJS()[key][statusType]
            ) &&
            (currStatus.toJS()[key] && currStatus.toJS()[key][statusType])
    ) || (
      !prevStatus && currStatus &&
            (currStatus.toJS()[key] && currStatus.toJS()[key][statusType])
    ) || (
      prevStatus && currStatus &&
            !prevStatus.toJS()[key] &&
            (currStatus.toJS()[key] && currStatus.toJS()[key][statusType])
    )
  )

  getMentorMenteeSessionObj = (sessions, mentors) => {
    const mentorMenteeSessionObj = {}
    const sortedSessions = sessions ? sortBy(sessions.toJS(), 'menteeSessionCreatedAt') : []
    sortedSessions.forEach(session => {
      const mentor = mentors ? mentors.toJS().filter(
        _m => _m.sessionId === get(session, 'mentorSession.id') && !_m.fromMentorMenteeSession
      ) : []
      if (mentor.length) {
        if (get(session, 'menteeSession.id')) {
          mentorMenteeSessionObj[session.menteeSession.id] = {
            id: session.id,
            mentor,
            present: true,
            sessionStatus: session.sessionStatus,
            sendSessionLink: session.sendSessionLink
          }
        }
      } else {
        if (get(session, 'mentorSession.user')) {
          session.mentorSession.user.sessionId = get(session, 'mentorSession.id')
        }
        if (get(session, 'menteeSession.id')) {
          mentorMenteeSessionObj[session.menteeSession.id] = {
            id: session.id,
            mentor: get(session, 'mentorSession.user')
              ? [session.mentorSession.user]
              : '',
            present: false,
            sessionStatus: session.sessionStatus
          }
        }
      }
    })

    return mentorMenteeSessionObj
  }

  mergeSessions = (_s1, _s2) => {
    const _sMerged = []
    if (_s1 && _s2) {
      _s1.forEach(s => _sMerged.push(s))
      _s2.forEach(s => _sMerged.push(s))
    }

    return fromJS(_sMerged)
  }

  async componentDidUpdate(prevProps) {
    const {
      currentRole,
      userInfoKeys,
      mentorSessionStatus,
      mentorMenteeSessions,
      usersFromStore,
      users,
      mentorMenteeSessionAddStatus,
      mentorMenteeSessionDeleteStatus,
      notification,
      loadingMenteeInfo
    } = this.props
    if (currentRole === MENTEE && get(prevProps, 'loadingMenteeInfo') && !loadingMenteeInfo) {
      const menteeSessionsIds = []
      if (users) {
        users.forEach(user => menteeSessionsIds.push(user.sessionId))
      }
      await fetchAssignMentorInfo(userInfoKeys.date, userInfoKeys.time,
        menteeSessionsIds, true)
    }

    const key = `mentorSession/${new Date(userInfoKeys.date).setHours(0, 0, 0, 0)}/${userInfoKeys.time}`

    if (this.getFinalStatus(prevProps.mentorSessionStatus, mentorSessionStatus, key, 'loading')) {
      this.setState({
        loadingAssignMentorInfo: true
      })
    }
    if (this.getFinalStatus(prevProps.mentorSessionStatus, mentorSessionStatus, key, 'success')) {
      if (mentorMenteeSessions && usersFromStore) {
        const mentors = filterKey(usersFromStore, key)
        const sessions = filterKey(mentorMenteeSessions, key)
        const mentorMenteeSessionObj = this.getMentorMenteeSessionObj(sessions, mentors)
        this.setState({
          mentorMenteeSessionObj,
          allMentors: mentors && mentors.toJS() ? mentors.toJS() : []
        }, this.getMentors)
      }

      if (this.state.loadingAssignMentorInfo) {
        this.setState({
          loadingAssignMentorInfo: false
        })
      }

      if (this.state.linkedMentorIdsArr.length) {
        this.setState({
          linkedMentorIdsArr: []
        })
      }
    }

    if (this.getFinalStatus(prevProps.mentorMenteeSessionAddStatus, mentorMenteeSessionAddStatus, `${key}/${this.state.currMenteeSessionId}`, 'loading')) {
      if (!this.state.updatingAssignedMentor) {
        this.setState({
          assigningMentor: true
        })
        notification.open({
          key: 'loading',
          message: 'Assigning mentor...',
          icon: <Icon type='loading' />,
          duration: 0
        })
      }
    }

    if (this.getFinalStatus(prevProps.mentorMenteeSessionAddStatus, mentorMenteeSessionAddStatus, `${key}/${this.state.currMenteeSessionId}`, 'success')) {
      const mentors = filterKey(usersFromStore, key)
      const sessions = filterKey(mentorMenteeSessions, key)
      const newlyAddedSession = []
      this.state.newlyAddedMentorMenteeSessions.forEach(id => {
        const _s = filterKey(mentorMenteeSessions, `${key}/${id}`)
        if (_s && _s.toJS().length) {
          newlyAddedSession.push(_s.toJS()[0])
        }
      })

      const mergedSessions = sessions && newlyAddedSession.length
        ? this.mergeSessions(sessions.toJS(), newlyAddedSession) : sessions
      const mentorMenteeSessionObj = this.getMentorMenteeSessionObj(mergedSessions, mentors)
      if (this.state.assigningMentor) {
        this.setState({
          mentorMenteeSessionObj,
          assigningMentor: false
        }, () => {
          notification.close('loading')
          notification.success({
            message: 'Mentor assigned'
          })
        })
      }
      if (this.state.updatingAssignedMentor) {
        this.setState({
          mentorMenteeSessionObj,
          updatingAssignedMentor: false
        }, () => {
          notification.close('loading')
          notification.success({
            message: 'New mentor assigned!'
          })
        })
      }
      const { updatingSessionId, allMentors } = this.state
      const newData = get(mentorMenteeSessionObj[updatingSessionId], 'mentor', [])
      const newMentor = mentors && mentors.toJS().length > 0 ? mentors.toJS()[0] : null
      const filtedMentor = allMentors.filter(mentor => get(mentor, 'id') !== get(newMentor, 'id'))
      filtedMentor.push(newMentor)
      if (newData && newData.length > 0) {
        this.setState({
          newAssignedMentorMenteeSession: newData,
          allMentors: filtedMentor
        }, () => this.getMentors(true))
      }
      // await fetchAssignMentorInfo(userInfoKeys.date, userInfoKeys.time, menteeSessionsIds)
    }

    if (this.getFinalStatus(prevProps.mentorMenteeSessionDeleteStatus, mentorMenteeSessionDeleteStatus, key, 'loading')) {
      if (!this.state.updatingAssignedMentor) {
        notification.open({
          key: 'loading',
          message: 'Removing assigned mentor...',
          icon: <Icon type='loading' />,
          duration: 0
        })
      } else if (this.state.updatingAssignedMentor) {
        notification.open({
          key: 'loading',
          message: 'Updating assigned mentor...',
          icon: <Icon type='loading' />,
          duration: 0
        })
      }
    }

    if (this.getFinalStatus(prevProps.mentorMenteeSessionDeleteStatus, mentorMenteeSessionDeleteStatus, key, 'success')) {
      if (mentorMenteeSessions && usersFromStore) {
        const mentors = filterKey(usersFromStore, key)
        const sessions = filterKey(mentorMenteeSessions, key)
        const newlyAddedSession = []
        this.state.newlyAddedMentorMenteeSessions.forEach(id => {
          const _s = filterKey(mentorMenteeSessions, `${key}/${id}`)
          if (_s && _s.toJS().length) {
            newlyAddedSession.push(_s.toJS()[0])
          }
        })

        const mergedSessions = sessions && newlyAddedSession.length
          ? this.mergeSessions(sessions.toJS(), newlyAddedSession) : sessions
        const mentorMenteeSessionObj = this.getMentorMenteeSessionObj(mergedSessions, mentors)
        this.setState({
          mentorMenteeSessionObj
        }, async () => {
          if (!this.state.updatingAssignedMentor) {
            notification.close('loading')
            notification.success({
              message: 'Assigned mentor removed'
            })
          } else if (this.state.updatingAssignedMentor) {
            const {
              mentorSessionConnectedId, menteeSessionConnectedId,
              topicConnectedId, date, time, input, selectedCourse
            } = this.state.newMentorMenteeSessionInfo
            addMentorMenteeSession(
              mentorSessionConnectedId, menteeSessionConnectedId,
              topicConnectedId, date, time, input, null, selectedCourse
            )
          }
        })
      }
    }
  }

  getMentors = (mentorStatus = false, mentorId) => {
    const { allMentors } = this.state
    if (mentorStatus === true) {
      const newMentorsArray = []
      const { newAssignedMentorMenteeSession } = this.state
      if (allMentors && allMentors.length > 0) {
        allMentors.forEach(mentor => {
          if (get(mentor, 'role') === MENTOR) {
            const menteeSessionsArray = []
            newAssignedMentorMenteeSession.forEach(session => {
              if (get(session, 'existMenteeSession', []) && session.id !== mentor.id) {
                get(session, 'existMenteeSession', []).forEach(mSession => menteeSessionsArray.push(mSession.id))
              }
            })
            if (mentorId && get(mentor, 'id') === mentorId) {
              const { updatingSessionId } = this.state
              mentor.existMenteeSession = get(mentor, 'existMenteeSession',
                []).filter(mSession => get(mSession, 'id') !== updatingSessionId)
            } else {
              mentor.existMenteeSession = get(mentor, 'existMenteeSession',
                []).filter(mSession => !menteeSessionsArray.includes(get(mSession, 'id')))
            }
            newMentorsArray.push(mentor)
          } else {
            newMentorsArray.push(mentor)
          }
        })
        this.setState({
          mentorsArray: sortBy(newMentorsArray, 'createdAt'),
          newAssignedMentorMenteeSession: [],
          updatingSessionId: ''
        })
      }
    } else if (allMentors.length) {
      if (this.state.linkedMentorIdsArr.length) {
        allMentors.forEach((_m, index) => {
          if (
            this.state.linkedMentorIdsArr.includes(_m.id)
          ) {
            allMentors.splice(index, 1)
          }
        })
        this.setState({
          mentorsArray: sortBy(allMentors, 'createdAt'),
        })
      }
      this.setState({
        mentorsArray: sortBy(allMentors, 'createdAt'),
      })
    }
  }

  updateAssignedMentor = (id, newMentorSessionId, menteeSessionId, topicId, date, time, course) => {
    this.updateCurrMenteeSessionId(menteeSessionId)
    this.setState({
      updatingAssignedMentor: true,
      newMentorMenteeSessionInfo: {
        mentorSessionConnectedId: newMentorSessionId,
        menteeSessionConnectedId: menteeSessionId,
        topicConnectedId: topicId,
        date,
        time,
        input: { sessionStatus: 'allotted' },
        selectedCourse: course
      }
    }, async () => {
      const key = `mentorSession/${new Date(date).setHours(0, 0, 0, 0)}/${time}`
      try {
        await deleteMentorMenteeSession(id, key)
      } catch (error) {
        console.log(error)
      }
    })
  }

  updateCurrMenteeSessionId = (sessionId) => {
    const currArr = this.state.newlyAddedMentorMenteeSessions
    currArr.push(sessionId)
    this.props.updateMenteeIdKeys(currArr)
    this.setState({
      currMenteeSessionId: sessionId,
      newlyAddedMentorMenteeSessions: currArr
    })
  }

  render() {
    const { visible, title, closeModal, currentRole, coursesList } = this.props
    const flexStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
    return (
      <div style={{ paddingLeft: `${hs(30)}px` }}>
        <MainModal
          visible={visible}
          title={[
            <div style={{ ...flexStyle, width: '95%' }}>
              {title}
              <div style={flexStyle}>
                <SlotsInfoStyle.StyledIndicator />
                Session Logs
              </div>
            </div>
          ]}
          width={currentRole === MENTOR ? '750px' : '1385px'}
          onCancel={() => closeModal()}
          maskClosable
          font='Nunito'
          footer={[
            <div />
            ]}
        >
          <UsersTable
            visible={visible}
            currentRole={currentRole}
            {...this.props}
            coursesList={coursesList}
            usersFromStore={this.props.usersFromStore}
            userInfoKeys={this.props.userInfoKeys}
            mentorMenteeSessionObj={this.state.mentorMenteeSessionObj}
            mentors={this.state.mentorsArray}
            loadingAssignMentorInfo={this.state.loadingAssignMentorInfo}
            loadingMentorInfo={this.props.loadingMentorInfo}
            loadingMenteeInfo={this.props.loadingMenteeInfo}
            notification={this.props.notification}
            updateAssignedMentor={
              (id, newMentorSessionId, menteeSessionId, topicId, date, time, course) => {
                this.updateAssignedMentor(
                      id, newMentorSessionId, menteeSessionId, topicId, date, time, course
                )
                this.setState({
                  updatingSessionId: menteeSessionId
                })
              }
            }
            updateCurrMenteeSessionId={
              (sessionId) => {
                this.updateCurrMenteeSessionId(sessionId)
                this.setState({
                  updatingSessionId: sessionId
                })
              }
            }
            updateLinkedMentorId={
              (mentorId, status, sessionId) => {
                const currArr = this.state.linkedMentorIdsArr
                if (!status) {
                  currArr.push(mentorId)
                  this.setState({
                    linkedMentorIdsArr: currArr
                  })
                }
                this.setState({
                  updatingSessionId: sessionId
                })
                this.getMentors(true, mentorId)
              }
            }
            country={this.props.country}
          />
        </MainModal>
      </div>
    )
  }
}

UsersInfo.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  visible: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  currentRole: PropTypes.string.isRequired,
  userInfoKeys: PropTypes.shape({}).isRequired,
  usersFromStore: PropTypes.shape([]).isRequired,
  users: PropTypes.shape([]).isRequired,
  mentorMenteeSessionAddStatus: PropTypes.shape({}).isRequired,
  mentorMenteeSessionDeleteStatus: PropTypes.shape({}).isRequired,
  notification: PropTypes.shape({}).isRequired
}

export default UsersInfo
