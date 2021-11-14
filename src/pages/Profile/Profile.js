/* eslint-disable max-len, jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react'
import { Icon, Pagination, Popconfirm, Select, Input, Tooltip, Switch } from 'antd'
import { get, sortBy } from 'lodash'
import { fromJS } from 'immutable'
import { Link } from 'react-router-dom'
import store from '../../reducers'
import fetchProfileUserInfo from '../../actions/profile/fetchProfileUserInfo'
import { vsValue } from '../../utils/scale'
import fetchProfileInfo from '../../actions/profile/fetchProfileInfo'
import fetchConvertedUserInfo from '../../actions/profile/fetchConvertedUserInfo'
import EditMentorModal from './components/EditMentorModal'
import './profile.scss'
import updateAllottedMentor from '../../actions/profile/updateAllottedMentor'
import { filterKey } from '../../utils/data-utils'
import EditSkillLevelModal from './components/EditSkillLevelModal'
import updateSkillLevel from '../../actions/profile/updateSkillLevel'
import { loadStateFromLocalStorage } from '../../utils/localStorage'
import isUserWrite from '../../utils/userRolePermissions/isUserWrite'
import formatDate from '../../utils/formatDate'
import getSlotLabel from '../../utils/slots/slot-label'
import SessionModal from '../SessionManagement/components/SessionModal/SessionModal'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import addMenteeSession from '../../actions/profile/addMenteeSession'
import deleteMenteeSession from '../../actions/profile/deleteMenteeSession'
import addMentorMenteeSession from '../../actions/sessions/addMentorMenteeSession'
import updateMenteeSession from '../../actions/profile/updateMenteeSession'
import fetchPaidSession from '../../actions/profile/fetchPaidSessions'
import updateSession from '../../actions/sessions/updateSession'
import addSession from '../../actions/sessions/addSession'
import { MENTOR } from '../../constants/roles'
import ProfileTable from './Profile.style'

const seeMentorColRoles = ['admin', 'umsAdmin', 'umsViewer']

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [],
      data: [],
      userIdArr: [],
      openEditMentorModal: false,
      salesOpIdSelected: '',
      mentors: [],
      defaultMentorId: '',
      isEditingMentor: false,
      openSkillLevelEditModal: false,
      userTopicComponentStatusIdSelected: '',
      defaultSkillLevel: '',
      isEditingSkill: false,
      currentPageNumber: 1,
      mentorMenteeSessionObj: {},
      topics: [],
      sessionModalVisible: false,
      nextTopicIdToBook: '',
      menteeId: '',
      menteeSessionsObj: {},
      selectedMentorId: '',
      menteeBookingInput: {},
      bookedMenteeSessionId: '',
      bookedSessionDate: '',
      bookedSessionTime: '',
      mentorSessionId: '',
      menteeSessionId: '',
      selectedDate: new Date(),
      sessionToEdit: {},
      filterOptions: ['Name', 'Email', 'Phone No.'],
      searchKey: 'All',
      searchValue: '',
      manageKidsFilter: null,
      selectedCourse: '',
      assigningMentor: false,
      showNotWonLeads: false
    }
  }

  getLoggedInUserRole = () => {
    const savedState = loadStateFromLocalStorage()
    return get(savedState, 'login.role')
  }

  async componentDidMount() {
    if (seeMentorColRoles.includes(this.getLoggedInUserRole())) {
      await fetchConvertedUserInfo({ skipCount: 0, showNotWonLeads: this.state.showNotWonLeads })
      await fetchProfileUserInfo('mentor')
    } else {
      const savedState = loadStateFromLocalStorage()
      await fetchConvertedUserInfo({
        skipCount: 0, mentorId: get(savedState, 'login.id'), showNotWonLeads: this.state.showNotWonLeads
      })
    }
  }

  closeSessionModal = () => this.setState({ sessionModalVisible: false, editingSession: false })

  onEditMentorClick = (salesOpId, mentorId) => {
    this.setState({
      openEditMentorModal: true,
      salesOpIdSelected: salesOpId,
      defaultMentorId: mentorId
    })
  }

  onEditSkillLevelClick = (userTopicComponentStatusId, skillLevel) => {
    this.setState({
      openSkillLevelEditModal: true,
      userTopicComponentStatusIdSelected: userTopicComponentStatusId,
      defaultSkillLevel: skillLevel
    })
  }

  getMentorCellData = (mentorName, mentorId, salesOpId) => (
    <div className='mentorSkillDateCell'>
      <div className='mentorName'>{mentorName}</div>
      {
        mentorName !== '-' && isUserWrite()
          ? (
            <Icon
              onClick={() => this.onEditMentorClick(salesOpId, mentorId)}
              style={{ fontSize: 18, color: '#66a3e0', cursor: 'pointer' }}
              type='edit'
            />
          ) : <div />
      }
    </div>
  )

  getParentCellData = (name, email, number) => (
    <div className='parentCell'>
      <div>{`Name: ${name}`}</div>
      <div>{`Email: ${email}`}</div>
      <div>{`Phone: ${number}`}</div>
    </div>
  )

  getSkillLevelCellData = (skillLevel, userTopicComponentStatusId) => (
    <div className='mentorSkillDateCell'>
      <div className='skillLevel'>{skillLevel}</div>
      {
        isUserWrite()
          ? (
            <Icon
              onClick={() => this.onEditSkillLevelClick(userTopicComponentStatusId, skillLevel)}
              style={{ fontSize: 18, color: '#66a3e0', cursor: 'pointer' }}
              type='edit'
            />
          ) : <div />
      }
    </div>
  )

  getDateCellData = (
    date,
    time,
    sessionId,
    mentorMenteeSessionId,
    mentorId,
    userId,
    topicId,
    type,
    user
  ) => {
    if (type === 'book') {
      if (get(user, 'client.studentProfile.batch')) {
        return (
          <Popconfirm
            title='Cannot book a session as student is already in batch.'
            placement='topRight'
            okText='View Batch Session.'
            cancelText='Cancel'
            onConfirm={() => {
              this.props.history.push(`/ums/assignTimetable/${get(user, 'client.studentProfile.batch.code')}`)
            }}
            key='view'
            overlayClassName='popconfirm-overlay-primary'
          >
            <div className='bookSessionButton'>
              Book
            </div>
          </Popconfirm>
        )
      }
      if (get(user, 'isCompleted', false)) {
        return (
          <span>Course completed</span>
        )
      }
      return (
        // eslint-disable-next-line max-len
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div
          className='bookSessionButton'
          style={!isUserWrite() ? { cursor: 'not-allowed' } : {}}
          onClick={() => {
            if (isUserWrite()) {
              this.setState({
                sessionModalVisible: true,
                nextTopicIdToBook: topicId,
                menteeId: userId,
                selectedMentorId: !seeMentorColRoles.includes(this.getLoggedInUserRole())
                  ? getDataFromLocalStorage('login.id')
                  : mentorId,
                menteeBookingInput: {},
                sessionToEdit: {
                  course: get(user, 'course'),
                  user: {
                    id: !seeMentorColRoles.includes(this.getLoggedInUserRole())
                      ? getDataFromLocalStorage('login.id')
                      : mentorId
                  },
                },
                selectedDate: new Date()
              })
            }
          }}
        >
          Book
        </div>
      )
    } else if (type === 'edit') {
      if (get(user, 'client.studentProfile.batch')) {
        return (
          <div className='mentorSkillDateCell'>
            <div className='date'>{date.formattedDate}</div>
            <div className='time'>{time.label}</div>
            {
              isUserWrite()
                ? (
                  <Popconfirm
                    title='Cannot Edit a session as student is already in batch.'
                    placement='topRight'
                    okText='View Batch Session.'
                    cancelText='Cancel'
                    onConfirm={() => {
                      this.props.history.push(`/ums/assignTimetable/${get(user, 'client.studentProfile.batch.code')}`)
                    }}
                    key='view'
                    overlayClassName='popconfirm-overlay-primary'
                  >
                    <Icon
                      style={{ fontSize: 18, color: '#66a3e0', cursor: 'pointer' }}
                      type='edit'
                    />
                  </Popconfirm>
                ) : <div />
            }
            <div style={{ marginLeft: '4px' }} />
            {
              isUserWrite()
                ? (
                  <Popconfirm
                    title='Cannot delete a session as student is already in batch.'
                    placement='topRight'
                    okText='View Batch Session.'
                    cancelText='Cancel'
                    onConfirm={() => {
                      this.props.history.push(`/ums/assignTimetable/${get(user, 'client.studentProfile.batch.code')}`)
                    }}
                    key='view'
                    overlayClassName='popconfirm-overlay-primary'
                  >
                    <Icon
                      style={{ fontSize: 18, color: '#66a3e0', cursor: 'pointer' }}
                      type='delete'
                    />
                  </Popconfirm>
                ) : <div />
            }
          </div>
        )
      }
      return (
        <div className='mentorSkillDateCell'>
          <div className='date'>{date.formattedDate}</div>
          <div className='time'>{time.label}</div>
          {
            isUserWrite()
              ? (
                <>
                  <Icon
                    style={{ fontSize: 18, color: '#66a3e0', cursor: 'pointer' }}
                    type='edit'
                    onClick={
                    () => {
                      const sessionToEdit = {
                        availabilityDate: new Date(date.rawDate),
                        [`slot${time.slot}`]: true,
                        user: {
                          id:
                            mentorId ||
                            (seeMentorColRoles.includes(this.getLoggedInUserRole()) ? 'ALL' : getDataFromLocalStorage('login.id'))
                        },
                        course: get(user, 'course'),
                        mentorMenteeSessionId,
                        selectedSlot: time.slot,
                      }
                      this.setState({
                        bookedMenteeSessionId: sessionId,
                        sessionModalVisible: true,
                        editingSession: true,
                        sessionToEdit,
                        menteeId: userId,
                        nextTopicIdToBook: topicId,
                        selectedDate: new Date(date.rawDate),
                        selectedMentorId: seeMentorColRoles.includes(this.getLoggedInUserRole())
                          ? mentorId
                          : getDataFromLocalStorage('login.id')
                      })
                    }
                  }
                  />
                </>
              ) : <div />
          }
          <div style={{ marginLeft: '4px' }} />
          {
            isUserWrite()
              ? (
                <Popconfirm
                  onConfirm={() => this.setState({
                    bookedMenteeSessionId: sessionId
                  }, () => {
                    deleteMenteeSession(sessionId, mentorMenteeSessionId)
                    if (mentorMenteeSessionId) {
                      store.dispatch({
                        type: 'mentorMenteeSession/delete/success',
                        payload: fromJS({
                          extractedData: {
                            completedSession: {
                              id: mentorMenteeSessionId
                            }
                          }
                        }),
                        autoReducer: true
                      })
                    }
                  })}
                  title='Do you want to delete this session?'
                >
                  <Icon
                    style={{ fontSize: 18, color: '#66a3e0', cursor: 'pointer' }}
                    type='delete'
                  />
                </Popconfirm>
              ) : <div />
          }
          {
            get(user, 'mmSessionExist') === 'Assign Mentor' && (
              <>
                <Tooltip title='Mentor not assigned yet, Click to assign'>
                  <div
                    className='bookSessionButton'
                    style={!isUserWrite() ? { cursor: 'not-allowed', marginLeft: '15px', padding: '10px' } : { marginLeft: '15px', padding: '10px' }}
                    onClick={async () => {
                      if (isUserWrite()) {
                        this.props.notification.open({
                            key: 'Loading/AssignMentor',
                            message: 'Assigning Mentor...',
                            icon: <Icon type='loading' />
                        })
                        await fetchPaidSession(mentorId, new Date(date.rawDate)).then(async (res) => {
                          const sessionToEdit = {
                            availabilityDate: new Date(date.rawDate),
                            [`slot${time.slot}`]: true,
                            user: {
                              id:
                                mentorId ||
                                (seeMentorColRoles.includes(this.getLoggedInUserRole()) ? 'ALL' : getDataFromLocalStorage('login.id'))
                            },
                            course: get(user, 'course'),
                            mentorMenteeSessionId,
                            selectedSlot: time.slot,
                          }
                          this.setState({
                            bookedMenteeSessionId: sessionId,
                            editingSession: true,
                            sessionToEdit,
                            menteeId: userId,
                            nextTopicIdToBook: topicId,
                            selectedDate: new Date(date.rawDate),
                            selectedCourse: get(user, 'course.id'),
                            assigningMentor: true,
                            selectedMentorId: seeMentorColRoles.includes(this.getLoggedInUserRole())
                              ? mentorId
                              : getDataFromLocalStorage('login.id')
                          })
                          if (get(res, 'mentorSessions', []).length > 0) {
                            const selectedMentorSessionId = get(res, 'mentorSessions[0].id')
                          const input = {
                            availabilityDate: new Date(date.rawDate),
                            sessionType: 'paid'
                            }
                            input[`slot${get(time, 'slot')}`] = true
                            await updateSession(
                              input,
                              selectedMentorSessionId,
                              `mentorSession/paid/${this.state.selectedMentorId}`
                            )
                            this.callMentorMenteeSessionQuery([{ id: sessionId }])
                          } else {
                            const input = {
                            availabilityDate: new Date(date.rawDate),
                            sessionType: 'paid'
                            }
                            input[`slot${get(time, 'slot')}`] = true
                            await addSession(input, this.state.selectedMentorId, get(user, 'course.id'), 'paid', this.state.selectedMentorId)
                            this.callMentorMenteeSessionQuery([{ id: sessionId }])
                          }
                          this.props.notification.close('Loading/AssignMentor')
                    })
                  }
                }}
                  >
                    Assign
                  </div>
                </Tooltip>
              </>
            )
          }
        </div>
      )
    }

    return <div />
  }

  getSelectedSlot = (session) => {
    if (session) {
      for (let i = 0; i < 24; i += 1) {
        if (get(session, `slot${i}`)) {
          return { label: getSlotLabel(i).startTime, slot: i }
        }
      }
    }

    return {}
  }
  setStudentsName = (name, id) => (
    <Link target='_blank' rel='noopener noreferrer' to={`/ums/studentJourney/${id}`}>
      {name}
    </Link>
  )
  setTableData = () => {
    const users = []
    this.props.convertedUsers.toJS().forEach(user => {
      const filteredTopicComponentStatus = this.props.userCurrentTopicComponentStatus &&
        this.props.userCurrentTopicComponentStatus.toJS().filter(uT => get(uT, 'user.id') === get(user, 'client.id') && get(uT, 'currentCourse.id') === get(user, 'course.id')) || []
      let updatedSalesOp
      if (this.props.updatedSalesOps && this.state.isEditingMentor) {
        updatedSalesOp = filterKey(this.props.updatedSalesOps, `salesOperation/${this.state.salesOpIdSelected}`)
          ? filterKey(this.props.updatedSalesOps, `salesOperation/${this.state.salesOpIdSelected}`).toJS()
          : []
      }
      const updatedSalesOpClientId = get(updatedSalesOp, '0.client.id') || ''
      let mentorName
      let mentorId
      if (this.state.isEditingMentor && updatedSalesOpClientId === get(user, 'client.id')) {
        mentorName = get(updatedSalesOp, '0.allottedMentor.name')
        mentorId = get(updatedSalesOp, '0.allottedMentor.id')
      } else {
        mentorName = get(user, 'allottedMentorName')
        mentorId = get(user, 'allottedMentorId')
      }
      const userTopicComponentStatusId = filteredTopicComponentStatus[0] ? get(filteredTopicComponentStatus[0], 'id') : ''
      let skillsLevel = '-'
      if (userTopicComponentStatusId.length) {
        skillsLevel = filteredTopicComponentStatus[0] ? get(filteredTopicComponentStatus[0], 'skillsLevel') : 'easy'
      }
      const salesOpId = get(user, 'id')
      user.studentName = this.setStudentsName(get(user, 'studentName'),
        get(user, 'studentId'))
      user.mentorName = [this.getMentorCellData(mentorName, mentorId, salesOpId)]
      user.parentInfo = [this.getParentCellData(get(user, 'parentName'), get(user, 'parentEmail'), get(user, 'parentPhone'))]
      user.skillsLevel = [this.getSkillLevelCellData(skillsLevel, userTopicComponentStatusId)]
      let course = ''
      if (get(user, 'course')) {
        course = get(user, 'course')
      } else {
        course = get(this.getOrderedCourse(), '[0]')
      }
      if (this.state.mentorMenteeSessionObj[get(user, 'client.id')] && this.state.mentorMenteeSessionObj[get(user, 'client.id')].length) {
        const mmSessions = this.state.mentorMenteeSessionObj[get(user, 'client.id')] && this.state.mentorMenteeSessionObj[get(user, 'client.id')] || []
        let newMMSessions = mmSessions
        if (get(user, 'course')) {
          newMMSessions = mmSessions.filter(session => get(session, 'course.id') === get(course, 'id'))
        }
        const sortedSessions = sortBy(newMMSessions, 'topicOrder')
        const latestSession = sortedSessions.pop()
        let bookingDate
        let bookingTime
        let nextTopicId
        let menteeSessionId
        let mentorMenteeSessionId
        let mentorSessionUserId
        let mmSessionExist = ''
        let isCompleted = false
        if (get(latestSession, 'sessionStatus') !== 'completed') {
          const filteredMenteeSession = this.props.menteeSessions
            ? this.props.menteeSessions.toJS().filter(s => get(s, 'id') === get(latestSession, 'menteeSession.id')) || []
            : []
          user.nextTopic = get(latestSession, 'topicTitle') ? <div>({get(latestSession, 'topicOrder')}) {get(latestSession, 'topicTitle')}</div> : '-'
          bookingDate = get(filteredMenteeSession, '0.bookingDate')
          bookingTime = this.getSelectedSlot(get(filteredMenteeSession, '0'))
          menteeSessionId = get(filteredMenteeSession, '0.id')
          mentorMenteeSessionId = get(latestSession, 'id')
          mentorSessionUserId = get(latestSession, 'mentorId')
          nextTopicId = get(latestSession, 'topicId')
        } else {
          const userCourseTopic = sortBy(get(this.getOrderedCourse().find(c => get(c, 'id') === get(course, 'id')), 'topics', []), 'order')
          const latestCompletedTopicOrder = get(latestSession, 'topicOrder')
          user.nextTopic = get(userCourseTopic, `${latestCompletedTopicOrder}.title`) ?
            <div>({get(userCourseTopic, `${latestCompletedTopicOrder}.order`)}) {get(userCourseTopic, `${latestCompletedTopicOrder}.title`)}</div> : '-'
          nextTopicId = get(userCourseTopic, `${latestCompletedTopicOrder}.id`)
          isCompleted = userCourseTopic.length === latestCompletedTopicOrder
          if (this.state.menteeSessionsObj[get(user, 'client.id')] && this.state.menteeSessionsObj[get(user, 'client.id')].length) {
            const nextTopicSession = this.state.menteeSessionsObj[get(user, 'client.id')].filter(
              s => get(s, 'topic.id') === nextTopicId
            ) || []
            if (nextTopicSession && nextTopicSession.length) {
              bookingDate = get(nextTopicSession, '0.bookingDate')
              bookingTime = this.getSelectedSlot(get(nextTopicSession, '0'))
              menteeSessionId = get(nextTopicSession, '0.id')
              const mmSessionData = mmSessions.filter(mmSession => get(mmSession, 'menteeSession.id') === menteeSessionId)
              mmSessionExist = mmSessionData.length === 0 ? 'Assign Mentor' : ''
            }
          }
        }
        user.isCompleted = isCompleted
        if (!mentorSessionUserId) mentorSessionUserId = mentorId
        user.mmSessionExist = mmSessionExist
        user.bookingDate = bookingDate
          ? [this.getDateCellData(
            { formattedDate: formatDate(new Date(bookingDate)).date, rawDate: bookingDate },
            bookingTime,
            menteeSessionId,
            mentorMenteeSessionId,
            mentorSessionUserId,
            get(user, 'client.id'),
            nextTopicId,
            'edit',
            user
          )]
          : [this.getDateCellData({}, {}, '', '', mentorSessionUserId, get(user, 'client.id'), nextTopicId, 'book', user)]
        user.course = course
        user.userCourse = get(course, 'title')
      }
      users.push(user)
    })
    const sortedUsers = []
    let order = (this.state.currentPageNumber - 1) * 20 + 1
    sortBy(users, 'createdAt').forEach(u => {
      u.order = order
      sortedUsers.push(u)
      order += 1
    })
    let columns = [
      {
        title: '#',
        dataIndex: 'order',
        width: 70,
      },
      {
        title: 'Student',
        dataIndex: 'studentName',
        width: 250,
      },
      {
        title: 'Parent Info',
        dataIndex: 'parentInfo',
        width: 300,
      },
      {
        title: 'Default Mentor',
        dataIndex: 'mentorName',
        width: 250,
      },
      {
        title: 'Course',
        dataIndex: 'userCourse',
        width: 200
      },
      {
        title: 'Next Topic',
        dataIndex: 'nextTopic',
        width: 200
      },
      {
        title: 'Session Date',
        dataIndex: 'bookingDate',
        width: 350
      }
    ]
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole === MENTOR) {
      columns = columns.filter(col => get(col, 'title') !== 'Default Mentor')
    }
    this.setState({
      data: sortedUsers,
      columns
    }, () => {
      if (this.state.openEditMentorModal) {
        this.setState({
          openEditMentorModal: false,
          isEditingMentor: false
        })
      }
    })
    if (this.getUserCount() === 0) {
      this.setState({
        data: []
      })
    }
  }
  getOrderedCourse = () => {
    const courses = this.props.courses && this.props.courses.toJS()
    const coursesData = []
    if (courses && courses.length > 0) {
      courses.forEach(course => {
        if (get(course, 'title') && get(course, 'id') && get(course, 'order')) {
          coursesData.push(course)
        }
      })
    }
    return sortBy(coursesData, 'order')
  }

  getMenteeSessionObj = (menteeSessions) => {
    const mntSessions = {}
    if (menteeSessions) {
      menteeSessions.toJS().forEach(session => {
        const userId = get(session, 'user.id')
        if (mntSessions[userId] && mntSessions[userId].length) {
          mntSessions[userId].push(session)
        } else {
          mntSessions[userId] = [session]
        }
      })
    }
    return mntSessions
  }

  getMentorMenteeSessionObj = (mentorMenteeSessions) => {
    const mtrMntSessions = {}
    if (mentorMenteeSessions) {
      mentorMenteeSessions.toJS().forEach(session => {
        const userId = get(session, 'menteeId')
        if (userId) {
          if (mtrMntSessions[userId] && mtrMntSessions[userId].length) {
            mtrMntSessions[userId].push(session)
          } else {
            mtrMntSessions[userId] = [session]
          }
        }
      })
    }
    return mtrMntSessions
  }

  callMentorMenteeSessionQuery = (bookedSession) => {
    if (bookedSession.length) {
      if (this.state.sessionToEdit && this.state.sessionToEdit.mentorMenteeSessionId) {
        store.dispatch({
          type: 'mentorMenteeSession/delete/success',
          payload: fromJS({
            extractedData: {
              completedSession: {
                id: this.state.sessionToEdit && this.state.sessionToEdit.mentorMenteeSessionId
              }
            }
          }),
          autoReducer: true
        })
      }
      this.setState({
        menteeSessionId: get(bookedSession, '0.id'),
        assigningMentor: false
      }, () => addMentorMenteeSession(
        this.state.mentorSessionId,
        get(bookedSession, '0.id'),
        this.state.nextTopicIdToBook,
        '',
        '',
        { sessionStatus: 'allotted' },
        `mentorMenteeSession/${this.state.menteeSessionId}/${this.state.mentorSessionId}`,
        this.state.selectedCourse
      ))
    }
  }

  async componentDidUpdate(prevProps) {
    const {
      profileInfoFetchStatus,
      mentorFetchStatus,
      convertedUserFetchStatus,
      mentorMenteeSessions,
      topics,
      menteeSessions,
      menteeSessionBookingStatus,
      mentorSessionBookingStatus,
      mentorSessionUpdateStatus,
      notification,
      menteeSessionDeleteStatus,
      mentorSession,
      mentorMenteeSessionAddStatus,
      mentorSessionFetchStatus,
      menteeSessionUpdateStatus,
      errors
    } = this.props
    if (
      (convertedUserFetchStatus && prevProps.convertedUserFetchStatus) &&
      (convertedUserFetchStatus.getIn(['success']) && !prevProps.convertedUserFetchStatus.getIn(['success']))
    ) {
      const userIdArr = []
      if (this.props.convertedUsers) {
        this.props.convertedUsers.toJS().forEach(user => {
          userIdArr.push(user.studentId)
        })
      }
      this.setState({
        userIdArr
      }, () => fetchProfileInfo(this.state.userIdArr))
    }

    if (
      (profileInfoFetchStatus && prevProps.profileInfoFetchStatus) &&
      (profileInfoFetchStatus.getIn(['success']) && !prevProps.profileInfoFetchStatus.getIn(['success']))
    ) {
      this.setState({
        mentorMenteeSessionObj: this.getMentorMenteeSessionObj(mentorMenteeSessions),
        menteeSessionsObj: this.getMenteeSessionObj(menteeSessions)
      }, () => {
        if (topics && !this.state.topics.length) {
          this.setState({
            topics: sortBy(topics.toJS(), 'order')
          }, () => this.setTableData())
        } else {
          this.setTableData()
        }
      })
    }

    if (
      (mentorFetchStatus && prevProps.mentorFetchStatus) &&
      (mentorFetchStatus.getIn(['success']) && !prevProps.mentorFetchStatus.getIn(['success']))
    ) {
      const mentors = []
      if (this.props.mentors) {
        this.props.mentors.toJS().forEach(user => {
          mentors.push({
            id: get(user, 'id'),
            name: get(user, 'name')
          })
        })
        this.setState({
          mentors
        })
      }
    }

    if (
      (this.props.updatingAllottedMentor && prevProps.updatingAllottedMentor) &&
      (
        this.props.updatingAllottedMentor.getIn([`salesOperation/${this.state.salesOpIdSelected}`, 'success']) &&
        !prevProps.updatingAllottedMentor.getIn([`salesOperation/${this.state.salesOpIdSelected}`, 'success'])
      )
    ) {
      this.setTableData()
      this.setState({
        isEditingMentor: false,

      })
    }

    if (
      (this.props.updatingAllottedMentor && prevProps.updatingAllottedMentor) &&
      (
        this.props.updatingAllottedMentor.getIn([`salesOperation/${this.state.salesOpIdSelected}`, 'failure']) &&
        !prevProps.updatingAllottedMentor.getIn([`salesOperation/${this.state.salesOpIdSelected}`, 'failure'])
      )
    ) {
      this.setState({
        isEditingMentor: false
      })
    }

    if (
      (this.props.updateSkillLevelStatus && prevProps.updateSkillLevelStatus) &&
      (
        this.props.updateSkillLevelStatus.getIn([`userCurrentTopicComponentStatus/${this.state.userTopicComponentStatusIdSelected}`, 'success']) &&
        !prevProps.updateSkillLevelStatus.getIn([`userCurrentTopicComponentStatus/${this.state.userTopicComponentStatusIdSelected}`, 'success'])
      )
    ) {
      this.setTableData()
      this.setState({
        isEditingSkill: false,
        openSkillLevelEditModal: false
      })
    }

    if (
      (this.props.updateSkillLevelStatus && prevProps.updateSkillLevelStatus) &&
      (
        this.props.updateSkillLevelStatus.getIn([`userCurrentTopicComponentStatus/${this.state.userTopicComponentStatusIdSelected}`, 'failure']) &&
        !prevProps.updateSkillLevelStatus.getIn([`userCurrentTopicComponentStatus/${this.state.userTopicComponentStatusIdSelected}`, 'failure'])
      )
    ) {
      this.setState({
        isEditingSkill: false,
        openSkillLevelEditModal: false
      })
    }

    if (menteeSessionBookingStatus && prevProps.menteeSessionBookingStatus) {
      const currStatus = menteeSessionBookingStatus.getIn([`menteeSession/${this.state.menteeId}/${this.state.nextTopicIdToBook}`, 'success'])
      const prevStatus = prevProps.menteeSessionBookingStatus.getIn([`menteeSession/${this.state.menteeId}/${this.state.nextTopicIdToBook}`, 'success'])
      const currAddStatus = menteeSessionBookingStatus.getIn([`menteeSession/${this.state.menteeId}/${this.state.nextTopicIdToBook}`])
      const prevAddStatus = prevProps.menteeSessionBookingStatus.getIn([`menteeSession/${this.state.menteeId}/${this.state.nextTopicIdToBook}`])
      if (currStatus && !prevStatus) {
        const bookedSession = filterKey(menteeSessions, `menteeSession/${this.state.menteeId}/${this.state.nextTopicIdToBook}`)
          ? filterKey(menteeSessions, `menteeSession/${this.state.menteeId}/${this.state.nextTopicIdToBook}`).toJS()
          : []
        this.setState({
          mentorMenteeSessionObj: this.getMentorMenteeSessionObj(mentorMenteeSessions),
          menteeSessionsObj: this.getMenteeSessionObj(menteeSessions)
        }, () => this.setTableData())
        this.callMentorMenteeSessionQuery(bookedSession)
      } else if (currAddStatus && !currAddStatus.getIn(['loading'])
      && currAddStatus.getIn(['failure']) &&
        (prevAddStatus !== currAddStatus)) {
        const error = errors.getIn(['menteeSession/add'])
        if (error && error.toJS() && error.toJS().length > 0) {
          const errorMessage = error.toJS().pop()
          notification.error({
            message: get(errorMessage, 'error.errors[0].message')
          })
        }
      }
    }

    if (menteeSessionUpdateStatus && prevProps.menteeSessionUpdateStatus) {
      const currStatus = menteeSessionUpdateStatus.getIn([`menteeSession/${this.state.menteeId}`, 'success'])
      const prevStatus = prevProps.menteeSessionUpdateStatus.getIn([`menteeSession/${this.state.menteeId}`, 'success'])
      const currUpdateStatus = menteeSessionBookingStatus.getIn([`menteeSession/${this.state.menteeId}`])
      const prevUpdateStatus = prevProps.menteeSessionBookingStatus.getIn([`menteeSession/${this.state.menteeId}`])
      if (currStatus && !prevStatus) {
        const bookedSession = filterKey(menteeSessions, `menteeSession/${this.state.menteeId}`)
          ? filterKey(menteeSessions, `menteeSession/${this.state.menteeId}`).toJS()
          : []
        this.setState({
          mentorMenteeSessionObj: this.getMentorMenteeSessionObj(mentorMenteeSessions),
          menteeSessionsObj: this.getMenteeSessionObj(menteeSessions)
        }, () => this.setTableData())
        this.callMentorMenteeSessionQuery(bookedSession)
      } else if (currUpdateStatus && !currUpdateStatus.getIn(['loading'])
      && currUpdateStatus.getIn(['failure']) &&
        (prevUpdateStatus !== currUpdateStatus)) {
        const error = errors.getIn(['menteeSession/update'])
        if (error && error.toJS() && error.toJS().length > 0) {
          const errorMessage = error.toJS().pop()
          notification.error({
            message: get(errorMessage, 'error.errors[0].message')
          })
        }
      }
    }

    if (
      (mentorSessionBookingStatus && prevProps.mentorSessionBookingStatus) ||
      (mentorSessionUpdateStatus && prevProps.mentorSessionUpdateStatus)
    ) {
      const currStatus = mentorSessionBookingStatus.getIn([`mentorSession/paid/${this.state.selectedMentorId}`, 'success']) ||
        mentorSessionUpdateStatus.getIn([`mentorSession/paid/${this.state.selectedMentorId}`, 'success'])
      const prevStatus = prevProps.mentorSessionBookingStatus.getIn([`mentorSession/paid/${this.state.selectedMentorId}`, 'success']) ||
        prevProps.mentorSessionUpdateStatus.getIn([`mentorSession/paid/${this.state.selectedMentorId}`, 'success'])
      const failureStatus = mentorSessionBookingStatus.getIn([`mentorSession/paid/${this.state.selectedMentorId}`, 'failure']) ||
        mentorSessionUpdateStatus.getIn([`mentorSession/paid/${this.state.selectedMentorId}`, 'failure'])
      const prevfailureStatus = prevProps.mentorSessionBookingStatus.getIn([`mentorSession/paid/${this.state.selectedMentorId}`, 'failure']) ||
        prevProps.mentorSessionUpdateStatus.getIn([`mentorSession/paid/${this.state.selectedMentorId}`, 'failure'])
      const bookedMentorSession = filterKey(mentorSession, `mentorSession/paid/${this.state.selectedMentorId}`)
        ? filterKey(mentorSession, `mentorSession/paid/${this.state.selectedMentorId}`).toJS()
        : []
      if (currStatus && !prevStatus) {
        if (bookedMentorSession.length) {
          this.setState({
            mentorSessionId: get(bookedMentorSession, '0.id')
          })
        }
        if (!this.state.editingSession) {
          addMenteeSession(
            this.state.menteeId,
            this.state.nextTopicIdToBook,
            this.state.menteeBookingInput,
            this.state.selectedCourse
          )
        } else if (!this.state.assigningMentor) {
          updateMenteeSession(
            this.state.bookedMenteeSessionId,
            this.state.menteeId,
            this.state.menteeBookingInput,
            this.state.sessionToEdit && this.state.sessionToEdit.mentorMenteeSessionId
          )
        }
      } else if (!currStatus && !prevfailureStatus && failureStatus) {
        if (this.state.editingSession) {
          const errorData = errors && get(errors.toJS(), 'session/update[0].error.errors[0]', '')
          if (get(errorData, 'code') === 'SlotsOccupiedError') {
            notification.error({
              message: 'Session already exist at this slot, please select a different slot'
            })
          } else {
            notification.error({
              message: get(errorData, 'message')
            })
          }
        } else {
          const errorData = errors && get(errors.toJS(), 'session/add[0].error.errors[0]', '')
          if (get(errorData, 'code') === 'SlotsOccupiedError') {
            notification.error({
              message: 'Session already exist at this slot, please select a different slot'
            })
          } else {
            notification.error({
              message: get(errorData, 'message')
            })
          }
        }
      }
    }
    if (menteeSessionDeleteStatus && prevProps.menteeSessionDeleteStatus) {
      const currStatus = menteeSessionDeleteStatus.getIn([`menteeSession/${this.state.bookedMenteeSessionId}`])
      const prevStatus = prevProps.menteeSessionDeleteStatus.getIn([`menteeSession/${this.state.bookedMenteeSessionId}`])
      if (currStatus && currStatus.getIn(['loading'])) {
        notification.open({
          key: `loading/${this.state.bookedMenteeSessionId}`,
          message: 'Deleting session...',
          icon: <Icon type='loading' />
        })
      }
      if ((currStatus && currStatus.getIn(['success'])) && (prevStatus && !prevStatus.getIn(['success']))) {
        notification.close(`loading/${this.state.bookedMenteeSessionId}`)
        this.setState({
          mentorMenteeSessionObj: this.getMentorMenteeSessionObj(mentorMenteeSessions),
          menteeSessionsObj: this.getMenteeSessionObj(menteeSessions)
        }, () => this.setTableData())
        notification.success({
          message: 'Session Deleted!'
        })
      }
      if ((currStatus && currStatus.getIn(['failure'])) && (prevStatus && !prevStatus.getIn(['failure']))) {
        notification.close(`loading/${this.state.bookedMenteeSessionId}`)
        if (errors) {
          const error = errors.getIn(['menteeSession/delete'])
            ? errors.getIn(['menteeSession/delete']).toJS().pop()
            : {}
          notification.error({
            message: get(error, 'error.errors.0.message')
          })
        }
      }
    }

    if (mentorMenteeSessionAddStatus && prevProps.mentorMenteeSessionAddStatus) {
      const currStatus = mentorMenteeSessionAddStatus.getIn([`mentorMenteeSession/${this.state.menteeSessionId}/${this.state.mentorSessionId}`])
      const prevStatus = prevProps.mentorMenteeSessionAddStatus.getIn([`mentorMenteeSession/${this.state.menteeSessionId}/${this.state.mentorSessionId}`])
      if ((currStatus && currStatus.getIn(['success'])) && (prevStatus && !prevStatus.getIn(['success']))) {
        this.setState({
          mentorMenteeSessionObj: this.getMentorMenteeSessionObj(mentorMenteeSessions),
          menteeSessionsObj: this.getMenteeSessionObj(menteeSessions)
        }, () => {
          this.setTableData()
          this.setState({
            sessionModalVisible: false,
            editingSession: false
          })
        })
        if (!this.state.editingSession) {
          notification.success({
            message: 'Session Booked!'
          })
        } else {
          notification.success({
            message: 'Session Updated!'
          })
        }
      } else if (currStatus && !currStatus.getIn(['loading'])
      && currStatus.getIn(['failure']) &&
        (prevStatus !== currStatus)) {
        const error = errors.getIn(['mentorMenteeSession/add'])
        if (error && error.toJS() && error.toJS().length > 0) {
          const errorMessage = error.toJS().pop()
          notification.error({
            message: get(errorMessage, 'error.errors[0].message')
          })
        }
      }
    }
    if (mentorSessionFetchStatus && prevProps.mentorSessionFetchStatus) {
      const currStatus = mentorSessionFetchStatus.getIn([`mentorSession/${this.state.selectedMentorId}/${new Date(this.state.selectedDate).setHours(0, 0, 0, 0)}`])
      const prevStatus = prevProps.mentorSessionFetchStatus.getIn([`mentorSession/${this.state.selectedMentorId}/${new Date(this.state.selectedDate).setHours(0, 0, 0, 0)}`])
      if ((currStatus && currStatus.getIn(['success'])) && (prevStatus && !prevStatus.getIn(['success']))) {
        const fetchedMentorSession = filterKey(
          mentorSession, `mentorSession/${this.state.selectedMentorId}/${new Date(this.state.selectedDate).setHours(0, 0, 0, 0)}`
        )
        if (fetchedMentorSession && fetchedMentorSession.toJS().length) {
          this.setState({
            mentorSessionId: get(fetchedMentorSession.toJS(), '0.id')
          })
        }
      }
    }
  }

  isLoading = () => {
    const { convertedUserFetchStatus, profileInfoFetchStatus } = this.props
    return (
      convertedUserFetchStatus && convertedUserFetchStatus.getIn(['loading']) ||
      profileInfoFetchStatus && profileInfoFetchStatus.getIn(['loading'])
    )
  }

  getUserCount = () => this.props.userCount ? this.props.userCount.getIn(['count']) : 0

  showModalSaving = () => {
    const {
      menteeSessionBookingStatus,
      mentorSessionBookingStatus,
      mentorSessionUpdateStatus,
      mentorMenteeSessionAddStatus,
      menteeSessionUpdateStatus
    } = this.props
    return (
      (menteeSessionBookingStatus && menteeSessionBookingStatus.getIn([`menteeSession/${this.state.menteeId}/${this.state.nextTopicIdToBook}`, 'loading'])) ||
      (mentorSessionBookingStatus && mentorSessionBookingStatus.getIn([`mentorSession/paid/${this.state.selectedMentorId}`, 'loading'])) ||
      (mentorSessionUpdateStatus && mentorSessionUpdateStatus.getIn([`mentorSession/paid/${this.state.selectedMentorId}`, 'loading'])) ||
      (mentorMenteeSessionAddStatus && mentorMenteeSessionAddStatus.getIn([`mentorMenteeSession/${this.state.menteeSessionId}/${this.state.mentorSessionId}`, 'loading'])) ||
      (menteeSessionUpdateStatus && menteeSessionUpdateStatus.getIn([`menteeSession/${this.state.menteeId}`, 'loading']))
    )
  }

  handleFilterKeyChange = value => {
    this.setState(
      {
        searchKey: value,
        searchValue: value === 'All' ? 'All' : ''
      },
      () => {
        if (value === 'All') {
          this.setState(
            {
              manageKidsFilter: null
            },
            this.callFetchQueryForFiltering
          )
        }
      }
    )
  }

  handleSeachValueChange = event => {
    this.setState({
      searchValue: event.target.value
    })
  }

  handleSearchButton = () => {
    const { searchKey } = this.state
    let { searchValue } = this.state
    searchValue = searchValue.trim()
    switch (searchKey) {
      case 'Name':
        this.setState(
          {
            manageKidsFilter: `{client_some:{name_contains: "${searchValue}"}}`
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'Parent Name':
        this.setState(
          {
            manageKidsFilter: `{client_some:
              {studentProfile_some:
                {parents_some:
                  {user_some:
                    {name_contains: "${searchValue}"
                  }
                }
              }}}`
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'Email':
        this.setState(
          {
            manageKidsFilter: `{
              client_some:
              {studentProfile_some:
                {parents_some:
                  {user_some:
                    {email_contains:"${searchValue}"}
                  }
                }
              }}`
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'Phone No.':
        this.setState(
          {
            manageKidsFilter: `{client_some:{studentProfile_some:
              {parents_some:
                {user_some:
                  {phone_number_subDoc_contains:"${searchValue}"}
                }
              }
            }}`
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'Mentor Name':
        this.setState(
          {
            manageKidsFilter: `{ allottedMentor_some:{ name_contains:"${searchValue}" }}`
          },
          this.callFetchQueryForFiltering
        )
        break
      default:
        this.setState(
          {
            manageKidsFilter: null
          },
          this.callFetchQueryForFiltering
        )
        break
    }
  }

  callFetchQueryForFiltering = () => {
    const {
      searchKey,
      manageKidsFilter,
      searchValue,
      showNotWonLeads
    } = this.state
    if (searchKey === 'All' && (searchValue === 'All' || searchValue === '')) {
      this.setState({
        searchKey: 'All',
        searchValue: '',
        manageKidsFilter: null,
        currentPageNumber: 1
      }, async () => {
        if (seeMentorColRoles.includes(this.getLoggedInUserRole())) {
          await fetchConvertedUserInfo({
            skipCount: (this.state.currentPageNumber - 1) * 20,
            showNotWonLeads
          })
        } else {
          const savedState = loadStateFromLocalStorage()
          await fetchConvertedUserInfo({
            skipCount: (this.state.currentPageNumber - 1) * 20,
            mentorId: get(savedState, 'login.id'),
            showNotWonLeads
          })
        }
      }
      )
    } else if (searchKey !== 'All' && searchValue !== '') {
      this.setState({
        currentPageNumber: 1
      }, async () => {
        if (seeMentorColRoles.includes(this.getLoggedInUserRole())) {
          await fetchConvertedUserInfo({
            skipCount: (this.state.currentPageNumber - 1) * 20,
            manageKidsFilter,
            showNotWonLeads
          })
        } else {
          const savedState = loadStateFromLocalStorage()
          await fetchConvertedUserInfo(
            {
              skipCount: (this.state.currentPageNumber - 1) * 20,
              mentorId: get(savedState, 'login.id'),
              manageKidsFilter,
              showNotWonLeads
            }
          )
        }
      }
      )
    }
  }
  render() {
    const {
      filterOptions,
      searchKey,
      searchValue,
      manageKidsFilter,
      selectedCourse,
      showNotWonLeads
    } = this.state
    const { Option } = Select
    return (
      <div className='profileContainer'>
        <div className='profileTopContainer'>
          {/* Filters */}
          <div style={{ display: 'flex', marginRight: 'auto' }}>
            <Select
              style={{ width: 200 }}
              defaultValue='All'
              onChange={this.handleFilterKeyChange}
            >
              <Option value='All' label='All'>
                All
              </Option>
              {[...filterOptions, 'Parent Name', 'Mentor Name'].map(option => (
                <Option value={option} label={option.toUpperCase()}>
                  {option}
                </Option>
              ))}
            </Select>
            {searchKey !== 'All' && (
              <Input
                value={searchValue}
                onChange={this.handleSeachValueChange}
                placeholder={`Type ${searchKey}`}
                onPressEnter={this.handleSearchButton}
                style={{
                  width: 300,
                  marginLeft: '10px'
                }}
              />
            )}
          </div>
          {/* Filters end */}
          <div style={{ marginRight: 10 }}>
              Show UnAssigned leads? {'  '}
            <Switch
              checked={showNotWonLeads}
              onChange={(checked) => this.setState({
                showNotWonLeads: checked
              }, this.callFetchQueryForFiltering)}
              size='small'
            />
          </div>
          <div className='profileCountContainer'>{`Total Students: ${this.getUserCount() || 0}`}</div>
        </div>
        <ProfileTable
          dataSource={this.state.data}
          columns={this.state.columns}
          rowKey='id'
          bordered
          loading={this.isLoading()}
          pagination={{
              total: this.state.data.length,
              pageSize: this.state.data.length,
              hideOnSinglePage: true
            }}
          scroll={{ y: vsValue(750) }}
        />
        {
            !this.isLoading()
              ? (
                <div className='profileTablePagination'>
                  <Pagination
                    current={this.state.currentPageNumber}
                    pageSize={20}
                    hideOnSinglePage
                    total={this.props.userCount ? this.props.userCount.getIn(['count']) : 0}
                    onChange={(pageNumber) => {
                      if (this.state.currentPageNumber !== pageNumber) {
                        this.setState({
                          data: [],
                          currentPageNumber: pageNumber,
                        }, async () => {
                          if (seeMentorColRoles.includes(this.getLoggedInUserRole())) {
                            await fetchConvertedUserInfo({
                              skipCount: (this.state.currentPageNumber - 1) * 20,
                              manageKidsFilter,
                              showNotWonLeads
                            })
                          } else {
                            const savedState = loadStateFromLocalStorage()
                            await fetchConvertedUserInfo({
                              skipCount: (this.state.currentPageNumber - 1) * 20,
                              mentorId: get(savedState, 'login.id'),
                              manageKidsFilter,
                              showNotWonLeads
                            })
                          }
                        })
                      }
                    }}
                  />
                </div>
              ) : <div />
          }
        <EditMentorModal
          visible={this.state.openEditMentorModal}
          title='Change Assigned Mentor'
          id='edit-mentor-modal'
          salesOpIdSelected={this.state.salesOpIdSelected}
          cancel={() => this.setState({ openEditMentorModal: false, salesOpIdSelected: '' })}
          editAssignedMentor
          mentorObjArr={this.state.mentors}
          defaultMentorId={this.state.defaultMentorId}
          onSave={(mentorId) => this.setState({ isEditingMentor: true }, () =>
            updateAllottedMentor(this.state.salesOpIdSelected, mentorId))
          }
          isSaving={this.state.isEditingMentor}
        />
        <EditSkillLevelModal
          visible={this.state.openSkillLevelEditModal}
          title='Change Skill Level'
          id='edit-skill-level'
          userTopicComponentStatusIdSelected={this.state.userTopicComponentStatusIdSelected}
          cancel={() => this.setState({ openSkillLevelEditModal: false, userTopicComponentStatusIdSelected: '' })}
          editAssignedMentor
          defaultSkillLevel={this.state.defaultSkillLevel}
          onSave={(skillLevel) => this.setState({ isEditingSkill: true }, () =>
            updateSkillLevel(
              this.state.userTopicComponentStatusIdSelected, { skillsLevel: skillLevel }
            ))}
          isSaving={this.state.isEditingSkill}
        />
        <SessionModal
          id='Session Modal'
          title={this.state.editingSession ? 'Update Session' : 'Book Session'}
          visible={this.state.sessionModalVisible}
          closeSessionModal={this.closeSessionModal}
          mentors={this.state.mentors}
          notification={this.props.notification}
          selectedCourse={selectedCourse}
          sessions={this.props.menteeSessions && this.props.menteeSessions.toJS()}
          editingSession={this.state.editingSession}
          sessionToEdit={this.state.sessionToEdit}
          selectCourse={(value) => this.setState({ selectedCourse: value })}
          userRole={getDataFromLocalStorage('login.role')}
          userId={getDataFromLocalStorage('login.id')}
          path={get(this.props, 'match.path')}
          courses={this.props.courses ? sortBy(this.props.courses.toJS(), 'order') : []}
          mentorSessionFetchStatus={this.props.mentorSessionFetchStatus}
          mentorSession={this.props.mentorSession}
          nextTopicIdToBook={this.state.nextTopicIdToBook}
          menteeId={this.state.menteeId}
          setSelectedMentorId={(selectedMentorId) => this.setState({ selectedMentorId })}
          setMenteeBookingInput={(menteeBookingInput) => this.setState({ menteeBookingInput })}
          showModalSaving={this.showModalSaving()}
          bookedMenteeSessionId={this.state.bookedMenteeSessionId}
          dateSelected={this.state.bookedSessionDate}
          bookedSessionTime={this.state.bookedSessionTime}
          changeSelectedDate={(selectedDate) => this.setState({ selectedDate })}
        />
      </div>
    )
  }
}

export default Profile
