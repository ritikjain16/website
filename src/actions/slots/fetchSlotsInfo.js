import gql from 'graphql-tag'
import moment from 'moment'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'
import offsetDate from '../../utils/date/date-offset'

const fetchSlotsInfo = (fromDate, toDate, country = 'india') => duck.query({
  query: gql`
            query {
                availableSlots(filter:{
                and: [
                    {date_gt:"${fromDate}"},
                    {date_lt:"${toDate}"}
                ]
                }
                orderBy: date_ASC) {
                    id
                    date
                    ${getSlotNames()}
                }
                menteeSessions(filter: {
                    and: [
                    {bookingDate_gt:"${fromDate}"},
                    {bookingDate_lt:"${toDate}"}
                    {source_not_in:[school]}
                    {topic_some: {order: 1}}
                    ${country === 'all' ? '' : `{country:${country}}`}
                  ]
                }
                orderBy: bookingDate_ASC) {
                    id
                    bookingDate
                    country
                    user{
                      id
                      verificationStatus
                    }
                    ${getSlotNames()}
                }
                mentorSessions(filter: {
                    and: [
                        {availabilityDate_gt:"${fromDate}"},
                        {availabilityDate_lt:"${toDate}"},
                        {sessionType: trial}
                    ]
                }, orderBy:availabilityDate_ASC) {
                    id
                    availabilityDate
                    ${getSlotNames()}
                }
                mentorMenteeSessions(filter:{
                  menteeSession_some: {
                    and:[
                      {bookingDate_gt: "${fromDate}"}
                      {bookingDate_lt: "${toDate}"}
                      {source_not_in:[school]}
                      {topic_some: {order: 1}}
                      ${country === 'all' ? '' : `{country:${country}}`}
                    ]
                  }
                }) {
                  id
                  sendSessionLink
                  menteeSession {
                      id
                      bookingDate
                      ${getSlotNames()}
                  }
                }
                salesOperationReport(fromDate: "${moment(offsetDate(fromDate, 1, 'ADD')).format('MM/DD/yyyy')}", toDate: "${moment(toDate).format('MM/DD/yyyy')}", ${country === 'all' ? '' : `country:${country}`}) {
                    _id
                    userRegisteredCount
                    menteeFirstSessionBookedCount
                    firstMentorMenteeSessionsCount
                    firstUnAssignedSessions
                    firstSessionCompletedCount
                    firstCompletedSessionsPercentage
                    zoomIssue
                    internetIssue
                    laptopIssue
                    chromeIssue
                    powerCut
                    notResponseAndDidNotTurnUp
                    turnedUpButLeftAbruptly
                    leadNotVerifiedProperly
                    otherReasonForReschedule
                }
            }
    `,
  type: 'slotsInfo/fetch',
  key: 'slotsInfo',
  changeExtractedData: (extractedData, originalData) => {
    if (
      extractedData && originalData &&
      extractedData.menteeSession && originalData.menteeSessions
    ) {
      originalData.menteeSessions.forEach((session, index) => {
        extractedData.menteeSession[index] = session
        if (session.topic) {
          extractedData.menteeSession[index].topic = {
            ...session.topic
          }
        }
      })
    }
    if (
      extractedData && originalData &&
      extractedData.completedSession && originalData.mentorMenteeSessions
    ) {
      const sessions = originalData.mentorMenteeSessions
      extractedData.completedSession.forEach(session => {
        const __s = sessions.filter(s => s.id === session.id)
        if (__s && __s[0]) {
          session.sessionInfo = __s[0].menteeSession
        }
      })
    }
    extractedData.user = []
    return extractedData
  }
})

export default fetchSlotsInfo
