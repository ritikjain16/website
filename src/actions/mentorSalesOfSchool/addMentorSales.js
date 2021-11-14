import gql from 'graphql-tag'
import duck from '../../duck'

const addMentorSales = async (
  clientConnectId,
  monitoredByConnectId,
  sessionId,
  mentorId,
  courseConnectId,
  input) => {
  duck.query({
    query: gql`
     mutation($input:SalesOperationInput!){
      addSalesOperation(
        input:$input,
        clientConnectId:"${clientConnectId}",
        monitoredByConnectId:"${monitoredByConnectId}",
        firstMentorMenteeSessionConnectId:"${sessionId}",
        allottedMentorConnectId:"${mentorId}",
        ${courseConnectId ? `courseConnectId: "${courseConnectId}"` : ''}
      ){
        id
        userVerificationStatus
        userResponseStatus
        userResponseStatusUpdateDate
        overallFeedback
        client{
            id
            username
            email
            name
            phone {
                countryCode
                number
            }
            studentProfile {
              parents {
                user {
                  phone {
                    number
                  }
                }
              }
            }
        }
        salesOperationActivities{
          id
          actionOn
          currentData
          oldData
          createdAt
        }
        monitoredBy{
          id
          username
          email
          name
          phone{
            countryCode
            number
          }
        }
        createdAt
        leadStatus
        nextCallOn
        rescheduledDate
        rescheduledDateProvided
        nextSteps
        otherReasonForNextStep
        oneToOne
        oneToTwo
        oneToThree
        firstMentorMenteeSession{
            id
        }
      }
    }
  `,
    variables: {
      input
    },
    type: 'salesOperation/add',
    key: 'completedSession',
    changeExtractedData: (extractedData, originalData) => ({
      ...extractedData,
      salesOperationForMentorSales: {
        id: originalData.addSalesOperation.firstMentorMenteeSession.id,
        salesOperation: originalData.addSalesOperation
      }
    })
  })
}

export default addMentorSales
