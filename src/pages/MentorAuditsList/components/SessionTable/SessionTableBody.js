/* eslint-disable */
import React, { Component } from 'react'
import moment from 'moment'
import { cloneDeep, get, filter } from 'lodash'
import { Icon, Spin } from 'antd'
import MainTable from '../../../../components/MainTable'
import SessionTableRow from './SessionTableRow'

class SessionTableBody extends Component {
  state = {
    filteredMentorAuditSessions: [],
  }

  componentDidMount() {
    this.setFilteredAudits()
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.filters.mentorAuditSessions !== this.props.filters.mentorAuditSessions) {
      this.setFilteredAudits()
    }
  }
  
  filterMentorAuditSessions = () => {
    const { tags, checkAll } = this.props
    let { mentorAuditSessions } = this.props.filters
    let filteredMentorAuditSessions = cloneDeep(mentorAuditSessions)

    if (!checkAll) {
      Object.keys(filteredMentorAuditSessions).forEach(date => {
        let audits = filteredMentorAuditSessions[date]
        filteredMentorAuditSessions[date] = audits.filter(audit => {
          let show = false
          tags.map(tag => {
            show = show || (tag.active && audit[tag.tag])
          })
          return show
        }
        )
        if (filteredMentorAuditSessions[date].length === 0)
        { delete filteredMentorAuditSessions[date] }
      })
    }

    return filteredMentorAuditSessions
  }

  setFilteredAudits = () => {
    const filteredMentorAuditSessions = this.filterMentorAuditSessions();
    this.setState({
      filteredMentorAuditSessions
    })
  }

  render() {
    const { tableData,
      showBatchSessionTable, mentorMenteeSessionsForAuditFetchStatus } = this.props;
    if (mentorMenteeSessionsForAuditFetchStatus
        && get(mentorMenteeSessionsForAuditFetchStatus.toJS(), 'loading')) {
      const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
      return (
        <div style={{ width: "100%", padding: "15px", textAlign: 'center' }}>
          <Spin indicator={loadingIcon} />
        </div>
      );
    }
    if (mentorMenteeSessionsForAuditFetchStatus
      && mentorMenteeSessionsForAuditFetchStatus.success && tableData.length === 0) {
      const noSessions = 'No Sessions'
      return <MainTable.EmptyTable>{noSessions}</MainTable.EmptyTable>;
    }
    const menteeSessionstoJS = this.props.menteeSessions.toJS()
    const userstoJS = this.props.users.toJS()
    const mentorstoJS = this.props.mentors.toJS()
    return tableData && tableData.map((audit, index) => (
      <SessionTableRow
        key={index + 1}
        order={index + 1}
        audit={audit}
        showBatchSessionTable={showBatchSessionTable}
        minWidth={this.props.minWidth}
        columnsTemplate={this.props.columnsTemplate}
        users={userstoJS}
        mentors={mentorstoJS}
        savedRole={this.props.savedRole}
        tags={this.props.tags}
        isPathContainsAssignedAudits={this.props.isPathContainsAssignedAudits}
        menteeSessions={menteeSessionstoJS}
        mentorId={get(audit, 'mentorMenteeSession.mentorSession.user.id')}
        openSendSessionModal={this.props.openSendSessionModal}
        openAssignAuditorModal={this.props.openAssignAuditorModal}
        updateMentorMenteeAuditStatus={this.props.updateMentorMenteeAuditStatus}
        openVideoLinkSection={
          (
              sessionId, userId, link,
              topic, time, mentorName
          ) => this.props.openVideoLinkSection(sessionId, userId, link, topic,
              moment(date).format('DD-MM-YYYY'), time,
              mentorName
          )
        }
      />
    ))
  }
}

export default SessionTableBody
