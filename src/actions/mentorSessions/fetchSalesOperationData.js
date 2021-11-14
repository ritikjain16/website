import gql from 'graphql-tag'
import duck from '../../duck'

const fetchSalesOperationData = async (filter) => (
  duck.query({
    query: gql`
  query{ 
    salesOperations(filter: ${filter}){
      id
      userVerificationStatus
      isMentorReadyToTakeClass
      userResponseStatus
      client{
        id
      }
      monitoredBy{
        id
      }
      salesOperationLog{
        id
        salesOperation {
          id
        }
        type
        log
        loggedBy {
          id
          name
          username
        }
        createdAt
        updatedAt
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
      learningSpeed
      personality
      payingPower
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
    type: 'salesOperations/fetch',
    key: 'salesOperations',
  })
)

export default fetchSalesOperationData
