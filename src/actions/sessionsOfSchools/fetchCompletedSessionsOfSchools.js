import { get } from 'lodash'
// import { groupBy, filter } from 'lodash'
import gql from 'graphql-tag'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'
// import requestToGraphql from '../../utils/requestToGraphql'

const dataPerPage = 30

const getFilters = filterQuery => {
  if (filterQuery) {
    return filterQuery
  }
  return ''
}

const getFiltersTotalCount = (sessionType, filterQuery) => {
  if (filterQuery) {
    return `(filter:{and:[
      ${filterQuery}
      {menteeSession_exists: true}
      {source:school}
      ${sessionType === 'trial' ? '{topic_some: {order: 1}}' : '{topic_some: {order_not: 1}}'}
    ]})`
  }
  return `(filter:{and:[
    {source:school}
    ${sessionType === 'trial' ? '{topic_some: {order: 1}}' : '{topic_some: {order_not: 1}}'}
  ]})`
}

const fetchCompletedSessionsOfSchools = async (sessionType, filterQuery, skipCount = 0) =>
  duck.query({
    query: gql`
  query{
    totalCompletedSessions: mentorMenteeSessionsMeta${getFiltersTotalCount(
    sessionType,
    filterQuery
  )}{
      count
    }
    mentorMenteeSessions(
      filter:{and:[
        ${getFilters(filterQuery)}
        {menteeSession_exists:true}
        {source:school}
        ${sessionType === 'trial' ? '{topic_some: {order: 1}}' : '{topic_some: {order_not: 1}}'}
      ]}
      orderBy:sessionStartDate_DESC
      first: ${dataPerPage}
      skip: ${skipCount * dataPerPage}
      ){
      id
      course{
        id
        title
      }
      sessionStartDate
      sessionEndDate
      sessionStatus
      isSubmittedForReview
      isFeedbackSubmitted
      sendSessionLink
      topic{
        id
        title
        order
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
          studentProfile{
            parents{
              user{
                name
                email
                phone{
                  countryCode
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
    type: 'completedSession/fetch',
    key: 'completedSession',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.course = []
      if (originalData.mentorMenteeSessions) {
        originalData.mentorMenteeSessions.forEach(async (data, index) => {
          if (data.menteeSession && data.menteeSession.user && data.menteeSession.user.id) {
            extractedData.completedSession[index].menteeId = get(data.menteeSession, 'user.id')
            extractedData.completedSession[index].menteeName = get(data.menteeSession, 'user.name')
            extractedData.completedSession[index].course = get(data, 'course')
            extractedData.completedSession[index].parentsInfo =
              data.menteeSession.user.studentProfile.parents
          }
          if (data.salesOperation) {
            extractedData.completedSession[index].salesOperation = {
              ...data.salesOperation,
              log: data.salesOperation.salesOperationLog
                ? data.salesOperation.salesOperationLog
                : null
            }
          }
          if (data.topic) {
            extractedData.completedSession[index].topic = {
              ...data.topic
            }
          }
        })
      }
      if (originalData.mentorMenteeSessions && originalData.mentorMenteeSessions.length) {
        return extractedData
      }
      return {
        ...extractedData,
        completedSession: []
      }
    }
  })

export default fetchCompletedSessionsOfSchools
