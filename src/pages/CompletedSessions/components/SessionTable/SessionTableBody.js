/* eslint-disable */
import React, { Component } from 'react'
import moment from 'moment'
import { cloneDeep, get, filter } from 'lodash'
import { Icon, Spin, Modal, Button } from 'antd'
import { Table } from '../../../../components/StyledComponents'
import MainTable from '../../../../components/MainTable'
import SessionTableRow from './SessionTableRow'
import SalesOperationReport from './SalesOperationReport'
import { MENTOR, TRANSFORMATION_ADMIN, TRANSFORMATION_TEAM } from '../../../../constants/roles'
import fetchSalesOperationReportOfTheDay from '../../../../actions/sessions/fetchSalesOperationReportOfTheDay'
import PropTypes from "prop-types";
import getDataFromLocalStorage from '../../../../utils/extract-from-localStorage'

class SessionTableBody extends Component {
  state = {
    filteredSessions: [],
    showSalesOperationReport: false,
    reportDate: ''
  }

  componentDidMount() {
    this.setFilteredSessions()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filters.sessions !== this.props.filters.sessions) {
      this.setFilteredSessions()
    }
  }

  showSalesOperationReportModal = () => {
    this.setState({
      showSalesOperationReport: true,
    })
    fetchSalesOperationReportOfTheDay({
      fromDate: moment(this.state.reportDate).startOf('day').toISOString(),
      toDate: moment(this.state.reportDate).endOf('day').toISOString(),
    })
  }

  hideSalesOperationReportModal = () => {
    this.setState({
      showSalesOperationReport: false,
    });
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

  getSortedSessionsObj = (keys) => {
    const sortedSessionsObj = {}
    const { filteredSessions } = this.state
    if (keys) {
      keys.forEach(key => {
        const sessions = filteredSessions[key]
        if (sessions) {
          sessions.sort((a, b) => new Date(get(a, 'createdAt')).getTime() - new Date(get(b, 'createdAt')).getTime())
          sortedSessionsObj[key] = sessions.reverse()
          sessions.sort((a, b) => get(a, 'slotId') - get(b, 'slotId'))
        }
      })
    }

    return sortedSessionsObj
  }

  render() {
    const { fetchStatus, queryFetchingNumber, queryFetchedNumber,
      showSessionLogs, sessionType } = this.props
    const { filteredSessions } = this.state
    if (
      (fetchStatus && fetchStatus.loading) ||
      queryFetchingNumber !== queryFetchedNumber
    ) {
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
    const sortedSessions = this.getSortedSessionsObj(filteredSessionsKeys)
    if (fetchStatus && fetchStatus.success && (!filteredSessions || (filteredSessions &&
      Object.keys(filteredSessions).length === 0))) {
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
          style={{
            '&:hover': 'background-color: #f5f5f5 !important',
            opacity: 1,
            backgroundColor: '#f5f5f5 !important',
            height: '48px',
            position: 'relative',
            left: 0,
            top: 0,
          }}
        >
          <Table.SubHeadItem backgroundColor='#f5f5f5'
            style={{
              width: '100vw',
            }}
          >
            <MainTable.Item>
              {
                getDataFromLocalStorage('login.role') === MENTOR ?
                `${moment(date).format('DD-MM-YYYY')} (${filteredSessions[date].length})`
                : (
                <Button
                  onClick={e => this.setState({ reportDate: date }, this.showSalesOperationReportModal)}
                  type='primary'
                  disabled={
                    this.props.savedRole === TRANSFORMATION_ADMIN || this.props.savedRole === TRANSFORMATION_TEAM
                  }
                >
                  {`${moment(date).format('DD-MM-YYYY')} (${filteredSessions[date].length})`}
                </Button>
              )
              }
            </MainTable.Item>
          </Table.SubHeadItem>
        </MainTable.Row>
        {
          filter(sortedSessions[date], session => get(session, 'menteeSession'))
          .map((session, index) => (
            <SessionTableRow
              key={index + 1}
              sessionType={sessionType}
              history={get(this.props, 'history')}
              order={index + 1}
              session={session}
              date={date}
              minWidth={this.props.minWidth}
              columnsTemplate={this.props.columnsTemplate}
              users={userstoJS}
              mentors={mentorstoJS}
              savedRole={this.props.savedRole}
              tags={this.props.tags}
              menteeSessions={menteeSessionstoJS}
              mentorId={get(session, 'mentorSession.user.id')}
              mentorSessionLink={get(session, 'mentorSession.user.mentorProfile.sessionLink')}
              onAuditToggle={(checked,sessionId, type) => { return this.props.onAuditToggle(checked, sessionId, type) }}
              openSendSessionModal={this.props.openSendSessionModal}
              showSessionLogs={showSessionLogs}
              country={this.props.country}
              openCommentSection={
                (
                    sessionId, userId, salesOperationData,
                    topic, time, mentorName, mentorId
                ) => {
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
              updateSessionIdOfUpdatingSessionInState={(id) => this.props.updateSessionIdOfUpdatingSessionInState(id)}
            />
          ))}
          <Modal
            title="Sales Operation Report"
            visible={this.state.showSalesOperationReport}
            onOk={this.hideSalesOperationReportModal}
            onCancel={this.hideSalesOperationReportModal}
            maskStyle={{
              backgroundColor: '#0000008c',
              opacity: 0.2
            }}
            footer={null}
          >
            <SalesOperationReport date={this.state.reportDate}/>
          </Modal>
      </div>
    ))
  }
}

export default SessionTableBody
