import React from 'react'
import { Spin, Checkbox } from 'antd'
import { get, debounce } from 'lodash'
import { LoadingOutlined } from '@ant-design/icons'
import moment from 'moment'
import Styles from './RescheduleModal.style'
import Modal from '../Modal.styles'
import { TekieGreen } from '../../../../constants/colors'
import { ClassesSvg, RescheduleSvg } from '../../../../constants/icons'
import updateMentorSession from '../../../../actions/mentorSessions/updateMentorSession'
import addMentorSession from '../../../../actions/mentorSessions/addMentorSessions'
import fetchMentorSessions from '../../../../actions/mentorSessions/fetchMentorSessions'
import getDataFromLocalStorage from '../../../../utils/extract-from-localStorage'
import updateBatchSession from '../../../../actions/mentorSessions/updateBatchSessions'
import appConfig from '../../../../config/appConfig'
import updateMenteeSession from '../../../../actions/mentorSessions/updateMenteeSession'
import getIdArrForQuery from '../../../../utils/getIdArrForQuery'

const loadingIcon = <LoadingOutlined style={{ fontSize: 16, marginRight: '8px', color: '#FFF' }} spin />
const loadingIconSmall = <LoadingOutlined style={{ fontSize: 12, marginRight: '8px', color: '#333' }} spin />

const rescheduleReasons = [
  { label: 'Internet Issue', key: 'internetIssue' },
  { label: 'Zoom Issue', key: 'zoomIssue' },
  { label: 'Chrome Issue', key: 'chromeIssue' },
  { label: 'Power Cut', key: 'powerCut' },
  { label: 'Laptop Issue', key: 'laptopIssue' },
  { label: 'No Response And Did Not Turn Up', key: 'notResponseAndDidNotTurnUp' },
  { label: 'Turned Up But Left Abruptly', key: 'turnedUpButLeftAbruptly' },
  { label: 'Lead Not Verified Properly', key: 'leadNotVerifiedProperly' },
]

const TimePickerFormat = 'hh a'

const RescheduleModal = ({
  isModalVisible = false,
  setModalVisibility,
  selectedSession,
  prevMentorSession,
  isPrevMentorSessionsLoading,
  isMentorSessionsAdding,
  updateMentorSessionStatus,
  updateBatchSessionStatus,
  updateMenteeStatus,
  updateExistingLocalSessionData,
}) => {
  const [selectedDateValue, setSelectedDateValue] =
    React.useState(null)
  const [selectedReasons, setSelectedReasons] =
    React.useState([])
  const [selectedTimeRange, setSelectedTimeRange] =
    React.useState({ startHour: null, endHour: null })
  const [otherReason, setOtherReason] =
    React.useState('')
  const userId = getDataFromLocalStorage('login.id')
  const isLoading = isMentorSessionsAdding
    || get(updateMentorSessionStatus, 'loading')
    || get(updateBatchSessionStatus, 'loading')
    || get(updateMenteeStatus, 'loading')

  /** UseEffect Methods */
  React.useEffect(() => {
    if (get(selectedSession, 'startTime')) {
      setSelectedDateValue(moment(get(selectedSession, 'startTime')))
    }
  }, [selectedSession])
  React.useEffect(() => {
    if (selectedDateValue) {
      fetchMentorSessions(getIdArrForQuery([userId]),
        `{availabilityDate: "${new Date(
          new Date(selectedDateValue).setHours(0, 0, 0, 0)
        ).toISOString()}"},`, 'prevMentorSession')
    }
  }, [selectedDateValue])

  /** Utils */
  const resetFields = () => {
    setSelectedTimeRange({ startHour: null, endHour: null })
    setSelectedDateValue(null)
    setSelectedReasons([])
    setOtherReason('')
  }
  const closeModal = () => {
    resetFields()
    setModalVisibility(false)
  }
  const checkIfSubmitBtnDisabled = () => {
    let isDisabled = false
    if ((get(selectedSession, 'sessionType') !== 'batch' && selectedReasons.length < 1)
      || selectedTimeRange.endHour == null || selectedTimeRange.startHour == null
      || selectedDateValue === null
      || (selectedReasons.includes('other') && otherReason === '')
      || isPrevMentorSessionsLoading
    ) {
      isDisabled = true
    }
    return isDisabled
  }
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
  const setHours = (date) => new Date(date).setHours(0, 0, 0, 0)

  const getRescheduledReasons = () => {
    let reasons = ''
    selectedReasons.forEach((selectedReason) => {
      reasons += `${selectedReason}: true,`
    })
    if (otherReason) {
      reasons += `otherReasonForReschedule: true, comment: "${otherReason}",`
    }
    return reasons
  }

  /** Queries */
  const updateSessionsBasedOnType = async (mentorSessionRecord) => {
    const recordID = get(selectedSession, 'record.id', null)
    const bookingDate = new Date(setHours(selectedDateValue)).toISOString()
    const slots = getSlotsFromTimeRange()
    for (let i = 0; i < appConfig.timeSlots.length; i += 1) {
      if (!slots[`slot${i}`]) {
        slots[`slot${i}`] = false
      }
    }
    if (get(selectedSession, 'sessionType') === 'batch') {
      /** update Batch Session */
      await updateBatchSession(recordID, {
        bookingDate,
        ...slots,
      }, get(mentorSessionRecord, 'id')).then(res => {
        if (res) {
          updateExistingLocalSessionData({ ...slots, bookingDate },
            get(selectedSession, 'record'), 'event')
          setModalVisibility(false)
        }
      })
      return
    }
    /** update MMS Session */
    await updateMenteeSession(
      get(selectedSession, 'record.menteeSession.id', null),
      { bookingDate, ...slots },
      get(mentorSessionRecord, 'id'), recordID,
      `{sessionStatus: allotted,${getRescheduledReasons()}}`
    ).then(res => {
      if (res) {
        updateExistingLocalSessionData({ ...slots, bookingDate },
          get(selectedSession, 'record'), 'event')
        setModalVisibility(false)
      }
    })
  }
  const onConfirm = async () => {
    const slots = await getSlotsFromTimeRange()
    const availabilityDate = new Date(setHours(selectedDateValue)).toISOString()
    if (prevMentorSession && prevMentorSession.length === 0) {
      /** Add Mentor Session */
      const input = {
        availabilityDate,
        sessionType: get(selectedSession, 'sessionType', 'trial'),
        ...slots,
      }
      await addMentorSession(input, userId, get(selectedSession, 'courseId')).then(async res => {
        /** Update Batch/MMS Session */
        if (res && res.addMentorSession && res.addMentorSession.id) {
          await updateSessionsBasedOnType(res.addMentorSession)
        }
      })
    } else if (prevMentorSession && prevMentorSession.length > 0) {
      /** Update Mentor Session  */
      const input = {
        availabilityDate,
        ...slots,
      }
      await updateMentorSession(input, get(prevMentorSession[0], 'id')).then(async res => {
        /** Update Batch/MMS Session */
        if (res && res.updateMentorSession && res.updateMentorSession.id) {
          await updateSessionsBasedOnType(res.updateMentorSession)
        }
      })
    }
  }

  /** Render Methods */
  const renderModalHeader = () => (
    <>
      <Styles.HeaderIcon>
        <Modal.Icon theme='twoTone'
          marginRight='0px'
          fillSvg={TekieGreen}
          component={ClassesSvg}
        />
        <Modal.SecondaryIcon
          fillSvg={TekieGreen}
          component={RescheduleSvg}
        />
      </Styles.HeaderIcon>
      <Styles.HeaderDetails>
        <Modal.HeaderTitle>
          Reschedule
        </Modal.HeaderTitle>
        <Modal.HeaderDescription>
          Are you sure you want to reschedule {get(selectedSession, 'batchtype', '').toUpperCase()} Class?
        </Modal.HeaderDescription>
      </Styles.HeaderDetails>
    </>
  )
  const renderDateTimeSection = () => (
    <>
      {/* Time & Date Picker Section */}
      <Modal.FlexContainer flexDirection='column' style={{ padding: '0px' }}>
        <Modal.FlexContainer style={{ justifyContent: 'space-between', padding: '0px' }}>
          <Modal.ContentText>Propose a Time: </Modal.ContentText>
          {isPrevMentorSessionsLoading &&
            <Modal.ContentText style={{ fontSize: '12px' }}>
              <Spin indicator={loadingIconSmall} />
              Checking availability for...
            </Modal.ContentText>
          }
        </Modal.FlexContainer>
        <Modal.FlexContainer style={{ paddingTop: '12px', alignItems: 'center' }}>
          <Modal.CustomTimePicker
            use12Hours
            format={TimePickerFormat}
            allowClear={false}
            disabledHours={() => {
              if (new Date().setHours(0, 0, 0, 0)
                === new Date(selectedDateValue).setHours(0, 0, 0, 0)) {
                return [...Array(new Date().getHours() + 1).keys()].slice(1)
              }
            }}
            placeholder='Start'
            onChange={(value) => {
              const selectedRange = { ...selectedTimeRange, startHour: get(value, '_d').getHours() }
              setSelectedTimeRange(selectedRange)
            }}
          />
          <Styles.SecondaryText style={{ padding: '8px' }}>to</Styles.SecondaryText>
          <Modal.CustomTimePicker
            use12Hours
            format={TimePickerFormat}
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
          <Styles.SecondaryText style={{ padding: '8px' }}>on</Styles.SecondaryText>
          <Modal.CustomDatePicker
            onChange={(value) => {
              setSelectedDateValue(value)
            }}
            disabled={isPrevMentorSessionsLoading}
            placeholder='Start Date'
            allowClear={false}
            value={selectedDateValue}
            disabledDate={(current) => current &&
              current < new Date().setDate((new Date().getDate()) - 1)
            }
            format='DD MMMM YYYY'
            style={{ width: 'fit-content' }}
          />
        </Modal.FlexContainer>
      </Modal.FlexContainer>
    </>
  )
  const renderRescheduleReasonSection = () => (
    <Modal.FlexContainer flexDirection='column' style={{ padding: '0px' }}>
      <Modal.ContentText>Reason to Reschedule: </Modal.ContentText>
      <Modal.FlexContainer style={{ paddingTop: '12px', alignItems: 'center' }}>
        <Checkbox.Group
          onChange={(reasonsArr) => setSelectedReasons(reasonsArr)}
          value={selectedReasons}
          style={{ width: '100%' }}
        >
          {rescheduleReasons.map(({ label, key }) => (
            <Modal.CustomCheckbox
              style={{ padding: '10px 0px' }}
              justifyContent='flex-start'
              value={key}
              key={key}
            >
              <Styles.Text>{label}</Styles.Text>
            </Modal.CustomCheckbox>
          ))}
          <Modal.CustomCheckbox
            style={{ padding: '10px 0px' }}
            justifyContent='flex-start'
            value='other'
          >
            <Styles.Text>Other</Styles.Text>
          </Modal.CustomCheckbox>
          <Modal.CustomInput
            onChange={(e) => { setOtherReason(e.target.value) }}
            value={otherReason}
            disabled={!selectedReasons.includes('other')}
            placeholder='Mention your reason here'
            style={{ width: '100%', margin: '4px 0px 0px 16px' }}
          />
        </Checkbox.Group>
      </Modal.FlexContainer>
    </Modal.FlexContainer>
  )
  const renderModalFooter = () => (
    <Modal.FlexContainer
      style={{
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        padding: 0
      }}
    >
      <Modal.SecondaryButton
        onClick={closeModal}
        style={{ marginRight: '10px' }}
      >
        Cancel
      </Modal.SecondaryButton>
      <Modal.PrimaryButton
        disabled={checkIfSubmitBtnDisabled()}
        loading={isLoading}
        onClick={debounce(onConfirm, 500)}
      >
        {isLoading && <Spin indicator={loadingIcon} />}
        Confirm
      </Modal.PrimaryButton>
    </Modal.FlexContainer>
  )

  return (
    <Modal.WithBackdrop visible={isModalVisible}>
      <Modal.ModalBox visible={isModalVisible}>
        <Modal.CloseIcon theme='twoTone'
          onClick={closeModal}
        />
        {/* Modal Header */}
        <Modal.Header bgColor='#E7FFFC'>
          {renderModalHeader()}
        </Modal.Header>
        {/* Modal Contents */}
        <Modal.Content>
          <Modal.FlexContainer flexDirection='row' style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {renderDateTimeSection()}
          </Modal.FlexContainer>
          <Modal.FlexContainer flexDirection='column'>
            {get(selectedSession, 'sessionType') !== 'batch' && (
              renderRescheduleReasonSection()
            )}
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

export default RescheduleModal
