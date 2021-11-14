/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
import React, { Component } from 'react'
import { DatePicker, notification, Pagination, Popconfirm, Radio, Select, Table } from 'antd'
import { get, orderBy } from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
// import { getTimezone } from 'countries-and-timezones'
import momentTZ from 'moment-timezone'
import fetchSessions, { getFilters } from '../../actions/sessions/fetchSessions'
import SessionManagementStyle from './SessionManagement.style'
import SessionModal from './components/SessionModal'
import { ADMIN, MENTOR, UMS_ADMIN, UMS_VIEWER } from '../../constants/roles'
import fetchUsers from '../../actions/ums/fetchUsers'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import fetchCourses from '../../actions/sessions/fetchCourses'
import { PUBLISHED_STATUS } from '../../constants/questionBank'
import isUserWrite from '../../utils/userRolePermissions/isUserWrite'
import { filterKey } from '../../utils/data-utils'
import Main from '../../components/TopicNav/TopicNav.style'
import './antdTableStyles.scss'
import hs, { vsValue } from '../../utils/scale'
import getSlotLabel from '../../utils/slots/slot-label'
import MainTable from '../../components/MainTable'
import formatDate from '../../utils/formatDate'
import { showNotification } from '../../utils/messages'
import deleteSession from '../../actions/sessions/deleteSession'
import offsetDate from '../../utils/date/date-offset'
import requestToGraphql from '../../utils/requestToGraphql'
import './sessionManagement.scss'
import MainModal from '../../components/MainModal'
import appConfig from '../../config/appConfig'
import SessionTimeModalStyle from './components/SessionTimeModal/SessionTimeModal.style'
import getIntlDateTime from '../../utils/time-zone-diff'
import getMentorMenteeSessionData from './components/SessionModal/getMentorMenteeSessionData'
import getSlotDifference from '../../utils/getSlotDifference'

const renderContent = (value, row) => {
  const obj = {
    children: value,
    props: {}
  }
  if (get(row, 'date')) {
    obj.props.colSpan = 0
  }
  return obj
}

const columns = [
  {
    title: 'Order',
    dataIndex: 'order',
    render: renderContent
  },
  {
    title: 'Mentor',
    dataIndex: 'mentorName',
    render: renderContent
  },
  {
    title: 'Slot Time',
    dataIndex: 'slotTime',
    render: (value, row) => {
      if (get(row, 'date')) {
        return {
          children: <div>{get(row, 'date')}</div>,
          props: {
            colSpan: 1
          }
        }
      }

      return {
        children: value,
        props: {}
      }
    }
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    render: renderContent
  },
  {
    title: 'Modified At',
    dataIndex: 'updatedAt',
    render: renderContent
  }
]

class SessionManagement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sessionModalVisible: false,
      editingSession: false,
      sessionToEdit: {},
      selectedUser: 'All Mentors',
      sessions: [],
      fromDate: null,
      toDate: null,
      sessionAddedCount: 0,
      activeTab: get(this.props, 'match.path'),
      columns: [],
      currentPageNumber: 1,
      filterSet: {},
      totalSessions: 0,
      showIntlTimeModal: false,
      selectedTimezone: 'Asia/Kolkata',
      sessionToView: {},
      selectedSlotsWithIntlTimingObj: [],
      selectedIntlDates: [],
      dateSelected: new Date()
    }
  }

  updateAddedSessionCount = (count) => {
    this.setState({
      sessionAddedCount: count
    })
  }

  getSessionType = () => {
    let sessionType = null
    if (get(this.props, 'match.path') === '/ums/sessions') {
      sessionType = 'trial'
    } else if (get(this.props, 'match.path') === '/ums/sessions/paid') {
      sessionType = 'paid'
    }

    return sessionType
  }

  loadSessions = () => {
    const savedId = getDataFromLocalStorage('login.id')
    const savedRole = getDataFromLocalStorage('login.role')
    this.setState({
      sessions: []
    })
    if (savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)) {
      fetchSessions(0, null, null, this.getSessionType(), null, null, false)
      fetchUsers({ role: MENTOR })
    } else if (savedRole && savedRole === MENTOR) {
      fetchSessions(0, savedId, null, this.getSessionType(), null, null, false)
    }
    fetchCourses()
  }

  componentDidMount() {
    this.loadSessions()
    if (isUserWrite() && columns.length === 5) {
      columns.push({
        title: 'Action',
        dataIndex: 'action',
        render: renderContent
      })
    }
    this.setState({
      columns
    })
    if (getDataFromLocalStorage('login.role') === MENTOR) {
      this.setState({
        selectedUser: getDataFromLocalStorage('login.id')
      })
    }
  }

  componentWillUnmount() {
    if (columns && columns.length === 6) {
      columns.pop()
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const {
      sessions,
      sessionFetchStatus,
      sessionDeleteStatus,
      mentorSessionsMeta,
      sessionAddStatus,
      sessionUpdateStatus,
      deleteError
    } = this.props
    if (
      get(this.props, 'match.path') !== get(prevProps, 'match.path')
    ) {
      if (isUserWrite() && columns.length === 5) {
        columns.push({
          title: 'Action',
          dataIndex: 'action',
          render: renderContent
        })
      }
      this.setState({
        columns,
        sessionModalVisible: false,
        editingSession: false,
        sessionToEdit: {},
        selectedUser: getDataFromLocalStorage('login.role') === MENTOR
          ? getDataFromLocalStorage('login.id')
          : 'All Mentors',
        sessions: [],
        fromDate: null,
        toDate: null,
        sessionAddedCount: 0,
        currentPageNumber: 1,
        filterSet: {},
        totalSessions: 0
      }, () => this.loadSessions())
    }

    if (sessions.toJS().length > 0 && prevProps.sessions.toJS().length === 0) {
      this.setState({
        sessions: sessions.toJS()
      })
    }
    if (!this.state.sessions && prevState.sessions) {
      this.state.sessions = prevState.sessions
    }

    if (get(prevProps, 'match.path') !== get(this.props, 'match.path')) {
      if (
        get(this.props, 'match.path') === '/ums/sessions' ||
          get(this.props, 'match.path') === '/ums/sessions/paid'
      ) {
        this.setState({
          activeTab: get(this.props, 'match.path')
        })
      }
    }

    if (
      (get(prevProps, 'sessionAddStatus') && sessionAddStatus) &&
        (
          !get(prevProps, 'sessionAddStatus').getIn([`mentorSession/${this.getSessionType()}/${this.state.sessionAddedCount}`, 'success']) &&
          sessionAddStatus.getIn([`mentorSession/${this.getSessionType()}/${this.state.sessionAddedCount}`, 'success'])
        )
    ) {
      const { selectedUser, fromDate, toDate } = this.state
      const id = selectedUser !== 'All Mentors' ? selectedUser : null
      await requestToGraphql(gql`
        query{
          mentorSessionsMeta(filter:{
              ${getFilters(id, null, this.getSessionType(), fromDate, toDate, true)}
            }){
              count
            }
          }
        `).then(res => {
        if (get(res, 'data.mentorSessionsMeta.count')) {
          this.setState({
            totalSessions: get(res, 'data.mentorSessionsMeta.count')
          })
        }
      })
      this.setState({
        sessions: this.getSessions()
      })
    }

    if (
      (get(prevProps, 'sessionFetchStatus') && sessionFetchStatus) &&
        (
          !get(prevProps, 'sessionFetchStatus').getIn([`mentorSession/${this.getSessionType()}`, 'loading']) &&
            sessionFetchStatus.getIn([`mentorSession/${this.getSessionType()}`, 'loading'])
        ) &&
        sessions
    ) {
      this.setState({
        sessions: [],
        totalSessions: 0,
        sessionAddedCount: 0
      })
    }

    const currStatus = sessionDeleteStatus && sessionDeleteStatus.getIn([`mentorSession/${this.getSessionType()}`])
    const prevStatus = prevProps.sessionDeleteStatus && prevProps.sessionDeleteStatus.getIn([`mentorSession/${this.getSessionType()}`])
    if (
      (currStatus && prevStatus) &&
        (currStatus.getIn(['success']) && !prevStatus.getIn(['success']))
    ) {
      const { totalSessions } = this.state
      this.setState({
        sessions: this.getSessions(),
        totalSessions: totalSessions - 1
      })
    }
    if (currStatus && prevStatus) {
      showNotification(currStatus.toJS(), prevStatus.toJS(), 'Deleting Session', 'Deleting session failed',
        'Session deleted successfully',
        false, null, null, true)
    } if ((currStatus && currStatus.getIn(['failure'])) && (prevStatus && !prevStatus.getIn(['failure']))) {
      if (deleteError && deleteError.toJS().length > 0) {
        const errors = deleteError.toJS().pop()
        notification.error({
          message: get(errors, 'error.errors[0].message')
        })
      }
    }

    if (
      (get(prevProps, 'sessionFetchStatus') && sessionFetchStatus) &&
        (
          !get(prevProps, 'sessionFetchStatus').getIn([`mentorSession/${this.getSessionType()}`, 'success']) &&
            sessionFetchStatus.getIn([`mentorSession/${this.getSessionType()}`, 'success'])
        ) &&
        sessions
    ) {
      const totalSessions = mentorSessionsMeta
        ? mentorSessionsMeta.getIn(['count']) + this.state.sessionAddedCount
        : this.state.sessionAddedCount
      this.setState({
        sessions: this.getSessions(),
        totalSessions
      })
    }

    if (
      (get(prevProps, 'sessionUpdateStatus') && sessionUpdateStatus) &&
        (
          !get(prevProps, 'sessionUpdateStatus').getIn(['updateSession', 'success']) &&
          sessionUpdateStatus.getIn(['updateSession', 'success'])
        )
    ) {
      this.setState({
        sessions: this.getSessions()
      })
    }

    if (this.state.showIntlTimeModal && !prevState.showIntlTimeModal) {
      this.setState({
        selectedTimezone: 'Asia/Kolkata'
      })
      this.updateSelectedSlotsWithIntlTimingObj()
    }

    if (this.state.selectedTimezone !== prevState.selectedTimezone) {
      this.updateSelectedSlotsWithIntlTimingObj()
    }
  }

  openSessionModal = () => {
    this.setState({
      sessionModalVisible: true
    })
  }

  openEditSession = (id) => {
    const { sessions } = this.props
    for (let i = 0; i < sessions.toJS().length; i += 1) {
      const session = (sessions.toJS())[i]
      if (session.id === id) {
        this.setState({
          sessionModalVisible: true,
          editingSession: true,
          sessionToEdit: session
        })
      }
    }
  }

  openTimezoneModal = (id) => {
    const { sessions } = this.props
    for (let i = 0; i < sessions.toJS().length; i += 1) {
      const session = (sessions.toJS())[i]
      if (session.id === id) {
        this.setState({
          showIntlTimeModal: true,
          sessionToView: session,
          dateSelected: new Date(get(session, 'availabilityDate'))
        })
      }
    }
  }

  closeSessionModal = () => {
    this.setState({
      sessionModalVisible: false,
      editingSession: false
    })
  }

  getPublishedCourses = () => {
    const { courses } = this.props
    const publishedCourses = []
    for (let i = 0; i < courses.length; i += 1) {
      if (courses[i].status === PUBLISHED_STATUS) {
        publishedCourses.push({
          id: courses[i].id,
          title: courses[i].title
        })
      }
    }
    return publishedCourses
  }

  getSlotStatusArray = (session) => {
    const slotStatusArray = []
    for (let i = 0; i < 24; i += 1) {
      const slotNumber = `slot${i}`
      slotStatusArray.push(session[slotNumber])
    }
    return slotStatusArray
  }

  renderBookedSlotLabels = (session) => {
    const slotStatusArray = this.getSlotStatusArray(session)
    return slotStatusArray.map((status, index) => {
      if (status) {
        return (
          <div
            style={{
              width: '54px',
              height: '25px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: 'rgba(0, 0, 0, 0.17) solid 1px'
            }}
          >
            {getSlotLabel(index).startTime}
          </div>
        )
      }

      return <div />
    })
  }

  getSelectedSlots = (slotsObj, checkCount = false) => {
    const selectedSlots = []
    for (let i = 0; i < appConfig.timeSlots.length; i += 1) {
      if (checkCount) {
        if (slotsObj[`slot${appConfig.timeSlots[i]}`] > 1) {
          const slotObj = {}
          slotObj[`slot${appConfig.timeSlots[i]}`] = slotsObj[`slot${appConfig.timeSlots[i]}`]
          selectedSlots.push(slotObj)
        }
        /* eslint-disable no-lonely-if */
      } else {
        if (slotsObj[`slot${appConfig.timeSlots[i]}`]) {
          selectedSlots.push(appConfig.timeSlots[i])
        }
      }
    }
    return selectedSlots
  }

  deleteSessionAction = (session) => {
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole === MENTOR) {
      const selectedSlots = this.getSelectedSlots(session, false)
      const newSelectedSlots = []
      selectedSlots.forEach(slot => {
        if (getSlotDifference(slot, get(session, 'availabilityDate'))) {
          newSelectedSlots.push(slot)
        }
      })
      if (newSelectedSlots.length > 0) {
        getMentorMenteeSessionData(get(session, 'availabilityDate')).then(res => {
          if (get(res, 'data.availableSlots', []).length > 0) {
            const availableSlots = get(res, 'data.availableSlots[0]')
            // getting slots value which is > 1
            const newAvailableSlots = this.getSelectedSlots(availableSlots, true)
            const slotsExistArray = []
            const notExistArray = []
            newSelectedSlots.forEach(slot => {
              const findSlot = newAvailableSlots.find(slotObj => slotObj[`slot${slot}`])
              if (findSlot) {
                slotsExistArray.push(findSlot)
              } else {
                notExistArray.push(slot)
              }
            })
            if (notExistArray.length === 0) {
              deleteSession(session.id, this.getSessionType())
            } else {
              notification.warn({
                message: `Cannot delete session, as mentee is already alloted at slots (${notExistArray.map(slot => `${getSlotLabel(slot).startTime}`)})`
              })
            }
          }
        })
      } else {
        deleteSession(session.id, this.getSessionType())
      }
    } else {
      deleteSession(session.id, this.getSessionType())
    }
  }
  renderAction = (session) => (
    <div style={{ display: 'flex' }}>
      <MainTable.ActionItem.IconWrapper>
        <MainTable.ActionItem.EditIcon onClick={() => this.openEditSession(session.id)} />
      </MainTable.ActionItem.IconWrapper>
      <div
        style={{
            width: '10px'
          }}
      />
      <div>
        <Popconfirm
          title='Do you want to delete this session?'
          placement='topRight'
          onConfirm={() => this.deleteSessionAction(session)}
          okText='Yes'
          cancelText='Cancel'
          key='delete'
          overlayClassName='popconfirm-overlay-primary'
        >
          <MainTable.ActionItem.IconWrapper>
            <MainTable.ActionItem.DeleteIcon />
          </MainTable.ActionItem.IconWrapper>
        </Popconfirm>
      </div>
    </div>
  )

  updateSelectedSlotsWithIntlTimingObj = () => {
    const selectedSlotsWithIntlTimingObj = []
    const selectedIntlDates = []
    const { sessionToView } = this.state
    for (let i = 0; i < appConfig.timeSlots.length; i += 1) {
      if (sessionToView[`slot${appConfig.timeSlots[i]}`]) {
        selectedSlotsWithIntlTimingObj.push({
          id: appConfig.timeSlots[i],
          intlDate: getIntlDateTime(
            this.state.dateSelected, appConfig.timeSlots[i], this.state.selectedTimezone
          ).intlDate,
          intlTime: getIntlDateTime(
            this.state.dateSelected, appConfig.timeSlots[i], this.state.selectedTimezone
          ).intlTime
        })
        if (
          !selectedIntlDates.includes(
            getIntlDateTime(
              this.state.dateSelected, appConfig.timeSlots[i], this.state.selectedTimezone
            ).intlDate
          )) {
          selectedIntlDates.push(
            getIntlDateTime(
              this.state.dateSelected, appConfig.timeSlots[i], this.state.selectedTimezone
            ).intlDate
          )
        }
      }
    }

    this.setState({
      selectedIntlDates,
      selectedSlotsWithIntlTimingObj
    })
  }

  renderSlots = (intlDate) => {
    const { selectedSlotsWithIntlTimingObj } = this.state
    const renderSlots = []
    let count = 0
    selectedSlotsWithIntlTimingObj.forEach(slot => {
      if (intlDate === get(slot, 'intlDate')) {
        let isFirst = false
        let isLeft = false
        if (count >= 0 && count < 4) {
          isFirst = true
        }
        if (count % 4 === 0) {
          isLeft = true
        }
        renderSlots.push(
          <SessionTimeModalStyle.Slot
            isFirst={isFirst}
            isLeft={isLeft}
            isBooked={false}
            selected
          >
            {get(slot, 'intlTime')}
          </SessionTimeModalStyle.Slot>
        )
        count += 1
      }
    })

    return renderSlots
  }

  getSortedSessions = (sessions) => orderBy(sessions, ['availabilityDate'], ['desc'])

  getSessions = () => {
    const { sessions } = this.props
    const { sessionAddedCount } = this.state
    if (this.getSessionType() !== null) {
      let _sessions = filterKey(sessions, `mentorSession/${this.getSessionType()}`)
      if (_sessions) {
        _sessions = _sessions.toJS()
        for (let i = 1; i <= sessionAddedCount; i += 1) {
          const newSession = filterKey(sessions, `mentorSession/${this.getSessionType()}/${i}`)
          if (newSession && newSession.toJS().length) {
            _sessions.push(newSession.toJS()[0])
          }
        }
        _sessions = this.getSortedSessions(_sessions)
        const dateArr = []
        let order = 1
        let { length } = _sessions
        for (let index = 0; index < length; index += 1) {
          const _s = _sessions[index]
          if (!dateArr.includes(new Date(_s.availabilityDate).setHours(0, 0, 0, 0))) {
            _sessions.splice(index, 0, {
              date: moment(new Date(_s.availabilityDate)).format('DD-MM-YYYY'),
              id: new Date(_s.availabilityDate).setHours(0, 0, 0, 0),
            })
            dateArr.push(new Date(_s.availabilityDate).setHours(0, 0, 0, 0))
            index += 1
            length += 1
          }
          _sessions[index].slotTime = [
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                padding: '10px 0 0 0',
                width: '100%',
                height: '100%'
              }}
            >
              {this.renderBookedSlotLabels(_sessions[index])}
              <div className='timeIcon'>
                <div
                  className='hoverable'
                  onClick={() => this.openTimezoneModal(_s.id)}
                >
                  Time
                </div>
              </div>
            </div>
          ]
          _sessions[index].action = [
            this.renderAction(_sessions[index])
          ]
          _sessions[index].createdAt =
            `${formatDate(_sessions[index].createdAt).date} ${formatDate(_sessions[index].createdAt).time}`
          _sessions[index].updatedAt =
            `${formatDate(_sessions[index].updatedAt).date} ${formatDate(_sessions[index].updatedAt).time}`
          _sessions[index].order = ((this.state.currentPageNumber - 1) * 20)
            + order
          order += 1
        }
      }
      return _sessions
    }

    return sessions && sessions.toJS()
  }

  filterSessions = () => fetchSessions(
    (this.state.currentPageNumber - 1) * 20,
    this.state.selectedUser !== 'All Mentors' && this.state.selectedUser,
    null, this.getSessionType(),
    this.state.fromDate !== null && offsetDate(new Date(this.state.fromDate), 1, 'SUBTRACT'),
    this.state.toDate !== null && offsetDate(new Date(this.state.toDate), 1, 'ADD'), true
  )

  handleDateChange = (event, type) => {
    const { filterSet } = this.state
    if (type === 'from') {
      if (event != null) {
        filterSet.from = true
        this.setState({
          fromDate: new Date(event),
          filterSet,
          sessions: [],
          currentPageNumber: 1
        }, () => this.filterSessions())
      } else {
        filterSet.from = false
        filterSet.to = false
        this.setState({
          fromDate: null,
          filterSet,
          sessions: [],
          currentPageNumber: 1
        }, () => this.filterSessions())
      }
    } else if (type === 'to') {
      filterSet.to = true
      if (event !== null) {
        this.setState({
          toDate: new Date(event),
          filterSet,
          sessions: [],
          currentPageNumber: 1
        }, () => this.filterSessions())
      } else {
        filterSet.to = false
        this.setState({
          toDate: null,
          filterSet,
          sessions: [],
          currentPageNumber: 1
        }, () => this.filterSessions())
      }
    }
  }

  getDateArray = () => {
    const { sessions } = this.state
    const dateArray = []
    if (sessions && sessions.length) {
      sessions.forEach(_s => {
        if (!dateArray.includes(new Date(_s.availabilityDate).setHours(0, 0, 0, 0))) {
          dateArray.push(new Date(_s.availabilityDate).setHours(0, 0, 0, 0))
        }
      })
    }

    return dateArray
  }

  changeTab = (e) => {
    this.setState({
      activeTab: e.target.value
      // eslint-disable-next-line react/prop-types
    }, () => this.props.history.push(this.state.activeTab))
  }

  render() {
    const { mentors, sessionFetchStatus } = this.props
    let mentors_ = []
    if (mentors && mentors.toJS()) {
      mentors_ = mentors.toJS()
      mentors_.splice(0, 0, { id: 'All Mentors', name: 'All Mentors' })
    }

    return (
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            top: '-5px',
            paddingBottom: '10px'
          }}
        >
          <Main.RadioGroup
            value={this.state.activeTab}
            onChange={(e) => this.changeTab(e)}
            buttonStyle='solid'
            className='sessionTypeRadioGrp'
          >
            <Radio.Button className='sessionTypeRadioBtn' value='/ums/sessions'>Trial</Radio.Button>
            <Radio.Button className='sessionTypeRadioBtn' value='/ums/sessions/paid'>Paid</Radio.Button>
          </Main.RadioGroup>
        </div>
        <SessionManagementStyle.TopContainer>
          {
            getDataFromLocalStorage('login.role') === ADMIN ||
            getDataFromLocalStorage('login.role') === UMS_ADMIN ||
            getDataFromLocalStorage('login.role') === UMS_VIEWER
                ? (
                  <div style={{ marginRight: 'auto' }}>
                    <Select
                      value={this.state.selectedUser}
                      style={{ width: 200 }}
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, option) =>
                        get(option, 'props.children')
                          ? get(option, 'props.children')
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                          : false
                      }
                      onChange={(value) => this.setState({
                            selectedUser: value,
                            sessions: [],
                            currentPageNumber: 1
                          }, () => this.filterSessions())}
                    >
                      {
                          mentors_
                              ? mentors_.map(mentor =>
                                <Select.Option key={mentor.id}
                                  value={mentor.id}
                                >{mentor.name || mentor.username}
                                </Select.Option>
                              )
                              : ''
                        }
                    </Select>
                  </div>
                ) :
                (
                  <div />
                )
          }
          <div
            style={{
              marginRight: 'auto',
              display: 'flex',
              flexDirection: 'row'
            }}
          >
            <DatePicker
              placeholder='Select From Date'
              dateRender={current => {
                  const currentDate = new Date().setHours(0, 0, 0, 0)
                  const style = {}
                  if (currentDate === new Date(current).setHours(0, 0, 0, 0)) {
                    style.backgroundColor = '#a8a6ee'
                    style.color = '#ffffff'
                  }
                  style.cursor = 'pointer'
                  return (
                    <div className='ant-picker-cell-inner' style={style}>
                      {current.date()}
                    </div>
                  )
              }}
              isClearable
              onChange={(event) => this.handleDateChange(event, 'from')}
              value={this.state.fromDate !== null ? moment(this.state.fromDate) : undefined}
            />
            <div style={{ marginLeft: '30px' }}>
              <DatePicker
                placeholder='Select To Date'
                dateRender={current => {
                    const currentDate = new Date().setHours(0, 0, 0, 0)
                    const style = {}
                    if (currentDate === new Date(current).setHours(0, 0, 0, 0)) {
                      style.backgroundColor = '#a8a6ee'
                      style.color = '#ffffff'
                    }
                    style.cursor = 'pointer'
                    return (
                      <div className='ant-picker-cell-inner' style={style}>
                        {current.date()}
                      </div>
                    )
                  }}
                isClearable
                onChange={(event) => this.handleDateChange(event, 'to')}
                value={this.state.toDate !== null ? moment(this.state.toDate) : undefined}
              />
            </div>
          </div>
          <div style={{ marginTop: '5px', marginRight: '10px', width: `${hs(270)}` }}>
            {`Total Sessions: ${
              this.state.totalSessions
            }`}
          </div>
          {isUserWrite() &&
          <SessionManagementStyle.StyledButton
            type='primary'
            icon='plus'
            id='add-btn'
            onClick={this.openSessionModal}
          >
            ADD SESSION
          </SessionManagementStyle.StyledButton>}
        </SessionManagementStyle.TopContainer>
        <div style={{ display: 'flex', width: '100.5%', alignItems: 'center', flexDirection: 'column' }}>
          <Table
            dataSource={this.state.sessions}
            columns={this.state.columns}
            rowKey='id'
            bordered
            loading={sessionFetchStatus && sessionFetchStatus.getIn([`mentorSession/${this.getSessionType()}`, 'loading'])}
            onChange={this.tableOnChange}
            pagination={{
              total: this.state.sessions.length,
              pageSize: this.state.sessions.length,
              hideOnSinglePage: true
            }}
            className='mentor-sessions-table'
            scroll={{ x: true, y: vsValue(730) }}
            rowClassName={(record => {
              if (get(record, 'date')) {
                return isUserWrite() ? 'date-row' : 'date-row-viewer'
              }
              return 'mentor-sessions-table'
            })}
          />
          <div style={{ display: 'flex', marginTop: `${hs(45)}` }}>
            {
              !(sessionFetchStatus && sessionFetchStatus.getIn([`mentorSession/${this.getSessionType()}`, 'loading']))
                  ? (
                    <Pagination
                      current={this.state.currentPageNumber}
                      pageSize={20}
                      total={this.state.totalSessions}
                      onChange={(pageNumber) => {
                        if (this.state.currentPageNumber !== pageNumber) {
                          this.setState({
                            sessions: [],
                            currentPageNumber: pageNumber,
                          }, () => this.filterSessions())
                        }
                      }}
                    />
                  ) : <div />
            }
          </div>
        </div>
        <SessionModal
          id='Session Modal'
          title='Add Session (Indian Timing)'
          visible={this.state.sessionModalVisible}
          closeSessionModal={this.closeSessionModal}
          mentors={this.props.mentors.toJS()}
          notification={this.props.notification}
          sessions={this.props.sessions && this.props.sessions.toJS()}
          addStatus={this.props.sessionAddStatus}
          updateStatus={this.props.sessionUpdateStatus}
          editingSession={this.state.editingSession}
          sessionToEdit={this.state.sessionToEdit}
          userRole={getDataFromLocalStorage('login.role')}
          userId={getDataFromLocalStorage('login.id')}
          courses={this.getPublishedCourses()}
          addError={this.props.addError}
          updateError={this.props.updateError}
          addedSession={this.props.addedSession}
          path={get(this.props, 'match.path')}
          sessionType={this.getSessionType()}
          updateAddedSessionCount={(count) => this.updateAddedSessionCount(count)}
          getSelectedSlots={this.getSelectedSlots}
        />
        <MainModal
          visible={this.state.showIntlTimeModal}
          title={`Date & Time of booked slots in ${this.state.selectedTimezone} Timezone`}
          onCancel={() => this.setState({ showIntlTimeModal: false })}
          maskClosable={false}
          width='720px'
          footer={[
            <MainModal.SaveButton
              type='primary'
              htmlType='submit'
              form='time-zone-modal'
              onClick={() => this.setState({ showIntlTimeModal: false })}
            > OK
            </MainModal.SaveButton>
        ]}
        >
          <div id='select-time-zone'>
            <MainModal.Select
              width='50%'
              placeholder='Select Timezone'
              getPopupContainer={() => document.getElementById('select-time-zone')}
              onChange={(value) => this.setState({ selectedTimezone: value })}
              value={this.state.selectedTimezone}
              showSearch
            >
              {
                momentTZ.tz.names().map(timezone =>
                  <MainModal.Option key={timezone}
                    value={timezone}
                  >{timezone}
                  </MainModal.Option>
              )}
            </MainModal.Select>
          </div>
          {
            this.state.selectedIntlDates.map(date => (
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                <div style={{ fontFamily: 'Nunito', color: 'rgba(0, 0, 0, 0.5)' }}>{date}</div>
                <div style={{ margin: '10px' }}>
                  <SessionTimeModalStyle.SlotContainer justifyContent='flex-start'>
                    {this.renderSlots(date)}
                  </SessionTimeModalStyle.SlotContainer>
                </div>
              </div>
            ))
          }
        </MainModal>
      </div>
    )
  }
}

SessionManagement.propTypes = {
  sessionUpdateStatus: PropTypes.shape({}).isRequired,
  notification: PropTypes.shape({}).isRequired,
  sessionAddStatus: PropTypes.shape({}).isRequired,
  sessions: PropTypes.shape([]).isRequired,
  addError: PropTypes.shape({}).isRequired,
  addedSession: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  mentors: PropTypes.shape([]).isRequired,
  mentorSessionsMeta: PropTypes.shape({}).isRequired,
  courses: PropTypes.shape([]).isRequired,
  sessionFetchStatus: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  sessionDeleteStatus: PropTypes.shape({}).isRequired
}

export default SessionManagement
