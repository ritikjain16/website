import gql from 'graphql-tag'
import duck from '../../duck'

const fetchSalesOperationReportOfTheDay = async ({ fromDate, toDate }) => duck.query({
  query: gql`
  query{
    salesOperationReport(
        fromDate: "${fromDate}",
        toDate: "${toDate}",
    ){
        _id
        userRegisteredCount
        firstSessionAllottedCount
        firstSessionStartedCount
        firstUnAssignedSessions
        menteeFirstSessionBookedCount
        firstMentorMenteeSessionsCount
        firstSessionCompletedCount
        firstCompletedSessionsPercentage
        zoomIssue
        internetIssue
        laptopIssue
        chromeIssue
        notResponseAndDidNotTurnUp
        turnedUpButLeftAbruptly
        leadNotVerifiedProperly
        otherReasonForReschedule
    }
  }
  `,
  type: 'salesOperationReportOfTheDay/fetch',
  key: 'salesOperationReportOfTheDay'
})

export default fetchSalesOperationReportOfTheDay
