// updateMentorMenteeReschedule

import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'
import updateRescheduleSheet from './updateRescheduleSheet'

const updateMentorMenteeReschedule = async (sessionId, input) => {
  duck.query({
    query: gql`
     mutation(
      $input: MentorMenteeSessionUpdate!
     ){
      updateMentorMenteeSession(
        input:$input,
        id: "${sessionId}"
      ){
      id
      sessionStartDate
      sessionEndDate
      sessionStatus
      isSubmittedForReview
      sendSessionLink
      topic{
        id
        title
        order
      }
      course{
        id
      }
      mentorSession{
        id
        user{
          id
          name
          username
          mentorProfile {
            sessionLink
          }
        }
      }
      menteeSession{
        id
        bookingDate
      ${getSlotNames()}
          user{
            id
            name
            email
            gender
            studentProfile{
              grade
              parents{
                user{
                  name
                  email
                  phone{
                    number
                  }
                }
              }
            }
          }
      }
      rating
      friendly
      motivating
      engaging
      helping
      enthusiastic
      patient
      conceptsPerfectlyExplained
      distracted
      rude
      slowPaced
      fastPaced
      notPunctual
      average
      boring
      poorExplanation
      averageExplanation
      comment
      sessionRecordingLink
      hasRescheduled
      rescheduledDate
      rescheduledDateProvided
      internetIssue
      zoomIssue
      laptopIssue
      chromeIssue
      powerCut
      notResponseAndDidNotTurnUp
      turnedUpButLeftAbruptly
      leadNotVerifiedProperly
      otherReasonForReschedule
      sessionCommentByMentor
      salesOperation{
        id
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
    }
  `,
    variables: {
      input
    },
    type: 'completedSession/update',
    key: 'completedSession',
    changeExtractedData: (extractedData, originalData) => {
      updateRescheduleSheet(get(originalData, 'updateMentorMenteeSession'))
      duck.merge(() => ({
        completedSession: {
          ...get(originalData, 'updateMentorMenteeSession'),
          menteeId: get(
            originalData.updateMentorMenteeSession.menteeSession,
            'user.id'
          ),
          menteeName: get(
            originalData.updateMentorMenteeSession.menteeSession,
            'user.name'
          ),
          parentsInfo:
            originalData.updateMentorMenteeSession.menteeSession.user.studentProfile.parents,
          salesOperation: {
            ...originalData.updateMentorMenteeSession.salesOperation,
            log: get(originalData, 'updateMentorMenteeSession.salesOperation.salesOperationLog')
          },
          topic: {
            ...originalData.updateMentorMenteeSession.topic
          }
        },
        salesOperationForMentorSales: get(originalData, 'updateMentorMenteeSession')
      }))
      return {}
      // let menteeId
      // let menteeName
      // let parentsInfo
      // let salesOperation
      // let topic
      // if (originalData.updateMentorMenteeSession) {
      //   if (
      //     originalData.updateMentorMenteeSession.menteeSession &&
      //     originalData.updateMentorMenteeSession.menteeSession.user &&
      //     originalData.updateMentorMenteeSession.menteeSession.user.id
      //   ) {
      //     menteeId = get(
      //       originalData.updateMentorMenteeSession.menteeSession,
      //       'user.id'
      //     )
      // extractedData.completedSession.menteeId = get(
      //   originalData.updateMentorMenteeSession.menteeSession,
      //   'user.id'
      // )
      // menteeName = get(
      //   originalData.updateMentorMenteeSession.menteeSession,
      //   'user.name'
      // )
      // extractedData.completedSession.menteeName = get(
      //   originalData.updateMentorMenteeSession.menteeSession,
      //   'user.name'
      // )
      // parentsInfo =
      //   originalData.updateMentorMenteeSession.menteeSession.user.studentProfile.parents
      // extractedData.completedSession.parentsInfo =
      //   originalData.updateMentorMenteeSession.menteeSession.user.studentProfile.parents
      // }
      // if (originalData.updateMentorMenteeSession.salesOperation) {
      // extractedData.completedSession.salesOperation = {
      //   ...originalData.updateMentorMenteeSession.salesOperation,
      //   log: originalData.updateMentorMenteeSession.salesOperation.salesOperationLog
      //     ? originalData.updateMentorMenteeSession.salesOperation.salesOperationLog
      //     : null
      // }
      //   salesOperation = {
      //     ...originalData.updateMentorMenteeSession.salesOperation,
      //     log: originalData.updateMentorMenteeSession.salesOperation.salesOperationLog
      //       ? originalData.updateMentorMenteeSession.salesOperation.salesOperationLog
      //       : null
      //   }
      // }
      // if (originalData.updateMentorMenteeSession.topic) {
      // extractedData.completedSession.topic = {
      //   ...originalData.updateMentorMenteeSession.topic
      // }
      //   topic = {
      //     ...originalData.updateMentorMenteeSession.topic
      //   }
      // }
    }
    // if (originalData.mentorMenteeSessions) {
    //   originalData.mentorMenteeSessions.forEach(async (data, index) => {
    //     if (data.menteeSession && data.menteeSession.user && data.menteeSession.user.id) {
    //       extractedData.completedSession[index].menteeId = get(data.menteeSession, 'user.id')
    //       extractedData.completedSession[index].menteeName =
    // get(data.menteeSession, 'user.name')
    //       extractedData.completedSession[index].parentsInfo
    //         = data.menteeSession.user.studentProfile.parents
    //     }
    //     if (data.salesOperation) {
    //       extractedData.completedSession[index].salesOperation = {
    //         ...data.salesOperation,
    //         log: data.salesOperation.salesOperationLog
    //           ? data.salesOperation.salesOperationLog : null
    //       }
    //     }
    //     if (data.topic) {
    //       extractedData.completedSession[index].topic = {
    //         ...data.topic
    //       }
    //     }
    //   }) salesOperationForMentorSales
    // }
    // return {
    //   ...extractedData,
    //   completedSession: {
    //     ...get(originalData, 'updateMentorMenteeSession'),
    //     menteeId,
    //     menteeName,
    //     parentsInfo,
    //     salesOperation,
    //     topic
    //   },
    //   salesOperationForMentorSales: get(originalData, 'updateMentorMenteeSession')
    // }
    // }
  })
}

export default updateMentorMenteeReschedule
