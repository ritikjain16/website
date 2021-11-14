/* eslint-disable */
import React, { Component } from 'react'
import moment from 'moment'
import { cloneDeep, get, filter } from 'lodash'
import { Icon, Spin } from 'antd'
import { Table } from '../../../../../components/StyledComponents'
import MainTable from '../../../../../components/MainTable'
import SessionTableRow from './SessionTableRow'
import { MENTOR } from '../../../../../constants/roles'
import PropTypes from "prop-types";

class SessionTableBody extends Component {
  state = {
    filteredSessions: []
  }

  componentDidMount() {
    this.setFilteredSessions()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filters.sessions !== this.props.filters.sessions) {
      this.setFilteredSessions()
    }
  }

  getTotalSessionsCount = (sessions) => {
    let totalSessions = 0
    for (const key in sessions) {
      totalSessions += sessions[key].length
    }
    this.props.setTotalSessionCount(totalSessions)
  }

  filterSessions = () => {
    const { tags, checkAll } = this.props
    let { sessions, isHomeworkSubmitted, selectedSlots } = this.props.filters
    let filteredSessions = cloneDeep(sessions)

    if (selectedSlots.length > 0) {
      Object.keys(filteredSessions).forEach(date => {
        let sessions = filteredSessions[date]
        filteredSessions[date] = sessions.filter(session => {
          const sessionStartDate = new Date(session.sessionStartDate)
          return selectedSlots.includes(sessionStartDate.getHours())
        }
        )
        if (filteredSessions[date].length === 0) { delete filteredSessions[date] }
      })
    }

    if (isHomeworkSubmitted !== null) {
      Object.keys(filteredSessions).forEach(date => {
        let sessions = filteredSessions[date]
        filteredSessions[date] = sessions.filter(session => session.isSubmittedForReview === isHomeworkSubmitted)
        if (filteredSessions[date].length === 0) { delete filteredSessions[date] }
      })
    }

    if (!checkAll) {
      Object.keys(filteredSessions).forEach(date => {
        let sessions = filteredSessions[date]
        filteredSessions[date] = sessions.filter(session => {
          let show = false
          tags.map(tag => {
            show = show || (tag.active && session[tag.tag])
          })
          return show
        }
        )
        if (filteredSessions[date].length === 0) { delete filteredSessions[date] }
      })
    }

    return filteredSessions
  }

  getSalesOperationData = (userId) => {
    const { salesOperation } = this.props
    if (salesOperation && userId) {
      return salesOperation[userId] || {}
    }

    return {}
  }

  setFilteredSessions = () => {
    const filteredSessions = this.filterSessions()
    this.setState({
      filteredSessions
    })
  }

  render() {
    const { fetchStatus, sessionType } = this.props
    const { filteredSessions } = this.state
    if (fetchStatus && fetchStatus.loading) {
      const loadingIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />
      return (
        <div style={{ width: '100%', padding: '15px' }}>
          <Spin indicator={loadingIcon} />
        </div>
      )
    }
    if (fetchStatus && fetchStatus.failure) {
      const errorText = 'An unexpected error occurred while fetching sessions.'
      return (
        <MainTable.EmptyTable>
          {errorText}
        </MainTable.EmptyTable>
      )
    }

    const menteeSessionstoJS = this.props.menteeSessions.toJS()
    const userstoJS = this.props.users.toJS()
    const mentorstoJS = this.props.mentors.toJS()
    const filteredSessionsKeys = filteredSessions ? Object.keys(filteredSessions) : null
    this.getTotalSessionsCount(filteredSessions)

    if (fetchStatus && fetchStatus.success && !filteredSessions) {
      const emptyText = 'No sessions found.'
      return (
        <MainTable.EmptyTable>
          {emptyText}
        </MainTable.EmptyTable>
      )
    }

    if (fetchStatus && fetchStatus.success && filteredSessions &&
      Object.keys(filteredSessions).length === 0) {
      const emptyText = 'No sessions found.'
      return (
        <MainTable.EmptyTable>
          {emptyText}
        </MainTable.EmptyTable>
      )
    }
    return filteredSessionsKeys && filteredSessionsKeys.map((date) => (
      <div key={date}>
        <MainTable.Row
          columnsTemplate='1fr'
          minWidth={this.props.minWidth}
          backgroundColor='#f5f5f5'
          style={{ '&:hover': 'background-color: #f5f5f5 !important' }}
        >
          <Table.Item backgroundColor='#f5f5f5'><MainTable.Item>{`${moment(date).format('DD-MM-YYYY')} (${filteredSessions[date].length})`}</MainTable.Item></Table.Item>
        </MainTable.Row>
        {
          filter(filteredSessions[date], session => get(session, 'menteeSession'))
          .map((session, index) => (
            <SessionTableRow
              key={index + 1}
              order={index + 1}
              history={get(this.props, 'history')}
              sessionType={sessionType}
              session={session}
              minWidth={this.props.minWidth}
              columnsTemplate={this.props.columnsTemplate}
              users={userstoJS}
              mentors={mentorstoJS}
              savedRole={this.props.savedRole}
              tags={this.props.tags}
              menteeSessions={menteeSessionstoJS}
              mentorId={get(session, 'mentorSession.user.id')}
              mentorSessionLink={get(session, 'mentorSession.user.mentorProfile.sessionLink')}
              openSendSessionModal={this.props.openSendSessionModal}
              openCommentSection={
                (
                    sessionId, userId, salesOperationData,
                    topic, time, mentorName, mentorId
                ) => {
                  // console.log(session, get(session, 'mentorSession.user.id'))
                  return this.props.openCommentSection(sessionId, userId, salesOperationData, topic,
                    moment(date).format('DD-MM-YYYY'), time,
                    mentorName, get(session, 'mentorSession.user.id'), session)
                }
              }
              openVideoLinkSection={
                (
                    sessionId, userId, link,
                    topic, time, mentorName
                ) => this.props.openVideoLinkSection(sessionId, userId, link, topic,
                    moment(date).format('DD-MM-YYYY'), time,
                    mentorName
                )
              }
              salesOperationData={session.salesOperation ? session.salesOperation : {}}
              openCompleteSessionModal={
                (
                    sessionId, studentName,
                    topic, time, mentorName, currentCompletedSessionPhone
                ) => this.props.toggleCompleteSessionModal(
                    sessionId, studentName, topic,
                    moment(date).format('DD-MM-YYYY'), time, mentorName, currentCompletedSessionPhone
                )
              }
            />
          ))}
      </div>
    ))
  }
}

export default SessionTableBody
