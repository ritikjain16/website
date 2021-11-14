import gql from 'graphql-tag'
import duck from '../../duck'
import { PARENT } from '../../constants/roles'

const dateFilters = (fromDate, toDate) => {
  if (fromDate && toDate) {
    return `{createdAt_gte: "${fromDate}"}{createdAt_lte: "${toDate}"}`
  } else if (fromDate) {
    return `{createdAt_gte: "${fromDate}"}`
  } else if (toDate) {
    return `{createdAt_lte: "${toDate}"}`
  }
  return ''
}

const getSesssionDateFilter = (fromDate, toDate, type) => {
  let dateFilter = ''
  if (type === 'booking') {
    if (fromDate) dateFilter += `{ bookingDate_gte: "${fromDate}" }`
    if (toDate) dateFilter += `{bookingDate_lte: "${toDate}"}`
  } else {
    if (fromDate) dateFilter += `{sessionStartDate_gte: "${fromDate}"}`
    if (toDate) dateFilter += `{sessionStartDate_lte: "${toDate}"}`
  }
  return dateFilter
}
const addSubtractDays = (date, days, type = 'add') => {
  const result = new Date(date)
  if (type === 'subtract') {
    result.setDate(result.getDate() - days)
  } else {
    result.setDate(result.getDate() + days)
  }
  return result.toDateString()
}

const getTotalRegisteredUsersBetween = (fromDate, toDate, country = 'india') => `
usersMeta(filter: {and: [{role: ${PARENT}}, ${dateFilters(fromDate, toDate)}, {source_not: school}, {country: ${country}}]}) {
  count
}
verifiedUsers: usersMeta(filter: {and: [{role: ${PARENT}}, {phoneVerified: true}, ${dateFilters(fromDate, toDate)}, {source_not: school}, {country: ${country}}]}) {
  count
}
`

// const getFutureBookedSessions = (country) => `
//   futureMenteeSessionsMeta: menteeSessionsMeta(
//     filter:{
//     and: [
//       { country: ${country} }
//       {bookingDate_gt: "${(new Date()).toDateString()}"}
//       {source_not:school}
//     ]
//     }
//   ){
//     count
//   }
// `

const getPaidUsers = (fromDate, toDate, country) => `
  convertedUsers: salesOperationsMeta(
    filter: {
      and: [{ leadStatus: won }, { source_not: school }, { country: ${country} }
        {
          client_some:{
            and:[
              ${dateFilters(fromDate, toDate)}
            ]
          }
        }
      ]
    }
  ) {
    count
  }
`

const salesOperationReport = (fromDate) => {
  if (!fromDate) {
    fromDate = addSubtractDays(new Date(), 30, 'subtract')
  }
  return ''
  // return `
  //     salesOperationReport(fromDate: "${fromDate}", toDate: "${toDate}"){
  //         _id
  //         userRegisteredCount
  //         menteeAllSessionsBookedCount
  //         menteeFirstSessionBookedCount
  //         firstSessionStartedCount
  //         firstSessionCompletedCount
  //         secondSessionCompletedCount
  //         allSessionsStartedCount
  //         allSessionsCompletedCount
  //     }`
}

const getSessionsDetails = (fromDate, toDate, sessionFromDate, sessionToDate, country = 'india') => `
bookedSessionsCount: menteeSessionsMeta(filter:
  {and: [
  ${getSesssionDateFilter(sessionFromDate, sessionToDate, 'booking')}
  {source_not: school},
  {country: ${country}},
  {topic_some: {order: 1}},
  {user_some: {and: [${dateFilters(fromDate, toDate)}]}}]})
  {
  count
}
allottedSessionsCount: mentorMenteeSessionsMeta(filter:
  {and: [{sessionStatus: allotted},
    ${getSesssionDateFilter(sessionFromDate, sessionToDate, 'session')}
    {source_not: school},
    {country: ${country}},
    {topic_some: {order: 1}},
    {menteeSession_some:
    {user_some: {and: [${dateFilters(fromDate, toDate)}]}}}]})
  {
  count
}
startedSessionsCount: mentorMenteeSessionsMeta(filter:
  {and: [{sessionStatus: started},
    ${getSesssionDateFilter(sessionFromDate, sessionToDate, 'session')}
    {source_not: school},
    {country: ${country}},
    {topic_some: {order: 1}},
    {menteeSession_some:
      {user_some: {and: [${dateFilters(fromDate, toDate)}]}}}]})
  {
  count
}
completedSessionsCount: mentorMenteeSessionsMeta(filter:
  {and: [{sessionStatus: completed},
    ${getSesssionDateFilter(sessionFromDate, sessionToDate, 'session')}
    {source_not: school},
    {country: ${country}},
    {topic_some: {order: 1}},
    {menteeSession_some:
      {user_some: {and: [${dateFilters(fromDate, toDate)}]}}}]})
  {
  count
}
`

// const getMissedSession = (fromDate, toDate, sessionFromDate, country = 'india') => `
// missedSessionsCount: mentorMenteeSessionsMeta(
//     filter: {
//       and: [
//         ${getSesssionDateFilter(sessionFromDate, null, 'session')}
//         { sessionStartDate_lt: "${(new Date()).toDateString()}" }
//         { country: ${country} }
//         { sessionStatus_not: completed }
//         { menteeSession_some: { user_some: { and: [${dateFilters(fromDate, toDate)}] } } }
//       ]
//     }
//   ) {
//     count
//   }
// `

const fetchStatsMeta = ({ fromDate, toDate, sessionFromDate,
  sessionToDate, country }) => duck.query({
  query: gql`{
    ${getTotalRegisteredUsersBetween(fromDate, toDate, country)}
    ${salesOperationReport(fromDate, toDate)}
    ${getSessionsDetails(fromDate, toDate, sessionFromDate, sessionToDate, country)}
    ${getPaidUsers(fromDate, toDate, country)}
  }`,
  type: 'fetchStats/fetch',
  key: 'fetchStats'
})

export default fetchStatsMeta
