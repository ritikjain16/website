import { PlusOutlined } from '@ant-design/icons'
import { DatePicker, notification, TimePicker, Tooltip } from 'antd'
import { get } from 'lodash'
import moment from 'moment'
import React from 'react'
import { fetchBatchSessions, updateBatchSchedule } from '../../../../actions/SchoolOnboarding'
import FullCalendar from '../../../../components/FullCalendar'
import MainModal from '../../../../components/MainModal'
import {
  AddGradeButton, CloseIcon, FlexContainer,
  SectionButton, StyledDivider
} from '../../SchoolOnBoarding.style'
import { getSuccessStatus } from '../../../../utils/data-utils'

const TimePickerFormat = 'hh a'

const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const divStyle = { width: '80%', marginBottom: '2vw' }

class ScheduleTime extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      selectedTimeRange: {
        startHour: null,
        endHour: null
      },
      selectedDateRange: {
        startDate: null,
        endDate: null
      },
      timeValues: {
        startTime: null,
        endTime: null
      },
      selectedWeekDays: [],
      fetchedEvents: [],
    }
  }
  componentDidMount = async () => {
    await fetchBatchSessions(this.props.batchId)
  }
  componentDidUpdate = async (prevProps) => {
    const { batchUpdatingStatus, batchUpdatingError,
      batchSessionsFetchingStatus, batchId } = this.props
    if ((batchUpdatingStatus && !get(batchUpdatingStatus.toJS(), 'loading')
      && get(batchUpdatingStatus.toJS(), 'success') &&
      (prevProps.batchUpdatingStatus !== batchUpdatingStatus))) {
      notification.success({
        message: 'Schedule Added Successfully'
      })
      this.onModalClose()
      await fetchBatchSessions(batchId)
    } else if (batchUpdatingStatus && !get(batchUpdatingStatus.toJS(), 'loading')
      && get(batchUpdatingStatus.toJS(), 'failure') &&
      (prevProps.batchUpdatingError !== batchUpdatingError)) {
      if (batchUpdatingError && batchUpdatingError.toJS().length > 0) {
        notification.error({
          message: get(get(batchUpdatingError.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
    if (getSuccessStatus(batchSessionsFetchingStatus, prevProps.batchSessionsFetchingStatus)) {
      this.convertDataToShow()
    }
  }
  convertDataToShow = () => {
    const batchSessions = this.props.batchSessions && this.props.batchSessions.toJS()
    const events = []
    batchSessions.map(session => {
      const { startTime, endTime } = this.getTimeRangeFromSession(
        get(session, 'bookingDate'), session)
      events.push({
        allDay: false,
        title: get(session, 'topic.title', ''),
        id: get(session, 'id'),
        date: new Date(startTime),
        end: new Date(endTime),
        backgroundColor: '#00ADE6',
        extendedProps: {
          session
        }
      })
    })
    this.setState({
      fetchedEvents: events,
    })
  }
  onModalClose = () => {
    this.setState({
      modalVisible: false,
      selectedTimeRange: {
        startHour: null,
        endHour: null
      },
      selectedDateRange: {
        startDate: null,
        endDate: null
      },
      timeValues: {
        startTime: null,
        endTime: null
      },
      selectedWeekDays: []
    })
  }
  onConfirm = async () => {
    const { batchId } = this.props
    const { selectedDateRange:
      { startDate, endDate },
    selectedTimeRange,
    selectedWeekDays } = this.state
    let { endHour } = selectedTimeRange
    const { startHour } = selectedTimeRange
    const slots = {}
    endHour = endHour === 0 ? 24 : endHour
    for (let i = startHour; i < endHour; i += 1) {
      slots[`slot${i}`] = true
    }
    const weekday = {}
    selectedWeekDays.forEach(day => weekday[day] = true)
    const input = {
      timeTableRule: {
        startDate: moment(startDate).startOf('day').toISOString(),
        endDate: moment(endDate).startOf('day').toISOString(),
        ...slots,
        ...weekday
      }
    }
    await updateBatchSchedule({ batchId, input })
  }
  addSelectedWeekDays = (weekDay) => {
    const { selectedWeekDays } = this.state
    const newDays = [...selectedWeekDays]
    const isExist = newDays.find(day => day === weekDay)
    if (!isExist) this.setState({ selectedWeekDays: [...newDays, weekDay] })
    else {
      this.setState({
        selectedWeekDays: newDays.filter(day => day !== weekDay)
      })
    }
  }
  disableConfirm = () => {
    const { selectedTimeRange: { startHour, endHour },
      selectedDateRange: { startDate, endDate },
      selectedWeekDays } = this.state
    if ((!startDate && !endDate) ||
      (!startHour && !endHour) ||
      !selectedWeekDays.length) {
      return true
    }
    return false
  }
  getSlotLabel = (slotNumberString, isCapital = true) => {
    const slotNumber = Number(slotNumberString)
    let AM = 'AM'
    let PM = 'PM'
    if (!isCapital) {
      AM = 'am'
      PM = 'pm'
    }
    let startTime = ''
    let endTime = ''
    if (slotNumber < 12) {
      if (slotNumber === 0) {
        startTime = `12:00 ${AM}`
      } else {
        startTime = `${slotNumber}:00 ${AM}`
      }
      if (slotNumber === 11) {
        endTime = `12:00 ${PM}`
      } else {
        endTime = `${slotNumber + 1}:00 ${AM}`
      }
    } else if (slotNumber > 12) {
      startTime = `${slotNumber - 12}:00 ${PM}`
      if (slotNumber === 23) {
        endTime = `12:00 ${AM}`
      } else {
        endTime = `${slotNumber - 11}:00 PM`
      }
    } else {
      startTime = `12:00 ${PM}`
      endTime = `1:00 ${PM}`
    }
    return {
      startTime,
      endTime
    }
  }
  getSelectedSlotsStringArray = (slots = {}) => {
    const slotTimeStringArray = []
    Object.keys(slots).forEach(slot => {
      if (slot.includes('slot')) {
        if (slots[slot]) {
          slotTimeStringArray.push(slot)
        }
      }
    })
    return slotTimeStringArray
  }
  getSlotTime = (batchSession) => {
    const slotTimeStringArray = this.getSelectedSlotsStringArray(batchSession)
    if (slotTimeStringArray && slotTimeStringArray.length) {
      const slotNumber = slotTimeStringArray[0].split('slot')[1]
      const label = this.getSlotLabel(slotNumber)
      return label
    }
    return null
  }
  getTimeRangeFromSession = (bookingDate, session) => {
    bookingDate = new Date(bookingDate).toDateString()
    const startTime = `${bookingDate}, ${this.getSlotTime(session).startTime}`
    const endTime = `${bookingDate}, ${this.getSlotTime(session).endTime}`
    return { startTime, endTime }
  }
  renderSlotsModal = () => {
    const { modalVisible, selectedTimeRange,
      selectedDateRange, selectedWeekDays, timeValues } = this.state
    const { batchesData } = this.props
    const { startHour } = selectedTimeRange
    let { endHour } = selectedTimeRange
    let totalSlots = 0
    endHour = endHour === 0 ? 24 : endHour
    if (startHour === null || endHour === null || endHour < startHour) {
      totalSlots = 0
    } else {
      totalSlots = endHour - startHour
    }
    const { batchUpdatingStatus } = this.props
    return (
      <MainModal
        visible={modalVisible}
        onCancel={this.onModalClose}
        maskClosable
        bodyStyle={{ padding: 0 }}
        closable={false}
        width='650px'
        centered
        destroyOnClose
        footer={null}
      >
        <FlexContainer noPadding style={{ width: '100%' }}>
          <div style={{ padding: '0.5vw 1.5vw' }}>
            <h1>Schedule a Recurring Slot</h1>
            <h3 style={{ opacity: '0.7' }}>for {get(batchesData, 'code')}</h3>
            <CloseIcon onClick={this.onModalClose} />
          </div>
        </FlexContainer>
        <StyledDivider
          style={{ marginBottom: '1vw' }}
        />
        <FlexContainer
          noPadding
          justify='center'
          style={{ flexDirection: 'column', padding: '1vw' }}
        >
          <div style={divStyle}>
            <h3>Date</h3>
            <FlexContainer justify='flex-start' noPadding>
              <DatePicker
                onChange={(value) => {
                  const dateRange = { ...selectedDateRange, startDate: value }
                  this.setState({ selectedDateRange: dateRange })
                }}
                placeholder='Start Date'
                allowClear={false}
                value={selectedDateRange.startDate}
                disabledDate={(current) => current &&
                  current < new Date().setDate((new Date().getDate()) - 1)
                }
                format='DD MMMM YYYY'
                style={{ width: '100%', maxWidth: '128px' }}
              />
              <span style={{ margin: '0 8px' }}><strong>To</strong></span>
              <DatePicker
                onChange={(value) => {
                  const dateRange = { ...selectedDateRange, endDate: value }
                  this.setState({ selectedDateRange: dateRange })
                }}
                placeholder='End Date'
                allowClear={false}
                value={selectedDateRange.endDate}
                disabled={!selectedDateRange.startDate}
                disabledDate={(current) => (
                  current &&
                    current < new Date().setDate(
                      (new Date(selectedDateRange.startDate || new Date()).getDate()))
                )}
                format='DD MMMM YYYY'
                style={{ width: '100%', maxWidth: '128px' }}
              />
            </FlexContainer>
          </div>
          <div style={divStyle}>
            <h3>Timing</h3>
            <FlexContainer justify='flex-start' noPadding>
              <TimePicker
                format={TimePickerFormat}
                allowClear={false}
                value={timeValues.startTime}
                placeholder='Start'
                disabledHours={() => {
                  if (new Date().setHours(0, 0, 0, 0)
                    === new Date(selectedDateRange.startDate).setHours(0, 0, 0, 0)) {
                    return [...Array(new Date().getHours() + 1).keys()].slice(1)
                  }
                }}
                onChange={(value) => {
                  if (value && get(value, '_d')) {
                    const selectedRange = {
                      ...selectedTimeRange,
                      startHour: get(value, '_d').getHours(),
                      endHour: get(value, '_d').getHours() + 1
                    }
                    this.setState({
                      selectedTimeRange: selectedRange,
                      timeValues: {
                        startTime: value,
                        endTime: moment(value).add(1, 'hour')
                      }
                    })
                  }
                }}
              />
              <span style={{ margin: '0 8px' }}><strong>To</strong></span>
              <TimePicker
                format={TimePickerFormat}
                allowClear={false}
                value={timeValues.endTime}
                placeholder='End'
                disabled={selectedTimeRange.startHour === null}
                disabledHours={() =>
                  [...Array(selectedTimeRange.startHour + 1).keys()].slice(1)
                }
                onChange={(value) => {
                  const endTime = value
                  if (value && value._d) {
                    const selectedRange = {
                      ...selectedTimeRange,
                      endHour: get(value, '_d').getHours(),
                      startHour: get(value, '_d').getHours() - 1
                    }
                    value = get(value, '_d').getHours() === 0 ? 24 : get(value, '_d').getHours()
                    if (value > selectedTimeRange.startHour
                      && (value - selectedTimeRange.startHour) === 1) {
                      this.setState({
                        selectedTimeRange: selectedRange,
                        timeValues: {
                          startTime: moment(value).subtract(1, 'hour'),
                          endTime
                        }
                      })
                    }
                  }
                }}
              />
            </FlexContainer>
          </div>
          <div style={divStyle}>
            <h3>Select Days</h3>
            <FlexContainer noPadding justify='flex-start'>
              <>
                {weekDays.map(weekDay => (
                  <AddGradeButton
                    type={selectedWeekDays.includes(weekDay) ? 'primary' : ''}
                    onClick={() => this.addSelectedWeekDays(weekDay)}
                    shape='circle'
                    style={{
                      margin: '0 5px',
                      textTransform: 'capitalize'
                    }}
                  >
                    {weekDay.slice(0, 2)}
                  </AddGradeButton>
                ))}
              </>
            </FlexContainer>
          </div>
          <div style={{ ...divStyle, textAlign: 'center' }}>
            <h3>Total Slots Chosen: {totalSlots}</h3>
            <StyledDivider
              style={{ width: '100%' }}
            />
          </div>
          <FlexContainer style={{ width: '60%' }}>
            <SectionButton
              campaign
              onClick={this.onModalClose}
              style={{ margin: '0 10px' }}
              type='default'
            >Edit Details
            </SectionButton>
            <SectionButton
              campaign
              style={{ margin: '0 10px' }}
              type='primary'
              loading={batchUpdatingStatus && get(batchUpdatingStatus.toJS(), 'loading')}
              disabled={this.disableConfirm()}
              onClick={this.onConfirm}
            >Confirm Details
            </SectionButton>
          </FlexContainer>
        </FlexContainer>
      </MainModal>
    )
  }
  render() {
    const { fetchedEvents } = this.state
    const { batchesData } = this.props
    return (
      <>
        {this.renderSlotsModal()}
        <div style={{ maxWidth: '1000px', width: '100%', padding: '1.4vw' }}>
          <FullCalendar
            fetchedEvents={fetchedEvents}
            calendarHeight='600px'
            initialCalendarView='dayGridMonth'
            customButtons={{
              AddButton: {
                text: (
                  get(batchesData, 'allottedMentor') ? (
                    <SectionButton type='primary' onClick={() => this.setState({ modalVisible: true })}>
                      Add Slots<PlusOutlined style={{ fontSize: '1vw' }} />
                    </SectionButton>
                  ) : (
                    <Tooltip title='Please assign a mentor to add slots'>
                      <SectionButton disabled type='primary' onClick={() => this.setState({ modalVisible: true })}>
                        Add Slots<PlusOutlined style={{ fontSize: '1vw' }} />
                      </SectionButton>
                    </Tooltip>
                  )
                )
              }
            }}
            setModalData={() => null}
            onDateClick={() => null}
            customHeaderToolBar={{
              start: 'prev,next title today, timeGridWeek,dayGridMonth',
              right: 'AddButton'
            }}
          />
          <h3 style={{ marginTop: '1.2vw' }}>
            Total Slots Booked: {fetchedEvents.length}
          </h3>
        </div>
      </>
    )
  }
}

export default ScheduleTime
