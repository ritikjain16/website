import React from 'react'
import { get, sortBy } from 'lodash'
import { Divider, message, notification, Tooltip } from 'antd'
import { format } from 'date-fns'
import moment from 'moment'
import { getDuration } from '../../../utils/time'
import updateMentorMenteeSession from '../../../actions/mentorSessions/updateMentorMenteeSessions'
import updateBatchSession from '../../../actions/mentorSessions/updateBatchSessions'
import ClassDetailsModalStyle from './ClassDetailsModal.style'
import Modal from './Modal.styles'
import { TekieAmethyst } from '../../../constants/colors'
import { ClockSVG, TypeSVG, RatioSVG, BatchSVG, StartClassSvg, FeedBackSvg, clipboardSvg, UploadSvg, EditSvg, StudentsSvg, ClassesSvg, AttendanceSvg, RescheduleSuccessSvg } from '../../../constants/icons'
import { getSlotTime, withHttps } from '../utils'
import sendTransactionalMessage from '../../../actions/sessions/sendTransactionalMessage'
import fetchSessionLogs from '../../../actions/mentorSessions/fetchSessionLogs'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'
import AttendanceStatus from '../../../constants/attendanceStatus'
import updateSessionLog from '../../../actions/mentorSessions/updateSessionLog'

const classDetailsModal = ({
  isModalVisible,
  setModalVisibility,
  modalData,
  updateSessionStatus,
  updateBatchSessionStatus,
  updateExistingLocalSessionData,
  isAdminLoggedIn,
  locationParams,
  sessionTypeFilter,
  activeAvailabilityDateGte,
  history,
}) => {
  /* This is just for testing on staging env, Do not change! */
  const [startConstraintCounter, setStartConstraintCounter] = React.useState(0)
  /* END */
  const [startClassConstraints, setStartClassConstraints] = React.useState({
    beforeTimeCheck: { minutes: 10 },
    afterTimeCheck: { minutes: 45 }
  })
  const [sessionRecordingLinkInput, setSessionRecordingLinkInput] = React.useState(null)
  const [sessionMeetingLink, setSessionMeetingLink] = React.useState(null)
  const [sendSessionLink, setSendSessionLink] = React.useState(false)
  const [sendLinkBlockActive, setSendLinkBlockActive] = React.useState(false)
  const [sessionLogData, setSessionLogData] = React.useState(null)
  const isSessionUpdating = get(updateSessionStatus, 'loading') || get(updateBatchSessionStatus, 'loading')
  const isFeedbackSubmitted = get(modalData, 'record.isFeedbackSubmitted', false)
    || get(modalData, 'isFeedbackSubmitted', false)
  const hasSessionRescheduled = get(modalData, 'record.hasRescheduled', false)
    || get(modalData, 'hasRescheduled', false)
  React.useEffect(() => {
    setSendLinkBlockActive(false)
    setSessionMeetingLink(null)

    const videoLink = get(modalData, 'sessionRecordingLink')
    setSessionRecordingLinkInput(videoLink)

    const meetingLink = get(modalData, 'mentorProfile.profile.sessionLink', null)
    setSessionMeetingLink(meetingLink)

    setSendSessionLink(get(modalData, 'record.sendSessionLink', false))
  }, [modalData])

  /** Utils  */
  const copyLink = () => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(get(modalData, 'sessionRecordingLink')).then(() => {
        message.success('Copied!')
      })
    }
  }

  const getSessionType = () => {
    const sessionType = get(modalData, 'sessionType')
    if (get(modalData, 'isB2B2CTrial', false)) {
      return 'DEMO'
    }
    if (sessionType === 'batch') {
      return 'PAID'
    }
    if (sessionType === 'trial') {
      return 'DEMO'
    }
    return sessionType
  }

  const getAttendanceOrStudentData = () => {
    const totalStudents = get(modalData, 'students')
    if (get(modalData, 'recordType') === 'mentorMenteeSession') {
      return get(modalData, 'studentName') || 1
    }
    if (get(modalData, 'sessionStatus') !== 'completed') {
      return totalStudents
    }
    let studentsPresent = 0
    if (get(modalData, 'record.attendance')) {
      get(modalData, 'record.attendance').map(attendance => {
        if (get(attendance, 'status') === AttendanceStatus.PRESENT) {
          studentsPresent += 1
        }
      })
    }
    return `${studentsPresent}/${totalStudents}`
  }

  /** Queries */
  const getInputObject = (queryType) => {
    const input = {}
    switch (queryType) {
      case 'Link Sent':
        input.sendSessionLink = true
        break
      case 'Start Class':
        input.sessionStatus = 'started'
        break
      case 'End Class':
        input.sessionStatus = 'completed'
        break
      case 'Upload Link':
        input.sessionRecordingLink = sessionRecordingLinkInput
        break
      default:
        break
    }
    return input
  }

  const updateExistingSessions = async (queryType, fromSessionLogs = false) => {
    let shouldUpdate = false
    const input = await getInputObject(queryType)
    const sessionId = get(modalData, 'record.id')
    const recordType = get(modalData, 'recordType', null)
    if (fromSessionLogs) {
      await updateSessionLog(sessionId, input).then(res => {
        if (res.updateSessionLog && res.updateSessionLog.id) {
          notification.success({
            message: 'Recording Uploaded Successfully!'
          })
          shouldUpdate = true
        }
      })
    }
    if (recordType === 'batchSession') {
      await updateBatchSession(sessionId, input).then(res => {
        if (res.updateBatchSession && res.updateBatchSession.id) {
          shouldUpdate = true
        }
      })
    } else if (recordType === 'mentorMenteeSession' && !fromSessionLogs) {
      await updateMentorMenteeSession(sessionId, input, 'updateMentorSession').then(res => {
        if (res.updateMentorMenteeSession && res.updateMentorMenteeSession.id) {
          shouldUpdate = true
        }
      })
    }
    if (shouldUpdate) {
      if (queryType !== 'Link Sent') {
        setModalVisibility('isClassDetailsModalVisible', false)
      }
      updateExistingLocalSessionData(input, get(modalData, 'record'))
    }
  }

  const getClassFeedbackRoute = () => {
    const { mentorId } = locationParams
    if (mentorId) {
      return `/mentorDashboard/${mentorId}/classFeedback/${get(modalData, 'record.id')}`
    }
    return `/mentorDashboard/classFeedback/${get(modalData, 'record.id')}`
  }

  const checkIfSessionB2CAndDemo = () => (!isAdminLoggedIn && getSessionType() === 'DEMO' && ['b2c', 'B2C'].includes(get(modalData, 'batchtype')))

  const checkIfSessionB2B2CAndDemo = () => (!isAdminLoggedIn && getSessionType() === 'DEMO' && ['b2b2c', 'B2B2C'].includes(get(modalData, 'batchtype')))

  const checkIfStartClassActionAllowed = () => {
    if (!isAdminLoggedIn) {
      const beforeTimeCheck = moment(get(modalData, 'startTime')).subtract(startClassConstraints.beforeTimeCheck)
      const afterTimeCheck = moment(get(modalData, 'startTime')).add(startClassConstraints.afterTimeCheck)
      if (moment().isBetween(beforeTimeCheck, afterTimeCheck)) {
        return true
      }
      return false
    }
    return true
  }

  /**
   * For now reschedule is disabled for all Classes!
   */
  const checkIfSessionRescheduleAllowed = () => false

  const checkIfEndSessionAllowed = () => {
    if (checkIfSessionB2CAndDemo()) {
      if (isFeedbackSubmitted && hasSessionRescheduled) {
        return false
      }
      return true
    }
    return true
  }

  const checkIfAttendanceSubmitted = () => {
    if (get(modalData, 'sessionType') === 'batch') {
      if (get(modalData, 'record.attendance') && get(modalData, 'record.attendance').length > 0) {
        let attendanceCompleted = true
        get(modalData, 'record.attendance', []).forEach(attendance => {
          if (get(attendance, 'status') === AttendanceStatus.NOTASSIGNED) {
            attendanceCompleted = false
          }
        })
        return attendanceCompleted
      }
      return true
    }
    return true
  }

  React.useEffect(() => {
    setSessionLogData(null)
    if (checkIfSessionB2CAndDemo() && get(modalData, 'documentType') !== 'rescheduled'
      && get(modalData, 'recordType') !== 'notAssigned') {
      const clientId = get(modalData, 'record.menteeSession.user.id', get(modalData, 'record.client.id', null))
      fetchSessionLogs(
        getIdArrForQuery([get(modalData, 'mentorProfile.id')]),
        `{client_some: { id: "${clientId}" }}`,
        ['deleteMentorMenteeSession'],
        'selectedSessionLogs'
      ).then(res => {
        const arrayPositionToDisplay = get(modalData, 'documentType') === 'demoSession' ? 2 : 1
        if (res && res.sessionLogs) {
          const sortedLogs = sortBy(res.sessionLogs, ['createdAt'])
          if (sortedLogs && sortedLogs.length) {
            setSessionLogData(sortedLogs[sortedLogs.length - arrayPositionToDisplay])
          } else {
            setSessionLogData(null)
          }
          return
        }
        setSessionLogData(null)
      })
    }
  }, [modalData])
  /** Render Methods */
  const renderClassDetails = ({ type, value, icon }) => (
    <ClassDetailsModalStyle.ContentClassDetail>
      <ClassDetailsModalStyle.Icon theme='twoTone'
        component={icon}
      />
      <span className='classDetailsText'>{type}</span>
      <ClassDetailsModalStyle.Text>{ value }</ClassDetailsModalStyle.Text>
    </ClassDetailsModalStyle.ContentClassDetail>
  )
  const renderFooterActionsBasedOnSessionStatus = (sessionStatus) => {
    switch (sessionStatus) {
      case 'allotted':
        return (
          <>
            {checkIfStartClassActionAllowed() && (
              <ClassDetailsModalStyle.FlexRow
                justifyContent='space-between'
                style={{
                  marginTop: 0, flexWrap: `${checkIfSessionB2CAndDemo() ? 'nowrap' : ''}`
                }}
              >
                <ClassDetailsModalStyle.FooterText>
                  Do you want to start the class?
                </ClassDetailsModalStyle.FooterText>
                {checkIfSessionB2CAndDemo() && (
                  <Modal.SecondaryButton
                    style={{
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      marginRight: 12,
                      placeItems: 'center',
                      flexDirection: 'row'
                    }}
                    disabled={sendSessionLink}
                    onClick={async () => {
                      if (sessionMeetingLink) {
                        sendTransactionalMessage(
                          get(modalData, 'record.menteeSession.user.id'),
                          sessionMeetingLink,
                          'sendSessionLink',
                          get(modalData, 'record.id')
                        )
                        await updateExistingSessions('Link Sent')
                        setSendSessionLink(true)
                      } else {
                        setSendLinkBlockActive(true)
                      }
                    }}
                  >
                    <Modal.StyledIcon
                      component={ClassesSvg}
                      fillSvg={sendSessionLink ? '#CCCCCC' : TekieAmethyst}
                    />
                    {sendSessionLink ? 'Link Sent' : 'Send Link'}
                  </Modal.SecondaryButton>
                )}
                <Modal.PrimaryButton
                  style={{ whiteSpace: 'nowrap' }}
                  loading={isSessionUpdating}
                  onClick={() => {
                    if (checkIfStartClassActionAllowed()) {
                      if (sessionMeetingLink &&
                        (checkIfSessionB2CAndDemo() || checkIfSessionB2B2CAndDemo())) {
                        window.open(withHttps(sessionMeetingLink), '_blank')
                      }
                      updateExistingSessions('Start Class')
                    }
                  }}
                >
                  {isSessionUpdating ?
                    <Modal.Spinner /> :
                    <Modal.StyledIcon component={StartClassSvg} fillSvg='#FFF' />}
                  Start Class
                </Modal.PrimaryButton>
              </ClassDetailsModalStyle.FlexRow>
            )}
          </>
        )
      case 'started':
        return (
          <>
            {(get(modalData, 'sessionType') === 'batch' && getAttendanceOrStudentData() > 0) && (
              <ClassDetailsModalStyle.FooterText>
                Please take attendance before ending the class.
              </ClassDetailsModalStyle.FooterText>
            )}
            <ClassDetailsModalStyle.FlexRow justifyContent='space-between'>
              {(get(modalData, 'sessionType') === 'batch' && getAttendanceOrStudentData() > 0) && (
                <Modal.ButtonOutline
                  onClick={() => {
                    setModalVisibility('isClassDetailsModalVisible', false)
                    setModalVisibility('isAttendanceModalVisible', true)
                  }}
                >
                  Take Attendance
                </Modal.ButtonOutline>
              )}
              <ClassDetailsModalStyle.ContentText fontSize='12px' style={{ padding: 0, display: 'flex', alignItems: 'center' }}>
                <ClassDetailsModalStyle.Icon theme='twoTone' component={ClockSVG} />
                Class Duration: {getDuration(get(modalData, 'record.sessionStartDate'),
                  new Date())}
              </ClassDetailsModalStyle.ContentText>
              {checkIfEndSessionAllowed() && (
                <Tooltip
                  overlayClassName='custom-ant-tooltip-inner'
                  title={checkIfAttendanceSubmitted() ? '' : 'Please update attendance first.'}
                  placement='top'
                >
                  <div>
                    <Modal.PrimaryButton
                      loading={isSessionUpdating}
                      disabled={!checkIfAttendanceSubmitted()}
                      onClick={() => {
                        if (checkIfSessionB2CAndDemo()) {
                          if (!get(modalData, 'record.isFeedbackSubmitted', false) &&
                          !get(modalData, 'isFeedbackSubmitted', false)) {
                            history.push({
                              pathname: getClassFeedbackRoute(),
                              state: {
                                modalData,
                                sessionTypeFilter,
                                activeAvailabilityDateGte
                              }
                            })
                            return
                          }
                        }
                        updateExistingSessions('End Class')
                      }}
                    >
                      {isSessionUpdating ?
                        <Modal.Spinner /> :
                        <Modal.StyledIcon component={StartClassSvg} fillSvg='#FFF' />}
                      End Class
                    </Modal.PrimaryButton>
                  </div>
                </Tooltip>
              )}
            </ClassDetailsModalStyle.FlexRow>
          </>
        )
      case 'completed':
        return (
          <>
            {(get(modalData, 'sessionType') !== 'batch' && get(modalData, 'record.topic.order') === 1) && (
              <ClassDetailsModalStyle.FlexRow justifyContent='space-between'>
                {get(modalData, 'record.isFeedbackSubmitted', false)
                  ? <div /> : (
                    <ClassDetailsModalStyle.FooterText>
                      Please give feedback for the class
                      <ClassDetailsModalStyle.ContentText fontSize='12px'>
                        Class is unaccounted until feedback is provided
                      </ClassDetailsModalStyle.ContentText>
                    </ClassDetailsModalStyle.FooterText>
                )}
                <Modal.PrimaryLink
                  to={{
                    pathname: getClassFeedbackRoute(),
                    state: {
                      modalData,
                      sessionTypeFilter,
                      activeAvailabilityDateGte
                    }
                  }}
                >
                  <Modal.StyledIcon
                    component={FeedBackSvg}
                    fillSvg='#FFF'
                  />
                  {get(modalData, 'record.isFeedbackSubmitted', false)
                    ? 'View Feedback' : 'Give Feedback'}
                </Modal.PrimaryLink>
              </ClassDetailsModalStyle.FlexRow>
            )}
          </>
        )
      default:
        break
    }
  }

  const renderSessionDateAndSlot = (sessionData, iconComponent, style = {}) => (
    <div style={style}>
      <ClassDetailsModalStyle.Icon theme='twoTone' component={iconComponent} />
      {get(sessionData, 'startTime') && format(get(sessionData, 'startTime'), 'hh:mm a')}
      {get(sessionData, 'endTime') && ` - ${format(get(sessionData, 'endTime'), 'hh:mm a')}`}
      {' '} &bull; {' '}
      {get(sessionData, 'startTime') && get(sessionData, 'startTime').toDateString()}
    </div>
  )

  const getSessionLogTimeAndSlot = () => {
    const bookingDate = new Date(get(sessionLogData, 'sessionDate')).toDateString()
    const startTime = `${bookingDate}, ${get(getSlotTime(sessionLogData, false), 'startTime')}`
    const endTime = `${bookingDate}, ${get(getSlotTime(sessionLogData, false), 'endTime')}`
    return { startTime: new Date(startTime), endTime: new Date(endTime) }
  }

  const renderHeaderSection = () => (
    <>
      <ClassDetailsModalStyle.Header bgColor={`${get(modalData, 'bgMuted')}`}>
        <ClassDetailsModalStyle.FlexContainer>
          <ClassDetailsModalStyle.HeaderSessionIndicator
            bgColor={`${get(modalData, 'bgColor')}`}
            onClick={() => {
              if (process.env.REACT_APP_NODE_ENV === 'staging' && startConstraintCounter <= 4) {
                if (startConstraintCounter >= 4) {
                  setStartClassConstraints({
                    beforeTimeCheck: { days: 999999 },
                    afterTimeCheck: { days: 999999 }
                  })
                } else {
                  setStartConstraintCounter(startConstraintCounter + 1)
                }
              }
            }}
          />
          <ClassDetailsModalStyle.PreHeaderText>
            {get(modalData, 'batchtype')}
          </ClassDetailsModalStyle.PreHeaderText>
          <ClassDetailsModalStyle.HeaderTag
            bgColor={getSessionType() === 'DEMO' ? '#333333' : null}
          >
            {getSessionType()}
          </ClassDetailsModalStyle.HeaderTag>
          <ClassDetailsModalStyle.CloseIcon theme='twoTone'
            onClick={() => setModalVisibility('isClassDetailsModalVisible', false)}
          />
        </ClassDetailsModalStyle.FlexContainer>
      </ClassDetailsModalStyle.Header>
      <ClassDetailsModalStyle.HeaderDetailsContainer>
        <ClassDetailsModalStyle.TopicThumbnail
          bgImage={get(modalData, 'record.topic.thumbnailSmall.uri')}
        />
        <ClassDetailsModalStyle.HeaderDetails>
          {get(modalData, 'course', null) && get(modalData, 'course') !== 'undefined' ? (
            <ClassDetailsModalStyle.HeaderCourse>
              {get(modalData, 'course')}
            </ClassDetailsModalStyle.HeaderCourse>
          ) : null}
          <ClassDetailsModalStyle.HeaderTitle>
            {get(modalData, 'topic')}
          </ClassDetailsModalStyle.HeaderTitle>
          <ClassDetailsModalStyle.HeaderDescription>
            {sessionLogData ? (
              <ClassDetailsModalStyle.FlexContainer style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                {renderSessionDateAndSlot(
                  getSessionLogTimeAndSlot(),
                  AttendanceSvg,
                  { textDecoration: 'line-through', opacity: '0.5' }
                )}
                {renderSessionDateAndSlot(modalData, RescheduleSuccessSvg, { marginTop: 16 })}
              </ClassDetailsModalStyle.FlexContainer>
            ) : (
              renderSessionDateAndSlot(modalData, ClockSVG)
            )}
            {checkIfSessionRescheduleAllowed() && (
              <ClassDetailsModalStyle.Text
                onClick={() => {
                  setModalVisibility('isClassDetailsModalVisible', false)
                  setModalVisibility('isRescheduleModalVisible', true)
                }}
              >
                <ClassDetailsModalStyle.Icon
                  component={EditSvg}
                  fillSvg={TekieAmethyst}
                  title='Reschedule Session'
                  style={{ marginLeft: '8px', cursor: 'pointer' }}
                />
              </ClassDetailsModalStyle.Text>
            )}
          </ClassDetailsModalStyle.HeaderDescription>
          {(get(modalData, 'documentType', null) === 'rescheduled') && (
            <ClassDetailsModalStyle.RescheduleTag>
              <ClassDetailsModalStyle.Icon
                fillSvg='#FFF'
                component={RescheduleSuccessSvg}
                style={{ marginRight: '6px' }}
              />
              Class Rescheduled
            </ClassDetailsModalStyle.RescheduleTag>
          )}
          <ClassDetailsModalStyle.HeaderTimestamp>
            {/* Weekly on Mon from 1 Apr - 30 Jun, 2021 */}
          </ClassDetailsModalStyle.HeaderTimestamp>
        </ClassDetailsModalStyle.HeaderDetails>
      </ClassDetailsModalStyle.HeaderDetailsContainer>
      <ClassDetailsModalStyle.Divider />
    </>
  )
  const renderUploadVideoLinkSection = (fromSessionLogs = false) => {
    const isRecordingUploaded = get(modalData, 'sessionRecordingLink', false)
    return (
      <>
        <ClassDetailsModalStyle.FlexRow style={{ justifyContent: 'space-between', margin: 0 }}>
          <Modal.ContentText>
            {isRecordingUploaded ? 'Want to watch the class recording?' :
              'Please upload the link of class recording.'}
          </Modal.ContentText>
          {isRecordingUploaded && (
            <Modal.SecondaryButton onClick={copyLink}>
              <Modal.StyledIcon component={clipboardSvg} fillSvg={TekieAmethyst} />
              Copy
            </Modal.SecondaryButton>
          )}
        </ClassDetailsModalStyle.FlexRow>
        <ClassDetailsModalStyle.FlexRow>
          {isRecordingUploaded ? (
            <Modal.CustomInputTemp
              onChange={(e) => { setSessionRecordingLinkInput(e.target.value) }}
              onClick={() => {
                if (isRecordingUploaded) {
                   window.open(withHttps(sessionRecordingLinkInput), '_blank').focus()
                }
              }}
              value={sessionRecordingLinkInput}
              placeholder='Enter link here'
              style={{ flex: 1, marginRight: '12px', cursor: `${isRecordingUploaded ? 'pointer' : 'text'}` }}
            />
          ) : (
            <Modal.CustomInput
              onChange={(e) => { setSessionRecordingLinkInput(e.target.value) }}
              onClick={() => {
                if (isRecordingUploaded) {
                   window.open(withHttps(sessionRecordingLinkInput), '_blank').focus()
                }
              }}
              value={sessionRecordingLinkInput}
              placeholder='Enter link here'
              style={{ flex: 1, marginRight: '12px', cursor: `${isRecordingUploaded ? 'pointer' : 'text'}` }}
            />
          )}
          {!isRecordingUploaded && (
            <Modal.PrimaryButton
              loading={isSessionUpdating}
              disabled={!sessionRecordingLinkInput}
              onClick={() => updateExistingSessions('Upload Link', fromSessionLogs)}
            >
              {isSessionUpdating ?
                <Modal.Spinner /> :
                <Modal.StyledIcon component={UploadSvg} fillSvg='#FFF' />}
              Upload
            </Modal.PrimaryButton>
          )}
        </ClassDetailsModalStyle.FlexRow>
        <Divider style={{ marginBottom: 0 }} />
      </>
    )
  }
  const renderSendLinkBlock = () => (
    <>
      <Divider />
      <ClassDetailsModalStyle.FlexRow style={{ justifyContent: 'space-between', margin: 0 }}>
        <Modal.ContentText>
          Please add the meeting link for the class.
        </Modal.ContentText>
      </ClassDetailsModalStyle.FlexRow>
      <ClassDetailsModalStyle.FlexRow>
        <Modal.CustomInput
          onChange={(e) => { setSessionMeetingLink(e.target.value) }}
          value={sessionMeetingLink}
          placeholder='Enter link here'
          style={{ flex: 1, marginRight: '12px' }}
        />
        <Modal.PrimaryButton
          disabled={!sessionMeetingLink || sendSessionLink}
          onClick={async () => {
            await sendTransactionalMessage(
              get(modalData, 'record.menteeSession.user.id'),
              sessionMeetingLink,
              'sendSessionLink',
              get(modalData, 'record.id')
            )
            await updateExistingSessions('Link Sent')
            setSendSessionLink(true)
            setSendLinkBlockActive(false)
          }}
        >
          <Modal.StyledIcon component={ClassesSvg} fillSvg='#FFF' />
          Send Link
        </Modal.PrimaryButton>
      </ClassDetailsModalStyle.FlexRow>
    </>
  )

  return (
    <ClassDetailsModalStyle.ModalBox visible={isModalVisible}>
      {renderHeaderSection()}
      <ClassDetailsModalStyle.Content>
        <Modal.Collapse defaultActiveKey={['classDetails']}>
          <Modal.Panel
            key='classDetails'
            header={
              <>
                <ClassDetailsModalStyle.ContentText>
                  Class Details
                </ClassDetailsModalStyle.ContentText>
              </>
            }
          >
            {(get(modalData, 'sessionStatus') === 'started' && get(modalData, 'record.sessionStartDate')) &&
              renderClassDetails({
              type: 'Time',
              value: `${format(get(modalData, 'record.sessionStartDate'), 'DD MMM hh:mm A')} -
                ${get(modalData, 'record.sessionEndDate') ? format(get(modalData, 'record.sessionEndDate'), 'DD MMM hh:mm A') : 'NA'}`,
              icon: ClockSVG
            })}
            {get(modalData, 'sessionStatus') === 'completed' &&
              renderClassDetails({
              type: 'Duration',
              value: get(modalData, 'record.sessionEndDate') ? getDuration(get(modalData, 'record.sessionStartDate'),
                get(modalData, 'record.sessionEndDate')) : moment(get(modalData, 'record.sessionStartDate')).format('DD MMM hh:mm A'),
              icon: ClockSVG
            })}
            {renderClassDetails({ type: 'Batch', value: get(modalData, 'batch'), icon: BatchSVG })}
            {(isAdminLoggedIn && get(modalData, 'mentorProfile.name')) && renderClassDetails({ type: 'Mentor', value: get(modalData, 'mentorProfile.name'), icon: StudentsSvg })}
            {renderClassDetails({ type: 'Students', value: getAttendanceOrStudentData(), icon: RatioSVG })}
            {renderClassDetails({ type: 'Type', value: get(modalData, 'type'), icon: TypeSVG })}
          </Modal.Panel>
        </Modal.Collapse>
        <ClassDetailsModalStyle.FlexRow alignItems='flex-start' style={{ flexDirection: 'column', marginTop: 8 }}>
        </ClassDetailsModalStyle.FlexRow>
      </ClassDetailsModalStyle.Content>
      {get(modalData, 'documentType', 'regular') === 'regular' && (
        <ClassDetailsModalStyle.Footer>
          {get(modalData, 'sessionStatus') === 'completed' && (
            <ClassDetailsModalStyle.FlexRow>
              {renderUploadVideoLinkSection()}
            </ClassDetailsModalStyle.FlexRow>
          )}
          {renderFooterActionsBasedOnSessionStatus(get(modalData, 'sessionStatus'))}
          {sendLinkBlockActive && (
            renderSendLinkBlock()
          )}
        </ClassDetailsModalStyle.Footer>
      )}
      {(get(modalData, 'documentType', 'regular') !== 'regular') && (
        <ClassDetailsModalStyle.Footer>
          <ClassDetailsModalStyle.FlexRow style={{ marginBottom: 8 }}>
            {renderUploadVideoLinkSection(true)}
          </ClassDetailsModalStyle.FlexRow>
          {
            get(modalData, 'record.isFeedbackSubmitted', false) && (
              <Modal.PrimaryLink
                style={{ alignSelf: 'flex-end' }}
                to={{
                  pathname: getClassFeedbackRoute(),
                  search: '?logs=true',
                  state: {
                    modalData,
                    sessionTypeFilter,
                    activeAvailabilityDateGte
                  }
                }}
              >
                <Modal.StyledIcon
                  component={FeedBackSvg}
                  fillSvg='#FFF'
                />
                View Feedback
              </Modal.PrimaryLink>
            )
          }
        </ClassDetailsModalStyle.Footer>
      )}
    </ClassDetailsModalStyle.ModalBox>
  )
}

export default classDetailsModal
