import gql from 'graphql-tag'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const fetchMentorMenteeSession = async (mentorMenteeSessionId) => (
  duck.query({
    query: gql`
  query{ 
    mentorMenteeSession(id:"${mentorMenteeSessionId}"){
      id
      sessionStartDate
      sessionEndDate
      sessionStatus
      isSubmittedForReview
      sendSessionLink
      leadStatus
      isAudit
      source
      createdAt
      course {
        id
        title
      }
      topic{
        id
        title
        order
        thumbnailSmall {
          uri
        }
      }
      mentorSessionData: mentorSession{
        sessionType
        userData: user {
          id
        }
      }
      menteeSessionData: menteeSession{
        id
        bookingDate
      ${getSlotNames()}
        userData: user{
          id
          name
          timezone
          country
          studentProfile{
            parents{
              userData: user{
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
      isFeedbackSubmitted
      fastPaced
      notPunctual
      average
      boring
      poorExplanation
      averageExplanation
      comment
      sessionRecordingLink
      otherLanguageBarrier
      otherTechnicalReason
      languageBarrier
      hasRescheduled
      rescheduledDate
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
      salesOperationData: salesOperation{
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
  }
  `,
    type: 'mentorMenteeSession/fetch',
    key: 'mentorMenteeSession',
    changeExtractedData: (extractedData, originalData) => {
      if (originalData.mentorMenteeSession) {
        extractedData.mentorMenteeSession = originalData.mentorMenteeSession
      }
      if (originalData.mentorMenteeSession) {
        return extractedData
      }
      return {
        ...extractedData,
        mentorMenteeSession: null
      }
    }
  })
)

export default fetchMentorMenteeSession
