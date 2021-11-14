/* eslint-disable max-len */
import { Pagination, Select, Modal, Button, notification, Tooltip } from 'antd'
import React, { Component } from 'react'
import moment from 'moment'
import { get, sortBy } from 'lodash'
import addMentorSession from '../../actions/assignTime/addMentorSession'
import withNav from '../../components/withNav'
import checkMentorSession from '../../actions/assignTime/checkMentorSession'
import fetchBatchCodes from '../../actions/assignTime/fetchBatchCodes'
import fetchBatchSessions from '../../actions/assignTime/fetchBatchSession'
import fetchLastSessionOfBatch from '../../actions/assignTime/fetchLastSessionOfBatch'
import fetchTopicId from '../../actions/assignTime/fetchTopicId'
import appConfig from '../../config/appConfig'
import offsetDate from '../../utils/date/date-offset'
import getSlotLabel from '../../utils/slots/slot-label'
import SessionTimeModalStyle from '../SessionManagement/components/SessionTimeModal/SessionTimeModal.style'
import changedatetoisostring from './common-util/changeDateToISOString'
import TableOfAssignTime from './components'
import addBatchSession from '../../actions/assignTime/addBatchSession'
import updateMentorSession from '../../actions/assignTime/updateMentorSession'
import updateBatchSession from '../../actions/assignTime/updateBatchSession'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import { MENTOR } from '../../constants/roles'
import fetchMentorsList from '../../actions/salesExecProfiles/fetchMentorsList'
import fetchBatchMentor from '../../actions/assignTime/fetchBatchMentor'
import fetchCourses from '../../actions/assignTime/fetchCourses'

class AssignTimeTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      batchName: [],
      paramBatchCode: this.props.match.params.code,
      currentBatchCode: this.props.match.params.code,
      currentBatchId: null,
      modalVisible: false,
      confirmLoadingModal: false,
      actiontype: null,
      batchSessionsData: [],
      showTimeSlots: false,
      topic: [],
      dateSelected: new Date(),
      slotsSelected: [],
      topicOrder: [],
      topicId: [],
      topicSelected: '',
      mentorUserId: '',
      prevslotsinfo: [],
      fetchedMentors: [],
      currentMentorId: null,
      editingSession: false,
      sessionToEdit: {},
      completedsessionerror: false,
      currentPage: 1,
      perPageQueries: 20,
      defaultSelectedValue: null,
      coursesList: [],
      selectedCourse: '',
      orderToFetch: 1,
      selectedMentorId: ''
    }
  }
  componentDidMount() {
    if (this.state.paramBatchCode) {
      fetchBatchSessions(this.state.paramBatchCode, {
        page: this.state.currentPage,
        perPage: this.state.perPageQueries,
      })
    }
    if (getDataFromLocalStorage('login.role') === MENTOR) {
      const id = getDataFromLocalStorage('login.id')
      fetchBatchMentor(this.state.currentBatchCode)
      this.setState(
        {
          mentorUserId: id,
          currentMentorId: id,
        },
        () => fetchBatchCodes(id, '{type : normal}')
      )
    } else {
      fetchBatchMentor(this.state.currentBatchCode)
      fetchMentorsList()
    }
    fetchCourses()
  }
  componentDidUpdate(prevProps) {
    const {
      batchSessionsData,
      batches,
      topic,
      topicOrder,
      isFetchingTopicId,
      isFetchingCheckMentorSession,
      previousslotsinfo,
      fetchedCheckMentorSession,
      addFailure,
      addErrors,
      updateFailure,
      updateErrors,
      mentors,
      mentorSessionId,
      mentorSessionAddFailure,
      mentorSessionAddError,
      mentorOfBatch,
      deleteErrors,
      deleteFailure,
      mentorSessionUpdateFailure,
      mentorSessionUpdateError,
      courseFetchingStatus,
    } = this.props
    if (
      this.state.paramBatchCode &&
      prevProps.isFetchingMentorOfBatch &&
      this.props.hasFetchedMentorOfBatch
    ) {
      const mentorId = !mentorOfBatch
        ? null
        : get(mentorOfBatch.toJS(), '[0].allottedMentor.id')
      const batchId = !mentorOfBatch ? null : mentorOfBatch.toJS()[0].id
      const courseFromBatch = !mentorOfBatch
        ? null
        : get(mentorOfBatch.toJS(), '[0].course.id')
      this.setState(
        {
          mentorUserId: mentorId,
          currentMentorId: mentorId,
          selectedMentorId: mentorId,
          currentBatchId: batchId,
          selectedCourse: courseFromBatch,
        },
        () => fetchLastSessionOfBatch(this.state.currentBatchId)
      )
    }
    if (
      prevProps.isFetchingBatchSessions &&
      this.props.hasFetchedBatchSessions
    ) {
      const batchesFiltered = !batchSessionsData
        ? []
        : batchSessionsData.toJS()
      this.setState({
        batchSessionsData: batchesFiltered,
        topic: topic ? topic.toJS() : [],
      })
    }
    if (prevProps.isFetchingBatches && this.props.hasFetchedBatches) {
      this.setState({
        batchName: batches ? batches.toJS() : [],
      })
    }
    if (
      prevProps.isFetchingLastSessionOfBatch &&
      this.props.hasFetchedLastSessionOfBatch
    ) {
      const topicsFiltered = !topicOrder ? [] : topicOrder.toJS()
      this.setState({
        topicOrder: topicsFiltered,
      })
    }
    if (prevProps.isFetchingMentors && this.props.hasFetchedMentors) {
      let mentorsFiltered = !mentors ? [] : mentors.toJS()
      mentorsFiltered = mentorsFiltered.filter(
        (item) => item.mentorProfile !== null
      )
      this.setState({
        fetchedMentors: mentorsFiltered,
      })
    }
    if (!isFetchingTopicId && prevProps.isFetchingTopicId) {
      let topicSelected = ''
      const { sessionToEdit, selectedCourse } = this.state
      if (this.state.actiontype === 'edit' && selectedCourse === get(sessionToEdit, 'course.id')) {
        topicSelected = get(sessionToEdit, 'topic.id')
      } else {
        topicSelected = this.props.topicId && this.props.topicId.toJS().length ? this.props.topicId.toJS()[0].id : null
      }
      this.setState({
        topicId: this.props.topicId ? this.props.topicId.toJS() : [],
        defaultSelectedValue: this.props.topicId
          ? this.props.topicId.toJS()[0].id
          : null,
        topicSelected
      })
    }
    if (
      !isFetchingCheckMentorSession &&
      prevProps.isFetchingCheckMentorSession
    ) {
      this.setState({
        prevslotsinfo: previousslotsinfo ? previousslotsinfo.toJS() : [],
      })
    }
    if (fetchedCheckMentorSession !== prevProps.fetchedCheckMentorSession) {
      if (fetchedCheckMentorSession) {
        this.setState({ showTimeSlots: true })
      }
    }
    if (prevProps.isAddingMentorSession && this.props.hasAddedMentorSession) {
      const {
        editingSession,
        slotsSelected,
        dateSelected,
        sessionToEdit,
      } = this.state
      const slotStatus = []
      for (let i = 0; i < appConfig.timeSlots.length; i += 1) {
        if (editingSession) {
          if (
            this.setHoursZero(dateSelected) > this.setHoursZero(new Date()) ||
            (this.setHoursZero(dateSelected) ===
              this.setHoursZero(new Date()) &&
              appConfig.timeSlots[i] > new Date().getHours())
          ) {
            if (slotsSelected.includes(appConfig.timeSlots[i])) {
              slotStatus.push(true)
            } else if (
              !slotsSelected.includes(appConfig.timeSlots[i]) &&
              sessionToEdit[`slot${appConfig.timeSlots[i]}`] === true
            ) {
              slotStatus.push(false)
            } else {
              slotStatus.push('noAction')
            }
          } else {
            slotStatus.push('noAction')
          }
        } else if (!editingSession) {
          if (slotsSelected.includes(appConfig.timeSlots[i])) {
            slotStatus.push(true)
          } else {
            slotStatus.push('noAction')
          }
        }
      }
      if (this.state.actiontype === 'add') {
        const slotStatusObj = this.getSlotStatusObject(slotStatus)
        const bookingDate = new Date(dateSelected).toISOString()
        const addInput = {
          bookingDate,
          ...slotStatusObj,
        }
        addBatchSession(
          addInput,
          this.state.currentBatchId,
          this.state.topicSelected,
          mentorSessionId.toJS()[0].id,
          this.state.selectedCourse
        )
      } else if (this.state.actiontype === 'edit') {
        const { bookingDate } = this.state.sessionToEdit
        const selectedDate = new Date(bookingDate).toISOString()
        const slots = {}
        for (const property in this.state.sessionToEdit) {
          if (property.startsWith('slot')) {
            if (this.state.sessionToEdit[property] === true) {
              slots[property] = true
            } else {
              slots[property] = false
            }
          }
        }
        const editBatchSessionInput = {
          bookingDate: selectedDate,
          ...slots,
        }
        // TODO : connect mentor to update batch call
        updateBatchSession(
          sessionToEdit.id,
          editBatchSessionInput,
          this.state.topicSelected,
          this.state.selectedCourse,
          mentorSessionId.toJS()[0].id
        )
      }
    }
    if (prevProps.isAddingBatchSession && this.props.hasAddedBatchSession) {
      notification.success({
        message: 'Batch session added successfully!',
      })
      this.handleModalCancel()
      this.setState(
        {
          topicSelected: '',
          slotsSelected: [],
        },
        () => {
          fetchBatchSessions(this.state.currentBatchCode, {
            page: this.state.currentPage,
            perPage: this.state.perPageQueries,
          })
          fetchLastSessionOfBatch(this.state.currentBatchId)
        }
      )
    }
    if (prevProps.isDeletingBatchSession && this.props.hasDeletedBatchSession) {
      notification.success({
        message: 'Batch session deleted successfully!',
      })
      fetchBatchSessions(this.state.currentBatchCode, {
        page: this.state.currentPage,
        perPage: this.state.perPageQueries,
      })
      fetchLastSessionOfBatch(this.state.currentBatchId)
    }
    if (addFailure !== prevProps.addFailure) {
      if (addFailure) {
        const currentError = addErrors.pop()
        notification.error({
          message:
            currentError.error.errors &&
            currentError.error.errors[0] &&
            currentError.error.errors[0].message,
        })
      }
    }
    if (prevProps.isUpdatingBatchSession && this.props.hasUpdatedBatchSession) {
      notification.success({
        message: 'Updated Batch Session Successfully',
      })
      this.handleModalCancel()
      fetchBatchSessions(this.state.currentBatchCode, {
        page: this.state.currentPage,
        perPage: this.state.perPageQueries,
      })
      fetchLastSessionOfBatch(this.state.currentBatchId)
    }
    if (updateFailure !== prevProps.updateFailure) {
      if (updateFailure) {
        const currentError = updateErrors.pop()
        notification.error({
          message:
            currentError.error.errors &&
            currentError.error.errors[0] &&
            currentError.error.errors[0].message,
        })
      }
    }
    if (deleteFailure !== prevProps.deleteFailure) {
      if (deleteFailure) {
        const currentError = deleteErrors.pop()
        notification.error({
          message:
            currentError.error.errors &&
            currentError.error.errors[0] &&
            currentError.error.errors[0].message,
        })
      }
    }
    if (mentorSessionAddFailure !== prevProps.mentorSessionAddFailure) {
      if (mentorSessionAddFailure) {
        const currentError = mentorSessionAddError.pop()
        notification.error({
          message: currentError.error.errors &&
            currentError.error.errors[0] &&
            currentError.error.errors[0].message
        })
      }
    }
    if (mentorSessionUpdateFailure !== prevProps.mentorSessionUpdateFailure) {
      if (mentorSessionUpdateFailure) {
        const currentError = mentorSessionUpdateError.pop()
        notification.error({
          message: currentError.error.errors &&
            currentError.error.errors[0] &&
            currentError.error.errors[0].message
        })
      }
    }
    if ((courseFetchingStatus && !get(courseFetchingStatus.toJS(), 'loading')
      && get(courseFetchingStatus.toJS(), 'success') &&
      (prevProps.courseFetchingStatus !== courseFetchingStatus))) {
      this.setState({
        coursesList: this.props.courses && this.props.courses.toJS()
      })
    }
  }
  onPageChange = (page) => {
    this.setState(
      {
        currentPage: page,
      },
      () =>
        fetchBatchSessions(this.state.currentBatchCode, {
          page: this.state.currentPage,
          perPage: this.state.perPageQueries,
        })
    )
  }
  handleBatchChange = (value) => {
    const batch = this.props.batches
      .toJS()
      .filter((item) => item.code === value)
    this.setState(
      {
        currentBatchCode: value,
        currentBatchId: batch[0].id,
      },
      () => {
        fetchBatchSessions(this.state.currentBatchCode, {
          page: this.state.currentPage,
          perPage: this.state.perPageQueries,
        })
        fetchLastSessionOfBatch(this.state.currentBatchId)
        window.history.pushState({}, '', `/ums/assignTimetable/${value}`)
      }
    )
  }
  handleTopicChange = (value) => {
    this.setState({
      topicSelected: value,
    })
  }
  handleMentorChange = (value) => {
    this.setState(
      {
        currentMentorId: value,
        batchName: [],
        currentBatchCode: '',
      },
      () => fetchBatchCodes(value, '{type : normal}')
    )
  }
  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
      completedsessionerror: false,
      dateSelected: new Date(),
      prevslotsinfo: [],
      slotsSelected: [],
      topicSelected: '',
      selectedMentorId: ''
    })
  }
  showModal = (actiontype, data) => {
    const { batchSessionsData, coursesList } = this.state
    let orderToFetch = 1
    if (
      actiontype === 'edit' &&
      this.state.topicOrder &&
      this.state.topicOrder[0]
    ) {
      orderToFetch = this.state.topicOrder[0].order
    } else if (
      actiontype === 'add' &&
      this.state.topicOrder &&
      this.state.topicOrder[0]
    ) {
      const completedSession = sortBy(batchSessionsData, 'createdAt').filter(session => get(session, 'sessionStatus') === 'completed')
      if (batchSessionsData.length === 0) {
        orderToFetch = this.state.topicOrder[0].order
      } else if (this.state.topicOrder[0].order > get(completedSession.slice(-1)[0], 'topic.order', 0)) {
        orderToFetch = this.state.topicOrder[0].order
      } else {
        orderToFetch = get(completedSession.slice(-1)[0], 'topic.order')
      }
    }
    this.setState({
      orderToFetch
    })
    this.setState(
      {
        actiontype,
        modalVisible: true,
        mentorUserId:
          this.state.batchSessionsData
            && this.state.batchSessionsData[0]
            ? this.state.batchSessionsData[0].batch.allottedMentor.id
            : this.state.currentMentorId,
      },
      () => {
        let date
        if (this.state.actiontype === 'edit') {
          date = this.state.sessionToEdit.bookingDate
        } else {
          date = this.state.dateSelected
        }
        checkMentorSession(this.state.mentorUserId, new Date(date).toISOString())
      }
    )
    if (actiontype === 'edit') {
      this.setState({
        sessionToEdit: data,
        showTimeSlots: true,
        editingSession: true,
        selectedMentorId: this.state.currentMentorId
      }, () => {
        const { sessionToEdit } = this.state
        let courseId = get(coursesList, '[0].id')
        if (get(sessionToEdit, 'course.id')) {
          courseId = get(sessionToEdit, 'course.id')
        }
        this.setState({
          selectedCourse: courseId,
          topicSelected: get(sessionToEdit, 'topic.id')
        }, () => fetchTopicId(this.state.orderToFetch, this.state.selectedCourse))
      })
    } else {
      const { selectedCourse } = this.state
      let updatedSelectedCourse = ''
      if (selectedCourse) {
        updatedSelectedCourse = selectedCourse
      } else {
        updatedSelectedCourse = get(coursesList, '[0].id')
      }
      this.setState({
        editingSession: false,
        selectedCourse: updatedSelectedCourse,
        selectedMentorId: this.state.currentMentorId
      }, () => fetchTopicId(this.state.orderToFetch, this.state.selectedCourse))
    }
  }
  getWeekDay = (day) => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat']
    return weekDays[day]
  }
  getMonthName = (month) => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ]
    return months[month]
  }
  renderDateTablet = () => {
    const days = []
    for (let i = 0; i < appConfig.bookingDaysCutOff; i += 1) {
      days.push(offsetDate(new Date(), i, 'ADD'))
    }
    if (this.state.actiontype === 'add') {
      return (
        <div>
          <h3 style={{ textAlign: 'center' }}>TimeTable</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
              gridGap: '15px',
            }}
          >
            {days.map((day) => (
              <SessionTimeModalStyle.DateTablet
                onClick={() =>
                  this.setState(
                    {
                      dateSelected: day,
                      showTimeSlots: false,
                      slotsSelected: [],
                    },
                    () => {
                      checkMentorSession(
                        this.state.mentorUserId,
                        new Date(this.state.dateSelected).toISOString()
                      )
                    }
                  )
                }
                selected={
                  this.state.dateSelected.setHours(0, 0, 0, 0) ===
                  day.setHours(0, 0, 0, 0)
                }
              >
                <SessionTimeModalStyle.DateText colored>
                  {this.getWeekDay(day.getDay())}
                </SessionTimeModalStyle.DateText>
                <SessionTimeModalStyle.DateText>
                  {day.getDate()}
                </SessionTimeModalStyle.DateText>
                <SessionTimeModalStyle.DateText>
                  {this.getMonthName(day.getMonth())}
                </SessionTimeModalStyle.DateText>
                <SessionTimeModalStyle.Selected
                  selected={
                    this.state.dateSelected.setHours(0, 0, 0, 0) ===
                    day.setHours(0, 0, 0, 0)
                  }
                />
              </SessionTimeModalStyle.DateTablet>
            ))}
          </div>
        </div>
      )
    } else if (this.state.actiontype === 'edit') {
      const dates = new Date(new Date(this.state.sessionToEdit.bookingDate).setHours(0, 0, 0, 0))
      return (
        <div>
          <h3 style={{ textAlign: 'center' }}>TimeTable(edit)</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
              gridGap: '15px',
            }}
          >
            {days.map((day) => (
              <SessionTimeModalStyle.DateTablet
                onClick={() =>
                  this.setState(
                    (prevstate) => ({
                      dateSelected: day,
                      showTimeSlots: false,
                      slotsSelected: [],
                      sessionToEdit: {
                        ...prevstate.sessionToEdit,
                        bookingDate: changedatetoisostring(offsetDate(day, 1, 'ADD'))
                      },
                    }),
                    () => {
                      checkMentorSession(
                        this.state.mentorUserId,
                        new Date(this.state.dateSelected).toISOString()
                      )
                    }
                  )
                }
                selected={
                  moment(day).isSame(dates)
                }
              >
                <SessionTimeModalStyle.DateText colored>
                  {this.getWeekDay(day.getDay())}
                </SessionTimeModalStyle.DateText>
                <SessionTimeModalStyle.DateText>
                  {day.getDate()}
                </SessionTimeModalStyle.DateText>
                <SessionTimeModalStyle.DateText>
                  {this.getMonthName(day.getMonth())}
                </SessionTimeModalStyle.DateText>
                <SessionTimeModalStyle.Selected
                  selected={
                    moment(day).isSame(dates)
                  }
                />
              </SessionTimeModalStyle.DateTablet>
            ))}
          </div>
        </div>
      )
    } else if (this.state.actiontype === 'delete') {
      return (
        <h1 style={{ textAlign: 'center' }}>Are sure you want delete it?</h1>
      )
    } else if (this.state.completedsessionerror === true) {
      return <h1>Cannot edit completed session</h1>
    }
  }
  isSlotSelected = (slotNumber) => {
    const { sessionToEdit, editingSession } = this.state
    if (sessionToEdit && editingSession) {
      return sessionToEdit[`slot${slotNumber}`] || false
    }
    if (this.state.actiontype === 'add' || this.state.actiontype === 'edit') {
      return this.state.slotsSelected.includes(slotNumber) || false
    }
    return false
  }
  isSlotBooked = (slotNumber) => {
    const { prevslotsinfo } = this.state
    if (prevslotsinfo.length > 0) {
      return prevslotsinfo[0][`slot${slotNumber}`] || false
    }
    return false
  }

  handleSlotClick = (slotNumber) => {
    let curSelectedSlots = this.state.slotsSelected
    if (curSelectedSlots.includes(slotNumber)) {
      curSelectedSlots.splice(curSelectedSlots.indexOf(slotNumber), 1)
    } else {
      curSelectedSlots = []
      curSelectedSlots.push(slotNumber)
    }
    this.setState({
      slotsSelected: curSelectedSlots,
    })
    if (this.state.actiontype === 'edit') {
      const key = `slot${slotNumber}`
      if (key in this.state.sessionToEdit) {
        if (this.state.sessionToEdit[key] === true) {
          this.state.sessionToEdit[key] = false
        } else {
          for (let i = 0; i <= 23; i += 1) {
            this.state.sessionToEdit[`slot${i}`] = false
          }
          this.state.sessionToEdit[key] = true
        }
      }
    }
  }
  renderTimeSlots = () => {
    const renderSlots = []
    appConfig.timeSlots.forEach((slot, index) => {
      const sameDate = this.state.actiontype === 'edit' ? this.state.sessionToEdit.bookingDate : this.state.dateSelected
      const disableTime = (moment(moment(sameDate).set('hours', appConfig.timeSlots[index])).isBefore(moment()))
      renderSlots.push(
        <SessionTimeModalStyle.Slot
          style={{ cursor: disableTime ? 'not-allowed' : 'pointer' }}
          selected={this.isSlotSelected(appConfig.timeSlots[index])}
          onClick={() => disableTime ? null : this.handleSlotClick(appConfig.timeSlots[index])}
          isBooked={this.isSlotBooked(appConfig.timeSlots[index])}
        >
          {`${getSlotLabel(appConfig.timeSlots[index]).startTime}`}
        </SessionTimeModalStyle.Slot>
      )
    })
    return renderSlots
  }
  getSlotStatusObject = (slotStatus) => {
    const slotStatusObj = {}
    for (let i = 0; i < appConfig.timeSlots.length; i += 1) {
      if (slotStatus[i] === true) {
        slotStatusObj[`slot${appConfig.timeSlots[i]}`] = true
      }
    }
    return slotStatusObj
  }
  setHoursZero = (date) => new Date(date).setHours(0, 0, 0, 0)
  onSave = () => {
    const { slotsSelected,
      dateSelected,
      sessionToEdit,
      selectedCourse,
      selectedMentorId
    } = this.state
    const slotStatus = []
    for (let i = 0; i < appConfig.timeSlots.length; i += 1) {
      if (slotsSelected.includes(appConfig.timeSlots[i])) {
        slotStatus.push(true)
      } else {
        slotStatus.push('noAction')
      }
    }
    if (this.state.actiontype === 'add') {
      const bookingDate = new Date(dateSelected).toISOString()
      if (this.state.prevslotsinfo.length === 0) {
        const slotStatusObj = this.getSlotStatusObject(slotStatus)
        const addMentorSessionInput = {
          availabilityDate: bookingDate,
          ...slotStatusObj,
          sessionType: 'batch',
        }
        addMentorSession(
          addMentorSessionInput,
          this.state.mentorUserId,
          selectedCourse
        )
      } else if (this.state.prevslotsinfo.length > 0) {
        const slotStatusObj = this.getSlotStatusObject(slotStatus)
        const updateMentorSessionInput = {
          availabilityDate: bookingDate,
          ...slotStatusObj,
        }
        const addInput = {
          bookingDate,
          ...slotStatusObj,
        }
        updateMentorSession(
          updateMentorSessionInput,
          this.state.prevslotsinfo[0].id,
          selectedCourse
        ).then((res) => {
          if (res && res.updateMentorSession && res.updateMentorSession.id) {
            addBatchSession(
              addInput,
              this.state.currentBatchId,
              this.state.topicSelected,
              this.state.prevslotsinfo.map((d) => d.id)[0],
              selectedCourse
            )
          }
        })
      }
    } else if (this.state.actiontype === 'edit') {
      const { bookingDate } = this.state.sessionToEdit
      const selectedDate = new Date(bookingDate).toISOString()
      const mentorId = !selectedMentorId ? this.state.mentorUserId : selectedMentorId
      if (this.state.prevslotsinfo.length === 0) {
        let slotStatusObj
        if (slotsSelected.length > 0) {
          slotStatusObj = this.getSlotStatusObject(slotStatus)
        } else {
          for (const property in this.state.sessionToEdit) {
            if (property.startsWith('slot')) {
              if (this.state.sessionToEdit[property] === true) {
                slotStatusObj = { ...slotStatusObj, [property]: true }
              }
            }
          }
        }
        const addMentorSessionInput = {
          availabilityDate: selectedDate,
          ...slotStatusObj,
          sessionType: 'batch',
        }
        // selectedMentorId is the one selected from modal
        // mentorUserId is the original mentor id
        // console.log(`Adding mentor session with mentor id: ${mentorId}`)
        addMentorSession(addMentorSessionInput, mentorId, selectedCourse)
        // console.log(`Added mentor session with mentor id: ${mentorId}`)
      } else if (this.state.prevslotsinfo.length > 0) {
        const slotStatusObj = this.getSlotStatusObject(slotStatus)
        const updateMentorSessionInput = {
          availabilityDate: selectedDate,
          ...slotStatusObj,
        }
        // console.log(`Updating mentor session with mentor id: ${mentorId} and mentorSessionId: ${this.state.prevslotsinfo[0].id}`)
        updateMentorSession(
          updateMentorSessionInput,
          this.state.prevslotsinfo[0].id,
          selectedCourse
        ).then((resp) => {
          if (resp && resp.updateMentorSession && resp.updateMentorSession.id) {
            const slots = {}
            for (const property in this.state.sessionToEdit) {
              if (property.startsWith('slot')) {
                if (this.state.sessionToEdit[property] === true) {
                  slots[property] = true
                } else {
                  slots[property] = false
                }
              }
            }
            const editBatchSessionInput = {
              bookingDate: selectedDate,
              ...slots,
            }
            // console.log(`updating batch session with mentorSession id: ${resp.updateMentorSession.id}`)
            updateBatchSession(
              sessionToEdit.id,
              editBatchSessionInput,
              this.state.topicSelected,
              selectedCourse,
              resp.updateMentorSession.id
            )
          }
        })
      }
    }
  }
  editMentorAction = (id) => {
    const { orderToFetch, dateSelected } = this.state
    // console.log('orderToFetch', orderToFetch)
    const sessionType = (orderToFetch === 1) ? 'trial' : 'batch'
    this.setState({
      selectedMentorId: id
    }, () => checkMentorSession(id, new Date(dateSelected).toISOString(), sessionType))
  }
  render() {
    const { Option } = Select
    const {
      isFetchingBatchSessions,
      isAddingBatchSession,
      isDeletingBatchSession,
      isUpdatingBatchSession,
      hasAddedBatchSession,
      hasDeletedBatchSession,
      hasFetchedBatchSessions,
      hasUpdatedBatchSession,
      batchSessionsCount,
      isFetchingTopicId
    } = this.props
    const { defaultSelectedValue, currentPage, perPageQueries,
      coursesList, selectedCourse, orderToFetch, selectedMentorId } = this.state
    const date = changedatetoisostring(
      offsetDate(this.state.dateSelected, 1, 'ADD')
    )
    return (
      <div>
        <Modal
          title={
            this.state.actionType === 'delete'
              ? 'Delete Session'
              : 'Assign TimeTable'
          }
          visible={this.state.modalVisible}
          confirmLoading={this.state.confirmLoadingModal}
          onCancel={this.handleModalCancel}
          destroyOnClose='true'
          maskClosable={false}
          width='700px'
          footer={[
            <Button key='submit' type='primary' onClick={this.onSave}>
              {' '}
              {isAddingBatchSession ? 'Saving...' : 'SAVE'}
            </Button>,
          ]}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Select
              style={{ width: 200 }}
              defaultValue={defaultSelectedValue}
              value={this.state.topicSelected}
              loading={isFetchingTopicId && isFetchingTopicId}
              onChange={this.handleTopicChange}
              placeholder='Select Topic'
            >
              {this.state.topicId.map((option) => (
                <Option key={option.id} value={option.id}>
                  <Tooltip title={option.title}>
                    {option.order}. {option.title}
                  </Tooltip>
                </Option>
              ))}
            </Select>
            <Select
              style={{ width: 200 }}
              showSearch
              placeholder='Select a Course'
              optionFilterProp='children'
              name='selectedCourse'
              value={selectedCourse}
              onChange={(value) => this.setState({ selectedCourse: value },
                () => fetchTopicId(orderToFetch, this.state.selectedCourse))}
              filterOption={(input, option) =>
                option.props.children
                  ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  : false
              }
            >
              {
                coursesList && coursesList.map(({ title, id }) =>
                  <Option key={id}
                    value={id}
                  >
                    <Tooltip title={title}>
                      {title}
                    </Tooltip>
                  </Option>
                )}
            </Select>
            {getDataFromLocalStorage('login.role') !== MENTOR ? (
              <Select
                showSearch
                placeholder='Mentor Name'
                style={{ width: 200 }}
                value={selectedMentorId}
                onChange={(value) => this.editMentorAction(value)}
                filterOption={(inputValue, option) => (
                  option.props.children &&
                  option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                )}
              >
                {[...this.state.fetchedMentors].map((option) => (
                  <Option
                    key={option.id}
                    value={option.id}
                  >
                    {option.name}
                  </Option>
                ))}
              </Select>
            ) : (
              <div />
            )}
            <div>
              <h2>
                {getDataFromLocalStorage('login.role') === MENTOR ? (
                  getDataFromLocalStorage('login.name')
                ) : (
                  <div />
                )}
              </h2>
            </div>
          </div>
          <SessionTimeModalStyle.DateTabletContainer>
            {this.renderDateTablet()}
          </SessionTimeModalStyle.DateTabletContainer>
          <SessionTimeModalStyle.DateTabletContainer>
            {this.state.showTimeSlots && this.renderTimeSlots()}
          </SessionTimeModalStyle.DateTabletContainer>
        </Modal>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: '25px',
          }}
        >
          <div style={{ paddingLeft: '5px' }}>
            {getDataFromLocalStorage('login.role') !== MENTOR ? (
              <h4>Select Mentor</h4>
            ) : (
              <div />
            )}
            {getDataFromLocalStorage('login.role') !== MENTOR ? (
              <Select
                showSearch
                optionFilterProp='children'
                style={{ width: 200 }}
                placeholder='Select Mentor'
                value={this.state.currentMentorId}
                onChange={this.handleMentorChange}
                loading={this.props.isFetchingMentors}
                filterOption={(inputValue, option) => (
                  option.props.children &&
                  option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                )}
              >
                {[...this.state.fetchedMentors].map((option) => (
                  <Option key={option.id} value={option.id}>
                    {option.name}
                  </Option>
                ))}
              </Select>
            ) : (
              <div />
            )}
          </div>
          <div style={{ paddingLeft: '5px' }}>
            <h4>Select Batch</h4>
            <Select
              style={{ width: 200 }}
              placeholder='Select Batch'
              value={this.state.currentBatchCode}
              onChange={this.handleBatchChange}
              loading={this.props.isFetchingBatches}
            >
              {[...this.state.batchName].map((option) => (
                <Option key={option.code}>{option.code}</Option>
              ))}
            </Select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '60%', marginLeft: 'auto' }}>
          {
            batchSessionsCount > perPageQueries && (
              <Pagination
                total={batchSessionsCount}
                onChange={this.onPageChange}
                current={currentPage}
                defaultPageSize={perPageQueries}
              />
            )
          }
          <h4>Total Sessions {batchSessionsCount || 0}</h4>
        </div>
        <TableOfAssignTime
          currentBatchCode={this.state.currentBatchCode}
          showModal={this.showModal}
          batchSessionsData={this.state.batchSessionsData}
          isFetchingBatchSessions={isFetchingBatchSessions}
          hasFetchedBatchSessions={hasFetchedBatchSessions}
          isAddingBatchSession={isAddingBatchSession}
          hasAddedBatchSession={hasAddedBatchSession}
          isUpdatingBatchSession={isUpdatingBatchSession}
          hasUpdatedBatchSession={hasUpdatedBatchSession}
          isDeletingBatchSession={isDeletingBatchSession}
          hasDeletedBatchSession={hasDeletedBatchSession}
          topic={this.state.topic}
          mentorUserId={this.state.mentorUserId}
          dateSelected={date}
          paramBatchCode={this.state.paramBatchCode}
        />
      </div>
    )
  }
}

export default withNav(AssignTimeTable)({
  title: 'Assign Timetable',
  activeNavItem: 'Assign Timetable',
  backRoute: '/ums/batchMapping',
  shouldBack: true,
  showUMSNavigation: true,
})
