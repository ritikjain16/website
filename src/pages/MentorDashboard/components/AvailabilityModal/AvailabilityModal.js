import React from 'react'
import { withRouter } from 'react-router-dom'
import { Checkbox, notification } from 'antd'
import { get, debounce } from 'lodash'
import getDataFromLocalStorage from '../../../../utils/extract-from-localStorage'
import addMentorSession from '../../../../actions/mentorSessions/addMentorSessions'
import addBulkMentorSession from '../../../../actions/mentorSessions/addBulkMentorSession'
import Styles from './AvailabilityModal.style'
import Modal from '../Modal.styles'
import { TekieAmethyst } from '../../../../constants/colors'
import { CalendarSvg } from '../../../../constants/icons'

const TimePickerFormat = 'hh a'

const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const shifts = [
  { label: 'Morning', description: '08:00 to 12:00', slots: ['slot8', 'slot9', 'slot10', 'slot11'] },
  { label: 'Afternoon', description: '12:00 to 16:00', slots: ['slot12', 'slot13', 'slot14', 'slot15'] },
  { label: 'Evening', description: '16:00 to 20:00', slots: ['slot16', 'slot17', 'slot18', 'slot19'] },
  { label: 'Night', description: '20:00 to 00:00', slots: ['slot20', 'slot21', 'slot22', 'slot23'] },
  { label: 'Midnight', description: '00:00 to 04:00', slots: ['slot0', 'slot1', 'slot2', 'slot3'] },
  { label: 'Early Morning', description: '04:00 to 08:00', slots: ['slot4', 'slot5', 'slot6', 'slot7'] },
]

const AvailabilityModal = ({
  isModalVisible = true,
  setModalVisibility,
  isMentorSessionsAdding,
  isMentorSessionsAdded,
  mentorSessionsAddStatus,
  mentorSessionsAddedFailure,
  addSlotsToLocalState,
  isAdminLoggedIn,
  match: URLMatch,
  mentors
}) => {
  const [isSlotTabActive, setIsSlotTabActive] = React.useState(true)
  const [isSlotRecurring, setIsSlotRecurring] = React.useState(false)
  const [selectedWeekDays, setSelectedWeekDays] = React.useState([])
  const [selectedShifts, setSelectedShifts] = React.useState([])
  const [selectedDateRange, setSelectedDateRange] =
    React.useState({ startDate: null, endDate: null })
  const [selectedTimeRange, setSelectedTimeRange] =
    React.useState({ startHour: null, endHour: null })
  const [totalSlots, setTotalSlots] = React.useState(0)
  const [selectedMentor, setSelectedMentor] = React.useState()

  React.useEffect(() => {
    if (mentorSessionsAddStatus && !get(mentorSessionsAddStatus.toJS(), 'loading')
      && get(mentorSessionsAddStatus.toJS(), 'success')) {
      notification.success({
        message: 'Session added successfully'
      })
    } else if (mentorSessionsAddStatus && !get(mentorSessionsAddStatus.toJS(), 'loading')
      && get(mentorSessionsAddStatus.toJS(), 'failure')) {
      const failureMessage = mentorSessionsAddedFailure && mentorSessionsAddedFailure.toJS()
      const error = get(get(failureMessage[0], 'error.errors[0]'), 'extensions.exception.name')
      if (error === 'SimilarDocumentAlreadyExistError') {
        notification.error({
          message: 'Session already booked on this date.'
        })
      } else {
        const errorObj = get(get(failureMessage[0], 'error.errors[0]'), 'message')
        notification.error({
          message: errorObj
        })
      }
    }
  }, [mentorSessionsAddStatus])

  React.useEffect(() => {
    const mentor = mentors.filter(el => el.id === URLMatch.params.mentorId)[0] || []
    if (Object.keys(mentor).length) {
      setSelectedMentor(`${mentor.name}-${mentor.id}`)
    }
  }, [mentors, URLMatch.params.mentorId])

  React.useEffect(() => {
    if (!isSlotTabActive) {
      const selectedSlots = []
      shifts.map(shift => {
        if (selectedShifts.includes(shift.label)) {
          selectedSlots.push(...shift.slots)
        }
      })
      setTotalSlots(selectedSlots.length)
      return
    }
    const { startHour } = selectedTimeRange
    let { endHour } = selectedTimeRange
    endHour = endHour === 0 ? 24 : endHour
    if (startHour === null || endHour === null || endHour < startHour) {
      return
    }
    setTotalSlots(endHour - startHour)
  }, [selectedTimeRange, selectedShifts])

  /** Utils */
  const resetFields = () => {
    setIsSlotRecurring(false)
    setSelectedTimeRange({ startHour: null, endHour: null })
    setSelectedDateRange({ startDate: null, endDate: null })
    setSelectedWeekDays([])
    setSelectedShifts([])
    setTotalSlots(0)
  }

  const addSelectedWeekDays = (weekDay) => {
    if (selectedWeekDays.includes(weekDay)) {
      setSelectedWeekDays(selectedWeekDays.filter(el => el !== weekDay))
      return
    }
    setSelectedWeekDays([...selectedWeekDays, weekDay])
  }

  const toggleTabs = (isSlotTab) => {
    setIsSlotTabActive(isSlotTab)
    resetFields()
  }

  const closeModal = (shouldFetch = false) => {
    resetFields()
    setModalVisibility(false, shouldFetch)
  }

  React.useEffect(() => {
    if (isMentorSessionsAdded) closeModal(true)
  }, [isMentorSessionsAdded])

  const checkIfSubmitBtnDisabled = () => {
    let isDisabled = false
    if (isAdminLoggedIn && !selectedMentor) {
      isDisabled = true
    }
    if (!isSlotTabActive) {
      if (!selectedDateRange.startDate || !selectedShifts.length
      || isSlotRecurring && (!selectedDateRange.endDate || !selectedWeekDays.length)) {
        isDisabled = true
      }
      return isDisabled
    }
    if (selectedTimeRange.startHour === null
      || selectedTimeRange.endHour === null || !selectedDateRange.startDate
      || isSlotRecurring && (!selectedDateRange.endDate || !selectedWeekDays.length)) {
      isDisabled = true
    }
    return isDisabled
  }

  /** Queries */

  const getSlotsFromTimeRange = () => {
    if (isSlotTabActive) {
      const { startHour } = selectedTimeRange
      let { endHour } = selectedTimeRange
      const slots = {}
      endHour = endHour === 0 ? 24 : endHour
      for (let i = startHour; i < endHour; i += 1) {
        slots[`slot${i}`] = true
      }
      return slots
    }
    let slots = {}
    shifts.forEach(shift => {
      if (selectedShifts.includes(shift.label)) {
        const additionalSlots = {}
        for (const slot of shift.slots) {
          additionalSlots[slot] = true
        }
        slots = { ...slots, ...additionalSlots }
      }
    })
    return slots
  }

  const getMentorId = () => {
    const savedId = getDataFromLocalStorage('login.id')
    if (isAdminLoggedIn) {
      return selectedMentor.split('-')[1]
    }
    return savedId
  }

  const addMentorSessionQuery = async () => {
    const slots = await getSlotsFromTimeRange()
    const mentorId = getMentorId()
    const { startDate } = selectedDateRange
    const input = {
      availabilityDate: new Date(new Date(startDate).setHours(0, 0, 0, 0)).toISOString(),
      sessionType: 'trial',
      ...slots
    }
    await addMentorSession(input, mentorId).then(res => {
      if (res && res.addMentorSession) {
        addSlotsToLocalState(input)
      }
    })
  }

  const addBulkMentorSessionsQuery = async () => {
    const mentorId = getMentorId()
    const { startDate, endDate } = selectedDateRange
    const slots = await getSlotsFromTimeRange()
    const weekDaysInput = {}
    for (const weekDay of selectedWeekDays) {
      weekDaysInput[weekDay] = true
    }
    const input = {
      userId: mentorId,
      timeTableRule: {
        startDate,
        endDate,
        ...slots,
        ...weekDaysInput
      }
    }
    await addBulkMentorSession(input)
  }

  const onConfirm = () => {
    if (!isMentorSessionsAdding) {
      if (isSlotRecurring) {
        addBulkMentorSessionsQuery()
        return
      }
      addMentorSessionQuery()
    }
  }

  /** Render Methods */
  const renderModalHeader = () => (
    <>
      <Styles.HeaderIcon>
        <Modal.Icon theme='twoTone'
          marginRight='0px'
          fillSvg={TekieAmethyst}
          component={CalendarSvg}
        />
      </Styles.HeaderIcon>
      <Styles.HeaderDetails>
        <Modal.HeaderTitle>
          Add Availibility
        </Modal.HeaderTitle>
        <Modal.HeaderDescription>
          Let Tekie know when you{'\''}re available for taking classes.
        </Modal.HeaderDescription>
      </Styles.HeaderDetails>
    </>
  )
  const renderTabs = () => (
    <>
      <Styles.Tab onClick={() => toggleTabs(true)} isActive={isSlotTabActive}>
        Slot
      </Styles.Tab>
      <Styles.Tab onClick={() => toggleTabs(false)} isActive={!isSlotTabActive}>
        Shift
      </Styles.Tab>
    </>
  )
  const renderDateTimeSection = () => (
    <>
      {/* Time Picker Section */}
      {isSlotTabActive && (
        <Modal.FlexContainer flexDirection='column' style={{ padding: '14px 20px 0px 0px' }}>
          <Styles.SecondaryText>Timings</Styles.SecondaryText>
          <Modal.FlexContainer style={{ padding: '0px', alignItems: 'center' }}>
            <Modal.CustomTimePicker
              use12Hours
              format={TimePickerFormat}
              hideDisabledOptions
              allowClear={false}
              placeholder='Start'
              disabledHours={() => {
                if (new Date().setHours(0, 0, 0, 0)
                  === new Date(selectedDateRange.startDate).setHours(0, 0, 0, 0)) {
                  return [...Array(new Date().getHours() + 1).keys()].slice(1)
                }
              }}
              onChange={(value) => {
                const selectedRange = { ...selectedTimeRange, startHour: get(value, '_d').getHours() }
                setSelectedTimeRange(selectedRange)
              }}
            />
            <Styles.SecondaryText style={{ padding: '8px' }}>to</Styles.SecondaryText>
            <Modal.CustomTimePicker
              use12Hours
              format={TimePickerFormat}
              hideDisabledOptions
              allowClear={false}
              placeholder='End'
              disabled={selectedTimeRange.startHour === null}
              disabledHours={() =>
                [...Array(selectedTimeRange.startHour + 1).keys()].slice(1)
              }
              onChange={(value) => {
                if (value && value._d) {
                  const selectedRange = { ...selectedTimeRange, endHour: get(value, '_d').getHours() }
                  value = get(value, '_d').getHours() === 0 ? 24 : get(value, '_d').getHours()
                  if (value > selectedTimeRange.startHour) {
                    setSelectedTimeRange(selectedRange)
                  }
                }
              }}
            />
          </Modal.FlexContainer>
        </Modal.FlexContainer>
      )}
      {/* Date Picker Section */}
      <Modal.FlexContainer flexDirection='column' style={{ padding: '14px 0px 0px 0px' }}>
        <Styles.SecondaryText>Date</Styles.SecondaryText>
        <Modal.FlexContainer style={{ padding: '0px', alignItems: 'center' }}>
          <Modal.CustomDatePicker
            onChange={(value) => {
              const dateRange = { ...selectedDateRange, startDate: value }
              setSelectedDateRange(dateRange)
            }}
            placeholder='Start Date'
            allowClear={false}
            value={selectedDateRange.startDate}
            disabledDate={(current) => current &&
              current < new Date().setDate((new Date().getDate()) - 1)
            }
            format='DD MMMM YYYY'
            style={{ width: '100%' }}
          />
          {isSlotRecurring && (
            <>
              <Styles.SecondaryText style={{ padding: '8px' }}>to</Styles.SecondaryText>
              <Modal.CustomDatePicker
                onChange={(value) => {
                  const dateRange = { ...selectedDateRange, endDate: value }
                  setSelectedDateRange(dateRange)
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
                style={{ width: '100%' }}
              />
            </>
          )}
        </Modal.FlexContainer>
      </Modal.FlexContainer>
    </>
  )
  const renderShiftContainer = () => (
    <>
      <Modal.FlexContainer flexDirection='column'>
        <Styles.SecondaryText>Select Shifts</Styles.SecondaryText>
        <Checkbox.Group
          onChange={(shiftsArr) => setSelectedShifts(shiftsArr)}
          value={selectedShifts}
        >
          <Styles.CustomSelectsContainer>
            {shifts.map(shift => (
              <Styles.CustomCheckboxContainer
                isSelected={selectedShifts.includes(shift.label)}
              >
                <Modal.CustomCheckbox value={shift.label}>
                  <Modal.FlexContainer flexDirection='column' style={{ padding: 0 }}>
                    <Styles.CustomCheckboxText>
                      {shift.label}
                    </Styles.CustomCheckboxText>
                    <Styles.CustomCheckboxText fontSize='12px' style={{ paddingTop: '8px' }}>
                      {shift.description}
                    </Styles.CustomCheckboxText>
                  </Modal.FlexContainer>
                </Modal.CustomCheckbox>
              </Styles.CustomCheckboxContainer>
            ))}
          </Styles.CustomSelectsContainer>
        </Checkbox.Group>
      </Modal.FlexContainer>
    </>
  )
  const renderRecurringWeekdaysContainer = () => (
    <>
      <Modal.FlexContainer flexDirection='column'>
        <Styles.SecondaryText>Repeat on</Styles.SecondaryText>
        <Styles.CustomSelectsContainer>
          {weekDays.map(weekDay => (
            <Styles.CustomWeekDaySelects
              onClick={() => addSelectedWeekDays(weekDay)}
              isSelected={selectedWeekDays.includes(weekDay)}
            >
              {weekDay.slice(0, 3)}
            </Styles.CustomWeekDaySelects>
          ))}
        </Styles.CustomSelectsContainer>
      </Modal.FlexContainer>
    </>
  )
  const renderModalFooter = () => (
    <Modal.FlexContainer style={{ alignItems: 'center', width: '100%', padding: 0 }}>
      <Styles.FooterText>
        Total slots {isSlotRecurring ? 'per day' : ''} : {totalSlots}
      </Styles.FooterText>
      <Modal.FlexContainer style={{ padding: 0 }}>
        <Modal.SecondaryButton
          onClick={() => closeModal()}
          style={{ marginRight: '10px' }}
        >
          Cancel
        </Modal.SecondaryButton>
        <Modal.PrimaryButton
          disabled={checkIfSubmitBtnDisabled()}
          loading={isMentorSessionsAdding}
          onClick={debounce(onConfirm, 500)}
        >
          {isMentorSessionsAdding && <Modal.Spinner />}
          Confirm
        </Modal.PrimaryButton>
      </Modal.FlexContainer>
    </Modal.FlexContainer>
  )
  const renderSelectMentorDropDown = () => (
    <Modal.Select
      value={selectedMentor}
      showSearch
      placeholder='Select Mentor'
      onChange={(value) => {
        setSelectedMentor(value)
      }}
    >
      {mentors.map(mentor => (
        <Modal.Option
          className='custom-selectOption'
          value={`${mentor.name}-${mentor.id}`}
        >
          {mentor.name}
        </Modal.Option>
      ))}
    </Modal.Select>
  )

  return (
    <Modal.WithBackdrop visible={isModalVisible}>
      <Modal.ModalBox visible={isModalVisible}>
        <Modal.CloseIcon theme='twoTone'
          onClick={() => closeModal()}
        />
        {/* Modal Header */}
        <Modal.Header>
          {renderModalHeader()}
        </Modal.Header>
        {/* Modal Contents */}
        <Modal.Content>
          <Styles.TabsContainer>
            {renderTabs()}
          </Styles.TabsContainer>
          {isAdminLoggedIn && (
            <Modal.FlexContainer style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Modal.ContentText>Add slots for</Modal.ContentText>
              {renderSelectMentorDropDown()}
            </Modal.FlexContainer>
          )}
          <Modal.FlexContainer style={{ justifyContent: 'space-between' }}>
            <Modal.ContentText>Is the slot recurring?</Modal.ContentText>
            <Styles.CustomSlider checked={isSlotRecurring}
              onChange={(checked) => setIsSlotRecurring(checked)}
            />
          </Modal.FlexContainer>
          <Modal.FlexContainer flexDirection='row' style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {renderDateTimeSection()}
          </Modal.FlexContainer>
          {!isSlotTabActive && renderShiftContainer()}
          {isSlotRecurring && renderRecurringWeekdaysContainer()}
        </Modal.Content>
        {/* Modal Footer */}
        <Modal.Footer>
          {renderModalFooter()}
        </Modal.Footer>
      </Modal.ModalBox>
    </Modal.WithBackdrop>
  )
}

export default withRouter(AvailabilityModal)
