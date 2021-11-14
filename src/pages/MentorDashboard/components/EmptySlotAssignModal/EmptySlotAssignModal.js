import React from 'react'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import { get, debounce } from 'lodash'
import moment from 'moment'
import getDataFromLocalStorage from '../../../../utils/extract-from-localStorage'
import addMentorSession from '../../../../actions/mentorSessions/addMentorSessions'
import Modal from '../Modal.styles'
import { TekieAmethyst } from '../../../../constants/colors'
import { CalendarSvg } from '../../../../constants/icons'
import EmptySlotAssignModalStyle from './EmptySlotAssignModal.style'
import { getMentorSessionData } from '../../utils'
import updateMentorSession from '../../../../actions/mentorSessions/updateMentorSession'

const TimePickerFormat = 'hh a'

const EmptySlotAssignModal = ({
  isModalVisible = true,
  setModalVisibility,
  isMentorSessionsAdding,
  mentorSessionsAddStatus,
  mentorSessionsAddedFailure,
  addSlotsToLocalState,
  isAdminLoggedIn,
  match: URLMatch,
  mentors,
  sessionDetail,
  updateMentorSessionStatus
}) => {
  const [selectedDate, setselectedDate] =
    React.useState(null)
  const [selectedTimeRange, setSelectedTimeRange] =
    React.useState({ startHour: null, endHour: null })
  const [timeValues, setTimeValues] = React.useState({
    startTime: null,
    endTime: null
  })
  const [selectedMentor, setSelectedMentor] = React.useState()
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (get(sessionDetail, 'endTime') && get(sessionDetail, 'startTime')) {
      setSelectedTimeRange({
        startHour: moment(get(sessionDetail, 'startTime')).get('hours'),
        endHour: moment(get(sessionDetail, 'endTime')).get('hours')
      })
      setTimeValues({
        startTime: moment(get(sessionDetail, 'startTime')),
        endTime: moment(get(sessionDetail, 'endTime'))
      })
      setselectedDate(moment(get(sessionDetail, 'startTime')))
    }
  }, [sessionDetail])
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

  /** Utils */
  const resetFields = () => {
    setSelectedTimeRange({ startHour: null, endHour: null })
    setselectedDate(null)
    setTimeValues({ startTime: null, endTime: null })
    setSelectedMentor()
    setLoading(false)
  }

  const closeModal = (shouldFetch = false) => {
    resetFields()
    setModalVisibility(false, shouldFetch)
  }

  const checkIfSubmitBtnDisabled = () => {
    let isDisabled = false
    if (isAdminLoggedIn && !selectedMentor) {
      isDisabled = true
    }
    if (selectedTimeRange.startHour === null
      || selectedTimeRange.endHour === null || !selectedDate) {
      isDisabled = true
    }
    return isDisabled
  }

  /** Queries */

  const getSlotsFromTimeRange = () => {
    const { startHour } = selectedTimeRange
    let { endHour } = selectedTimeRange
    const slots = {}
    endHour = endHour === 0 ? 24 : endHour
    for (let i = startHour; i < endHour; i += 1) {
      slots[`slot${i}`] = true
    }
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
    setLoading(true)
    const slots = getSlotsFromTimeRange()
    const mentorId = getMentorId()
    const availabilityDate = new Date(new Date(selectedDate).setHours(0, 0, 0, 0)).toISOString()
    const input = {
      availabilityDate,
      sessionType: 'trial',
      ...slots
    }
    const slotsToUpdate = {
      availabilityDate,
      sessionType: 'trial',
      ...slots
    }
    const mentorSessionData = await getMentorSessionData(availabilityDate, mentorId)
    const mentorSessionObj = get(mentorSessionData, 'data.mentorSessions[0]', null)
    if (mentorSessionObj) {
      for (const property in mentorSessionObj) {
        if (property.startsWith('slot') && mentorSessionObj[property]) {
          input[property] = true
        }
      }
      await updateMentorSession(input, get(mentorSessionObj, 'id'))
        .then(res => {
          if (res && res.updateMentorSession) {
            notification.success({
              message: 'Session added successfully'
            })
            closeModal(true)
            addSlotsToLocalState({ ...slotsToUpdate, emptyId: get(sessionDetail, 'emptyId') })
          }
        })
    } else {
      await addMentorSession(input, mentorId).then(res => {
        if (res && res.addMentorSession) {
          closeModal(true)
          addSlotsToLocalState({ ...input, emptyId: get(sessionDetail, 'emptyId') })
        }
      })
    }
  }

  const onConfirm = () => {
    if (!isMentorSessionsAdding || (updateMentorSessionStatus && !get(updateMentorSessionStatus.toJS(), 'loading'))) {
      addMentorSessionQuery()
    }
  }

  /** Render Methods */
  const renderModalHeader = () => (
    <>
      <EmptySlotAssignModalStyle.HeaderIcon>
        <Modal.Icon theme='twoTone'
          marginRight='0px'
          fillSvg={TekieAmethyst}
          component={CalendarSvg}
        />
      </EmptySlotAssignModalStyle.HeaderIcon>
      <EmptySlotAssignModalStyle.HeaderDetails>
        <Modal.HeaderTitle>
          Add Availibility
        </Modal.HeaderTitle>
        <Modal.HeaderDescription>
          Let Tekie know when you{'\''}re available for taking classes.
        </Modal.HeaderDescription>
      </EmptySlotAssignModalStyle.HeaderDetails>
    </>
  )
  const renderDateTimeSection = () => (
    <>
      <Modal.FlexContainer flexDirection='column' style={{ padding: '14px 20px 0px 0px' }}>
        <EmptySlotAssignModalStyle.SecondaryText>Timings</EmptySlotAssignModalStyle.SecondaryText>
        <Modal.FlexContainer style={{ padding: '0px', alignItems: 'center' }}>
          <Modal.CustomTimePicker
            use12Hours
            format={TimePickerFormat}
            hideDisabledOptions
            allowClear={false}
            value={timeValues.startTime}
            placeholder='Start'
            disabledHours={() => {
                if (new Date().setHours(0, 0, 0, 0)
                  === new Date(selectedDate.startDate).setHours(0, 0, 0, 0)) {
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
                const newTimeValue = {
                  startTime: value,
                  endTime: moment(value).add(1, 'hour')
                }
                setSelectedTimeRange(selectedRange)
                setTimeValues(newTimeValue)
              }
            }}
          />
          <EmptySlotAssignModalStyle.SecondaryText style={{ padding: '8px' }}>
            to
          </EmptySlotAssignModalStyle.SecondaryText>
          <Modal.CustomTimePicker
            use12Hours
            format={TimePickerFormat}
            hideDisabledOptions
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
                  setSelectedTimeRange(selectedRange)
                  setTimeValues({
                    startTime: moment(value).subtract(1, 'hour'),
                    endTime
                  })
                }
              }
            }}
          />
        </Modal.FlexContainer>
      </Modal.FlexContainer>
      <Modal.FlexContainer flexDirection='column' style={{ padding: '14px 0px 0px 0px' }}>
        <EmptySlotAssignModalStyle.SecondaryText>
          Date
        </EmptySlotAssignModalStyle.SecondaryText>
        <Modal.FlexContainer style={{ padding: '0px', alignItems: 'center' }}>
          <Modal.CustomDatePicker
            onChange={(value) => {
              setselectedDate(value)
            }}
            placeholder='Start Date'
            allowClear={false}
            value={selectedDate}
            disabledDate={(current) => current &&
              current < new Date().setDate((new Date().getDate()) - 1)
            }
            format='DD MMMM YYYY'
            style={{ width: '100%' }}
          />
        </Modal.FlexContainer>
      </Modal.FlexContainer>
    </>
  )

  const renderModalFooter = () => (
    <Modal.FlexContainer style={{ alignItems: 'center', width: '100%', padding: 0, justifyContent: 'flex-end' }}>
      <Modal.SecondaryButton
        onClick={() => closeModal()}
        style={{ marginRight: '10px' }}
      >
          Cancel
      </Modal.SecondaryButton>
      <Modal.PrimaryButton
        disabled={checkIfSubmitBtnDisabled()}
        loading={loading}
        onClick={debounce(onConfirm, 500)}
      >
        {loading && <Modal.Spinner />}
          Confirm
      </Modal.PrimaryButton>
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
          {isAdminLoggedIn && (
            <Modal.FlexContainer style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Modal.ContentText>Add slots for</Modal.ContentText>
              {renderSelectMentorDropDown()}
            </Modal.FlexContainer>
          )}
          <Modal.FlexContainer flexDirection='row' style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {renderDateTimeSection()}
          </Modal.FlexContainer>
        </Modal.Content>
        {/* Modal Footer */}
        <Modal.Footer>
          {renderModalFooter()}
        </Modal.Footer>
      </Modal.ModalBox>
    </Modal.WithBackdrop>
  )
}

export default withRouter(EmptySlotAssignModal)
