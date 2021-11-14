import gql from 'graphql-tag'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const getFilters = (userIds, customFilters, actions) => {
  // let filter = '{or:[{batchSessions_some:{
  // batch_exists:true}},{mentorMenteeSessions_some:{menteeSession_exists:true}}]},'
  let filter = ''
  if (customFilters) {
    filter += customFilters
  }
  if (actions) {
    filter += `{action_in: [${actions}]}`
  }
  if (userIds) {
    filter += `{mentor_some:{id_in:[${userIds}]}}`
  }

  return filter
}

const fetchSessionLogs = async (
  userIds,
  filters = null,
  actions = null,
  key = null,
) => duck.query({
  query: gql`
    query {
        sessionLogs(
        filter: { and: [${getFilters(userIds, filters, actions)}]
    }) {
        id
        client {
          id
          name
        }
        course {
          id
          title
        }
        mentor {
          name
          id
        }
        topic{
          id
          title
          order
          thumbnailSmall {
            uri
          }
        }
        action
        sessionDate
        sessionStatus
        mentorAvailabilityDate
        batchCode
        sessionStartDate
        sessionEndDate
        classMissedMessageStatus
        sendSessionLink
        leadStatus
        source
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
        isFeedbackSubmitted
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
        languageBarrier
        otherLanguageBarrier
        otherTechnicalReason
        rescheduledDateProvided
        internetIssue
        zoomIssue
        laptopIssue
        chromeIssue
        videoNotLoading
        webSiteLoadingIssue
        classDurationExceeded
        logInOTPError
        codePlaygroundIssue
        powerCut
        notResponseAndDidNotTurnUp
        turnedUpButLeftAbruptly
        leadNotVerifiedProperly
        otherReasonForReschedule
        otherReasonForChallenges
        sessionCommentByMentor
        didNotTurnUpInSession
        didNotPickTheCall
        sessionNotConducted
        ${getSlotNames()}
        createdAt
        salesOperation {
          personality
          prodigyChild
          learningSpeed
          studentEnglishSpeakingSkill
          parentEnglishSpeakingSkill
          parentCounsellingDone
          leadStatus
          isMentorReadyToTakeClass
          knowCoding
          lookingForAdvanceCourse
          ageNotAppropriate
          ageNotAppropriate
          notInterestedInCoding
          payingPower
        }
    }
  }
  `,
  type: 'sessionLogs/fetch',
  key: key || 'sessionLogs',
  changeExtractedData: (extractedData, originalData) => {
    if (originalData.sessionLogs) {
      extractedData.sessionLogs = originalData.sessionLogs
    }
    if (originalData.sessionLogs && originalData.sessionLogs.length) {
      return extractedData
    }
    return {
      ...extractedData,
      sessionLogs: []
    }
  }
})

export default fetchSessionLogs
