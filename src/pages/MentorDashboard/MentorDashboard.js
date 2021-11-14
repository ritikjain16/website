import React from 'react'
import { get } from 'lodash'
import { Spin, notification, Icon, DatePicker } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import moment from 'moment'
import Calendar from '../../components/FullCalendar'
import { MENTOR, ADMIN, UMS_ADMIN, UMS_VIEWER, SALES_EXECUTIVE } from '../../constants/roles'
import fetchMentorSessions from '../../actions/mentorSessions/fetchMentorSessions'
import fetchMentorForSalesExec from '../../actions/sessions/fetchMentorForSales'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import ClassDetailsModal from './components/ClassDetailsModal'
import AvailabilityModal from './components/AvailabilityModal/AvailabilityModal'
import AttendanceModal from './components/AttendanceModal/AttendanceModal'
import RescheduleModal from './components/RescheduleModal/RescheduleModal'
import getIdArrForQuery from '../../utils/getIdArrForQuery'
import MentorDashboardStyle from './MentorDashboard.style'
import Style from './components/Modal.styles'
import { mentorDashboard as colors, TekieAmethyst } from '../../constants/colors'
import { PlusSvg } from '../../constants/icons'
import { getDates, getSlotTime } from './utils'

import './customStyles.scss'
import fetchSessionLogs from '../../actions/mentorSessions/fetchSessionLogs'
import NotAssignedModal from './components/NotAssignedModal/NotAssignedModal'
import appConfig from '../../config/appConfig'
import EmptySlotAssignModal from './components/EmptySlotAssignModal/EmptySlotAssignModal'

const loadingIcon = <LoadingOutlined style={{ fontSize: 16, marginRight: '8px', color: TekieAmethyst }} spin />

const isMobile = typeof window === 'undefined' ? false : window.innerWidth < 700

const sessionFilters = {
  All: { filterValue: null },
  'Unassigned Slots': { filterValue: null },
  B2C: { filterValue: null },
  B2B: { filterValue: ',{batchSessions_some: {batch_some: {type: b2b}}}' },
  B2B2C: { filterValue: ',{batchSessions_some: {batch_some: {type: b2b2c}}}' },
}

class MentorDashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isAdminLoggedIn: false,
      isClassDetailsModalVisible: false,
      isAvailabilityModalVisible: false,
      isAttendanceModalVisible: false,
      isRescheduleModalVisible: false,
      isFetching: false,
      availabilityDateGte: null,
      availabilityDateLte: null,
      selectedSession: null,
      fetchedEvents: [],
      sessionTypeFilter: 'All',
      isSMMentorsFetched: false,
      mentors: [],
      mentorIds: [],
      isNotAssignedModalVisible: false,
      isEmptySlotAssignModalVisible: false,
      isTimeGridWeekView: false
    }
  }

  async componentDidMount() {
    const { location } = this.props.history
    let stateObj = {}
    /** If location state received store it in the local state and clear location state */
    if (get(location, 'state.modalData')) {
      stateObj = {
        selectedSession: {
          ...get(location, 'state.modalData'),
          isFeedbackSubmitted: get(location, 'state.isFeedbackSubmitted', false),
          hasRescheduled: get(location, 'state.hasRescheduled', false),
        },
        isClassDetailsModalVisible: true,
        sessionTypeFilter: get(location, 'state.sessionTypeFilter'),
        navigateToAvailabilityDateGte: get(location, 'state.activeAvailabilityDateGte'),
      }
      if (get(location, 'state.isFeedbackSubmitted', false)) {
        stateObj.selectedSession = null
        stateObj.isClassDetailsModalVisible = false
      }
      this.props.history.replace(this.props.history.pathname)
    }

    const savedRole = getDataFromLocalStorage('login.role')
    const isAdmin = savedRole === ADMIN || savedRole === UMS_ADMIN
    || savedRole === UMS_VIEWER || savedRole === SALES_EXECUTIVE
    let customCalendarView = null
    if (isAdmin) {
      customCalendarView = 'timeGridDay'
    }
    this.setState({
      isAdminLoggedIn: isAdmin,
      customCalendarView,
      ...stateObj
    })
    // await this.fetchMentorSessionsQuery()
  }

  componentDidUpdate(prevProps) {
    const updateSessionStatus = this.props.updateSessionStatus
      && this.props.updateSessionStatus.toJS()
    const prevUpdateSessionStatus = prevProps.updateSessionStatus
      && prevProps.updateSessionStatus.toJS()
    const updateBatchSessionStatus = this.props.updateBatchSessionStatus
      && this.props.updateBatchSessionStatus.toJS()
    const prevUpdateBatchSessionStatus = prevProps.updateBatchSessionStatus
      && prevProps.updateBatchSessionStatus.toJS()
    const updateMentorSessionStatus = this.props.updateMentorSessionStatus
      && this.props.updateMentorSessionStatus.toJS()
    const prevUpdateMentorSessionStatus = prevProps.updateMentorSessionStatus
      && prevProps.updateMentorSessionStatus.toJS()
    const { sendLinkFailure, sendLinkStatus, mentorSessionDeleteStatus,
      mentorSessionDeleteFailure } = this.props

    if ((get(updateSessionStatus, 'success', false)
      && !get(prevUpdateSessionStatus, 'success', false))
      || (get(updateBatchSessionStatus, 'success', false)
      && !get(prevUpdateBatchSessionStatus, 'success', false))
    ) {
      notification.success({
        message: 'Session updated successfully'
      })
    }
    if (get(updateMentorSessionStatus, 'failure')
      && !get(prevUpdateMentorSessionStatus, 'failure')) {
      const failureMessage = this.props.mentorSessionsUpdateFailure
        && this.props.mentorSessionsUpdateFailure.toJS()
      const error = get(get(failureMessage[0], 'error.errors[0]'), 'extensions.exception.name')
      if (error === 'SlotsOccupiedError') {
        notification.error({
          message: 'Slots Already Occupied!'
        })
      } else {
        const errorObj = get(get(failureMessage[0], 'error.errors[0]'), 'message')
        notification.error({
          message: errorObj
        })
      }
    }

    if (sendLinkStatus && !get(sendLinkStatus.toJS(), 'loading')
      && get(sendLinkStatus.toJS(), 'success') &&
      (prevProps.sendLinkStatus !== sendLinkStatus)) {
      notification.close('loading')
      notification.success({
        message: 'Session link sent'
      })
    } else if (sendLinkStatus && !get(sendLinkStatus.toJS(), 'loading')
      && get(sendLinkStatus.toJS(), 'failure') &&
      (prevProps.sendLinkFailure !== sendLinkFailure)) {
      notification.close('loading')
      if (sendLinkFailure && sendLinkFailure.toJS().length > 0) {
        notification.error({
          message: get(get(sendLinkFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    } else if (sendLinkStatus && get(sendLinkStatus.toJS(), 'loading')
      && !get(sendLinkStatus.toJS(), 'success') &&
      (prevProps.sendLinkStatus !== sendLinkStatus)) {
      notification.open({
        key: 'loading',
        message: 'Sending Link...',
        icon: <Icon type='loading' />,
        duration: 0
      })
    }

    if (mentorSessionDeleteStatus && !get(mentorSessionDeleteStatus.toJS(), 'loading')
      && get(mentorSessionDeleteStatus.toJS(), 'success') &&
      (prevProps.mentorSessionDeleteStatus !== mentorSessionDeleteStatus)) {
      notification.success({
        message: 'Session deleted successfully'
      })
    } else if (mentorSessionDeleteStatus && !get(mentorSessionDeleteStatus.toJS(), 'loading')
      && get(mentorSessionDeleteStatus.toJS(), 'failure') &&
      (prevProps.mentorSessionDeleteFailure !== mentorSessionDeleteFailure)) {
      if (mentorSessionDeleteFailure && mentorSessionDeleteFailure.toJS().length > 0) {
        notification.error({
          message: get(get(mentorSessionDeleteFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }

    const { mentorId } = this.props.match.params
    const { mentorId: prevMentorId } = prevProps.match.params
    if (mentorId !== prevMentorId) {
      this.setState({
        isFetching: true
      })
      this.fetchMentorSessionsQuery()
    }
  }


  /** Utils  */
  getBgColorBasedOnSessionType = (sessionType, batchSession, colorType = '') => {
    if (sessionType === 'trial' || sessionType === 'paid') {
      return colors[`b2cAccent${colorType}`]
    } else if (sessionType === 'batch') {
      if (batchSession && batchSession.batch) {
        if (batchSession.batch.type === 'b2b') {
          return colors[`b2bAccent${colorType}`]
        } else if (batchSession.batch.type === 'b2b2c') {
          return colors[`b2b2cAccent${colorType}`]
        }
        return colors[`b2cAccent${colorType}`]
      }
    }
    return colors[`b2cAccent${colorType}`]
  }
  getTimeRangeFromSession = (bookingDate, session, newLogic = false) => {
    bookingDate = new Date(bookingDate).toDateString()
    const startTime = `${bookingDate}, ${get(getSlotTime(session, newLogic), 'startTime')}`
    const endTime = `${bookingDate}, ${get(getSlotTime(session, newLogic), 'endTime')}`
    return { startTime, endTime }
  }
  getUserIdToFilter = () => {
    const savedId = getDataFromLocalStorage('login.id')
    const savedRole = getDataFromLocalStorage('login.role')
    const { isAdminLoggedIn } = this.state
    if (savedRole && savedRole === SALES_EXECUTIVE && !this.props.match.params.mentorId) {
      return this.state.mentorIds
    } else if (isAdminLoggedIn) {
      const { mentorId } = this.props.match.params
      if (mentorId) {
        return [mentorId]
      }
      return null
    } else if (savedRole === MENTOR) {
      return [savedId]
    }
    return null
  }
  getAllUnAssignedSlotsForMentorSession = (session, prevEvents) => {
    if (get(session, 'sessionType') === 'trial') {
      const sessionsOnSameDay = prevEvents.filter(prevEvent => {
        if (get(prevEvent, 'extendedProps.rawBookingDate') === get(session, 'availabilityDate')) {
          return prevEvent
        }
      })
      let sessionSlots = getSlotTime(session, true)
      sessionsOnSameDay.forEach(prevSession => {
        const { record } = prevSession.extendedProps
        if (prevSession.extendedProps.documentType === 'demoSession') {
          sessionSlots = sessionSlots.filter(slots => get(slots, 'startTime') !== get(getSlotTime(record), 'startTime'))
        } else {
          if (prevSession.extendedProps.recordType === 'mentorMenteeSession') {
            sessionSlots = sessionSlots.filter(slots => get(slots, 'startTime') !== get(getSlotTime(record.menteeSession), 'startTime'))
          }
          if (prevSession.extendedProps.recordType === 'batchSession') {
            sessionSlots = sessionSlots.filter(slots => get(slots, 'startTime') !== get(getSlotTime(record), 'startTime'))
          }
          if (prevSession.extendedProps.recordType === 'notAssigned') {
            const { notAssignedStartTime } = prevSession.extendedProps
            sessionSlots = sessionSlots.filter(slots => get(slots, 'startTime') !== notAssignedStartTime)
          }
        }
      })
      return sessionSlots
    }
    return []
  }

  // Setters
  setModalVisibility = (key, value) => this.setState({
    [key]: value,
  })

  setSelectedSession = (data) => this.setState({
    isClassDetailsModalVisible: true,
    selectedSession: data
  })

  // Methods to sanitize incoming data...
  checkIfDateAndSlotAreEqual = (eventDetails, currentMenteeSession) => {
    if (eventDetails.menteeSession && (
      eventDetails.menteeSession.bookingDate === currentMenteeSession.bookingDate)) {
      if (getSlotTime(eventDetails.menteeSession).startTime
        === getSlotTime(currentMenteeSession).startTime) {
        if (eventDetails.menteeSession.user.id === currentMenteeSession.user.id) {
          return true
        }
        return false
      }
      return false
    }
    return false
  }
  checkIfRedundantDataExists = (mentorMenteeSession, events) => {
    let IDToFilter = false
    events.forEach(event => {
      const eventDetails = get(event.extendedProps, 'record')
      const eventId = get(event.extendedProps, 'recordId')
      if (this.checkIfDateAndSlotAreEqual(eventDetails, mentorMenteeSession.menteeSession)) {
        if (eventDetails.menteeSession.user.id === mentorMenteeSession.menteeSession.user.id) {
          IDToFilter = eventId
        }
      }
    })
    return IDToFilter
  }
  checkIfBatchSessionExistsOnSameSlot = (mentorMenteeSession, events) => {
    let shouldSkip = false
    events.forEach(event => {
      const eventType = get(event.extendedProps, 'recordType')
      if (eventType === 'batchSession') {
        const eventDetails = get(event.extendedProps, 'record')
        if (eventDetails && (
          eventDetails.bookingDate === mentorMenteeSession.menteeSession.bookingDate)) {
          if (getSlotTime(eventDetails) && (getSlotTime(eventDetails).startTime
            === getSlotTime(mentorMenteeSession.menteeSession).startTime)) {
            const studentIds = eventDetails.attendance.map(el => el.student.user.id)
            if (studentIds.includes(mentorMenteeSession.menteeSession.user.id)) {
              shouldSkip = true
            }
          }
        }
      }
    })
    return shouldSkip
  }

  mapSessionsToEventObject = (title, courseId, startTime, endTime, backgroundColor,
    borderColor, theme = {}, record, sessionType, totalStudent, recordType, recordId, sessionId,
    mentorProfile, rawBookingDate, isB2B2CTrial = false, notAssignedStartTime,
    documentType = 'regular', clickable = true) => (
    {
      title,
      allDay: false,
      date: startTime,
      end: endTime,
      backgroundColor,
      borderColor,
      extendedProps: {
        theme,
        record,
        recordId,
        recordType,
        sessionType,
        totalStudent,
        courseId,
        sessionId,
        mentorProfile,
        rawBookingDate,
        isB2B2CTrial,
        notAssignedStartTime,
        clickable,
        documentType
      }
    }
  )

  filterLocalSessions = (sessionType) => {
    if (sessionType !== 'Unassigned Slots') {
      this.setState({
        isFetching: false,
        fetchedEvents: this.state.fetchedEvents.filter(events => {
          if (
            (this.getBatchType(get(events, 'extendedProps.record.batch.type')) === sessionType.toLowerCase()) &&
            (get(events, 'extendedProps.recordType') !== 'notAssigned')
          ) {
            return events
          }
        })
      })
      return
    }
    this.setState({
      isFetching: false,
      fetchedEvents: this.state.fetchedEvents.filter(events => {
        if (get(events, 'extendedProps.recordType') === 'notAssigned') {
          return events
        }
      })
    })
  }

  /** Mentor Session Query  */
  fetchMentorSessionsQuery = async () => {
    const { availabilityDateGte, availabilityDateLte, sessionTypeFilter,
      isTimeGridWeekView } = this.state

    let datesFilter = ''
    let sessionLogDatesFilter = ''
    let filters = ''
    if (availabilityDateGte) {
      datesFilter += `{availabilityDate_gte: "${new Date(new Date(availabilityDateGte).setHours(0, 0, 0, 0)).toISOString()}"},`
      sessionLogDatesFilter += `{sessionDate_gte: "${new Date(new Date(availabilityDateGte).setHours(0, 0, 0, 0)).toISOString()}"},`
    }
    if (availabilityDateLte) {
      datesFilter += `{availabilityDate_lte: "${new Date(new Date(availabilityDateLte).setHours(0, 0, 0, 0)).toISOString()}"},`
      sessionLogDatesFilter += `{sessionDate_lte: "${new Date(new Date(availabilityDateLte).setHours(0, 0, 0, 0)).toISOString()}"},`
    }
    if (sessionTypeFilter !== 'All') {
      filters += sessionFilters[sessionTypeFilter].filterValue || ''
    }
    await fetchMentorSessions(getIdArrForQuery(this.getUserIdToFilter()), `${datesFilter}${filters}`)
    let sessionLogs = []
    // const sessionLogs = this.props.sessionLogs && this.props.sessionLogs.toJS()
    await fetchSessionLogs(
      getIdArrForQuery(this.getUserIdToFilter()),
      sessionLogDatesFilter,
      ['deleteMentorMenteeSession'],
      'sessionLogsData'
    ).then(res => {
      if (res && res.sessionLogs) {
        sessionLogs = get(res, 'sessionLogs')
      }
    })
    const mentorSessions = this.props.mentorSessions && this.props.mentorSessions.toJS()
    let events = []
    const timesArray = []
    sessionLogs.map(logs => {
      if (logs && logs.hasRescheduled && logs.rescheduledDateProvided) {
        const { startTime, endTime } = this.getTimeRangeFromSession(
          logs.sessionDate, logs)
        timesArray.push(new Date(startTime))
        events.push(this.mapSessionsToEventObject(
          get(logs.course, 'title', ''),
          get(logs.course, 'id'),
          new Date(startTime),
          new Date(endTime),
          this.getBgColorBasedOnSessionType('trial', null, 'Muted'),
          this.getBgColorBasedOnSessionType('trial', null),
          {
            color: this.getBgColorBasedOnSessionType('trial', null),
            textDecoration: 'line-through'
          },
          logs,
          'trial',
          1,
          'mentorMenteeSession',
          logs.id,
          null,
          get(logs, 'mentor'),
          logs.sessionDate,
          false,
          null,
          'rescheduled',
        ))
      } else if (logs && logs.isFeedbackSubmitted && !logs.rescheduledDateProvided) {
        const { startTime, endTime } = this.getTimeRangeFromSession(
          logs.sessionDate, logs)
        timesArray.push(new Date(startTime))
        events.push(this.mapSessionsToEventObject(
          get(logs.course, 'title', ''),
          get(logs.course, 'id'),
          new Date(startTime),
          new Date(endTime),
          this.getBgColorBasedOnSessionType('trial', null, 'Muted'),
          this.getBgColorBasedOnSessionType('trial', null),
          {
            color: this.getBgColorBasedOnSessionType('trial', null),
            textDecoration: 'line-through'
          },
          logs,
          'trial',
          1,
          'mentorMenteeSession',
          logs.id,
          null,
          get(logs, 'mentor'),
          logs.sessionDate,
          false,
          null,
          'demoSession',
        ))
      }
    })
    mentorSessions.map(session => {
      if (session.sessionType === 'trial' && session.batchSessions && session.batchSessions.length > 0) {
        session.batchSessions.forEach(batchSession => {
          if (batchSession.batch) {
            const { startTime, endTime } = this.getTimeRangeFromSession(
              batchSession.bookingDate, batchSession)
            timesArray.push(new Date(startTime))
            events.push(this.mapSessionsToEventObject(
              get(batchSession, 'course.title', get(batchSession, 'topic.title', '')),
              get(batchSession, 'course.id'),
              new Date(startTime),
              new Date(endTime),
              '#04cad9',
              this.getBgColorBasedOnSessionType('batch', batchSession, 'Muted'),
              null,
              batchSession,
              'batch',
              batchSession.attendance.length || 0,
              'batchSession',
              batchSession.id,
              get(session, 'id'),
              get(session, 'user'),
              batchSession.bookingDate,
              true // isB2B2CTrial = true
            ))
          }
        })
      }
      if (session.sessionType === 'batch') {
        if (session.batchSessions && session.batchSessions.length > 0) {
          session.batchSessions.forEach(batchSession => {
            if (batchSession.batch) {
              const { startTime, endTime } = this.getTimeRangeFromSession(
                batchSession.bookingDate, batchSession)
              timesArray.push(new Date(startTime))
              events.push(this.mapSessionsToEventObject(
                get(batchSession, 'course.title', get(batchSession, 'topic.title', '')),
                get(batchSession, 'course.id'),
                new Date(startTime),
                new Date(endTime),
                this.getBgColorBasedOnSessionType(session.sessionType, batchSession),
                this.getBgColorBasedOnSessionType(session.sessionType, batchSession, 'Muted'),
                null,
                batchSession,
                session.sessionType,
                batchSession.attendance.length || 0,
                'batchSession',
                batchSession.id,
                get(session, 'id'),
                get(session, 'user'),
                batchSession.bookingDate
              ))
            }
          })
        }
      } else if (session.mentorMenteeSessions && session.mentorMenteeSessions.length > 0) {
        session.mentorMenteeSessions.forEach(mentorMenteeSession => {
          if (mentorMenteeSession.menteeSession) {
            const shouldSkip = this.checkIfBatchSessionExistsOnSameSlot(mentorMenteeSession, events)
            if (!shouldSkip) {
              const IDToFilter = this.checkIfRedundantDataExists(mentorMenteeSession, events)
              if (IDToFilter) {
                events = events.filter(el => el.extendedProps.recordId !== IDToFilter)
              }
              const { startTime, endTime } = this.getTimeRangeFromSession(
                mentorMenteeSession.menteeSession.bookingDate, mentorMenteeSession.menteeSession)
              timesArray.push(new Date(startTime))
              events.push(this.mapSessionsToEventObject(
                get(mentorMenteeSession, 'course.title', get(mentorMenteeSession, 'topic.title', '')),
                get(mentorMenteeSession, 'course.id'),
                new Date(startTime),
                new Date(endTime),
                this.getBgColorBasedOnSessionType(session.sessionType, null),
                this.getBgColorBasedOnSessionType(session.sessionType, null, 'Muted'),
                null,
                mentorMenteeSession,
                session.sessionType,
                1,
                'mentorMenteeSession',
                mentorMenteeSession.id,
                get(session, 'id'),
                get(session, 'user'),
                mentorMenteeSession.menteeSession.bookingDate
              ))
            }
          }
        })
      }
      const unAssignedSlots = this.getAllUnAssignedSlotsForMentorSession(session, events)
      const bookingDate = new Date(session.availabilityDate).toDateString()
      unAssignedSlots.forEach(slots => {
        const startTime = `${bookingDate}, ${get(slots, 'startTime')}`
        const endTime = `${bookingDate}, ${get(slots, 'endTime')}`
        timesArray.push(new Date(startTime))
        events.push(this.mapSessionsToEventObject(
          'Yet to be assigned!',
          null,
          new Date(startTime),
          new Date(endTime),
          '#CCCCCC',
          null,
          null,
          session,
          session.sessionType,
          null,
          'notAssigned',
          null,
          get(session, 'id'),
          get(session, 'user'),
          session.availabilityDate,
          false,
          get(slots, 'startTime')
        ))
      })
    })
    const addedSlotEvents = timesArray.sort()
    const dateRangeArray = getDates(availabilityDateGte, availabilityDateLte)
    const notAddedEvents = []
    appConfig.timeSlots.forEach(slot => {
      dateRangeArray.forEach(dateValue => {
        const newDateValue = new Date(dateValue.date).setHours(slot, 0, 0, 0)
        const slotEventNotExist = addedSlotEvents.find(foundDate =>
          moment(foundDate).isSame(moment(newDateValue)))
        // check if the date is not present in any sessions and if it is after the current time
        if (!slotEventNotExist && moment(newDateValue).isAfter(moment())) {
          notAddedEvents.push(new Date(newDateValue))
        }
      })
    })
    if (isTimeGridWeekView) {
      notAddedEvents.forEach((dateSlots, ind) => {
        const startTime = dateSlots
        const endTime = moment(dateSlots).add(1, 'hour')
        timesArray.push(new Date(startTime))
        events.push({
          emptyId: `Empty${ind}`,
          ...this.mapSessionsToEventObject(
            'Empty Slot',
            null,
            new Date(startTime),
            new Date(endTime),
            '#FAF7FF',
            null,
            null,
            null,
            'Empty Slot',
            null,
            'Empty Slot',
            null,
            null,
            null,
            new Date(startTime),
            false,
            null,
          )
        })
      })
    }
    this.setState({
      fetchedEvents: events,
      isFetching: false
    }, () => {
      if (this.state.sessionTypeFilter !== 'All') {
        this.filterLocalSessions(this.state.sessionTypeFilter)
      }
    })
  }

  fetchSalesManagerMentorsIfLoggedIn = async () => {
    const { isSMMentorsFetched } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    if (!isSMMentorsFetched) {
      if (savedRole && savedRole === SALES_EXECUTIVE) {
        const salesExecutiveId = getDataFromLocalStorage('login.id')
        await fetchMentorForSalesExec(salesExecutiveId).then(res => {
          const mentorIds = res.user.salesExecutiveProfile.mentors.map(({ user }) => user.id)
          this.setState({
            mentorIds,
            mentors: res.user.salesExecutiveProfile.mentors.map(({ user }) => user),
            isSMMentorsFetched: true
          })
        })
      }
    }
    return null
  }

  updateExistingLocalSessionData = (updateData, originalData, updateType = null) => {
    this.setState((prevState) => (
      {
        fetchedEvents: prevState.fetchedEvents.map(event => {
          if (get(event.extendedProps, 'recordId') === get(originalData, 'id')) {
            let updateObj = {}
            if (updateType === 'event') {
              const { startTime, endTime } = this.getTimeRangeFromSession(
                updateData.bookingDate,
                updateData
              )
              updateObj = { ...event, date: new Date(startTime), end: new Date(endTime) }
            } else {
              updateObj = {
                ...event,
                extendedProps: {
                  ...event.extendedProps,
                  record: {
                    ...event.extendedProps.record,
                    ...updateData
                  } } }
            }
            return updateObj
          }
          return event
        })
      }
    ), async () => {
      await this.fetchMentorSessionsQuery()
    })
  }

  handleEventClick = (arg) => {
    const { record, sessionType,
      recordType, courseId, sessionId,
      isB2B2CTrial, mentorProfile, clickable, documentType } = get(arg.event, 'extendedProps')
    // const rect = arg.el.getBoundingClientRect()
    // console.log('asfasf', (rect.x + rect.width) < 0
    //          || (rect.y + rect.height) < 0
    //          || (rect.x + 550 > window.innerWidth || rect.y + 200 > window.innerHeight))
    let bgColor = this.getBatchType(get(arg.event, 'backgroundColor'))
    let bgMuted = this.getBatchType(get(arg.event, 'borderColor'))
    if (['rescheduled', 'demoSession'].includes(documentType)) {
      bgColor = this.getBatchType(get(arg.event, 'borderColor'))
      bgMuted = this.getBatchType(get(arg.event, 'backgroundColor'))
    }
    if (recordType !== 'notAssigned' && clickable && recordType !== 'Empty Slot') {
      this.setSelectedSession({
        course: get(arg.event, 'title'),
        courseId,
        topic: `${get(record, 'topic.order')}. ${get(record, 'topic.title')}`,
        startTime: get(arg.event, 'start'),
        endTime: get(arg.event, 'end'),
        batchtype: this.getBatchType(get(record, 'batch.type')),
        bgColor,
        bgMuted,
        studentName: get(record, 'menteeSession.user.name') || get(record, 'client.name', null),
        sessionType,
        isB2B2CTrial,
        batch: get(record, 'batch.code') || '-',
        students: get(record, 'attendance.length', null),
        type: 'Learning',
        sessionStatus: get(record, 'sessionStatus'),
        sessionRecordingLink: get(record, 'sessionRecordingLink'),
        recordType,
        record,
        sessionId,
        mentorProfile,
        documentType,
      })
    } else if (recordType === 'notAssigned' && clickable) {
      this.setState({
        isNotAssignedModalVisible: true,
        selectedSession: {
          course: get(arg.event, 'title'),
          courseId,
          topic: `${get(record, 'topic.order')}. ${get(record, 'topic.title')}`,
          startTime: get(arg.event, 'start'),
          endTime: get(arg.event, 'end'),
          batchtype: this.getBatchType(get(record, 'batch.type')),
          bgColor,
          bgMuted,
          studentName: get(record, 'menteeSession.user.name') || get(record, 'client.name', null),
          sessionType,
          isB2B2CTrial,
          batch: get(record, 'batch.code') || '-',
          students: get(record, 'attendance.length', null),
          type: 'Learning',
          sessionStatus: get(record, 'sessionStatus'),
          sessionRecordingLink: get(record, 'sessionRecordingLink'),
          recordType,
          record,
          sessionId,
          mentorProfile,
          documentType
        }
      })
    } else if (recordType === 'Empty Slot' && clickable) {
      const { emptyId } = get(arg, 'event.extendedProps')
      const selectedSession = {
        course: get(arg.event, 'title'),
        courseId,
        topic: `${get(record, 'topic.order')}. ${get(record, 'topic.title')}`,
        startTime: get(arg.event, 'start'),
        endTime: get(arg.event, 'end'),
        batchtype: this.getBatchType(get(record, 'batch.type')),
        bgColor,
        bgMuted,
        studentName: get(record, 'menteeSession.user.name') || get(record, 'client.name', null),
        sessionType,
        isB2B2CTrial,
        batch: get(record, 'batch.code') || '-',
        students: get(record, 'attendance.length', null),
        type: 'Learning',
        sessionStatus: get(record, 'sessionStatus'),
        sessionRecordingLink: get(record, 'sessionRecordingLink'),
        recordType,
        record,
        sessionId,
        mentorProfile,
        documentType,
        emptyId
      }
      this.setState({
        isEmptySlotAssignModalVisible: true,
        selectedSession
      })
    }
  }

  getBatchType = (batchType) => {
    if (batchType === 'normal') {
      return 'b2c'
    }
    return batchType || 'b2c'
  }

  handleFilterChange = (value) => {
    this.setState({
      sessionTypeFilter: value,
      isFetching: true,
    }, () => {
      this.fetchMentorSessionsQuery()
    })
  }

  getMentorsArr = () => {
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole === SALES_EXECUTIVE) {
      return this.state.mentors
    }
    return null
  }

  render() {
    const { isAdminLoggedIn } = this.state
    return (
      <div id='mentor-dashboard-calender-container'>
        {this.state.isFetching ? (
          <>
            <div className='loading-container show'>
              <div className='loading-bar-container'>
                <div />
              </div>
            </div>
            <div className='mentor-dashboard-calender-loading-container'>
              <Spin indicator={loadingIcon} />
              <div className='mentor-dashboard-calender-loading'>Fetching Sessions...</div>
            </div>
          </>
        ) : (null)}
        <Calendar
          customCalendarView={this.state.customCalendarView}
          navLinks
          customViews={{
            timeGridWeek: {
              dayHeaderFormat: { weekday: 'short', day: 'numeric' },
              dayHeaderContent: ({ date }) => (
                <>
                  <div className='fullcalendar-timeGrid-header-weekday'>{date.toLocaleDateString('en', { weekday: 'short' })}</div>
                  <div className='fullcalendar-timeGrid-header-date'>{date.getDate()}</div>
                </>
              )
            },
            timeGridDay: {
              dayHeaderFormat: { weekday: 'short', day: 'numeric' },
              dayHeaderContent: ({ date }) => (
                <>
                  <div className='fullcalendar-timeGrid-header-date'>{date.toLocaleDateString('en', { weekday: 'long' })} {date.getDate()}</div>
                </>
              )
            }
          }}
          customButtons={{
              datePicker: {
                text: (
                  <DatePicker
                    style={{ width: '100%' }}
                    onChange={(date, dateString) => {
                      this.setState({
                        navigateToAvailabilityDateGte: dateString
                      })
                    }}
                  />
                )
              },
              sessionTypeFilter: {
                text: (
                  <Style.Select
                    style={{ width: '100%' }}
                    value={`Session Type: ${this.state.sessionTypeFilter}`}
                    placeholder='Session Type'
                    onChange={this.handleFilterChange}
                  >
                    {Object.keys(sessionFilters).map(sessionType => (
                      <Style.Option className='custom-selectOption' value={sessionType}>{sessionType}</Style.Option>
                    ))}
                  </Style.Select>
                )
              },
          }}
          customHeaderToolBar={{
            start: isMobile ? 'prev title today next' : 'prev next title today',
            right: (isAdminLoggedIn && !this.props.match.params.mentorId) ? 'sessionTypeFilter timeGridDay,timeGridWeek' :
              'sessionTypeFilter timeGridDay,timeGridWeek,dayGridMonth,listMonth'
          }}
          customDateToNavigate={this.state.navigateToAvailabilityDateGte}
          datesSet={(args) => {
              const { availabilityDateGte, availabilityDateLte } = this.state
            if (availabilityDateGte !== args.startStr || availabilityDateLte !== args.endStr) {
                const isTimeGridWeekView = args.view.type !== 'dayGridMonth'
                  this.setState({
                      availabilityDateGte: args.startStr,
                      availabilityDateLte: args.endStr,
                      isFetching: true,
                      isTimeGridWeekView
                  }, async () => {
                    this.setState({
                      isSMMentorsFetched: true
                    })
                    await this.fetchSalesManagerMentorsIfLoggedIn()
                    const savedRole = getDataFromLocalStorage('login.role')
                    if (savedRole === SALES_EXECUTIVE) {
                      if (this.state.mentorIds.length !== 0) {
                        this.fetchMentorSessionsQuery()
                      }
                    } else {
                      this.fetchMentorSessionsQuery()
                    }
                  })
              }
          }}
          handleEventClick={this.handleEventClick}
          fetchedEvents={this.state.fetchedEvents}
        />
        <ClassDetailsModal
          isAdminLoggedIn={isAdminLoggedIn}
          sessionTypeFilter={this.state.sessionTypeFilter}
          activeAvailabilityDateGte={this.state.availabilityDateGte}
          modalData={this.state.selectedSession}
          setModalVisibility={(key, value) => this.setModalVisibility(key, value)}
          isModalVisible={this.state.isClassDetailsModalVisible}
          updateExistingLocalSessionData={this.updateExistingLocalSessionData}
          updateSessionStatus={this.props.updateSessionStatus &&
            this.props.updateSessionStatus.toJS()}
          updateBatchSessionStatus={this.props.updateBatchSessionStatus &&
            this.props.updateBatchSessionStatus.toJS()}
          locationParams={this.props.match.params}
          history={this.props.history}
        />
        <RescheduleModal
          updateExistingLocalSessionData={this.updateExistingLocalSessionData}
          isPrevMentorSessionsLoading={this.props.isPrevMentorSessionsLoading}
          prevMentorSession={this.props.prevMentorSession &&
            this.props.prevMentorSession.toJS()}
          selectedSession={this.state.isRescheduleModalVisible && this.state.selectedSession}
          setModalVisibility={(value) => this.setModalVisibility('isRescheduleModalVisible', value)}
          isModalVisible={this.state.isRescheduleModalVisible}
          isMentorSessionsAdding={this.props.isMentorSessionsAdding}
          updateMentorSessionStatus={this.props.updateMentorSessionStatus &&
          this.props.updateMentorSessionStatus.toJS()}
          updateBatchSessionStatus={this.props.updateBatchSessionStatus
            && this.props.updateBatchSessionStatus.toJS()}
          updateMenteeStatus={this.props.updateMenteeStatus && this.props.updateMenteeStatus.toJS()}
        />
        <AvailabilityModal
          mentors={this.getMentorsArr() || this.props.mentors && this.props.mentors.toJS()}
          isAdminLoggedIn={this.state.isAdminLoggedIn}
          addSlotsToLocalState={(input) => {
            const bookingDate = new Date(input.availabilityDate).toDateString()
            const slotTimeArr = getSlotTime(input, true)
            const events = []
            slotTimeArr.forEach(slots => {
              const startTime = `${bookingDate}, ${get(slots, 'startTime')}`
              const endTime = `${bookingDate}, ${get(slots, 'endTime')}`
              events.push(this.mapSessionsToEventObject(
                  'Yet to be assigned!',
                  null,
                  new Date(startTime),
                  new Date(endTime),
                  '#CCCCCC',
                  null,
                  null,
                  null,
                  'trial',
                  null,
                  'notAssigned',
                  null,
                  null,
                  null
                ))
            })
            this.setState({
              fetchedEvents: [
                ...this.state.fetchedEvents,
                ...events
              ]
            })
          }}
          mentorSessionsAddStatus={this.props.mentorSessionsAddStatus}
          mentorSessionsAddedFailure={this.props.mentorSessionsAddedFailure}
          isMentorSessionsAdding={this.props.isMentorSessionsAdding}
          isMentorSessionsAdded={this.props.isMentorSessionsAdded}
          setModalVisibility={(value, shouldFetch) => {
            if (shouldFetch) {
              this.fetchMentorSessionsQuery()
            }
            this.setModalVisibility('isAvailabilityModalVisible', value)
          }}
          isModalVisible={this.state.isAvailabilityModalVisible}
        />
        <AttendanceModal
          updateExistingLocalSessionData={this.updateExistingLocalSessionData}
          selectedSession={this.state.selectedSession}
          setModalVisibility={async (value) => {
            this.setModalVisibility('isAttendanceModalVisible', value)
          }}
          isModalVisible={this.state.isAttendanceModalVisible}
          updateBatchSessionStatus={this.props.updateBatchSessionStatus
            && this.props.updateBatchSessionStatus.toJS()}
        />
        <NotAssignedModal
          selectedSession={this.state.selectedSession}
          setModalVisibility={(value, shouldFetch) => {
            if (shouldFetch) {
              this.fetchMentorSessionsQuery()
            }
            this.setModalVisibility('isNotAssignedModalVisible', value)
          }}
          isModalVisible={this.state.isNotAssignedModalVisible}
          mentorSessionDeleteStatus={this.props.mentorSessionDeleteStatus
            && this.props.mentorSessionDeleteStatus.toJS()}
          removeSlotsToLocalState={(input) => {
            const slotTimeArr = getSlotTime(input, true)
            const bookingDate = new Date(input.availabilityDate).toDateString()
            const events = []
            let newFetchedEvents = [...this.state.fetchedEvents]
            slotTimeArr.forEach(slots => {
              const startTime = `${bookingDate}, ${get(slots, 'startTime')}`
              const endTime = `${bookingDate}, ${get(slots, 'endTime')}`
              newFetchedEvents = [...newFetchedEvents].filter(event => !moment(get(event, 'date')).isSame(moment(startTime)))
              events.push(this.mapSessionsToEventObject(
                'Empty Slot',
                null,
                new Date(startTime),
                new Date(endTime),
                '#FAF7FF',
                null,
                null,
                null,
                'Empty Slot',
                null,
                'Empty Slot',
                null,
                null,
                null,
                new Date(startTime),
                false,
                null,
              ))
            })
            this.setState({
              fetchedEvents: [
                ...newFetchedEvents,
                ...events
              ]
            })
          }}
        />
        <EmptySlotAssignModal
          mentors={this.getMentorsArr() || this.props.mentors && this.props.mentors.toJS()}
          isAdminLoggedIn={this.state.isAdminLoggedIn}
          addSlotsToLocalState={(input) => {
            const bookingDate = new Date(input.availabilityDate).toDateString()
            const slotTimeArr = getSlotTime(input, true)
            const events = []
            let newFetchedEvents = [...this.state.fetchedEvents]
            slotTimeArr.forEach(slots => {
              const startTime = `${bookingDate}, ${get(slots, 'startTime')}`
              const endTime = `${bookingDate}, ${get(slots, 'endTime')}`
              newFetchedEvents = [...newFetchedEvents].filter(event => get(event, 'emptyId') !== get(input, 'emptyId'))
              events.push(this.mapSessionsToEventObject(
                'Yet to be assigned!',
                null,
                new Date(startTime),
                new Date(endTime),
                '#CCCCCC',
                null,
                null,
                null,
                'trial',
                null,
                'notAssigned',
                null,
                null,
                null,
                null,
                null,
                bookingDate
              ))
            })
            this.setState({
              fetchedEvents: [
                ...newFetchedEvents,
                ...events
              ]
            })
          }}
          mentorSessionsAddStatus={this.props.mentorSessionsAddStatus}
          mentorSessionsAddedFailure={this.props.mentorSessionsAddedFailure}
          isMentorSessionsAdding={this.props.isMentorSessionsAdding}
          isMentorSessionsAdded={this.props.isMentorSessionsAdded}
          updateMentorSessionStatus={this.props.updateMentorSessionStatus}
          setModalVisibility={(value, shouldFetch) => {
            if (shouldFetch) {
              this.fetchMentorSessionsQuery()
            }
            this.setModalVisibility('isEmptySlotAssignModalVisible', value)
          }}
          isModalVisible={this.state.isEmptySlotAssignModalVisible}
          sessionDetail={this.state.selectedSession}
        />
        <MentorDashboardStyle.AddSessionButton
          onClick={() => this.setModalVisibility('isAvailabilityModalVisible', true)}
        >
          <MentorDashboardStyle.Icon theme='twoTone'
            marginRight='0px'
            component={PlusSvg}
          />
        </MentorDashboardStyle.AddSessionButton>
      </div>
    )
  }
}

export default MentorDashboard
