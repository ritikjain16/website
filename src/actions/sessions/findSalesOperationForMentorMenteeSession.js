// import { filter } from 'lodash'
// import moment from 'moment'
import gql from 'graphql-tag'
import duck from '../../duck'

const findSalesOperationForMentorMenteeSession = async (menteeId, courseId) => duck.query({
  query: gql`
  query{
    unlinkedSalesOperation: salesOperations(
      filter: { and: [{ client_some: { id: "${menteeId}" } }, { course_some: { id: "${courseId}" } }] }
    ){
      id
        client{
          id
        }
        monitoredBy{
          id
        }
        firstMentorMenteeSession{
          id
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
      }
  }
  `,
  type: 'unlinkedSalesOperation/fetch',
  key: 'getSalesOperation',
  changeExtractedData: (extracted, original) => ({
    unlinkedSalesOperation: original.unlinkedSalesOperation
  })
})

export default findSalesOperationForMentorMenteeSession
