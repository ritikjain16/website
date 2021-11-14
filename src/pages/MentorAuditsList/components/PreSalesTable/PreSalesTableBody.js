/* eslint-disable */
import React, { Component } from 'react'
import moment from 'moment'
import { cloneDeep, get, filter } from 'lodash'
import { Icon, Spin } from 'antd'
import MainTable from '../../../../components/MainTable'
import SessionTableRow from '../SessionTable/SessionTableRow'

class PreSalesTableBody extends Component {
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
    const { mentorAuditsFetchStatus } = this.props;
    const { filteredMentorAuditSessions } = this.state
    if (mentorAuditsFetchStatus && mentorAuditsFetchStatus.loading) {
      const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
      return (
        <div style={{ width: "100%", padding: "15px", textAlign: 'center' }}>
          <Spin indicator={loadingIcon} />
        </div>
      );
    }
    if (mentorAuditsFetchStatus && mentorAuditsFetchStatus.failure) {
      const errorText = "An unexpected error occurred while fetching sessions.";
      return <MainTable.EmptyTable>{errorText}</MainTable.EmptyTable>;
    }

    const menteeSessionstoJS = this.props.menteeSessions.toJS()
    const userstoJS = this.props.users.toJS()
    const mentorstoJS = this.props.mentors.toJS()
    const filteredMentorAuditSessionsKeys = filteredMentorAuditSessions ? Object.keys(filteredMentorAuditSessions) : null
    if (mentorAuditsFetchStatus && mentorAuditsFetchStatus.success && filteredMentorAuditSessions &&
      Object.keys(filteredMentorAuditSessions).length === 0) {
      const emptyText = 'No sessions found.'
      return (
        <MainTable.EmptyTable>
          {emptyText}
        </MainTable.EmptyTable>
      )
    }
    return filteredMentorAuditSessionsKeys && filteredMentorAuditSessionsKeys.map((date) => (
      <div key={date}>
        {
          filter(filteredMentorAuditSessions[date], session =>get(session, 'mentorMenteeSession.menteeSession'))
            .map((audit, index) => (
            <SessionTableRow
              auditType='preSales'
              key={index + 1}
              order={index + 1}
              audit={audit}
              date={date}
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
          ))}
      </div>
    ))
  }
}

export default PreSalesTableBody
