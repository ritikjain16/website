import React, { Component } from 'react'
import { Icon, Tooltip, Button, Switch, Popconfirm } from 'antd'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import cx from 'classnames'
import { get, filter } from 'lodash'
import moment from 'moment'
import MainTable from '../../../../components/MainTable'
import { Table } from '../../../../components/StyledComponents'
import formatDate from '../../../../utils/formatDate'
import { getLowerboundTime, T12HrFormat, getDuration } from '../../../../utils/time'
import styles from '../../icon.module.scss'
import {
  MENTOR,
  ADMIN,
  UMS_ADMIN,
  UMS_VIEWER,
  TRANSFORMATION_TEAM,
  TRANSFORMATION_ADMIN
} from '../../../../constants/roles'
import CompletedSessionStyle from '../../CompletedSessions.style'
import { green, yellow, red } from '../../../../constants/colors'
import getIntlDateTime from '../../../../utils/time-zone-diff'
import updateMentorMenteeSession from '../../../../actions/sessions/updateMentorMenteeSession'
import getDataFromLocalStorage from '../../../../utils/extract-from-localStorage'

const StyledIcon = styled(({ isSubmitted, ...rest }) => (
  <Icon
    {...rest}
    type={isSubmitted ? 'check-circle' : 'close-circle'}
    twoToneColor={isSubmitted ? '#52c41a' : '#f12c2c'}
  />
))`
  font-size: 28px;
`

class SessionTableRow extends Component {
  state = {
    auditToggle: false,
    isPostSalesAudit: false,
    menteeAttitude: [
      'knowCoding',
      'lookingForAdvanceCourse',
      'ageNotAppropriate',
      'notRelevantDifferentStream',
      'noPayingPower',
      'notInterestedInCoding',
      'learningAptitudeIssue',
      'notAQualifiedLeadComment',
      'internetIssue',
      'zoomIssue',
      'laptopIssue',
      'chromeIssue',
      'powerCut',
      'notResponseAndDidNotTurnUp',
      'turnedUpButLeftAbruptly',
      'leadNotVerifiedProperly',
      'leadStatus',
      'prodigyChild',
      'extrovertStudent',
      'fastLearner',
      'studentEnglishSpeakingSkill',
      'parentEnglishSpeakingSkill'
    ],
    cmntStatusCheckKeys: [
      'parentCounsellingDone',
      'oneToOne',
      'notRelevantDifferentStream',
      'noPayingPower',
      'notInterestedInCoding',
      'oneToTwo',
      'extrovertStudent',
      'studentEnglishSpeakingSkill',
      'leadStatus',
      'nextCallOn',
      'otherReasonForNextStep',
      'nextSteps',
      'knowCoding',
      'fastLearner',
      'notAQualifiedLeadComment',
      'ageNotAppropriate',
      'learningAptitudeIssue',
      'lookingForAdvanceCourse',
      'prodigyChild',
      'pricingPitched',
      'parentEnglishSpeakingSkill',
      'leadNotVerifiedProperly',
      'oneToThree'
    ],
    statusKeysFromSession: [
      'hasRescheduled',
      'zoomIssue',
      'turnedUpButLeftAbruptly',
      'rescheduledDate',
      'rescheduledDateProvided',
      'notResponseAndDidNotTurnUp',
      'internetIssue',
      'powerCut',
      'otherReasonForReschedule',
      'chromeIssue',
      'laptopIssue'
    ]
  }

  setIsAudit = () => {
    const { isAudit, isPostSalesAudit } = this.props.session
    this.setState({
      auditToggle: isAudit,
      isPostSalesAudit
    })
  }
  componentDidMount() {
    this.setIsAudit()
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.session !== this.props.session) {
      this.setIsAudit()
    }
  }

  getStudentUserName = () => ({
    // userName: get(menteeSession[0], 'user.name'),
    userName: get(this.props, 'session.menteeName'),
    userId: get(this.props, 'session.menteeId'),
    timezone: get(this.props, 'session.timezone') || 'Asia/Kolkata',
    country: get(this.props, 'session.country') || 'india'
  })
  // getStudentUserName = (users, menteeSessions, id) => {
  //   let userName = ''
  //   let userId = ''
  //   // console.log(users)
  //   // const menteeSession = filter(users, item => item.id === id)
  //   // console.log(menteeSession)
  //   const menteeSession = menteeSessions.filter((session) => session.id === id) || []
  //   if (menteeSession.length > 0) {
  //   //   // console.log(menteeSession)
  //     for (let i = 0; i < users.length; i += 1) {
  //       const user = users[i]
  //       if (menteeSession[0].user && menteeSession[0].user.id === user.id) {
  //         const { name, username } = user
  //         userName = name || username
  //         userId = user && user.id
  //       }
  //     }
  //   }
  //   return {
  //     // userName: get(menteeSession[0], 'user.name'),
  //     userName: get(this.props, 'session.menteeName'),
  //     userId: get(this.props, 'session.menteeId')
  //     // userId: get(menteeSession[0], 'user.id')
  //   }
  //   // return {
  //   //   userName,
  //   //   userId
  //   // }
  // }
  getSelectedSlotsStringArray = (slots = {}) => {
    const slotTimeStringArray = []
    Object.keys(slots).forEach(slot => {
      if (slot.includes('slot') && !slot.includes('slotId')) {
        if (slots[slot]) {
          slotTimeStringArray.push(slot)
        }
      }
    })
    return slotTimeStringArray
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

  getSlotTime = (menteeSessions, id, returnSlotNumber = false, showSessionLogs) => {
    let menteeSession = []
    if (showSessionLogs) {
      menteeSession = menteeSessions
    } else {
      menteeSession = menteeSessions.filter(session => session.id === id) || []
    }
    const slotTimeStringArray = this.getSelectedSlotsStringArray(menteeSession[0])
    if (slotTimeStringArray && slotTimeStringArray.length) {
      const slotNumber = slotTimeStringArray[0].split('slot')[1]
      if (returnSlotNumber) return slotNumber
      const label = this.getSlotLabel(slotNumber)
      return label.startTime
    }
    return '-'
  }

  getSlotNumber = (menteeSessions, id, showSessionLogs) => {
    if (!menteeSessions || !menteeSessions.filter) return 0
    let menteeSession = []
    if (showSessionLogs) {
      menteeSession = menteeSessions
    } else {
      menteeSession = menteeSessions.filter(session => session.id === id) || []
    }
    const slotTimeStringArray = this.getSelectedSlotsStringArray(menteeSession[0])
    if (slotTimeStringArray && slotTimeStringArray.length) {
      const slotNumber = slotTimeStringArray[0].split('slot')[1]
      return slotNumber
    }
    return 0
  }

  getMentorUserName = (users, id) => {
    // const { mentors } = this.props
    // let userName = ''
    // console.log(mentors)
    // for (let i = 0; i < users.length; i += 1) {
    //   const user = users[i]
    //   if (id === user.id) {
    //     const { name, username } = user
    //     userName = name || username
    //   }
    // }
    const mentorData = filter(users, item => item.id === id)
    return mentorData.length && (mentorData[0].userName || mentorData[0].name)
  }
  getRowColor = sessionStatus => {
    if (sessionStatus && sessionStatus === 'started') {
      return '#fff7e9'
    } else if (sessionStatus && sessionStatus === 'allotted') {
      return '#e8e8e8'
    }
    return ''
  }

  renderZoneColor = zone => {
    switch (zone) {
      case 'green':
        return green
      case 'red':
        return red
      case 'yellow':
        return yellow
      default:
        return 'grey'
    }
  }

  renderTags = () => {
    const { tags, session } = this.props
    const tagsToShow = filter(tags, item => session[item.tag])
    if (tagsToShow.length > 3) {
      return (
        <React.Fragment>
          <CompletedSessionStyle.TagsIcon
            style={{
              backgroundColor: `${this.renderZoneColor(tagsToShow[0].zone)}`,
              marginLeft: '-8px',
              border: '1px solid #fff'
            }}
          >
            {tagsToShow[0].icon}
          </CompletedSessionStyle.TagsIcon>
          <CompletedSessionStyle.TagsIcon
            style={{
              backgroundColor: `${this.renderZoneColor(tagsToShow[1].zone)}`,
              marginLeft: '-8px',
              border: '1px solid #fff'
            }}
          >
            {tagsToShow[1].icon}
          </CompletedSessionStyle.TagsIcon>
          <Tooltip
            placement='right'
            title={() =>
              tagsToShow.map(item => (
                <CompletedSessionStyle.MoreTags>
                  {item.displayTitle ? item.displayTitle : item.tag}
                </CompletedSessionStyle.MoreTags>
              ))
            }
          >
            <CompletedSessionStyle.TagsIcon
              style={{ backgroundColor: '#777', marginLeft: '-8px', border: '1px solid #fff' }}
            >
              +{tagsToShow.length - 2}
            </CompletedSessionStyle.TagsIcon>
          </Tooltip>
        </React.Fragment>
      )
    }
    return tagsToShow.map(item => (
      <CompletedSessionStyle.TagsIcon
        style={{
          backgroundColor: `${this.renderZoneColor(item.zone)}`,
          marginLeft: '-8px',
          border: '1px solid #fff'
        }}
      >
        {item.icon}
      </CompletedSessionStyle.TagsIcon>
    ))
  }

  getIconName = (type, status) => {
    if (type === 'comment') {
      return status ? styles.completedIcon : styles.notCompletedIcon
    } else if (type === 'link') {
      return status ? styles.videoLinkYes : styles.videoLinkNo
    } else if (type === 'feedback') {
      return status ? styles.feedbackYes : styles.feedbackNo
    }

    return ''
  }

  onToggle = async (checked) => {
    const { id } = this.props.session
    await this.props.onAuditToggle(checked, id)
    this.setState({
      auditToggle: checked
    })
  }
  onIsPostSalesAudit = async (checked) => {
    const { id } = this.props.session
    await this.props.onAuditToggle(checked, id, true)
    this.setState({
      isPostSalesAudit: checked
    })
  }
  renderMentorPopOver = (child, type) => {
    const savedId = getDataFromLocalStorage('login.id')
    return (
      <Popconfirm
        title={`Please ${type} from new mentor dashboard`}
        placement='topRight'
        okText='Go to new Mentor Dashboard'
        cancelText='Cancel'
        onConfirm={() => {
            this.props.history.push(`/mentordashboard/${savedId}`)
          }}
        key='view'
        overlayClassName='popconfirm-overlay-primary'
      >
        {child}
      </Popconfirm>
    )
  }
  renderCompletedSessionModal = (
    users,
    menteeSessions,
    menteeSession,
    sessionStartDate,
    mentorId,
    id,
    topic,
    status,
    type
  ) => {
    const { session, showSessionLogs, sessionType } = this.props
    const savedRole = getDataFromLocalStorage('login.role')
    if ((type === 'comment' || type === 'link') && sessionType === 'trial' && savedRole === MENTOR) {
      return (
        // eslint-disable-next-line max-len
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        this.renderMentorPopOver(<div
          className={cx(this.getIconName(type, get(session, 'isFeedbackSubmitted')), styles.icon)}
        />, `add ${type === 'link' ? 'video link' : type}`)
      )
    }
    return (
      // eslint-disable-next-line max-len
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
      <div
        onClick={() => {
          const { userId } = this.getStudentUserName(
            users,
            menteeSessions,
            menteeSession && menteeSession.id
          )
          if (type === 'comment' || type === 'feedback') {
            this.props.openCommentSection(
              id,
              userId,
              this.props.salesOperationData,
              topic,
              T12HrFormat(getLowerboundTime(formatDate(sessionStartDate).timeHM), 'a'),
              this.getMentorUserName(users, mentorId),
              mentorId,
              session
            )
          } else {
            /* eslint-disable no-lonely-if */
            if (!showSessionLogs) {
              this.props.openVideoLinkSection(
                id,
                userId,
                session && session.sessionRecordingLink !== null ? session.sessionRecordingLink : '',
                topic,
                T12HrFormat(getLowerboundTime(formatDate(sessionStartDate).timeHM), 'a'),
                this.getMentorUserName(users, mentorId)
              )
            }
          }
        }}
        className={cx(this.getIconName(type, get(session, 'isFeedbackSubmitted')), styles.icon)}
      />
    )
  }

  getCommentStatus = (salesOperationData, topic) => {
    const logs = get(salesOperationData, 'log')
    // const logs = get('this.props.session.salesOperation', 'log')
    // console.log(logs)
    const { cmntStatusCheckKeys, statusKeysFromSession } = this.state
    const { session } = this.props
    // for comments
    if (logs && logs.length > 0) {
      for (let i = 0; i < logs.length; i += 1) {
        if (get(logs[i], 'topic.id') === topic.id) {
          return true
        }
      }
    }
    // for other checks
    for (let item = 0; item < cmntStatusCheckKeys.length; item += 1) {
      if (salesOperationData[cmntStatusCheckKeys[item]]) {
        return true
      }
    }
    for (let item = 0; item < statusKeysFromSession.length; item += 1) {
      if (session[statusKeysFromSession[item]]) {
        return true
      }
    }
    return false
  }

  renderMenteeAttitude = (showSessionLogs) => {
    const { menteeAttitude } = this.state
    const { salesOperationData, session } = this.props
    let toShow = []
    if (showSessionLogs) {
      toShow = filter(menteeAttitude, item => session[item])
    } else {
      toShow = filter(menteeAttitude, item => salesOperationData[item])
    }
    if (toShow.length > 2) {
      return (
        <Tooltip
          title={() => toShow.map(item => <p style={{ marginBottom: 0 }}>{item}</p>)}
          placement='left'
        >
          <p style={{ marginBottom: 0 }}>{toShow[0]}</p>
          <p style={{ marginBottom: 0 }}>{toShow[1]}...</p>
        </Tooltip>
      )
    } else if (toShow.length > 0) {
      return toShow.map(item => <p style={{ marginBottom: 0 }}>{item}</p>)
    }
    return '-'
  }

  renderNextCallOn = () => {
    const { salesOperationData } = this.props
    if (salesOperationData.nextCallOn) {
      const bgColor = moment(salesOperationData.nextCallOn).calendar(null, {
        sameDay: '[red]',
        sameElse: '[#ffffff00]'
      })
      return (
        <div
          style={{
            backgroundColor: bgColor,
            display: 'grid',
            color: bgColor === 'red' ? '#fff' : '#757575'
          }}
        >
          <span>{moment(salesOperationData.nextCallOn).format('DD-MM-YYYY')}</span>
          <span>{moment(salesOperationData.nextCallOn).format('hh:mm')}</span>
        </div>
      )
    }
    return '-'
  }

  getMentorDetails = (type) => {
    const { session, showSessionLogs, mentorId } = this.props
    const { mentorName } = session
    let value = ''
    if (showSessionLogs) {
      if (type === 'name' && get(session, 'mentor')) {
        value = get(session, 'mentor.name')
      } else if (type === 'phone') {
        value = `${get(session, 'mentor.phone.countryCode', '-')} ${get(session, 'mentor.phone.number', '-')}`
      }
    } else {
      /* eslint-disable no-lonely-if */
      if (type === 'name') {
        if (mentorId) {
          value = mentorName
        }
      } else if (type === 'phone') {
        value = `${get(session, 'mentorSession.user.phone.countryCode', '-')} ${get(session, 'mentorSession.user.phone.number', '-')}`
      }
    }
    return value
  }
  renderSendLink = (canSendSessionLink, userId, id) => {
    const { sessionType, openSendSessionModal } = this.props
    const savedRole = getDataFromLocalStorage('login.role')
    if (sessionType === 'trial' && savedRole === MENTOR) {
      return (
        this.renderMentorPopOver(
          <Button
            type='primary'
            disabled={!canSendSessionLink}
          >
            Send Link
          </Button>, 'send session link')
      )
    }
    return (
      <Button
        type='primary'
        disabled={!canSendSessionLink}
        onClick={() => {
          openSendSessionModal(userId, id, this.props.mentorSessionLink)
        }}
      >
        Send Link
      </Button>
    )
  }
  getParentData = (data) =>
    data && data.length > 0 && get(data[0], 'user') ? get(data[0], 'user') : {}
  render() {
    const {
      order,
      session,
      menteeSessions,
      users,
      mentorId,
      openCompleteSessionModal,
      showSessionLogs,
      sessionType,
      country
    } = this.props
    const {
      id,
      sessionStartDate,
      sessionEndDate,
      sessionStatus,
      isSubmittedForReview,
      topic,
      menteeSession,
      rating,
      sessionRecordingLink,
      parentsInfo,
      sendSessionLink,
    } = session
    const { userId, userName, timezone } = this.getStudentUserName(
      users,
      menteeSessions,
      menteeSession && menteeSession.id
    )
    const isAdmin =
      this.props.savedRole === ADMIN ||
      this.props.savedRole === UMS_ADMIN ||
      this.props.savedRole === UMS_VIEWER
    const hour = showSessionLogs ? this.getSlotNumber([session], null, showSessionLogs)
      : this.getSlotNumber(menteeSessions, menteeSession && menteeSession.id)
    const canSendSessionLink =
      moment().isBefore(
        moment(sessionStartDate)
          .hours(hour)
          .add(1, 'h')
      ) && sessionStatus === 'allotted'
    const savedRole = getDataFromLocalStorage('login.role')
    return (
      <MainTable.Row
        columnsTemplate={this.props.columnsTemplate}
        noBorder={this.props.noBorder}
        minWidth={this.props.minWidth}
        style={{ justifyContent: 'flex-start' }}
        backgroundColor={this.getRowColor(sessionStatus)}
      >
        <Table.StickyItem backgroundColor={this.getRowColor(sessionStatus)} style={{ left: 0 }}>
          <MainTable.Item style={{ minWidth: 60 }}>
            {order}
            {get(session, 'source') === 'transformation' ? '*' : ''}
          </MainTable.Item>
          <MainTable.Item style={{ width: 180 }}>
            {this.getMentorDetails('name')}
          </MainTable.Item>
          <MainTable.Item style={{ width: 180 }}>{userName}</MainTable.Item>
        </Table.StickyItem>
        <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
          <MainTable.Item>
            {get(this.getParentData(parentsInfo), 'name', '-')}
          </MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
          <MainTable.Item>
            {get(this.getParentData(parentsInfo), 'email', '-')}
          </MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
          <MainTable.Item>
            {`${get(this.getParentData(parentsInfo), 'phone.countryCode', '-')} ${get(this.getParentData(parentsInfo), 'phone.number', '-')}`}
          </MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
          <MainTable.Item>
            {this.getMentorDetails('phone')}
          </MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
          <MainTable.Item>
            {
              showSessionLogs ? this.getSlotTime([session], null, false, showSessionLogs) :
              this.getSlotTime(menteeSessions, menteeSession && menteeSession.id)
            }
            {/* {T12HrFormat(getLowerboundTime(formatDate(sessionStartDate).timeHM), 'a')} */}
          </MainTable.Item>
        </Table.Item>
        {
          country !== 'india' && (
          <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
            <MainTable.Item>
              {getIntlDateTime(
                    this.props.date,
                    showSessionLogs ? this.getSlotTime([session], null, true, showSessionLogs) :
                    this.getSlotTime(menteeSessions, menteeSession && menteeSession.id, true),
                    timezone).intlTime
                  }
              {' | '}
              {getIntlDateTime(
                    this.props.date,
                    showSessionLogs ? this.getSlotTime([session], null, true, showSessionLogs) :
                  this.getSlotTime(menteeSessions, menteeSession && menteeSession.id, true),
                timezone).intlDate
                  }
            </MainTable.Item>
          </Table.Item>
          )
        }
        <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
          <MainTable.Item>
            {get(session, 'course.title')}
          </MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
          <MainTable.Item>
            ({topic ? topic.order : ''}) {topic ? topic.title : ''}
          </MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
          {topic && topic.order === 1 ? (
            <>
              {sendSessionLink ? (
                <span style={{ color: '#73d13d' }}>Link sent</span>
              ) : (
                  <>
                    {
                      showSessionLogs ? (<span>-</span>) :
                        this.renderSendLink(canSendSessionLink, userId, id)
                    }
                </>
              )}
            </>
          ) : (
            <span>-</span>
          )}
        </Table.Item>
        {
          sessionStatus === 'started' || sessionStatus === 'completed'
            ? (
              <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
                {isAdmin ? (
                  <MainTable.Item
                    isLinkedItem={sessionStatus === 'started'}
                    onClick={() => {
                      if (sessionStatus === 'started' && this.props.savedRole !== TRANSFORMATION_TEAM && this.props.savedRole !== TRANSFORMATION_ADMIN && !showSessionLogs) {
                        openCompleteSessionModal(
                          id,
                          this.getStudentUserName(
                            users,
                            menteeSessions,
                            menteeSession && menteeSession.id
                          ).userName,
                          topic,
                          T12HrFormat(getLowerboundTime(formatDate(sessionStartDate).timeHM), 'a'),
                          this.getMentorUserName(users, mentorId),
                          get(parentsInfo, '[0].user.phone.number', '')
                        )
                      }
                    }}
                  >
                    {sessionStatus}
                  </MainTable.Item>
                ) : (
                  <MainTable.Item> {sessionStatus} </MainTable.Item>
                )}
              </Table.Item>
            ) : (
              <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
                {
                  sessionType === 'trial' && savedRole === MENTOR ? (
                    this.renderMentorPopOver(
                      <Button
                        type='primary'
                      >
                        Start Session
                      </Button>, 'Start Session')
                  ) : (
                    <Button
                      type='primary'
                      onClick={async () => {
                    if (!showSessionLogs) {
                      this.props.updateSessionIdOfUpdatingSessionInState(id)
                      await updateMentorMenteeSession(id, { sessionStatus: 'started' }, `updateCompletedSession/startSession/${id}`)
                    }
                  }}
                    >
                  Start Session
                    </Button>
                  )
                }
              </Table.Item>
            )
        }
        <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
          {sessionStatus === 'completed' ? (
            <MainTable.Item>
              {`
                ${T12HrFormat(formatDate(sessionStartDate).timeHM)}
                - 
                ${T12HrFormat(formatDate(sessionEndDate).timeHM)}
                `}
            </MainTable.Item>
          ) : (
            '-'
          )}
        </Table.Item>

        <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
          {sessionStatus === 'completed' ? (
            <MainTable.Item>{`${getDuration(sessionStartDate, sessionEndDate)}`}</MainTable.Item>
          ) : (
            '-'
          )}
        </Table.Item>
        <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
          {sessionStatus === 'completed' ? (
            <MainTable.Item>{`${moment(get(session, 'sessionStartDate')).format('lll')}`}</MainTable.Item>
          ) : (
            '-'
          )}
        </Table.Item>
        {
          !showSessionLogs && (
            <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
              <MainTable.Item>
                <StyledIcon isSubmitted={isSubmittedForReview} theme='twoTone' />
              </MainTable.Item>
            </Table.Item>
          )
         }
        <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
          {topic.order === 1 ? (
            <MainTable.Item>
              <Tooltip title='Comment' placement='left'>
                {this.renderCompletedSessionModal(
                  users,
                  menteeSessions,
                  menteeSession,
                  sessionStartDate,
                  mentorId,
                  id,
                  topic,
                  this.getCommentStatus(this.props.salesOperationData, topic),
                  // this.getCommentStatus(this.props.session, topic),
                  'comment'
                )}
              </Tooltip>
            </MainTable.Item>
          ) : (
            '-'
          )}
        </Table.Item>
        <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
          {topic.order === 1 ? <MainTable.Item>{this.renderMenteeAttitude(showSessionLogs)}</MainTable.Item> : '-'}
        </Table.Item>
        <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
          <MainTable.Item>
            <Tooltip title='Video Link' placement='left'>
              {this.renderCompletedSessionModal(
                users,
                menteeSessions,
                menteeSession,
                sessionStartDate,
                mentorId,
                id,
                topic,
                sessionRecordingLink && sessionRecordingLink !== null,
                'link'
              )}
            </Tooltip>
          </MainTable.Item>
        </Table.Item>
        {
          !showSessionLogs && (
            <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
              <MainTable.Item>{this.renderNextCallOn()}</MainTable.Item>
            </Table.Item>
          )
        }
        {this.props.savedRole !== MENTOR && (
          <React.Fragment>
            <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
              <MainTable.Item>{rating || '-'}</MainTable.Item>
            </Table.Item>
            <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
              <MainTable.Item>{this.renderTags()}</MainTable.Item>
            </Table.Item>
            <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
              <MainTable.Item>
                {session.comment && session.comment.length > 70 ? (
                  <Tooltip title={session.comment} placement='left'>
                    {session.comment.substring(0, 60)}...
                  </Tooltip>
                ) : (
                  session.comment
                )}
              </MainTable.Item>
            </Table.Item>
            {
              !showSessionLogs && (
                <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
                  <MainTable.Item>
                    <Switch
                      checked={this.state.auditToggle}
                      onChange={this.onToggle}
                      size='default'
                    />
                  </MainTable.Item>
                </Table.Item>
              )
            }
            {
              !showSessionLogs && (
                <Table.Item backgroundColor={this.getRowColor(sessionStatus)}>
                  <MainTable.Item>
                    <Switch
                      checked={this.state.isPostSalesAudit}
                      onChange={this.onIsPostSalesAudit}
                      size='default'
                    />
                  </MainTable.Item>
                </Table.Item>
              )
            }
          </React.Fragment>
        )}
      </MainTable.Row>
    )
  }
}

SessionTableRow.propTypes = {
  session: PropTypes.shape({}).isRequired,
  order: PropTypes.number.isRequired,
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
  noBorder: PropTypes.bool.isRequired,
  users: PropTypes.shape([]).isRequired,
  menteeSessions: PropTypes.shape([]).isRequired,
  mentorId: PropTypes.number.isRequired,
  openCommentSection: PropTypes.func.isRequired,
  salesOperationData: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  sessionType: PropTypes.string.isRequired,
  savedRole: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string.isRequired,
  openVideoLinkSection: PropTypes.func.isRequired,
  openCompleteSessionModal: PropTypes.func.isRequired
}

export default SessionTableRow
