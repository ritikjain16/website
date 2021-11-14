import React, { Component } from 'react'
import { Row, Icon } from 'antd'
import { get } from 'lodash'
import CardStyle from './Cards.styles'


class Cards extends Component {

  getCardPercentage = (count, totalCount) => count && totalCount ? `${((count / totalCount) * 100).toFixed(0)}%` : '0%'
  getRegisteredUsers = () => {
    const { analyticsMeta } = this.props
    const totalRegisteredUsers = get(analyticsMeta, 'totalRegisteredUsers') || 0
    const totalVerifiedUsers = get(analyticsMeta, 'totalVerifiedUsers') || 0
    const unVerifiedUsers = totalRegisteredUsers - totalVerifiedUsers
    const usersCount = []
    const verifiedUsersPercent = this.getCardPercentage(totalVerifiedUsers, totalRegisteredUsers)
    usersCount.push(<span>{totalRegisteredUsers}</span>)
    usersCount.push(<p>{unVerifiedUsers || 0} ({this.getCardPercentage(unVerifiedUsers, totalRegisteredUsers)}) <br />UnVerified</p>)
    usersCount.push(<p>{get(analyticsMeta, 'totalVerifiedUsers') || 0} ({verifiedUsersPercent}) <br />Verified</p>)
    return usersCount
  }

  // getRegisteredNotBooked = () => {
  //   const { totalRegisteredUsers, totalBookedSessionsBetween } = this.props
  //   if (totalRegisteredUsers !== null && totalBookedSessionsBetween !== null) {
  //     return totalRegisteredUsers - totalBookedSessionsBetween
  //   }
  //   return null
  // }

  // getFutureSessionsBooked = () => {
  //   let { futureBookedSessions } = this.props

  //   if (futureBookedSessions) {
  //     return futureBookedSessions
  //   }

  //   return null
  // }

  // getSessionsMissed = () => {
  //   const { missedSessionsCount } = this.props
  //   if (missedSessionsCount) {
  //     return missedSessionsCount
  //   }
  //   return 0
  // }

  getPaidUsers = () => get(this.props, 'analyticsMeta.totalConvertedUsers') || 0

  getSessionDetails = () => {
    const { analyticsMeta } = this.props
    const sessionsCount = []
    const totalBooked = get(analyticsMeta, 'totalBooked') || 0
    const completedSession = get(analyticsMeta, 'totalDemoCompleted') || 0
    sessionsCount.push(<span>{totalBooked}</span>)
    sessionsCount.push(<p>{completedSession} ({this.getCardPercentage(completedSession, totalBooked)}) <br />Completed</p>)
    // sessionsCount.push(<p>{allottedSessionsCount || 0} ({this.getCardPercentage(allottedSessionsCount, bookedSessionsCount)}) <br />Allotted</p>)
    // sessionsCount.push(<p>{startedSessionsCount || 0} ({this.getCardPercentage(startedSessionsCount, bookedSessionsCount)}) <br />Started</p>)
    return sessionsCount
  }

  getPendingBookings = () => {
    const { analyticsMeta } = this.props
    const totalBooked = get(analyticsMeta, 'totalBooked') || 0
    const totalRegisteredUsers = get(analyticsMeta, 'totalRegisteredUsers') || 0
    if (totalRegisteredUsers > totalBooked) {
      return totalRegisteredUsers - totalBooked
    }
    return 0
  }
  renderCounts = (card, fetchStatus) => {
    const { StyledSpan, StyledDetails, StyledDivider } = CardStyle
    if (card.count && Array.isArray(card.count) && card.count.length === 3) {
      const innerCounts = card.count.slice(1, card.count.length)
      return (
        <>
          <div style={{ marginBottom: '15px' }}>
            <StyledSpan
              style={{ flexDirection: 'column' }}
              // onClick={() => this.props.openModal(card.title)}
              filterWillWork={card.filterWillWork}
            >
              {fetchStatus ? card.count[0] : <Icon type="loading" style={{ fontSize: 24 }} theme="outlined" spin />}
            </StyledSpan>
          </div>
          {
            fetchStatus && <StyledDetails>
              {
                innerCounts.map((countVal, index) => (
                  <>
                    {countVal}
                    {index !== innerCounts.length - 1 && <StyledDivider type='vertical' />}
                  </>
                ))
              }
            </StyledDetails>
          }
        </>
      )
    } else if (card.count && Array.isArray(card.count) && card.count.length === 4) {
      const innerCounts = card.count.slice(1, card.count.length)
      return (
        <>
          <div style={{ marginBottom: '15px' }}>
            <StyledSpan
              style={{ flexDirection: 'column' }}
              // onClick={() => this.props.openModal(card.title)}
              filterWillWork={card.filterWillWork}
            >
              {fetchStatus ? <span>{card.count[0]} {`${card.showPercent ? ` (${card.percentage || 0}%)` : ''}`}</span> : <Icon type="loading" style={{ fontSize: 24 }} theme="outlined" spin />}
            </StyledSpan>
          </div>
          {
            fetchStatus && <StyledDetails columns>
              {
                innerCounts.map((countVal, index) => (
                  <>
                    {countVal}
                    {index !== innerCounts.length - 1 && <StyledDivider type='vertical' />}
                  </>
                ))
              }
            </StyledDetails>
          }
        </>
      )
    } else if (card.count && Array.isArray(card.count) && card.count.length === 2) {
      const innerCounts = card.count.slice(1, card.count.length)
      return (
        <>
          <div style={{ marginBottom: '15px' }}>
            <StyledSpan
              style={{ flexDirection: 'column' }}
              // onClick={() => this.props.openModal(card.title)}
              filterWillWork={card.filterWillWork}
            >
              {fetchStatus ? <span>{card.count[0]} {`${card.showPercent ? ` (${card.percentage || 0}%)` : ''}`}</span> : <Icon type="loading" style={{ fontSize: 24 }} theme="outlined" spin />}
            </StyledSpan>
          </div>
          {
            fetchStatus && <StyledDetails columns>
              {
                innerCounts.map((countVal, index) => (
                  <>
                    {countVal}
                    {index !== innerCounts.length - 1 && <StyledDivider type='vertical' />}
                  </>
                ))
              }
            </StyledDetails>
          }
        </>
      )
    }
    return (
      <div style={{ marginBottom: '15px' }}>
        <StyledSpan
          style={{ flexDirection: 'column' }}
          // onClick={() => this.props.openModal(card.title)}
          filterWillWork={card.filterWillWork}
        >
          {fetchStatus && card.count !== null ? `${card.count} ${card.showPercent ? ` (${card.percentage || 0}%)` : ''}` : <Icon type="loading" style={{ fontSize: 24 }} theme="outlined" spin />}
        </StyledSpan>
      </div>
    )
  }
  getPercentage = (type) => {
    const { analyticsMeta } = this.props
    let percentage = 0
    const totalRegisteredUsers = get(analyticsMeta, 'totalRegisteredUsers') || 0
    if (type === 'notBooked') {
      const totalBooked = get(analyticsMeta, 'totalBooked') || 0
      if (totalRegisteredUsers > totalBooked) {
        percentage = ((totalRegisteredUsers - totalBooked) / totalRegisteredUsers) * 100
      }
    } else if (type === 'sessionsBooked') {
      const totalBooked = get(analyticsMeta, 'totalBooked') || 0
      if (totalBooked && totalRegisteredUsers) percentage = (totalBooked / totalRegisteredUsers) * 100
    } else if (type === 'paidUser') {
      const completedSession = get(analyticsMeta, 'totalDemoCompleted') || 0
      const totalConvertedUsers = get(analyticsMeta, 'totalConvertedUsers') || 0
      if (completedSession && totalConvertedUsers) percentage = (totalConvertedUsers / completedSession) * 100
    }
    return percentage.toFixed(1)
  }
  render() {
    let { fetchStatus, dateDiff } = this.props
    const cards = [
      { title: `Registered Users within ${dateDiff} days`, filterWillWork: true, count: this.getRegisteredUsers() },
      // { title: 'Registered & Not Booked', filterWillWork: true, count: this.getRegisteredNotBooked() },
      { title: 'Not Booked', filterWillWork: true, count: this.getPendingBookings(), percentage: this.getPercentage('notBooked'), showPercent: true },
      { title: `Sessions Booked in ${dateDiff} days`, filterWillWork: true, count: this.getSessionDetails(), percentage: this.getPercentage('sessionsBooked'), showPercent: true },
      { title: 'Paid Users', filterWillWork: true, count: this.getPaidUsers(), percentage: this.getPercentage('paidUser'), showPercent: true },
      // { title: 'Future Sessions Booked', filterWillWork: false, count: this.getFutureSessionsBooked(), showPercent: false },
      // { title: 'Missed Sessions', filterWillWork: false, count: this.getSessionsMissed(), showPercent: false },
    ]
    fetchStatus = fetchStatus && fetchStatus.toJS().success
    const { StyledCol, StyledTitle, StyledCard } = CardStyle
    return (
      <Row style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {
          cards.map((card, index) => {
            return (
              <StyledCol filterWillWork={card.filterWillWork} key={index + 1} span={6}>
                <StyledCard filterWillWork={card.filterWillWork}
                  title={<StyledTitle>{card.title}</StyledTitle>}
                >
                  {this.renderCounts(card, fetchStatus)}
                </StyledCard>
              </StyledCol>
            )
          })
        }
      </Row >
    )
  }
}

export default Cards
