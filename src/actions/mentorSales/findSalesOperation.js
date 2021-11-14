// import { filter } from 'lodash'
// import moment from 'moment'
import gql from 'graphql-tag'
import duck from '../../duck'

const findSalesOperation = async (menteeId) => duck.query({
  query: gql`
  query{
    unlinkedSalesOperation: salesOperations(
      filter: {client_some: {id: "${menteeId}"}}
    ){
        id
        enrollmentType
        client{
          id
          name
          gender
          studentProfile{
            id
            grade
            parents{
              id
              user{
                id
                name
                phone{
                  countryCode
                  number
                }
                email
              }
            }
          }
        }
        monitoredBy{
          id
        }
        salesOperationActivities{
          id
          actionOn
          currentData
          oldData
          createdAt
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

export default findSalesOperation
