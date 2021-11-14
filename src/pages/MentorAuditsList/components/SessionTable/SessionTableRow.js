import React, { Component } from 'react'
import { Icon, Tooltip, Button, Switch, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { get, filter } from 'lodash'
import moment from 'moment'
import cx from 'classnames'
import MainTable from '../../../../components/MainTable'
import { Table } from '../../../../components/StyledComponents'
import formatDate from '../../../../utils/formatDate'
import { getDuration, getLowerboundTime, T12HrFormat } from '../../../../utils/time'
import styles from '../../../CompletedSessions/icon.module.scss'
import { AUDITOR, MENTOR } from '../../../../constants/roles'
import MentorAuditListStyle from '../../MentorAuditList.style'
import colors, { green, yellow, red } from '../../../../constants/colors'
import getDataFromLocalStorage from '../../../../utils/extract-from-localStorage'
import { auditType } from '../../../../constants/auditQuestionConst'
import { PreSalesDiv } from '../../PreSalesAudit/PreSalesAudit.styles'
import copyToClipboard from '../../../../utils/copyToClipboard'
import updateMentorAudit from '../../../../actions/mentorAudits/updateMentorAudit'

class SessionTableRow extends Component {
  state = {
    isToggleLoading: false,
    isAuditUpdating: false,
    isUpdateVisible: false
  }
  getStudentUserName = () => ({
    // userName: get(menteeSession[0], 'user.name'),
    userName: get(this.props, 'audit.menteeName'),
    userId: get(this.props, 'audit.menteeId'),
    timezone: get(this.props, 'audit.timezone') || 'Asia/Kolkata',
    country: get(this.props, 'audit.country') || 'india'
  })

  getMentorUserName = (users, id) => {
    const mentorData = filter(users, item => item.id === id)
    return mentorData.length && (mentorData[0].userName || mentorData[0].name)
  }

  isNegativeTagsPresent = audit => {
    const { timestampAnswer } = audit
    const { mentorMenteeSession } = audit
    let isNegative = false
    timestampAnswer.forEach(timestamp => {
      if ((timestamp.rude || timestamp.distracted || timestamp.dormant)) {
        isNegative = true
      }
    })
    if (mentorMenteeSession.rude || mentorMenteeSession.distracted) {
      isNegative = true
    }
    return isNegative
  }

  getRowColor = sessionStatus => {
    if (sessionStatus && sessionStatus === 'started') {
      return '#fff7e9'
    } else if (sessionStatus && sessionStatus === 'allotted') {
      return '#e8e8e8'
    }
    return ''
  }

  isAuditorSameAsLoggedInUser = (auditor) => {
    const loggedInUserId = getDataFromLocalStorage('login.id')
    if (auditor && auditor.id === loggedInUserId) {
      return true
    }
    return false
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
    const { tags, audit } = this.props
    const tagsToShow = filter(tags, (item) => audit[item.tag])
    if (tagsToShow.length < 1) {
      return '-'
    }
    if (tagsToShow.length > 3) {
      return (
        <React.Fragment>
          <MentorAuditListStyle.TagsIcon
            style={{
              backgroundColor: `${this.renderZoneColor(tagsToShow[0].zone)}`,
              marginLeft: '-8px',
              border: '1px solid #fff'
            }}
          >
            {tagsToShow[0].icon}
          </MentorAuditListStyle.TagsIcon>
          <MentorAuditListStyle.TagsIcon
            style={{
              backgroundColor: `${this.renderZoneColor(tagsToShow[1].zone)}`,
              marginLeft: '-8px',
              border: '1px solid #fff'
            }}
          >
            {tagsToShow[1].icon}
          </MentorAuditListStyle.TagsIcon>
          <Tooltip
            placement='right'
            title={() =>
              tagsToShow.map(item => (
                <MentorAuditListStyle.MoreTags>
                  {item.displayTitle ? item.displayTitle : item.tag}
                </MentorAuditListStyle.MoreTags>
              ))
            }
          >
            <MentorAuditListStyle.TagsIcon
              style={{ backgroundColor: '#777', marginLeft: '-8px', border: '1px solid #fff' }}
            >
              +{tagsToShow.length - 2}
            </MentorAuditListStyle.TagsIcon>
          </Tooltip>
        </React.Fragment>
      )
    }
    return tagsToShow.map(item => (
      <MentorAuditListStyle.TagsIcon
        style={{
          backgroundColor: `${this.renderZoneColor(item.zone)}`,
          marginLeft: '-8px',
          border: '1px solid #fff'
        }}
      >
        {item.icon}
      </MentorAuditListStyle.TagsIcon>
    ))
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
  ) => {
    const { mentorMenteeSession } = this.props.audit
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
          this.props.openVideoLinkSection(
            id,
            userId,
            mentorMenteeSession && mentorMenteeSession.sessionRecordingLink !== null ? mentorMenteeSession.sessionRecordingLink : '',
            topic,
            T12HrFormat(getLowerboundTime(formatDate(sessionStartDate).timeHM), 'a'),
            this.getMentorUserName(users, mentorId)
          )
        }
        }
        className={cx(this.getIconName(status), styles.icon)}
      />
    )
  }

  renderStartAuditButton = (audit, isAuditAlloted) => {
    const { isPathContainsAssignedAudits } = this.props
    const { isUpdateVisible, isAuditUpdating } = this.state
    if (!isPathContainsAssignedAudits && !this.isAuditorSameAsLoggedInUser(audit.auditor)) {
      return (
        <>
          {get(audit, 'auditStatus', 'pending')}
          {!isAuditAlloted && (
            <Link to={`/audit/${auditType.mentor}/${audit.audit.id}`}
              style={{ marginLeft: '.5rem' }}
            >
              <Tooltip title='View Audit' placement='top'>
                <MainTable.ActionItem.EyeIcon />
              </Tooltip>
            </Link>
          )}
        </>
      )
    }
    return (
      <>
        <Link to={`/audit/${auditType.mentor}/${audit.audit.id}`}>
          <Button
            disabled={!audit.auditor}
            type='default'
          >
            <Icon
              type='play-circle'
              theme='filled'
              style={{ paddingRight: '2px', color: 'rgb(100,217,120)' }}
            />
            {get(audit, 'auditStatus', 'allotted') === 'allotted' ? 'Start Audit' : 'Continue Audit'}
          </Button>
        </Link>
        {
          get(audit, 'auditStatus', 'allotted') === 'started' && (
            <Popconfirm
              title='Do you want to complete this audit ?'
              placement='topRight'
              visible={isUpdateVisible}
              onCancel={() => this.setState({ isUpdateVisible: false })}
              onConfirm={async () => {
                this.setState({ isAuditUpdating: true })
                await updateMentorAudit(get(audit, 'audit.id'), null, { status: 'completed' }, 'mentorAudits')
                this.setState({ isAuditUpdating: false, isUpdateVisible: false })
              }}
              okText='Yes'
              cancelText='Cancel'
              key='delete'
              okButtonProps={{
                loading: isAuditUpdating
              }}
              overlayClassName='popconfirm-overlay-primary'
            >
              <Button
                style={{ marginLeft: '10px' }}
                icon='check'
                onClick={() => this.setState({ isUpdateVisible: true })}
              />
            </Popconfirm>
          )
        }
      </>
    )
  }

  renderAuditorRow = (audit, mentorId, isAuditAlloted) => {
    const { isPathContainsAssignedAudits } = this.props
    if (audit && audit.auditor) {
      return (
        <MainTable.Item style={{
          width: 180,
            justifyContent: (isAuditAlloted && this.props.savedRole !== MENTOR
            && this.props.savedRole !== AUDITOR && !isPathContainsAssignedAudits) && 'space-between'
        }}
        >
          <p style={{ width: '70%', textOverflow: 'ellipsis', margin: 0, overflow: 'hidden', whiteSpace: 'nowrap' }}>{get(audit.auditor, 'name')}</p>
          {(isAuditAlloted && this.props.savedRole !== MENTOR &&
            this.props.savedRole !== AUDITOR && !isPathContainsAssignedAudits) && (
            <MainTable.ActionItem.EditIcon
              onClick={() => {
                this.props.openAssignAuditorModal(get(audit, 'audit.id', null), mentorId, get(audit, 'auditor', null))
              }}
              style={{ color: `${colors.table.editIcon}` }}
            />
          )}
        </MainTable.Item>
      )
    }
    if (this.props.savedRole === MENTOR || this.props.savedRole === AUDITOR) {
      return '-'
    }
    return (
      <Button
        onClick={() => {
          this.props.openAssignAuditorModal(get(audit, 'audit.id', null), mentorId, null)
        }}
        disabled={!audit.isAudit || !get(audit, 'audit')}
        type='default'
      >
        Assign Auditor
      </Button>
    )
  }

  getIconName = (status) => status ? styles.videoLinkYes : styles.videoLinkNo
  getScore = (type, record) => {
    const totalScore = get(record, 'audit.totalScore') || 0
    if (type === 'score') {
      return `${get(record, 'audit.score') || 0}/${totalScore}`
    } else if (type === 'customScore') {
      return `${get(record, 'audit.customScore') || 0}/${totalScore}`
    }
  }
  render() {
    const {
      order,
      audit,
      // menteeSessions,
      // users,
      mentorId,
      showBatchSessionTable
    } = this.props
    const {
      id,
      sessionStartDate,
      sessionEndDate,
      sessionStatus,
      topic,
      // menteeSession,
      rating,
      sessionRecordingLink,
      isAudit
    } = audit
    const auditStatus = get(audit, 'auditStatus', 'allotted')
    const isAuditAlloted = auditStatus === 'allotted'
    const savedRole = getDataFromLocalStorage('login.role')
    return (
      <MainTable.Row
        columnsTemplate={this.props.columnsTemplate}
        noBorder={this.props.noBorder}
        minWidth={this.props.minWidth}
        style={{ justifyContent: 'flex-start' }}
        backgroundColor={this.getRowColor(auditStatus, audit)}
      >
        <Table.StickyItem backgroundColor={
          this.getRowColor(auditStatus)
        }
          style={{ left: 0 }}
        >
          <MainTable.Item style={{ minWidth: 60 }}>
            {order}
            {get(audit.mentorMenteeSession, 'source') === 'transformation' ? '*' : ''}
          </MainTable.Item>
          <MainTable.Item style={{ width: 180 }}>
            {get(audit, 'mentorName') || '-'}
          </MainTable.Item>
          <MainTable.Item style={{ width: 180 }}>
            {showBatchSessionTable ? get(audit, 'batch.code') : get(audit, 'studentName')}
          </MainTable.Item>
          {
            savedRole === MENTOR || savedRole === AUDITOR ? null : (
              <MainTable.Item style={{ width: 150 }}>
                <Switch
                  checked={isAudit}
                  disabled={isAudit}
                  loading={this.state.isToggleLoading}
                  onChange={checked => {
                    this.setState({
                      isToggleLoading: true
                    })
                    this.props.updateMentorMenteeAuditStatus(id, checked).then(() => {
                      this.setState({
                        isToggleLoading: false
                      })
                    })
                  }}
                  size='default'
                />
              </MainTable.Item>
            )
          }
        </Table.StickyItem>
        <Table.Item backgroundColor={this.getRowColor(auditStatus, audit)}>
          {this.renderAuditorRow(audit, mentorId, isAuditAlloted)}
        </Table.Item>
        <Table.Item backgroundColor={this.getRowColor(auditStatus, audit)}>
          <MainTable.Item>
            {
              get(audit, 'auditCreatedAt') && (
                get(audit, 'auditStatus') === 'allotted' || get(audit, 'auditStatus') === 'started' ? (
                  this.renderStartAuditButton(audit, isAuditAlloted)
                ) : 'completed'
              )
            }
            {
              !get(audit, 'auditCreatedAt') && '-'
            }
          </MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor={this.getRowColor(auditStatus, audit)}>
          <MainTable.Item>
            ({topic ? topic.order : ''}) {topic ? topic.title : ''}
          </MainTable.Item>
        </Table.Item>
        {
          !showBatchSessionTable ? (
            <>
              <Table.Item backgroundColor={this.getRowColor(auditStatus, audit)}>
                <MainTable.Item>{rating || '-'}</MainTable.Item>
              </Table.Item>
              <Table.Item backgroundColor={this.getRowColor(auditStatus, audit)}>
                <MainTable.Item>
                  {audit.comment && audit.comment.length > 70 ? (
                    <Tooltip title={audit.comment} placement='left'>
                      {audit.comment.substring(0, 60)}...
                    </Tooltip>
                  ) : (
                    audit.comment || '-'
                  )}
                </MainTable.Item>
              </Table.Item>
            </>
          ) : (
              <>
                <Table.Item backgroundColor={this.getRowColor(auditStatus, audit)}>
                  <MainTable.Item>{get(audit, 'batch.type')}</MainTable.Item>
                </Table.Item>
                <Table.Item backgroundColor={this.getRowColor(auditStatus, audit)}>
                  <MainTable.Item>{get(audit, 'batch.school.name') || '-'}</MainTable.Item>
                </Table.Item>
                <Table.Item backgroundColor={this.getRowColor(auditStatus, audit)}>
                  <MainTable.Item>
                    {get(audit, 'batch.studentsMeta.count') || 0}
                  </MainTable.Item>
                </Table.Item>
            </>
          )
        }
        <Table.Item backgroundColor={this.getRowColor(auditStatus, audit)}>
          <MainTable.Item>
            {this.getScore('customScore', audit)}
          </MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor={this.getRowColor(auditStatus, audit)}>
          <MainTable.Item>
            {this.getScore('score', audit)}
          </MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor={this.getRowColor(auditStatus, audit)}>
          <MainTable.Item>
            {`${get(audit, 'mentorSession.user.phone.countryCode') || '-'} ${get(
              audit,
              'mentorSession.user.phone.number'
            ) || '-'}`}
          </MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor={this.getRowColor(auditStatus, audit)}>
          <MainTable.Item>{`${moment(get(audit, 'sessionStartDate')).format('lll')}`}</MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor={this.getRowColor(auditStatus, audit)}>
          <MainTable.Item>{`${getDuration(sessionStartDate, sessionEndDate)}`}</MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor={this.getRowColor(auditStatus, audit)}>
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
        <Table.Item backgroundColor={this.getRowColor(auditStatus, audit)}>
          <MainTable.Item>
            {
              sessionRecordingLink ? (
                <Tooltip title='Copy link'>
                  <PreSalesDiv className={cx(this.getIconName(true), styles.icon)}
                    onClick={() => copyToClipboard(sessionRecordingLink)}
                  />
                </Tooltip>
              ) : (
                <div className={cx(this.getIconName(false), styles.icon)} />
              )
            }
          </MainTable.Item>
        </Table.Item>
        {
          !showBatchSessionTable && (
            <>
              <Table.Item backgroundColor={this.getRowColor(auditStatus, audit)}>
                <MainTable.Item>{this.renderTags()}</MainTable.Item>
              </Table.Item>
              <Table.Item backgroundColor={this.getRowColor(auditStatus, audit)}>
                {get(audit, 'country') || '-'}
              </Table.Item>
            </>
          )
        }
      </MainTable.Row>
    )
  }
}

SessionTableRow.propTypes = {
  audit: PropTypes.shape({}).isRequired,
  order: PropTypes.number.isRequired,
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
  noBorder: PropTypes.bool.isRequired,
  users: PropTypes.shape([]).isRequired,
  menteeSessions: PropTypes.shape([]).isRequired,
  mentorId: PropTypes.number.isRequired,
  savedRole: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string.isRequired,
  openAssignAuditorModal: PropTypes.func.isRequired,
  openVideoLinkSection: PropTypes.func.isRequired
}

export default SessionTableRow
