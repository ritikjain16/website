import React, { Component } from 'react'
import { Button, Form, Icon, Tooltip } from 'antd'
import { Map } from 'immutable'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import momentTZ from 'moment-timezone'
import MainModal from '../../../../components/MainModal'
import validators from '../../../../utils/formValidators'
import SessionTimeModalStyle from '../SessionTimeModal/SessionTimeModal.style'
import getSlotLabel from '../../../../utils/slots/slot-label'
import formatDate from '../../../../utils/formatDate'
import addSession from '../../../../actions/sessions/addSession'
import updateSession from '../../../../actions/sessions/updateSession'
import { ADMIN, MENTOR, UMS_ADMIN, UMS_VIEWER } from '../../../../constants/roles'
import appConfig from '../../../../config/appConfig'
import offsetDate from '../../../../utils/date/date-offset'
import { showNotification } from '../../../../utils/messages'
import fetchPaidSession from '../../../../actions/profile/fetchPaidSessions'
import { filterKey } from '../../../../utils/data-utils'
import addMenteeSession from '../../../../actions/profile/addMenteeSession'
import updateMenteeSession from '../../../../actions/profile/updateMenteeSession'
import getIntlDateTime from '../../../../utils/time-zone-diff'
import getSlotDifference from '../../../../utils/getSlotDifference'
import getMentorMenteeSessionData, { getMentorSessions } from './getMentorMenteeSessionData'
import getDataFromLocalStorage from '../../../../utils/extract-from-localStorage'

const seeMentorColRoles = ['admin', 'umsAdmin', 'umsViewer']

class SessionModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dateSelected: new Date(),
      slotsSelected: [],
      sessionAddedCount: 0,
      selectedMentor: '',
      bookedSlots: [],
      selectedMentorSessionId: '',
      mentorChanged: false,
      slotChanged: false,
      selectedTimezone: 'Asia/Kolkata',
      timeSlotFocused: undefined,
      selectedSlotsWithIntlTimingObj: [],
      selectedIntlDates: [],
      selectedCourse: ''
    }
  }

  getSlotStatusObject = (slotStatus) => {
    const slotStatusObj = {}
    for (let i = 0; i < appConfig.timeSlots.length; i += 1) {
      if (slotStatus[i] === true) {
        slotStatusObj[`slot${appConfig.timeSlots[i]}`] = true
      } else if (slotStatus[i] === false) {
        slotStatusObj[`slot${appConfig.timeSlots[i]}`] = false
      }
    }

    return slotStatusObj
  }

  setDefaultValues = () => {
    const { form, sessionToEdit, path, editingSession, selectCourse } = this.props
    const sessionDate = new Date(new Date(sessionToEdit.availabilityDate).setHours(0, 0, 0, 0))
    const selectedSlots = []
    for (let i = 0; i < appConfig.timeSlots.length; i += 1) {
      if (sessionToEdit[`slot${appConfig.timeSlots[i]}`]) {
        selectedSlots.push(appConfig.timeSlots[i])
      }
    }
    if (path === '/ums/manageKids' && editingSession) {
      this.setState({
        selectedCourse: get(sessionToEdit, 'course.id')
      }, () => selectCourse(get(sessionToEdit, 'course.id')))
    }
    this.setState({
      slotsSelected: selectedSlots,
      dateSelected: sessionDate,
      selectedMentor: get(sessionToEdit, 'user.id') !== 'ALL' ? get(sessionToEdit, 'user.id') : ''
    })
    form.setFieldsValue({
      courseTitle: get(sessionToEdit, 'course.id'),
      mentor: sessionToEdit.user.id !== 'ALL' ? sessionToEdit.user.id : undefined,
    })
  }

  setDefaultCourseTitle = () => {
    const { courses, form } = this.props
    if (courses.length > 0) {
      form.setFieldsValue({
        courseTitle: courses[0].id,
      })
    }
  }

  handleAddSuccess = (
    addStatus,
    prevProps,
    form,
    closeSessionModal,
    notification
  ) => {
    const { sessionType } = this.props
    const { sessionAddedCount } = this.state
    const curStatus = addStatus && addStatus.getIn([`mentorSession/${sessionType}/${sessionAddedCount}`])
    const prevStatus = prevProps && prevProps.addStatus &&
      prevProps.addStatus.getIn([`mentorSession/${sessionType}/${sessionAddedCount}`])
    if (curStatus && prevStatus) {
      showNotification(
        curStatus.toJS(), prevStatus.toJS(),
        'Adding Session', 'Adding session failed',
        'Session added successfully', true,
        form, closeSessionModal, true
      )
      if (curStatus.getIn(['success']) && !prevStatus.getIn(['success'])) {
        if (!this.props.editingSession) {
          this.setState({
            slotsSelected: []
          })
        }
        this.setState({
          dateSelected: new Date()
        })
      }
      if (curStatus.getIn(['failure']) && !prevStatus.getIn(['failure'])) {
        const { addError } = this.props
        const index = addError && (addError.toJS().length - 1)
        const error = addError && addError.getIn([index, 'error', 'errors', 0, 'extensions', 'exception', 'name'])
        if (error === 'SimilarDocumentAlreadyExistError') {
          notification.error({
            message: 'Session already booked on this date.'
          })
        } else if (error === 'SlotsOccupiedError') {
          notification.error({
            message: 'Session already exist at this slot, please select a different slot'
          })
        }
      }
    }
  }

  updateSelectedSlotsWithIntlTimingObj = () => {
    const selectedSlotsWithIntlTimingObj = []
    const selectedIntlDates = []
    const sortedSlots = this.state.slotsSelected.sort((a, b) => a - b)
    sortedSlots.forEach(slot => {
      selectedSlotsWithIntlTimingObj.push({
        id: slot,
        intlDate: getIntlDateTime(
          this.state.dateSelected, slot, this.state.selectedTimezone
        ).intlDate,
        intlTime: getIntlDateTime(
          this.state.dateSelected, slot, this.state.selectedTimezone
        ).intlTime
      })
      if (
        !selectedIntlDates.includes(
          getIntlDateTime(this.state.dateSelected, slot, this.state.selectedTimezone).intlDate
        )) {
        selectedIntlDates.push(
          getIntlDateTime(this.state.dateSelected, slot, this.state.selectedTimezone).intlDate
        )
      }
    })

    this.setState({
      selectedIntlDates,
      selectedSlotsWithIntlTimingObj
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      editingSession, visible,
      addStatus, form,
      closeSessionModal, notification,
      updateStatus, path, mentorSessionFetchStatus,
      sessionToEdit, userId, userRole,
    } = this.props
    if (path !== prevProps.path) {
      this.setState({
        sessionAddedCount: 0
      })
    }
    if (visible && !prevProps.visible && !editingSession) {
      if (path === '/ums/manageKids') {
        const { courses, selectCourse } = this.props
        let course = ''
        if (get(sessionToEdit, 'course.id')) {
          course = get(sessionToEdit, 'course.id')
        } else {
          course = get(courses, '[0].id')
        }
        this.setState({
          selectedCourse: course
        }, () => selectCourse(course))
        if (seeMentorColRoles.includes(userRole)) {
          form.setFieldsValue({
            mentor: seeMentorColRoles.includes(userRole) ? get(sessionToEdit, 'user.id', '') : userId,
          })
        }
        this.setState({
          selectedMentor: seeMentorColRoles.includes(userRole) ? get(sessionToEdit, 'user.id', '') : userId,
          dateSelected: new Date()
        }, () => {
          const { selectedMentor, dateSelected } = this.state
          if (selectedMentor) {
            fetchPaidSession(selectedMentor, dateSelected)
          }
        })
      }
      this.setDefaultCourseTitle()
      this.setState({
        dateSelected: new Date(),
        slotsSelected: [],
      })
    }
    if (visible && !prevProps.visible) {
      this.setState({
        selectedTimezone: 'Asia/Kolkata',
        timeSlotFocused: undefined,
        selectedSlotsWithIntlTimingObj: [],
        selectedIntlDates: []
      })
    }
    if (editingSession && !prevProps.editingSession && visible) {
      this.setDefaultValues()
      this.setState({
        selectedMentor: sessionToEdit.user.id,
        dateSelected: new Date(sessionToEdit.availabilityDate),
        mentorChanged: false,
        slotChanged: false
      }, () => {
        if (path === '/ums/manageKids') {
          if (this.state.selectedMentor && this.state.selectedMentor.length) {
            fetchPaidSession(
              this.state.selectedMentor, this.state.dateSelected
            )
          } else {
            fetchPaidSession(
              'ALL', this.state.dateSelected
            )
          }
        }
      })
    }

    this.handleAddSuccess(
      addStatus,
      prevProps,
      form,
      closeSessionModal,
      notification
    )

    const currStatus = updateStatus && updateStatus.getIn(['updateSession'])
    const prevStatus = prevProps && prevProps.updateStatus &&
      prevProps.updateStatus.getIn(['updateSession'])
    const { updateError } = this.props
    const index = updateError && (updateError.toJS().length - 1)
    const error = updateError && updateError.getIn([index, 'error', 'errors', 0, 'extensions', 'exception', 'name'])
    let errorMessage = 'Updating session failed'
    if (error === 'SlotsOccupiedError') {
      errorMessage = 'Session already exist at this slot, please select a different slot'
    }
    if (currStatus && prevStatus) {
      showNotification(
        currStatus.toJS(), prevStatus.toJS(),
        'Updating Session', errorMessage,
        'Session updated successfully',
        true, form, closeSessionModal
      )
    }

    if (path === '/ums/manageKids' && mentorSessionFetchStatus && prevProps.mentorSessionFetchStatus) {
      const curr = mentorSessionFetchStatus.getIn([
        `mentorSession/${this.state.selectedMentor}/${new Date(this.state.dateSelected).setHours(0, 0, 0, 0)}`,
        'success'
      ])
      const prev = prevProps.mentorSessionFetchStatus.getIn([
        `mentorSession/${this.state.selectedMentor}/${new Date(this.state.dateSelected).setHours(0, 0, 0, 0)}`,
        'success'
      ])
      if (curr && !prev) {
        const { mentorSession } = this.props
        if (mentorSession) {
          const bookedSlots = []
          const filteredSession = filterKey(
            mentorSession,
            `mentorSession/${this.state.selectedMentor}/${new Date(this.state.dateSelected).setHours(0, 0, 0, 0)}`
          )
          if (!this.props.editingSession) {
            this.setState({
              slotsSelected: []
            })
          }
          this.setState({
            bookedSlots: [],
            selectedMentorSessionId: ''
          }, () => {
            if (filteredSession && filteredSession.toJS().length) {
              for (let i = 0; i < 24; i += 1) {
                for (let j = 0; j < filteredSession.toJS().length; j += 1) {
                  if (get(filteredSession.toJS(), `${j}.slot${i}`)) {
                    bookedSlots.push(i)
                  }
                }
              }
              this.setState({
                bookedSlots,
                selectedMentorSessionId: get(filteredSession.toJS(), '0.id')
              })
            }
          })
        }
      }
    }

    if (
      this.state.selectedTimezone !== prevState.selectedTimezone ||
      this.state.slotsSelected.length !== this.state.selectedSlotsWithIntlTimingObj.length ||
      prevState.dateSelected !== this.state.dateSelected
    ) {
      this.updateSelectedSlotsWithIntlTimingObj()
    }
  }

  handleSlotClick = (slotNumber) => {
    const curSelectedSlots = this.state.slotsSelected
    if (curSelectedSlots.includes(slotNumber)) {
      curSelectedSlots.splice(curSelectedSlots.indexOf(slotNumber), 1)
    } else {
      curSelectedSlots.push(slotNumber)
    }
    this.setState({
      slotsSelected: curSelectedSlots
    })
  }
  selctedIntlDates
  isSlotSelected = (slotNumber) => this.state.slotsSelected.includes(slotNumber)

  checkIfSlotSelected = (slotNumber) => {
    const { sessionToEdit } = this.props
    if (
      sessionToEdit && !this.state.mentorChanged && !this.state.slotChanged &&
      new Date(sessionToEdit.availabilityDate).setHours(0, 0, 0, 0) ===
      new Date(this.state.dateSelected).setHours(0, 0, 0, 0)
    ) {
      return sessionToEdit[`slot${slotNumber}`] || false
    }

    return this.state.slotsSelected.includes(slotNumber) || false
  }

  renderTimeSlots = () => {
    const renderSlots = []
    appConfig.timeSlots.forEach((slot, index) => {
      let isFirst = false
      let isLeft = false
      if (index >= 0 && index < 6) {
        isFirst = true
      }
      if (index % 6 === 0) {
        isLeft = true
      }
      renderSlots.push(
        <Tooltip
          id={appConfig.timeSlots[index]}
          placement='top'
          title={`${getIntlDateTime(this.state.dateSelected, appConfig.timeSlots[index], this.state.selectedTimezone).intlDate} | ${getIntlDateTime(this.state.dateSelected, appConfig.timeSlots[index], this.state.selectedTimezone).intlTime}`}
          visible={this.state.timeSlotFocused === appConfig.timeSlots[index] && this.state.selectedTimezone !== 'Asia/Kolkata'}
          onMouseEnter={() => this.setState({ timeSlotFocused: appConfig.timeSlots[index] })}
          onMouseLeave={() => this.setState({ timeSlotFocused: undefined })}
        >
          <SessionTimeModalStyle.Slot
            isFirst={isFirst}
            isLeft={isLeft}
            isBooked={this.props.path === '/ums/manageKids' ? this.state.bookedSlots.includes(slot) : false}
            selected={
            this.props.path === '/ums/manageKids'
              ? this.checkIfSlotSelected(appConfig.timeSlots[index])
              : this.isSlotSelected(appConfig.timeSlots[index])
          }
            onClick={() => {
            if (this.props.path === '/ums/manageKids') {
              if (
                this.props.sessionToEdit &&
                this.props.sessionToEdit.selectedSlot !== appConfig.timeSlots[index]
              ) {
                this.setState({
                  slotChanged: true
                })
              }
              this.setState({
                slotsSelected: [appConfig.timeSlots[index]]
              })
            } else {
              this.handleSlotClick(appConfig.timeSlots[index])
            }
          }}
          >
            {`${getSlotLabel(appConfig.timeSlots[index]).startTime}`}
          </SessionTimeModalStyle.Slot>
        </Tooltip>
      )
    })

    return renderSlots
  }

  renderSelectedTimeSlots = (intlDate) => {
    const renderSlots = []
    let count = 0
    this.state.selectedSlotsWithIntlTimingObj.forEach(slot => {
      if (intlDate === get(slot, 'intlDate')) {
        let isFirst = false
        let isLeft = false
        if (count >= 0 && count < 6) {
          isFirst = true
        }
        if (count % 6 === 0) {
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

  getSelectedMentorPreBookedDates = (mentor) => {
    const { sessions } = this.props
    const bookedDates = []
    for (let i = 0; i < sessions.length; i += 1) {
      if (sessions[i].user && sessions[i].user.id === mentor) {
        bookedDates.push(formatDate(sessions[i].availabilityDate).date)
      }
    }

    return bookedDates
  }

  validateIfDateSelectedIsValid = (sessionDate) => {
    // const selectedDate = dateFormat(sessionDate, 'YYYY-MM-DD')
    const currentDate = new Date().setHours(0, 0, 0, 0)
    if (sessionDate < currentDate) {
      return false
    }
    return true
  }

  validateIfSlotSelectedIsValid = (sessionDate, slotStatus) => {
    const selectedDate = new Date(sessionDate).setHours(0, 0, 0, 0)
    const currentDate = new Date().setHours(0, 0, 0, 0)
    if (selectedDate === currentDate) {
      const currentHour = new Date().getHours()
      for (let i = 0; i < appConfig.timeSlots.length; i += 1) {
        if (slotStatus[i] === true) {
          if (currentHour >= appConfig.timeSlots[i]) {
            return false
          }
        }
      }
    }

    return true
  }

  validateDateSelectedUnique = (mentor, sessionDate) => {
    const bookedDates = this.getSelectedMentorPreBookedDates(mentor)
    for (let i = 0; i < bookedDates.length; i += 1) {
      if (sessionDate === bookedDates[i]) {
        return false
      }
    }

    return true
  }

  validateSlotSelected = (slotStatus) => {
    const { sessionToEdit } = this.props
    for (let i = 0; i < slotStatus.length; i += 1) {
      if (
        slotStatus[i] === true ||
          (sessionToEdit && sessionToEdit[appConfig.timeSlots[i]])
      ) {
        return true
      }
    }
    return false
  }

  validateInputs = (sessionDate, mentor, slotStatus) => {
    const { notification, editingSession } = this.props
    const availabilityDate = sessionDate.setHours(0, 0, 0, 0)
    const isValidDateSelected = this.validateIfDateSelectedIsValid(sessionDate)
    if (!isValidDateSelected) {
      notification.error({
        message: 'Selected Date is old'
      })
      return false
    }
    const isDateSelectedUnique = this.validateDateSelectedUnique(mentor, availabilityDate)
    if (!isDateSelectedUnique && !editingSession) {
      notification.error({
        message: 'Slots already booked for the selected date'
      })
      return false
    }
    const isSlotSelected = this.validateSlotSelected(slotStatus)
    if (!isSlotSelected && !editingSession) {
      notification.error({
        message: 'No slot selected'
      })
      return false
    }
    const isValidSlotSelected = this.validateIfSlotSelectedIsValid(sessionDate, slotStatus)
    if (!isValidSlotSelected && !editingSession) {
      notification.error({
        message: 'Selected slot(s) is/are old'
      })
      return false
    }

    return true
  }

  setHoursZero = (date) => new Date(date).setHours(0, 0, 0, 0)

  onSave = () => {
    this.props.form.validateFields(async (err, values) => {
      const { mentor, courseTitle } = values
      const { editingSession, sessionToEdit, notification, userRole,
        userId } = this.props
      if (!err) {
        const slotStatus = []
        for (let i = 0; i < appConfig.timeSlots.length; i += 1) {
          if (editingSession) {
            if (
              this.setHoursZero(this.state.dateSelected) > this.setHoursZero(new Date()) ||
                (this.setHoursZero(this.state.dateSelected) === this.setHoursZero(new Date()) &&
                appConfig.timeSlots[i] > (new Date()).getHours())
            ) {
              if (
                this.state.slotsSelected.includes(appConfig.timeSlots[i])
              ) {
                slotStatus.push(true)
              } else if (
                !this.state.slotsSelected.includes(appConfig.timeSlots[i]) &&
                  sessionToEdit[`slot${appConfig.timeSlots[i]}`] === true
              ) {
                slotStatus.push(false)
              } else {
                slotStatus.push('noAction')
              }
            } else if (
              (this.state.slotsSelected.includes(appConfig.timeSlots[i]) && !sessionToEdit[`slot${appConfig.timeSlots[i]}`] === true) ||
                  (!this.state.slotsSelected.includes(appConfig.timeSlots[i]) && sessionToEdit[`slot${appConfig.timeSlots[i]}`] === true)
            ) {
              notification.error({
                message: 'Selected slot(s) is/are old'
              })
              return
            } else {
              slotStatus.push('noAction')
            }
          } else if (!editingSession) {
            if (this.state.slotsSelected.includes(appConfig.timeSlots[i])) {
              slotStatus.push(true)
            } else {
              slotStatus.push('noAction')
            }
          }
        }
        const sessionDate = this.state.dateSelected
        const isValidInputs = this.validateInputs(sessionDate, mentor, slotStatus)
        const changedDate = new Date(sessionDate).setHours(0, 0, 0, 0)
        const slotStatusObj = this.getSlotStatusObject(slotStatus)
        const availabilityDate = new Date(changedDate).toISOString()
        if (isValidInputs && !editingSession) {
          const addInput = {
            availabilityDate,
            ...slotStatusObj,
            sessionType: this.props.sessionType
          }
          const selectedUserId = userRole && userRole === MENTOR ? userId : mentor
          const mentorSessionData = await getMentorSessions(availabilityDate,
            this.props.sessionType, selectedUserId)
          if (mentorSessionData && mentorSessionData.length > 0) {
            await this.updateMentorSessionOperation({
              sessionDate, slotStatus, slotStatusObj, updateMentorSessionId: get(mentorSessionData, '[0].id')
            })
            return
          }
          const newCount = this.state.sessionAddedCount + 1
          if (userRole && userRole === MENTOR) {
            this.setState({
              sessionAddedCount: newCount
            }, () => {
              this.props.updateAddedSessionCount(this.state.sessionAddedCount)
              addSession(
                addInput,
                userId,
                courseTitle,
                this.props.sessionType,
                this.state.sessionAddedCount
              )
            })
          } else if (userRole && (userRole === ADMIN || userRole === UMS_ADMIN)) {
            this.setState({
              sessionAddedCount: newCount
            }, () => {
              this.props.updateAddedSessionCount(this.state.sessionAddedCount)
              addSession(
                addInput,
                mentor,
                courseTitle,
                this.props.sessionType,
                this.state.sessionAddedCount
              )
            })
          }
        } else if (isValidInputs && editingSession) {
          await this.updateMentorSessionOperation({ sessionDate, slotStatus, slotStatusObj })
        }
      }
    })
  }

  updateMentorSessionOperation = async ({ sessionDate, slotStatus, slotStatusObj,
    updateMentorSessionId }) => {
    const { sessionToEdit, notification, getSelectedSlots } = this.props
    const isSelectedSlotsValid = this.validateIfSlotSelectedIsValid(sessionDate,
      slotStatus)
    if (!isSelectedSlotsValid) {
      notification.error({
        message: 'Selected slot(s) is/are old'
      })
    } else {
      let mentorSessionId = get(sessionToEdit, 'id')
      if (updateMentorSessionId) mentorSessionId = updateMentorSessionId
      const editInput = {
        availabilityDate: this.state.dateSelected,
        ...slotStatusObj
      }
      const savedRole = getDataFromLocalStorage('login.role')
      if (savedRole === MENTOR) {
        // getting the prev Selected and latest selected slots
        const prevSelectedSlots = getSelectedSlots(sessionToEdit)
        const currSelectedSlots = [...this.state.slotsSelected]
        const removedSlots = []
        // getting the removed slots
        prevSelectedSlots.forEach(slot => {
          if (!currSelectedSlots.includes(slot)) {
            if (getSlotDifference(slot, this.state.dateSelected)) {
              removedSlots.push(slot)
            }
          }
        })
        if (removedSlots.length > 0) {
          getMentorMenteeSessionData(this.state.dateSelected).then(res => {
            if (get(res, 'data.availableSlots', []).length > 0) {
              const availableSlots = get(res, 'data.availableSlots[0]')
              // getting slots value which is > 1
              const newAvailableSlots = getSelectedSlots(availableSlots, true)
              const slotsExistArray = []
              const slotsNotExist = []
              removedSlots.forEach(slot => {
                const findSlot = newAvailableSlots.find(slotObj => slotObj[`slot${slot}`])
                if (findSlot) {
                  slotsExistArray.push(findSlot)
                } else {
                  slotsNotExist.push(slot)
                }
              })
              if (slotsNotExist.length === 0) {
                updateSession(editInput, mentorSessionId)
              } else {
                notification.warn({
                  message: `Cannot update slots(${slotsNotExist.map(slot => `${getSlotLabel(slot).startTime}`)}), as mentee is already alloted.`
                })
              }
            }
          })
        } else {
          updateSession(editInput, mentorSessionId)
        }
      } else {
        updateSession(editInput, mentorSessionId)
      }
    }
  }

    onCancel = () => {
      const { closeSessionModal, form, selectCourse } = this.props
      form.resetFields()
      this.setState({
        selectedCourse: ''
      })
      if (selectCourse) {
        selectCourse('')
      }
      closeSessionModal()
    }

    isSaving = () => {
      const { addStatus, updateStatus, sessionType, showModalSaving, path } = this.props
      const { sessionAddedCount } = this.state
      if (path === '/ums/manageKids') {
        return showModalSaving
      }
      if ((addStatus && addStatus.getIn([`mentorSession/${sessionType}/${sessionAddedCount}`, 'loading'])) ||
          (updateStatus && updateStatus.getIn(['updateSession', 'loading']))) {
        return true
      }

      return false
    }

  getWeekDay = (day) => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat']
    return weekDays[day]
  }

  getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    return months[month]
  }

  renderDateTablets = () => {
    const days = []
    for (let i = 0; i < appConfig.bookingDaysCutOff; i += 1) {
      days.push(offsetDate(new Date(), i, 'ADD'))
    }

    return days.map((day) => (
      <SessionTimeModalStyle.DateTablet
        onClick={() => this.setState({ dateSelected: day }, async () => {
          if (this.props.path === '/ums/manageKids') {
            if (
              this.props.sessionToEdit && this.props.sessionToEdit.availabilityDate &&
              new Date(this.props.sessionToEdit.availabilityDate).setHours(0, 0, 0, 0) ===
              new Date(this.state.dateSelected).setHours(0, 0, 0, 0)
            ) {
              this.setState({
                slotsSelected: [this.props.sessionToEdit.selectedSlot]
              })
            } else if (
              this.props.sessionToEdit && this.props.sessionToEdit.availabilityDate &&
              new Date(this.props.sessionToEdit.availabilityDate).setHours(0, 0, 0, 0) !==
              new Date(this.state.dateSelected).setHours(0, 0, 0, 0)
            ) {
              this.setState({
                slotsSelected: []
              })
            }
            this.props.changeSelectedDate(new Date(this.state.dateSelected))
          }
          if (
            this.props.path === '/ums/manageKids' &&
            (this.state.selectedMentor && this.state.selectedMentor.length) &&
            this.state.selectedMentor !== 'ALL'
          ) {
            await fetchPaidSession(
              this.state.selectedMentor,
              new Date(this.state.dateSelected)
            )
          }
        })}
        selected={
          this.state.dateSelected.setHours(0, 0, 0, 0) === day.setHours(0, 0, 0, 0)
        }
      >
        <SessionTimeModalStyle.DateText
          colored
        >
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
              this.state.dateSelected.setHours(0, 0, 0, 0) === day.setHours(0, 0, 0, 0)
            }
        />
      </SessionTimeModalStyle.DateTablet>
    ))
  }

  shouldRenderSlots = () => {
    if (this.props.path === '/ums/manageKids') {
      return this.state.selectedMentor.length > 0
    }

    return true
  }

  showSlotLoading = () => {
    const { mentorSessionFetchStatus, path } = this.props
    if (path === '/ums/manageKids' && mentorSessionFetchStatus) {
      return mentorSessionFetchStatus.getIn([
        `mentorSession/${this.state.selectedMentor}/${new Date(this.state.dateSelected).setHours(0, 0, 0, 0)}`,
        'loading'
      ])
    }

    return false
  }

  checkIfSelectedSlotOld = (slot, date) => {
    if (
      new Date(date).setHours(0, 0, 0, 0) ===
      new Date().setHours(0, 0, 0, 0)
    ) {
      return slot <= new Date().getHours()
    }

    return false
  }

  checkIfSameSlotSelected = (slot, date) => {
    const { sessionToEdit, editingSession } = this.props
    if (
      editingSession &&
      sessionToEdit && sessionToEdit.availabilityDate &&
      (
        new Date(sessionToEdit.availabilityDate).setHours(0, 0, 0, 0) ===
        new Date(date).setHours(0, 0, 0, 0)
      )
    ) {
      return slot === sessionToEdit.selectedSlot
    }

    return false
  }

  onSessionBook = async () => {
    const {
      selectedMentor,
      dateSelected,
      slotsSelected,
      bookedSlots
    } = this.state
    const { notification, setMenteeBookingInput } = this.props
    if (slotsSelected.length) {
      if (
        !this.checkIfSelectedSlotOld(slotsSelected[0], dateSelected) &&
        !this.checkIfSameSlotSelected(slotsSelected[0], dateSelected)
      ) {
        if (this.props.sessionToEdit && this.state.slotChanged && this.props.editingSession) {
          setMenteeBookingInput({
            bookingDate: dateSelected,
            [`slot${get(slotsSelected, '0')}`]: true,
            [`slot${this.props.sessionToEdit.selectedSlot}`]: false
          })
        } else {
          setMenteeBookingInput({
            bookingDate: dateSelected,
            [`slot${get(slotsSelected, '0')}`]: true
          })
        }
        if (bookedSlots.includes(get(slotsSelected, '0'))) {
          const { nextTopicIdToBook, menteeId } = this.props
          const input = {
            bookingDate: dateSelected
          }
          input[`slot${get(slotsSelected, '0')}`] = true
          if (!this.props.editingSession) {
            const { selectedCourse } = this.state
            await addMenteeSession(menteeId, nextTopicIdToBook,
              input, selectedCourse)
          } else {
            const { bookedMenteeSessionId, sessionToEdit: { mentorMenteeSessionId } } = this.props
            if (this.props.sessionToEdit && this.state.slotChanged && this.props.editingSession) {
              input[`slot${this.props.sessionToEdit.selectedSlot}`] = false
            }
            await updateMenteeSession(
              bookedMenteeSessionId,
              menteeId,
              input,
              mentorMenteeSessionId
            )
          }
        } else if (bookedSlots.length === 0) {
          const input = {
            availabilityDate: dateSelected,
            sessionType: 'paid'
          }
          input[`slot${get(slotsSelected, '0')}`] = true
          const { selectedCourse } = this.state
          await addSession(input, selectedMentor, selectedCourse, 'paid', selectedMentor)
        } else if (bookedSlots.length > 0) {
          const input = {
            availabilityDate: dateSelected
          }
          input[`slot${get(slotsSelected, '0')}`] = true
          await updateSession(
            input,
            this.state.selectedMentorSessionId,
            `mentorSession/paid/${selectedMentor}`
          )
        }
      } else if (this.checkIfSameSlotSelected(slotsSelected[0], dateSelected)) {
        notification.error({
          message: 'Change the slot before editing the session!'
        })
      } else if (this.checkIfSelectedSlotOld(slotsSelected[0], dateSelected)) {
        notification.error({
          message: 'Selected slot is old!'
        })
      }
    } else {
      notification.error({
        message: 'Select a slot!'
      })
    }
  }

  render() {
    const { visible, title, id, form, mentors, courses, editingSession,
      userRole, selectCourse } = this.props
    const { selectedCourse, selectedMentor } = this.state
    return (
      <MainModal
        visible={visible}
        title={title}
        onCancel={() => this.onCancel()}
        maskClosable={false}
        width='960px'
        styles={{ marginTop: '-70px' }}
        footer={[
          <Button onClick={this.onCancel}>CANCEL</Button>,
          <MainModal.SaveButton
            type='primary'
            htmlType='submit'
            form={id}
            onClick={this.props.path === '/ums/manageKids' ? this.onSessionBook : this.onSave}
          > {this.isSaving() ? 'Saving...' : 'SAVE'}
          </MainModal.SaveButton>
        ]}
      >
        <Form>
          <div
            style={{
                  display: 'flex',
                  flexDirection: 'row'
                }}
          >
            <div id='select-course-name'
              style={{
               display: 'flex',
               flex: '1',
               marginRight: '5px'
             }}
            >
              {
                this.props.path === '/ums/manageKids' ? (
                  <MainModal.FormItem>
                    <MainModal.Select
                      width='70%'
                      placeholder='Course Name'
                      value={selectedCourse}
                      onChange={value =>
                        this.setState({ selectedCourse: value }, () => selectCourse(value))}
                      disabled={editingSession}
                      getPopupContainer={() => document.getElementById('select-course-name')}
                    >
                      {
                        courses.map(course =>
                          <MainModal.Option key={course.id}
                            value={course.id}
                          >{course.title ? course.title.toUpperCase() : ''}
                          </MainModal.Option>
                        )}
                    </MainModal.Select>
                  </MainModal.FormItem>
                ) : (
                  <MainModal.FormItem>
                    {
                      editingSession ? (
                        <MainModal.Select
                          width='70%'
                          placeholder='Course Name'
                          disabled={editingSession}
                          getPopupContainer={() => document.getElementById('select-course-name')}
                        >
                          {
                            courses.map(course =>
                              <MainModal.Option key={course.id}
                                value={course.id}
                              >{course.title ? course.title.toUpperCase() : ''}
                              </MainModal.Option>
                            )}
                        </MainModal.Select>
                      ) : (
                        form.getFieldDecorator(...validators.courseTitle)(
                          <MainModal.Select
                            width='70%'
                            placeholder='Course Name'
                            disabled={editingSession}
                            getPopupContainer={() => document.getElementById('select-course-name')}
                          >
                            {
                              courses.map(course =>
                                <MainModal.Option key={course.id}
                                  value={course.id}
                                >{course.title ? course.title.toUpperCase() : ''}
                                </MainModal.Option>
                              )}
                          </MainModal.Select>
                        )
                      )
                    }
                  </MainModal.FormItem>
                )
              }
            </div>
            {
              this.props.path !== '/ums/manageKids'
               ? (
                 <div id='select-time-zone'
                   style={{
                    display: 'flex',
                    flex: '1',
                    marginRight: '60px'
                  }}
                 >
                   <MainModal.Select
                     width='90%'
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
               ) : <div />
            }
            {
                seeMentorColRoles.includes(userRole)
                    ?
                      <div id='select-mentor-name'
                        style={{
                           display: 'flex',
                           flex: '1',
                           marginLeft: '5px'
                         }}
                      >
                        <MainModal.FormItem>
                          {form.getFieldDecorator(...validators.mentor)(
                            <MainModal.Select
                              showSearch
                              placeholder='Mentor Name'
                              disabled={
                                (editingSession && this.props.path !== '/ums/manageKids') ||
                                userRole === UMS_VIEWER
                              }
                              width='100%'
                              value={selectedMentor}
                              filterOption={(input, option) =>
                                get(option, 'props.children')
                                  ? get(option, 'props.children')
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                  : false
                              }
                              onChange={(value) => {
                                if (this.props.path === '/ums/manageKids') {
                                  if (
                                    this.state.sessionToEdit && this.state.sessionToEdit.user &&
                                    this.state.sessionToEdit.user.id !== value
                                  ) {
                                    this.setState({
                                      mentorChanged: true
                                    })
                                  } else {
                                    this.setState({
                                      mentorChanged: false
                                    })
                                  }
                                  this.props.setSelectedMentorId(value)
                                  this.setState({ selectedMentor: value }, async () => {
                                    await fetchPaidSession(
                                      this.state.selectedMentor,
                                      new Date(this.state.dateSelected)
                                    )
                                  })
                                }
                              }}
                            >
                              {
                                mentors.map(mentor =>
                                  <MainModal.Option key={mentor.id}
                                    value={mentor.id}
                                  >{mentor.name || mentor.username}
                                  </MainModal.Option>
                                )}
                            </MainModal.Select>
                        )}
                        </MainModal.FormItem>
                      </div>
                    :
                      <div />
              }
          </div>
          <div
            style={{
                  marginTop: '10px'
                }}
          >
            <SessionTimeModalStyle.DateTabletContainer>
              {this.renderDateTablets()}
            </SessionTimeModalStyle.DateTabletContainer>
          </div>
          <div
            style={{
                marginTop: '15px'
              }}
          >
            <MainModal.TextItem>
              Session Date {`(${formatDate(new Date(this.state.dateSelected)).date})`}
            </MainModal.TextItem>
          </div>
          {
            this.shouldRenderSlots() && !this.showSlotLoading()
              ? (
                <div
                  style={{
                    marginTop: '15px'
                  }}
                >
                  <SessionTimeModalStyle.SlotContainer>
                    {this.renderTimeSlots()}
                  </SessionTimeModalStyle.SlotContainer>
                  <div
                    style={{
                      marginTop: '18px'
                    }}
                  >
                    <MainModal.TextItem>Session Time</MainModal.TextItem>
                  </div>
                </div>
              ) : <div />
          }
          {
            this.showSlotLoading()
              ? (
                <Icon
                  style={{ fontSize: 18, color: '#66a3e0', cursor: 'pointer' }}
                  type='loading'
                />
            ) : <div />
          }
        </Form>
        {
          this.state.selectedTimezone !== 'Asia/Kolkata' && this.state.slotsSelected.length
           ? (
             <div>
               <div style={{ width: '99%', height: '1px', backgroundColor: '#27d6e9' }} />
               <div style={{ color: 'rgba(0, 0, 0, 0.3)', marginTop: '10px', fontFamily: 'Nunito', fontWeight: 'bold' }}>
                 {`Date and Time of the selected slots in ${this.state.selectedTimezone} Timezone:`}
               </div>
               {
                  this.state.selectedIntlDates.map(date => (
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                      <div style={{ fontFamily: 'Nunito', color: 'rgba(0, 0, 0, 0.5)' }}>{date}</div>
                      <div style={{ margin: '10px' }}>
                        <SessionTimeModalStyle.SlotContainer justifyContent='flex-start'>
                          {this.renderSelectedTimeSlots(date)}
                        </SessionTimeModalStyle.SlotContainer>
                      </div>
                    </div>
                  ))
                }
             </div>
           ) : <div />
        }
      </MainModal>
    )
  }
}

SessionModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  closeSessionModal: PropTypes.func.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFields: PropTypes.func,
  }).isRequired,
  mentors: PropTypes.shape([]),
  sessions: PropTypes.shape([]),
  notification: PropTypes.shape({}).isRequired,
  addStatus: PropTypes.shape({}),
  updateStatus: PropTypes.shape({}),
  deleteStatus: PropTypes.shape({}),
  sessionToEdit: PropTypes.shape({}),
  editingSession: PropTypes.bool.isRequired,
  userRole: PropTypes.string.isRequired,
  courses: PropTypes.shape([]),
  addError: PropTypes.string,
  addedSession: PropTypes.shape([]),
  sessionType: PropTypes.string.isRequired,
  updateAddedSessionCount: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired
}

SessionModal.defaultProps = {
  mentors: [],
  sessions: [],
  addStatus: Map({}),
  updateStatus: Map({}),
  sessionToEdit: {},
  deleteStatus: {},
  courses: [],
  addError: '',
  addedSession: []
}

export default Form.create()(SessionModal)
