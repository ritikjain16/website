import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import sendTransactionalMessage from '../sessions/sendTransactionalMessage'
import updateRescheduleSheet from './updateRescheduleSheet'
// import updateMentorMenteeReschedule from './updateMentorMenteeReschedule'

const addSalesOperationData = async (
  clientConnectId,
  monitoredByConnectId,
  // logsConnectIds,
  input,
  sessionId,
  mentorId,
  courseConnectId
  // reschedulingDataToBeSended
) => (
  duck.query({
    query: gql`
     mutation(
      $input:SalesOperationInput!
     ){
      addSalesOperation(
        input:$input,
        clientConnectId:"${clientConnectId}",
        monitoredByConnectId:"${monitoredByConnectId}",
        firstMentorMenteeSessionConnectId:"${sessionId}",
        allottedMentorConnectId:"${mentorId}"
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
    type: 'salesOperation/add',
    key: 'salesOperationAdd',
    changeExtractedData: (extractedData, originalData) => {
      // await updateMentorMenteeReschedule(sessionId, reschedulingDataToBeSended)
      updateRescheduleSheet(get(originalData, 'addSalesOperation'))
      if (extractedData.salesOperation && extractedData.salesOperationLog) {
        extractedData.salesOperation.log = extractedData.salesOperationLog
      }

      if (input.hasRescheduled) {
        sendTransactionalMessage(clientConnectId, '', 'sessionNotConducted', originalData.addSalesOperation.firstMentorMenteeSession.id)
      }
      return {
        ...extractedData,
        completedSession: {
          id: originalData.addSalesOperation.firstMentorMenteeSession.id,
          salesOperation: {
            ...originalData.addSalesOperation,
            salesOperationLog: extractedData.salesOperationLog
          }
        }
      }
    }
  })
)

export default addSalesOperationData
