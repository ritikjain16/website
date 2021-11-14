import { LoadingOutlined } from '@ant-design/icons'
import { notification, Spin } from 'antd'
import { format } from 'date-fns'
import { get } from 'lodash'
import moment from 'moment'
import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import updateMentorSession from '../../../../actions/mentorSessions/updateMentorSession'
import { ClockSVG } from '../../../../constants/icons'
import { MENTOR } from '../../../../constants/roles'
import MAX_SLOT_DIFFERENCE from '../../../../constants/slotDifference'
import getDataFromLocalStorage from '../../../../utils/extract-from-localStorage'
import getSlotDifference from '../../../../utils/getSlotDifference'
import { getSlotLabel } from '../../utils'
import Modal from '../Modal.styles'
import NotAssignedModalStyle from './NotAssignedModal.style'

const loadingIcon = <LoadingOutlined style={{ fontSize: 16, marginRight: '8px', color: '#FFF' }} spin />

const NotAssignedModal = ({
  isModalVisible = true,
  setModalVisibility,
  selectedSession,
  removeSlotsToLocalState
}) => {
  const [showDeleteOption, setShowDeleteOption] = useState(false)
  const [loading, setLoading] = useState(false)
  const closeModal = (shouldFetch = false) => {
    setShowDeleteOption(false)
    setLoading(false)
    setModalVisibility(false, shouldFetch)
  }

  const getSlotsFromTimeRange = (value) => {
    const startHour = new Date(get(selectedSession, 'startTime')).getHours()
    let endHour = new Date(get(selectedSession, 'endTime')).getHours()
    const slots = {}
    endHour = endHour === 0 ? 24 : endHour
    for (let i = startHour; i < endHour; i += 1) {
      slots[`slot${i}`] = value
    }
    return slots
  }
  const selectedSessionSlot = new Date(get(selectedSession, 'startTime')).getHours()
  const deleteBefore = moment(get(selectedSession, 'startTime')).subtract(MAX_SLOT_DIFFERENCE, 'hours')
  const deleteBeforeTime = moment(deleteBefore).get('hours')
  const liesWithIn12HoursRange = getSlotDifference(selectedSessionSlot, get(selectedSession, 'startTime'))
  const savedRole = getDataFromLocalStorage('login.role')
  const removeSlotFromSession = async () => {
    setLoading(true)
    const availabilityDate = new Date(new Date(get(selectedSession, 'startTime')).setHours(0, 0, 0, 0)).toISOString()
    const slots = getSlotsFromTimeRange(false)
    const input = {
      availabilityDate,
      ...slots
    }
    const removeSlot = getSlotsFromTimeRange(true)
    const slotToRemove = {
      availabilityDate,
      ...removeSlot
    }
    await updateMentorSession(input, get(selectedSession, 'record.id'))
      .then(res => {
        if (res && res.updateMentorSession) {
          notification.success({
            message: 'Session deleted successfully'
          })
          removeSlotsToLocalState(slotToRemove)
          closeModal(true)
        }
      })
    // if (mentorSessionObj) {
    // } else {
    //   deleteMentorSession(get(selectedSession, 'record.id')).then(res => {
    //     if (res && res.deleteMentorSession && res.deleteMentorSession.id) {
    //       removeSlotsToLocalState(res.deleteMentorSession)
    //       closeModal(true)
    //     }
    //   })
    // }
    /* below code is used to perform 12 hr`s check and restrict mentor to
    delete and session in the 12hr`s bracket */
    // if (savedRole === MENTOR) {
    //   getMentorMenteeSessionData(get(selectedSession,
    // 'record.availabilityDate')).then(response => {
    //     if (get(response, 'data.availableSlots', []).length > 0) {
    //       const availableSlots = get(response, 'data.availableSlots[0]')
    //       // getting slots value which is > 1
    //       const newAvailableSlots = getSelectedSlots(availableSlots, true)
    //       const slotExist = newAvailableSlots.find(slotObj =>
    // slotObj[`slot${selectedSessionSlot}`])
    //       if (!slotExist) {
    //         notification.warn({
    //           message: `Cannot delete session,
    //  as mentee is already alloted at slots(${ getSlotLabel(selectedSessionSlot).startTime })`
    //         })
    //       } else {
    //         deleteMentorSession(get(selectedSession, 'record.id')).then(res => {
    //           if (res && res.deleteMentorSession && res.deleteMentorSession.id) {
    //             removeSlotsToLocalState(res.deleteMentorSession)
    //             closeModal(true)
    //           }
    //         })
    //       }
    //     }
    //   })
    // } else {
    //   deleteMentorSession(get(selectedSession, 'record.id')).then(res => {
    //     if (res && res.deleteMentorSession && res.deleteMentorSession.id) {
    //       removeSlotsToLocalState(res.deleteMentorSession)
    //       closeModal(true)
    //     }
    //   })
    // }
  }
  const renderFooterAction = () => {
    if (showDeleteOption) {
      return (
        <div className='action-buttons'>
          <Modal.SecondaryButton
            onClick={() => closeModal()}
            style={{ marginRight: '10px' }}
          >
            Cancel
          </Modal.SecondaryButton>
          <Modal.DangerButton
            onClick={removeSlotFromSession}
            loading={loading}
          >
            {loading && <Spin indicator={loadingIcon} />}
            Delete Slot
          </Modal.DangerButton>
        </div>
      )
    }
    if (savedRole !== MENTOR || (savedRole === MENTOR && !liesWithIn12HoursRange)) {
      return (
        <NotAssignedModalStyle.EditText
        // cursor={savedRole === MENTOR && liesWithIn12HoursRange ? 'not-allowed' : 'pointer'}
          cursor='pointer'
          onClick={() => {
          setShowDeleteOption(true)
          // if (savedRole === MENTOR && !liesWithIn12HoursRange) {
          //   setShowDeleteOption(true)
          // } else if (savedRole !== MENTOR) {
          //   setShowDeleteOption(true)
          // }
        }}
        >Edit
        </NotAssignedModalStyle.EditText>
      )
    }
    return null
  }
  return (
    <Modal.WithBackdrop visible={isModalVisible} style={{ overflow: 'hidden' }}>
      <NotAssignedModalStyle.ModalBox visible={isModalVisible}>
        {/* Modal Header */}
        <NotAssignedModalStyle.Header>
          <Modal.FlexContainer style={{ alignItems: 'center', padding: 0 }}>
            <Modal.HeaderSessionIndicator
              bgColor='#8C61CB'
            />
            <NotAssignedModalStyle.PreHeaderText>
              Not Yet Assigned!
            </NotAssignedModalStyle.PreHeaderText>
            <Modal.CloseIcon theme='twoTone'
              onClick={() => closeModal()}
            />
          </Modal.FlexContainer>
        </NotAssignedModalStyle.Header>
        {/* Modal Contents */}
        <Modal.Content>
          <NotAssignedModalStyle.NotAssignedDetail justify='flex-start' >
            <Modal.StyledIcon theme='twoTone' component={ClockSVG} />
            {get(selectedSession, 'startTime') && format(get(selectedSession, 'startTime'), 'hh:mm a')}
            {get(selectedSession, 'endTime') && ` - ${format(get(selectedSession, 'endTime'), 'hh:mm a')}`}
            {' '} &bull; {' '}
            {get(selectedSession, 'startTime') && get(selectedSession, 'startTime').toDateString()}
          </NotAssignedModalStyle.NotAssignedDetail>
          <Modal.FlexContainer flexDirection='row' style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
          </Modal.FlexContainer>
        </Modal.Content>
        {/* Modal Footer */}
        <Modal.Footer>
          <NotAssignedModalStyle.NotAssignedDetail padding >
            {
              savedRole === MENTOR ? (
                <span>
                  Note: Cancel by {getSlotLabel(deleteBeforeTime, false).startTime}{' '}
                  on {moment(deleteBefore).format('ll')}
                </span>
              ) : (<div />)
            }
            {renderFooterAction()}
          </NotAssignedModalStyle.NotAssignedDetail>
        </Modal.Footer>
      </NotAssignedModalStyle.ModalBox>
    </Modal.WithBackdrop>
  )
}

export default withRouter(NotAssignedModal)
