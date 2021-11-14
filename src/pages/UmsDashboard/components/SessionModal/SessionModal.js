import React, { Component } from 'react'
import { Button, Divider, Form, Spin, Tooltip } from 'antd'
import { Map } from 'immutable'
import PropTypes from 'prop-types'
import moment from 'moment'
import { get } from 'lodash'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import momentTZ from 'moment-timezone'
import MainModal from '../../../../components/MainModal'
import fetchAvailability from '../../../../actions/ums/fetchAvailability'
import SessionTimeModalStyle from '../SessionTimeModal/SessionTimeModal.style'
import getSlotLabel from '../../../../utils/slots/slot-label'
import getSlotNames from '../../../../utils/slots/slot-names'
import addMenteeSession from '../../../../actions/sessions/addMenteeSession'
import updateMenteeSession from '../../../../actions/sessions/updateMenteeSession'
import appConfig from '../../../../config/appConfig'
import offsetDate from '../../../../utils/date/date-offset'
import getIntlDateTime from '../../../../utils/time-zone-diff'
import rebookMenteeSession from '../../../../actions/sessions/rebookMenteeSession'
import requestToGraphql from '../../../../utils/requestToGraphql'
import getGrades from '../../../../utils/getGrades'
import { getCourseForGrade } from '../../../../utils/courseToGradeMapping'

// import { showNotification } from '../../../../utils/messages'
// import { filterKey } from '../../../../utils/data-utils'

// const seeMentorColRoles = ['admin', 'umsAdmin', 'umsViewer']
class SessionModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dateSelected: moment().startOf('day').toDate().toISOString(),
      availabilitySlots: [],
      selectedSlot: '',
      selectedTimezone: 'Asia/Kolkata',
      selectedIntlDates: {},
      selectedCourse: '',
      coursesList: [],
      selectedGradeRange: '1-2',
      selectedGradesArray: []
    }
  }

  componentDidUpdate(prev, prevState) {
    if (get(prev, 'availabilityFetchLoading') && get(this.props, 'availabilityFetchSuccess')) {
      const availability = {}
      if (get(this.props, 'availabilitySlots')) {
        get(this.props, 'availabilitySlots').toJS().forEach(slot => {
          availability[get(slot, 'date')] = slot
        })
      }
      this.setState({
        availabilitySlots: availability
      })
    }
    if (!get(prev, 'visible') && get(this.props, 'visible')) {
      fetchAvailability()
      this.setDefault()
    }
    if (get(prev, 'errors') !== get(this.props, 'errors')) {
      if (get(this.props, 'errors')) {
        this.setState({
          error: get(get(this.props, 'errors').toJS(), '0.error.errors.0.message')
        })
      }
    }
    if (get(prev, 'addErrors') !== get(this.props, 'addErrors')) {
      if (get(this.props, 'addErrors')) {
        this.setState({
          error: get(get(this.props, 'addErrors').toJS(), '0.error.errors.0.message')
        })
      }
    }
    const prevSessionAdd = get(prev, 'sessionAddStatus') && get(prev, 'sessionAddStatus').toJS()
    const sessionAdd = get(this.props, 'sessionAddStatus') && get(this.props, 'sessionAddStatus').toJS()
    const prevSessionUpdate = get(prev, 'sessionUpdateStatus') && get(prev, 'sessionUpdateStatus').toJS()
    const sessionUpdate = get(this.props, 'sessionUpdateStatus') && get(this.props, 'sessionUpdateStatus').toJS()
    if (get(prevSessionUpdate, 'loading') && get(sessionUpdate, 'success') ||
      get(prevSessionAdd, 'loading') && get(sessionAdd, 'success')) {
      this.props.closeSessionModal()
    }

    if (this.props.visible && !prev.visible && !this.props.editingSession) {
      this.setState({
        dateSelected: moment().startOf('day').toDate().toISOString()
      })
    }
    if (
      this.state.selectedTimezone !== prevState.selectedTimezone ||
      prevState.dateSelected !== this.state.dateSelected ||
      prevState.selectedSlot !== this.state.selectedSlot
    ) {
      this.updateSelectedSlotsWithIntlTimingObj()
    }
  }

  updateSelectedSlotsWithIntlTimingObj = () => {
    const { dateSelected, selectedSlot, selectedTimezone } = this.state
    this.setState({
      selectedIntlDates: {
        id: selectedSlot,
        intlDate: getIntlDateTime(
          dateSelected, selectedSlot, selectedTimezone
        ).intlDate,
        intlTime: getIntlDateTime(
          dateSelected, selectedSlot, selectedTimezone
        ).intlTime
      }
    })
  }

  setDefault = () => {
    const { sessionToEdit, editingSession, editingCompletedSession, courses } = this.props
    const { dateSelected } = this.state
    const selectedGradesArray = [{ key: get(sessionToEdit, 'grade', 0), label: get(sessionToEdit, 'grade', 0) }]
    if (editingSession || editingCompletedSession) {
      let selectedSlot = ''
      getSlotNames().split('\n').forEach(slot => {
        if (get(sessionToEdit.bookingDate, slot)) {
          selectedSlot = Number(slot.slice(4))
        }
      })
      this.setState({
        dateSelected: get(sessionToEdit, 'bookingDate.bookingDate') || dateSelected,
        selectedSlot,
        error: '',
        selectedCourse: get(sessionToEdit, 'bookingDate.course.id'),
        selectedTimezone: get(sessionToEdit, 'timezone'),
        selectedGradesArray
      })
    } else {
      this.setState({
        dateSelected: moment().startOf('day').toDate().toISOString(),
        selectedSlot: '',
        error: '',
        selectedTimezone: 'Asia/Kolkata',
        selectedGradesArray
      }, () => {
        const { removeCourse } = this.getCoursesForSelectedGrade()
        let { filteredCourse } = this.getCoursesForSelectedGrade()
        const defaultCourse = getCourseForGrade(get(sessionToEdit, 'grade'))
        filteredCourse = filteredCourse.filter(course => get(course, 'id') !== get(defaultCourse, 'id'))
        const addedCourse = filteredCourse.map(course => get(course, 'id'))
        if (!addedCourse.includes(get(defaultCourse, 'id')) && !removeCourse.includes(get(defaultCourse, 'id'))) {
          const findCourse = courses.find(course => get(course, 'id') === get(defaultCourse, 'id'))
          filteredCourse = [{ ...findCourse }, ...filteredCourse]
        }
        this.setState({
          selectedCourse: get(filteredCourse, '[0].id')
        })
      })
      // const defaultCourse = getCourseForGrade(get(sessionToEdit, 'grade'))
      // if (defaultCourse) {
      //   coursesList.push({
      //     ...defaultCourse,
      //     id: get(defaultCourse, 'id'),
      //     title: get(defaultCourse, 'title')
      //   })
      // }
      // const userCourseList = get(sessionToEdit, 'userCourse.courses', [])
      // if (userCourseList && userCourseList.length > 0) {
      //   userCourseList.forEach(course => {
      //     const addedCourseInList = coursesList.map(courseValue => get(courseValue, 'id'))
      //     if (!addedCourseInList.includes(get(course, 'id'))) {
      //       coursesList.push({
      //         ...course,
      //         id: get(course, 'id'),
      //         title: get(course, 'title')
      //       })
      //     }
      //   })
      // }
      // let selectedCourse = ''
      // if (coursesList.length > 0) {
      //   selectedCourse = get(coursesList, '[0].id')
      // }
    }
  }

  getWeekDay = (day) => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat']
    return weekDays[day]
  }

  getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    return months[month]
  }

  onCancel = () => {
    const { closeSessionModal } = this.props
    this.setState({
      error: ''
    }, closeSessionModal)
  }

  onSave = async () => {
    const { editingSession, editingCompletedSession } = this.props
    const { selectedCourse } = this.state
    const input = {}
    input.bookingDate = moment(this.state.dateSelected).startOf('day').toDate().toISOString()
    if (!this.state.dateSelected || this.state.selectedSlot === '') {
      this.setState({
        error: 'Select Date And Time'
      })
    } else if (!editingSession && !selectedCourse) {
      this.setState({
        error: 'Select Course'
      })
    } else {
      this.setState({
        error: ''
      })
      if (!editingSession && !editingCompletedSession) {
        input[`slot${this.state.selectedSlot}`] = true
        const topic = await requestToGraphql(gql`{
          topics(filter: { and: [ { courses_some: { id: "${selectedCourse}" } } { order_gte: 1 }  ] }, first: 1) {
            id
          }
        }`)
        const topicConnectId = get(topic, 'data.topics[0].id')
        const addInput = {
          userConnectId: get(this.props, 'menteeId'),
          courseConnectId: selectedCourse,
          input,
          topicConnectId
        }
        addMenteeSession(addInput)
      } else {
        getSlotNames().split('\n').forEach(slot => {
          if (get(get(this.props, 'sessionToEdit.bookingDate'), slot)) {
            input[slot] = false
          }
        })
        input[`slot${this.state.selectedSlot}`] = true
        if (editingCompletedSession) {
          input.menteeSessionId = get(this.props, 'sessionToEdit.bookingDate.sessionId')
          rebookMenteeSession({ input })
        } else {
          updateMenteeSession({
            sessionId: get(this.props, 'sessionToEdit.bookingDate.sessionId'),
            input
          })
        }
      }
    }
  }

  isSaving = () => {
    const updateStatus = get(this.props, 'sessionUpdateStatus') && get(this.props, 'sessionUpdateStatus').toJS()
    const addStatus = get(this.props, 'sessionAddStatus') && get(this.props, 'sessionAddStatus').toJS()
    return get(updateStatus, 'loading') || get(addStatus, 'loading')
  }

  renderDateTablets = () => {
    const days = []
    for (let i = 0; i < appConfig.bookingDaysCutOff; i += 1) {
      days.push(offsetDate(new Date(), i, 'ADD'))
    }
    const dateFormat = 'DD/MM/YYYY'
    return days.map((day) => (
      <SessionTimeModalStyle.DateTablet
        onClick={() => {
          this.setState({
            dateSelected: day,
            selectedSlot: ''
          })
        }}
        selected={moment(get(this.state, 'dateSelected')).format(dateFormat) === moment(day).format(dateFormat)}
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
          selected
        />
      </SessionTimeModalStyle.DateTablet>
    ))
  }
gradeNumber = (grade) => grade.replace('Grade', '')
  renderTimeSlots = () => {
    const renderSlots = []
    appConfig.timeSlots.forEach((slot, index) => {
      let isFirst = false
      let isLeft = false
      if (index === 0 || index === 1 || index === 2 || index === 3) {
        isFirst = true
      }
      if (index % 4 === 0) {
        isLeft = true
      }
      renderSlots.push(
        <SessionTimeModalStyle.UMSDashSot
          isFirst={isFirst}
          isLeft={isLeft}
          isBooked={get(get(this.state.availabilitySlots, moment(get(this.state, 'dateSelected')).startOf('day').toDate().toISOString()), `slot${slot}`)}
          selected={get(this.state, 'selectedSlot') === slot}
          onClick={() => {
            this.setState({
              selectedSlot: slot
            })
          }}
          disabled={!get(get(this.state.availabilitySlots, moment(get(this.state, 'dateSelected')).startOf('day').toDate().toISOString()), `slot${slot}`)}
        >
          {`${getSlotLabel(appConfig.timeSlots[index]).startTime}`}
        </SessionTimeModalStyle.UMSDashSot>
      )
    })

    return renderSlots
  }

  getCoursesForSelectedGrade = () => {
    const { selectedGradesArray } = this.state
    const { editingSession, sessionToEdit, courses = [] } = this.props
    const gradesArray = selectedGradesArray.map(grade => Number(get(grade, 'key', 0)))
    let filteredCourse = []
    courses.forEach(course => {
      const isBetween = gradesArray.filter(grade =>
        get(course, 'minGrade') <= grade && get(course, 'maxGrade') >= grade)
      if (isBetween.length > 0) filteredCourse.push(course)
    })
    const removeCourse = []
    if (!editingSession) {
      const bookingDetails = get(sessionToEdit, 'bookingDate', [])
      if (bookingDetails && bookingDetails.length > 0) {
        const addedCourses = bookingDetails.map(booking => get(booking, 'course.id'))
        if (addedCourses && addedCourses.length > 0) {
          addedCourses.forEach(course => {
            if (course) removeCourse.push(course)
          })
        }
      }
    } else {
      const addedFilteredCourse = filteredCourse.map(course => get(course, 'id'))
      if (!addedFilteredCourse.includes(get(sessionToEdit, 'bookingDate.course.id'))) {
        const findCourse = courses.find(course => get(course, 'id') === get(sessionToEdit, 'bookingDate.course.id'))
        filteredCourse.push(findCourse)
      }
    }
    filteredCourse = filteredCourse.filter(course => !removeCourse.includes(get(course, 'id'))
      && get(course, 'topics', []).length > 0)
    return { filteredCourse, removeCourse }
  }
  getTitle = () => {
    const { title, sessionToEdit } = this.props
    return `${title} | ${get(sessionToEdit, 'menteeName')} | ${get(sessionToEdit, 'parentName')} | Grade: ${get(sessionToEdit, 'grade')}`
  }

  onSelectGrade = (value) => {
    const { selectedGradesArray } = this.state
    this.setState({
      selectedGradesArray: [...selectedGradesArray, value]
    })
  }

  onGradeDeselect = (value) => {
    const { selectedGradesArray } = this.state
    this.setState({
      selectedGradesArray: selectedGradesArray.filter(grade => get(grade, 'key') !== get(value, 'key'))
    })
  }
  render() {
    const { visible, id, availabilityFetchLoading,
      availabilityFetchSuccess } = this.props
    const { selectedIntlDates, selectedCourse, selectedGradesArray } = this.state
    // const isProduction = process.env.REACT_APP_NODE_ENV === 'production'
    return (
      <MainModal
        visible={visible}
        title={this.getTitle()}
        onCancel={() => this.onCancel()}
        maskClosable={false}
        width='700px'
        footer={[
          <Button onClick={this.onCancel}>CANCEL</Button>,
          <MainModal.SaveButton
            type='primary'
            htmlType='submit'
            form={id}
            onClick={this.onSave}
          >
            {' '}
            {this.isSaving() ? 'Saving...' : 'SAVE'}
          </MainModal.SaveButton>
        ]}
      >
        <Form>
          <div
            style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
          >
            <div id='select-course-name'
              style={{
               display: 'flex',
               flex: '0.8',
               marginRight: '15px'
             }}
            >
              <MainModal.Select
                width='40%'
                mode='multiple'
                labelInValue
                maxTagCount={2}
                placeholder='Select Grade'
                value={selectedGradesArray}
                onSelect={this.onSelectGrade}
                onDeselect={this.onGradeDeselect}
                disabled={false}
              >
                {
                    getGrades().map(grade =>
                      <MainModal.Option key={this.gradeNumber(grade)}
                        value={this.gradeNumber(grade)}
                      >
                        {this.gradeNumber(grade)}
                      </MainModal.Option>
                    )}
              </MainModal.Select>
              <MainModal.Select
                width='60%'
                placeholder='Course Name'
                value={selectedCourse}
                onChange={value =>
                    this.setState({ selectedCourse: value })}
                disabled={false}
              >
                {
                    this.getCoursesForSelectedGrade().filteredCourse.map(course =>
                      <MainModal.Option key={course.id}
                        value={course.id}
                      >
                        <Tooltip title={get(course, 'title')}>
                          {`${get(course, 'title')} | (Grade: ${get(course, 'minGrade')}-${get(course, 'maxGrade')})`}
                        </Tooltip>
                      </MainModal.Option>
                    )}
              </MainModal.Select>
            </div>
            <div id='select-time-zone'
              style={{
                display: 'flex',
                flex: 0.2
            }}
            >
              <MainModal.Select
                width='95%'
                placeholder='Select Timezone'
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
              Session Date {`(${moment(get(this.state, 'dateSelected')).format('DD-MM-YYYY')})`}
            </MainModal.TextItem>
          </div>
          <div
            style={{
              marginTop: '15px'
            }}
          >
            {
              !availabilityFetchLoading && availabilityFetchSuccess &&
              <SessionTimeModalStyle.SlotContainer>
                {this.renderTimeSlots()}
              </SessionTimeModalStyle.SlotContainer>
            }
            {
              availabilityFetchLoading && !availabilityFetchSuccess && <Spin />
            }
            <div
              style={{
                marginTop: '18px'
              }}
            >
              {
                this.state.selectedTimezone !== 'Asia/Kolkata' && this.state.selectedSlot ? (
                  <>Session Date: {get(selectedIntlDates, 'intlDate')}{' '}Session Time: {get(selectedIntlDates, 'intlTime')}</>
                ) : (
                  <MainModal.TextItem>Session Time: {get(this.state, 'selectedSlot') ? `${getSlotLabel(get(this.state, 'selectedSlot')).startTime}` : 'Not Selected'}</MainModal.TextItem>
                )
              }
            </div>
          </div>
          <Divider />
          {
            this.state.error &&
            <div>
              <p style={{ color: 'crimson' }}>{this.state.error}</p>
            </div>
          }
          <div />
        </Form>
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
    validateFields: PropTypes.func
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

const mapStateToProps = state => ({
  availabilitySlots: state.data.getIn(['availableSlot', 'data']),
  availabilityFetchLoading: state.data.getIn(['availability', 'fetchStatus', 'availability', 'loading']),
  availabilityFetchSuccess: state.data.getIn(['availability', 'fetchStatus', 'availability', 'success']),
  topic: state.data.getIn(['topic', 'data']),
  errors: state.data.getIn(['errors', 'session/update']),
  addErrors: state.data.getIn(['errors', 'session/add']),
  sessionAddStatus: state.data.getIn(['session', 'addStatus', 'bookedSessions']),
  sessionUpdateStatus: state.data.getIn(['session', 'updateStatus', 'bookedSessions']),
})

export default connect(mapStateToProps)(Form.create()(SessionModal))
