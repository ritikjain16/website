import React, { Component } from 'react'
import moment from 'moment'
import { orderBy, get } from 'lodash'
import PropTypes from 'prop-types'
import { Icon, Spin, notification } from 'antd'
import MainTable from '../../../../components/MainTable'
import SessionTableRow from './SessionTableRow'
import { showNotification } from '../../../../utils/messages'
import { Table } from '../../../../components/StyledComponents'

class SessionTableBody extends Component {
  componentDidUpdate(prevProps) {
    const { deleteStatus } = this.props
    const currStatus = deleteStatus && deleteStatus.session
    const prevStatus = prevProps.deleteStatus && prevProps.deleteStatus.session
    if (currStatus && prevStatus) {
      showNotification(currStatus, prevStatus, 'Deleting Session', 'Deleting session failed',
        'Session deleted successfully',
        false, null, null, true)
    } if ((currStatus && currStatus.failure) && (prevStatus && !prevStatus.failure)) {
      notification.error({
        message: 'Cannot delete old sessions.'
      })
    }
  }

  getSortedSessions = (sessions) => orderBy(sessions, ['availabilityDate'], ['desc'])

  appendNewlyAddedSession = () => {
    const { sessions, addedSession } = this.props
    if (sessions && (addedSession && addedSession.getIn([0]))) {
      sessions.push(addedSession.getIn([0]).toJS())
    }
    return sessions
  }

  render() {
    const { fetchStatus, sessionKey, dateArray } = this.props
    let date; let
      showDate = false
    if (get(fetchStatus, `${sessionKey}.loading`)) {
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
    if (fetchStatus && fetchStatus.success && this.props.sessions &&
      this.props.sessions.size === 0) {
      const emptyText = 'No sessions found. Click on \'Add Session\' button to add sessions.'
      return (
        <MainTable.EmptyTable>
          {emptyText}
        </MainTable.EmptyTable>
      )
    }
    const { filteredSessions } = this.props
    const sortedSessions = this.getSortedSessions(filteredSessions)
    const lastSessionIndex = sortedSessions.length - 1

    return sortedSessions && sortedSessions.map((session, index) => {
      if (dateArray.includes(new Date(session.availabilityDate).setHours(0, 0, 0, 0))) {
        date = new Date(session.availabilityDate).setHours(0, 0, 0, 0)
        showDate = true
        dateArray.splice(dateArray.indexOf(
          new Date(session.availabilityDate).setHours(0, 0, 0, 0)
        ), 1)
      } else {
        showDate = false
      }

      return (
        <div>
          {
            showDate &&
            (
            <MainTable.Row
              columnsTemplate='1fr'
              minWidth={this.props.minWidth}
              hoverBackgroundColor='#d1dadd'
            >
              <Table.Item
                backgroundColor='#d1dadd'
              >
                <MainTable.Item>{`${moment(new Date(date)).format('DD-MM-YYYY')}`}</MainTable.Item>
              </Table.Item>
            </MainTable.Row>
            )
          }
          <SessionTableRow
            order={index + 1}
            session={session}
            {...session}
            minWidth={this.props.minWidth}
            columnsTemplate={this.props.columnsTemplate}
            noBorder={index === lastSessionIndex}
            users={this.props.mentors.toJS()}
            openSessionTimeModal={
                (slotStatusArray) => this.props.openSessionTimeModal(slotStatusArray)
            }
            openEditSession={(id) => this.props.openEditSession(id)}
          />
        </div>
      )
    }
    )
  }
}

SessionTableBody.propTypes = {
  sessionsLoading: PropTypes.bool.isRequired,
  hasSessionsFetched: PropTypes.bool.isRequired,
  sessions: PropTypes.shape([]),
  minWidth: PropTypes.string.isRequired,
  columnsTemplate: PropTypes.string.isRequired,
  openSessionTimeModal: PropTypes.func.isRequired,
  fetchStatus: PropTypes.shape({}).isRequired,
  openEditSession: PropTypes.func.isRequired,
  dateArray: PropTypes.shape([]).isRequired
}

SessionTableBody.defaultProps = {
  sessions: []
}

export default SessionTableBody
