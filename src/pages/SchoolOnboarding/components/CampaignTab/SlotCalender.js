import { notification, Select, Spin, Tooltip } from 'antd'
import { get, sortBy } from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchMentorSession } from '../../../../actions/SchoolOnboarding'
import FullCalendar from '../../../../components/FullCalendar'
import MainModal from '../../../../components/MainModal'
import MainTable from '../../../../components/MainTable'
import appConfig from '../../../../config/appConfig'
import offsetDate from '../../../../utils/date/date-offset'
import getSlotLabel from '../../../../utils/slots/slot-label'
import SessionTimeModalStyle from '../../../SessionManagement/components/SessionTimeModal/SessionTimeModal.style'
import {
  CloseIcon, FlexContainer, SectionButton, SlotsInfo,
  StyledButton,
  StyledCheckbox,
  StyledDivider, StyledSelect, UserIcon
} from '../../SchoolOnBoarding.style'

const { Option } = Select

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

class SlotCalender extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedMonth: months[moment().month()],
      selectedDate: new Date(offsetDate(new Date())).toISOString(),
      selectedSlots: [],
      modalVisible: false,
      slotToEdit: null,
      defaultSelectedSlots: []
    }
  }
  componentDidMount = async () => {
    const { timeTableRules } = this.props
    this.getSelectedSlots(timeTableRules)
    this.setState({ selectedDate: new Date(offsetDate(new Date())).toISOString() }, () =>
      fetchMentorSession(new Date(offsetDate(new Date())).toISOString()))
  }
  componentWillUnmount = () => {
    this.setState({ selectedDate: new Date(offsetDate(new Date())).toISOString() })
  }
  getSelectedSlots = (timeTableRule) => {
    const newTimeTableRule = []
    timeTableRule.forEach(rule => {
      let slotName = ''
      for (const property1 in rule) {
        if (property1.startsWith('slot')) {
          if (rule[property1] === true) {
            slotName = property1
          }
        }
      }
      const slotsData = {
        ...rule,
        slotName: `${slotName}${get(rule, 'bookingDate')}`,
        index: `${get(rule, 'bookingDate')}${slotName.split('slot')[1]}`
      }
      if (slotName) slotsData[`${slotName}`] = true
      newTimeTableRule.push(slotsData)
    })
    let defaultSlots = []
    newTimeTableRule.forEach(rule => {
      const isExist = defaultSlots.find(slot => get(slot, 'slotName') === get(rule, 'slotName'))
      if (!isExist) {
        defaultSlots.push({
          ...rule,
          default: true,
          allottedMentors: [{
            ...get(rule, 'allottedMentor'),
            mentorSessionConnectId: get(rule, 'mentorSession.id')
          }]
        })
      } else {
        isExist.allottedMentors.push({
          ...get(rule, 'allottedMentor'),
          mentorSessionConnectId: get(rule, 'mentorSession.id')
        })
        const newDefaultSlots = defaultSlots.filter((s) => get(s, 'slotName') !== get(isExist, 'slotName'))
        defaultSlots = [...newDefaultSlots, isExist]
      }
    })
    this.setState({
      defaultSelectedSlots: defaultSlots
    })
  }
  handleSlotClick = (slot, ind) => {
    const { selectedDate, selectedSlots } = this.state
    const isExist = selectedSlots.find(({ index }) => index === `${selectedDate}${ind}`)
    if (isExist) {
      const newSlots = selectedSlots.filter(({ index }) =>
        index !== `${selectedDate}${ind}`)
      this.setState({ selectedSlots: newSlots })
    } else {
      const selectSlot = {
        bookingDate: selectedDate,
        [`slot${ind}`]: true,
        mentors: get(slot, 'mentors'),
        index: `${selectedDate}${ind}`,
        allottedMentors: get(slot, 'mentors', []).length === 1 ? [get(slot, 'mentors[0]')] : [],
        // limit: get(slot, 'limit')
      }
      this.setState({
        selectedSlots: [...selectedSlots, selectSlot]
      })
    }
  }
  editSlotMentor = () => {
    const { slotToEdit, selectedSlots } = this.state
    if (get(slotToEdit, 'allottedMentors', []).length > 0) {
      const isExist = selectedSlots.find(({ index }) => index === get(slotToEdit, 'index'))
      if (isExist) {
        const newSlots = selectedSlots.filter(({ index }) =>
          index !== isExist.index)
        this.setState({
          selectedSlots: [...newSlots, slotToEdit],
          modalVisible: false,
          slotToEdit: null
        })
      }
      // if (get(slotToEdit, 'allottedMentors', []).length <= get(slotToEdit, 'limit')) {
      //   const isExist = selectedSlots.find(({ index }) => index === get(slotToEdit, 'index'))
      //   if (isExist) {
      //     const newSlots = selectedSlots.filter(({ index }) =>
      //       index !== isExist.index)
      //     this.setState({
      //       selectedSlots: [...newSlots, slotToEdit],
      //       modalVisible: false,
      //       slotToEdit: null
      //     })
      //   }
      // } else {
      //   notification.warn({
      //     message: `Maximum ${get(slotToEdit, 'limit')} mentors can be selected.`
      //   })
      // }
    } else {
      notification.warn({
        message: 'Please select a mentor'
      })
    }
  }
  deleteSelectedSlots = (indexVal) => {
    const { selectedSlots } = this.state
    const isExist = selectedSlots.find(({ index }) => index === indexVal)
    if (isExist) {
      const newSlots = selectedSlots.filter(({ index }) =>
        index !== isExist.index)
      this.setState({ selectedSlots: newSlots })
    }
  }
  isSlotSelected = (slotNumber) => {
    const { selectedDate, selectedSlots } = this.state
    const isExist = selectedSlots.find(({ index }) => index === `${selectedDate}${slotNumber}`)
    if (isExist) {
      return isExist[`slot${slotNumber}`] || false
    }
    return false
  }
  renderTimeSlots = () => {
    const { selectedDate, defaultSelectedSlots } = this.state
    const renderSlots = []
    const availabilitySlots =
      this.props.availabilitySessionSlots && this.props.availabilitySessionSlots.toJS()
    availabilitySlots.forEach((slots) => {
      Object.keys(slots).forEach(slot => {
        if (slot.includes('slot')) {
          const disableTime = (appConfig.timeSlots[slot.replace('slot', '')] <= Number(moment().format('HH'))) &&
            new Date(new Date(selectedDate).setHours(0, 0, 0, 0))
          === new Date(new Date().setHours(0, 0, 0, 0))
          if (slots[slot] >= 1
            // && get(slots, 'limit', 0) >= 1
            && get(slots, 'mentors', []).length > 0
            && !disableTime) {
            const slotNumber = slot.split('slot')[1]
            const isDefaultSlot = defaultSelectedSlots.find(({ index }) => index === `${selectedDate}${slotNumber}`)

            // disable past slots
            const isSlotDisabled = (appConfig.timeSlots[slotNumber] <= Number(moment().format('HH'))) &&
              moment(selectedDate).isSame(new Date(new Date().setHours(0, 0, 0, 0)))
            renderSlots.push(
              <SessionTimeModalStyle.Slot
                style={{
                  cursor: isSlotDisabled ? 'not-allowed' : 'pointer',
                  height: '65px',
                  width: '160px',
                  flexDirection: 'column'
                }}
                selected={get(isDefaultSlot, 'default') || this.isSlotSelected(appConfig.timeSlots[slot.replace('slot', '')])}
                onClick={() => isSlotDisabled ? null : this.handleSlotClick(slots, appConfig.timeSlots[slot.replace('slot', '')])}
              >
                {`${getSlotLabel(appConfig.timeSlots[slot.replace('slot', '')]).startTime}`}<br />
                <p
                  style={{
                    fontSize: '12px', marginTop: '5px', marginBottom: '0'
                  }}
                >Available Mentor : {get(slots, 'mentors', []).length}
                </p>
              </SessionTimeModalStyle.Slot>
            )
          }
        }
      })
    })
    if (renderSlots.length > 0) {
      return renderSlots
    }
    return <h3>No Slots Available</h3>
  }
  renderDateTablet = () => {
    const { selectedMonth, selectedDate } = this.state
    return (
      <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
        <FullCalendar
          calendarHeight='600px'
          initialCalendarView='dayGridMonth'
          customDateToNavigate={new Date(moment().month(selectedMonth))}
          customHeaderToolBar={{
            start: 'title',
            end: ''
          }}
          setModalData={() => (null)}
          showSelected
          fetchedEvents={[
            {
              allDay: false,
              title: moment(selectedDate).format('ll'),
              id: 123,
              date: new Date(selectedDate),
              backgroundColor: '#00ADE6',
            }
          ]}
          onDateClick={(info) => {
            if (moment(info.date).isSameOrAfter(moment().startOf('day'))) {
              if (new Date(info.date).toISOString() !== this.state.selectedDate) {
                this.setState({
                  selectedDate: new Date(info.date).toISOString()
                }, () => fetchMentorSession(new Date(info.date).toISOString()))
              }
            }
          }}
        />
      </div>
    )
  }
  closeMentorModal = () => {
    this.setState({ modalVisible: false, slotToEdit: null })
  }
  onSave = () => {
    const { selectedSlots, defaultSelectedSlots } = this.state
    const { onSaveClick } = this.props
    const mentorsId = []
    selectedSlots.forEach(slot => {
      if (get(slot, 'allottedMentors').length === 0) {
        mentorsId.push(false)
      }
    })
    if (mentorsId.length > 0) {
      notification.warn({
        message: 'Please select the mentor for the slots'
      })
    } else {
      const finalSlots = [...defaultSelectedSlots, ...selectedSlots]
      onSaveClick(finalSlots)
    }
  }
  onCheckMentor = (checked, mentor) => {
    const {
      slotToEdit
    } = this.state
    const newMentors = [...slotToEdit.allottedMentors]
    if (checked) {
      const isExist = newMentors.find(ment => get(ment, 'id') === get(mentor, 'id'))
      if (!isExist) {
        this.setState(prevState => ({
          slotToEdit: {
            ...prevState.slotToEdit,
            allottedMentors: [...newMentors, mentor]
          }
        }))
      }
    } else {
      const isExist = newMentors.find(ment => get(ment, 'id') === get(mentor, 'id'))
      if (isExist) {
        this.setState(prevState => ({
          slotToEdit: {
            ...prevState.slotToEdit,
            allottedMentors: newMentors.filter(ment => get(ment, 'id') !== get(mentor, 'id'))
          }
        }))
      }
    }
  }
  getSlotTime = (session) => {
    const slotTimeStringArray = this.getSelectedSlotsStringArray(session)
    if (slotTimeStringArray && slotTimeStringArray.length) {
      const slotNumber = slotTimeStringArray[0].split('slot')[1]
      const label = getSlotLabel(slotNumber)
      return label
    }
    return null
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
  renderMentors = () => {
    const { slotToEdit } = this.state
    const mentors = []
    get(slotToEdit, 'mentors', []).forEach(item =>
      mentors.push(
        <div key={item.id} style={{ width: '100%' }}>
          <StyledCheckbox
            style={{ margin: '1vw 0' }}
            onChange={(e) => this.onCheckMentor(e.target.checked, item)}
            checked={get(slotToEdit, 'allottedMentors').find(ment => get(ment, 'id') === get(item, 'id'))}
            id={item.id}
          />
          <label htmlFor={item.id} style={{ cursor: 'pointer' }}>
            {`${get(item, 'name')} 
            (${moment(slotToEdit.bookingDate).format('ll')}
            ${get(this.getSlotTime(slotToEdit), 'startTime')})
            `}
          </label>
          <br />
        </div>
      )
    )
    if (mentors.length > 0) {
      return (
        <div>
          {mentors}
          {/* <p>{get(slotToEdit, 'allottedMentors', []).length > get(slotToEdit, 'limit')
            &&
            <span style={{ fontSize: 'small', color: 'red' }}>
              Maximum {get(slotToEdit, 'limit')} mentors can be selected.
            </span>}
          </p> */}
        </div>
      )
    }
    return <h3>No Mentors Available</h3>
  }
  renderMentorModal = () => {
    const { modalVisible } = this.state
    return (
      <MainModal
        visible={modalVisible}
        onCancel={this.closeMentorModal}
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
            <h1>Choose Mentor</h1>
            <CloseIcon onClick={this.closeMentorModal} />
          </div>
        </FlexContainer>
        <StyledDivider style={{ marginBottom: '1vw' }} />
        <FlexContainer
          noPadding
          justify='center'
          style={{ flexDirection: 'column', paddingBottom: '1vw', width: '80%', margin: '0 auto' }}
        >
          {this.renderMentors()}
          <SectionButton
            type='primary'
            style={{ marginTop: '2vw' }}
            onClick={this.editSlotMentor}
          >
            Confirm Mentor<UserIcon />
          </SectionButton>
        </FlexContainer>
      </MainModal>
    )
  }
  renderSlotsInfo = () => {
    const { selectedSlots, defaultSelectedSlots } = this.state
    const renderSlotsInfo = []
    defaultSelectedSlots.forEach((slot) => {
      for (const property in slot) {
        if (property.startsWith('slot')) {
          if (slot[property] === true) {
            renderSlotsInfo.push(
              <SlotsInfo
                bgColor='#E6F7FD'
                style={{
                  border: '0.5px solid black',
                  borderLeft: 0,
                  marginBottom: '0.7vw',
                  justifyContent: 'flex-start',
                  cursor: 'not-allowed',
                  opacity: '0.7'
                }}
              >
                <SlotsInfo
                  bgColor='white'
                  style={{ width: '30%', border: '0.5px solid black', padding: '10px 0' }}
                >
                  {moment(slot.bookingDate).format('ll')}
                </SlotsInfo>
                <span style={{ margin: '0 15px' }}>
                  {getSlotLabel(property.replace('slot', '')).startTime}
                </span>
                {
                  get(slot, 'allottedMentors', []).length > 0 && (
                    <Tooltip title={get(slot, 'allottedMentors', []).map(ment => `${get(ment, 'name')}, `)}>
                      <SectionButton
                        type='primary'
                        disabled
                      >
                        View Mentors
                        <UserIcon />
                      </SectionButton>
                    </Tooltip>
                  )
                }
                <MainTable.ActionItem.IconWrapper>
                  <MainTable.ActionItem.DeleteIcon />
                </MainTable.ActionItem.IconWrapper>
              </SlotsInfo>
            )
          }
        }
      }
    })
    sortBy(selectedSlots, 'index').forEach((slot) => {
      for (const property in slot) {
        if (property.startsWith('slot')) {
          if (slot[property] === true) {
            renderSlotsInfo.push(
              <SlotsInfo
                bgColor='#E6F7FD'
                style={{
                  border: '0.5px solid black',
                  borderLeft: 0,
                  marginBottom: '0.7vw',
                  justifyContent: 'flex-start'
                }}
              >
                <SlotsInfo
                  bgColor='white'
                  style={{ width: '30%', border: '0.5px solid black', padding: '10px 0' }}
                >
                  {moment(slot.bookingDate).format('ll')}
                </SlotsInfo>
                <span style={{ margin: '0 15px' }}>
                  {getSlotLabel(property.replace('slot', '')).startTime}
                </span>
                {
                  get(slot, 'allottedMentors', []).length > 0 ? (
                    <Tooltip title={get(slot, 'allottedMentors', []).map(ment => `${get(ment, 'name')}, `)}>
                      <SectionButton
                        type='primary'
                        onClick={() => this.setState({ modalVisible: true, slotToEdit: slot })}
                      >
                        View Mentors
                        <UserIcon />
                      </SectionButton>
                    </Tooltip>
                  ) : (
                    <SectionButton
                      type='primary'
                      onClick={() => this.setState({ modalVisible: true, slotToEdit: slot })}
                    >
                      Choose Mentor
                      <UserIcon />
                    </SectionButton>
                  )
                }
                {/* <Tooltip title={`${get(slot, 'limit', 0)} slots available.`}>
                  <SectionButton
                    type='primary'
                    shape='circle'
                  >{get(slot, 'limit', 0)}
                  </SectionButton>
                </Tooltip> */}
                <MainTable.ActionItem.IconWrapper>
                  <MainTable.ActionItem.DeleteIcon onClick={() => this.deleteSelectedSlots(get(slot, 'index'))} />
                </MainTable.ActionItem.IconWrapper>
              </SlotsInfo>
            )
          }
        }
      }
    })
    return renderSlotsInfo
  }
  disableSave = () => {
    const { studentsPerBatch, selectedBatch } = this.props
    const { selectedSlots, defaultSelectedSlots } = this.state
    if (defaultSelectedSlots.length > 0) return false
    return (selectedSlots.length === 0
              || studentsPerBatch <= 0
              || selectedBatch.length === 0)
  }
  render() {
    const { selectedMonth, selectedDate } = this.state
    const { mentorSessionsFetchStatus } = this.props
    return (
      <>
        <FlexContainer justify='flex-end' style={{ width: '100%' }}>
          {this.renderMentorModal()}
          <StyledSelect
            value={selectedMonth}
            onChange={(value) => this.setState({ selectedMonth: value })}
          >
            {months.map(month => <Option value={month} >{month}</Option>)}
          </StyledSelect>
        </FlexContainer>
        {this.renderDateTablet()}
        <FlexContainer justify='space-between'
          style={{ display: 'grid', gridTemplateColumns: '55% 40%', width: '100%' }}
        >
          <FlexContainer justify='initial' style={{ flexWrap: 'wrap' }}>
            {
              mentorSessionsFetchStatus && get(mentorSessionsFetchStatus.toJS(), 'loading') ?
                (
                  <Spin />
                ) : (
                  <>
                    <div style={{ width: '100%' }} >Select Slots for {moment(selectedDate).format('ll')}</div>
                    {this.renderTimeSlots()}
                  </>
                )
            }
          </FlexContainer>
          <FlexContainer grade>
            <h1 style={{ width: '100%', marginBottom: '1vw' }}>Slots</h1>
            {this.renderSlotsInfo()}
          </FlexContainer>
        </FlexContainer>
        <FlexContainer style={{ width: '100%' }} justify='center'>
          <StyledButton
            disabled={this.disableSave()}
            type='primary'
            onClick={this.onSave}
          >Save Slot
          </StyledButton>
        </FlexContainer>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  mentorSessionsFetchStatus: state.data.getIn(['mentorSessions', 'fetchStatus', 'mentorSessions']),
  availabilitySessionSlots: state.data.getIn(['mentorSessions', 'data'])
})

SlotCalender.propTypes = {
  mentorSessionsFetchStatus: PropTypes.shape({}).isRequired,
  availabilitySessionSlots: PropTypes.arrayOf({}).isRequired,
  onSaveClick: PropTypes.func.isRequired,
  studentsPerBatch: PropTypes.number.isRequired,
  selectedBatch: PropTypes.arrayOf({}).isRequired
}

export default connect(mapStateToProps)(SlotCalender)
