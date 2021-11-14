import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import updateRescheduleSheet from './updateRescheduleSheet'
// import updateMentorMenteeReschedule from './updateMentorMenteeReschedule'

const updateSalesOperationData = async (
  id,
  input,
  sessionId
  // logIds,
  // reschedulingDataToBeSended
) => (
  duck.query({
    query: gql`
     mutation($input:SalesOperationUpdate!){
      updateSalesOperation(
        input:$input,
        id: "${id}",
        ${sessionId ? `firstMentorMenteeSessionConnectId: "${sessionId}"` : ''}
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
        salesOperationLog{
          id
          loggedBy{
            id
            name
          }
          log
          createdAt
          updatedAt
          type
          topic {
            id
          }
        }
        knowCoding
        lookingForAdvanceCourse
        ageNotAppropriate
        notRelevantDifferentStream
        noPayingPower
        notInterestedInCoding
        learningAptitudeIssue
        notAQualifiedLeadComment
        hasRescheduled
        internetIssue
        zoomIssue
        laptopIssue
        chromeIssue
        powerCut
        notResponseAndDidNotTurnUp
        turnedUpButLeftAbruptly
        leadNotVerifiedProperly
        otherReasonForReschedule
        pricingPitched
        parentCounsellingDone
        courseInterestedIn
        leadStatus
        prodigyChild
        extrovertStudent
        fastLearner
        studentEnglishSpeakingSkill
        parentEnglishSpeakingSkill
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
    type: 'salesOperation/update',
    key: 'salesOperationUpdate',
    changeExtractedData: (extractedData, originalData) => {
      // await updateMentorMenteeReschedule(sessionId, reschedulingDataToBeSended)
      updateRescheduleSheet(get(originalData, 'updateSalesOperation'))
      if (extractedData.salesOperation && extractedData.salesOperationLog) {
        extractedData.salesOperation.log = extractedData.salesOperationLog
      }
      return {
        ...extractedData,
        salesOperationForMentorSales: {
          id: originalData.updateSalesOperation.firstMentorMenteeSession.id,
          salesOperation: {
            ...extractedData.salesOperation,
            salesOperationLog: extractedData.salesOperationLog
          }
        },
        completedSession: {
          id: originalData.updateSalesOperation.firstMentorMenteeSession.id,
          salesOperation: {
            ...originalData.updateSalesOperation,
            salesOperationLog: extractedData.salesOperationLog
          }
        }
      }
    }
  })
)

export default updateSalesOperationData
