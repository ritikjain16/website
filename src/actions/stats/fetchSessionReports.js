import gql from 'graphql-tag'
import duck from '../../duck'

const fetchSessionReports = async (filterQuery, fetchCount) =>
  duck.query({
    query: gql`
    {
      sessionReports(filter: { and: [${filterQuery || ''}] }) {
        id
        date
        vertical
        registeredSameDay {
          registered
          phoneVerified
          booked
          demoCompleted
          converted
        }
        createdAt
        updatedAt
        totalBooked
        totalDemoCompleted
        totalConvertedUsers
        country
        internetIssue
        zoomIssue
        laptopIssue
        chromeIssue
        powerCut
        notResponseAndDidNotTurnUp
        classDurationExceeded
        turnedUpButLeftAbruptly
        leadNotVerifiedProperly
        otherReasonForReschedule
        webSiteLoadingIssue
        videoNotLoading
        codePlaygroundIssue
        logInOTPError
      }
    }
    
    
  `,
    type: 'sessionReports/fetch',
    key: `sessionReports/${fetchCount}`,
  })

export default fetchSessionReports
