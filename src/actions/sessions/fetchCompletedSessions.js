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

const getUserData = `id
  name
  timezone
  country
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
  }`

const getFiltersTotalCount = (sessionType, filterQuery, country = 'india', sessionFilter, userId) => {
  const transformationQueryNot = '{source_not: school}'
  const { dateFilter, filterQuery: fQuery, showSessionLogs, userFilter } = sessionFilter || {}
  const sessionLogsFilter = `{ action: deleteMentorMenteeSession }${!dateFilter ? '' : dateFilter}
      ${!fQuery ? '' : fQuery}
      ${!userFilter ? '' : userFilter}`
  if (filterQuery) {
    return `(filter:{and:[
      ${showSessionLogs ? '' : `${userId ? `{ menteeSession_some: { user_some: { id: "${userId}" } } }` : filterQuery}`}
      ${showSessionLogs ? sessionLogsFilter : '{menteeSession_exists: true}'}
      ${transformationQueryNot}
      ${sessionType === 'trial' ? '{topic_some: {order: 1}}' : '{topic_some: {order_not: 1}}'}
      ${country === 'all' ? '' : `{country:${country}}`}
    ]})`
  }
  return `(filter:{and:[
    ${transformationQueryNot}
    ${userId ? `{ menteeSession_some: { user_some: { id: "${userId}" } } }` : ''}
    ${showSessionLogs ? sessionLogsFilter : ''}
    ${sessionType === 'trial' ? '{topic_some: {order: 1}}' : '{topic_some: {order_not: 1}}'}
    ${country === 'all' ? '' : `{country:${country}}`}
  ]})`
}

const getSessionsQuery = (sessionType,
  filterQuery,
  skipCount = 0,
  country,
  sessionFilter,
  userId) => {
  let query = ''
  const transformationQueryNot = '{source_not: school}'
  const { dateFilter, filterQuery: fQuery, showSessionLogs, userFilter } = sessionFilter || {}
  if (showSessionLogs) {
    query = gql`{
    totalCompletedSessions: sessionLogsMeta${getFiltersTotalCount(sessionType, filterQuery, country, sessionFilter)}{
      count
    }
  sessionLogs(
    filter: {
      and: [
        ${transformationQueryNot}
        ${!dateFilter ? '' : dateFilter}
        ${!fQuery ? '' : fQuery}
        ${!userFilter ? '' : userFilter}
        { action: deleteMentorMenteeSession }
        ${sessionType === 'trial' ? '{topic_some: {order: 1}}' : '{topic_some: {order_not: 1}}'}
        ${country === 'all' ? '' : `{country:${country}}`}
      ]
    }
    first: ${dataPerPage}
    skip: ${skipCount * dataPerPage}
    orderBy:sessionStartDate_DESC
  ) {
    id
    client {
      ${getUserData}
    }
    course {
      id
      title
    }
    mentor {
      name
      id
      username
      phone{
        countryCode
        number
      }
      mentorProfile {
        sessionLink
      }
    }
    topic {
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
  }
}
`
  } else {
    query = gql`query{
    totalCompletedSessions: mentorMenteeSessionsMeta${getFiltersTotalCount(sessionType, filterQuery, country, sessionFilter, userId)}{
      count
    }
    mentorMenteeSessions(
      filter:{and:[
        ${!userId ? getFilters(filterQuery) : `{ menteeSession_some: { user_some: { id: "${userId}" } } }`}
        {menteeSession_exists:true}
        ${transformationQueryNot}
        ${sessionType === 'trial' ? '{topic_some: {order: 1}}' : '{topic_some: {order_not: 1}}'}
        ${country === 'all' ? '' : `{country:${country}}`}
      ]}
      orderBy:sessionStartDate_DESC
      first: ${dataPerPage}
      skip: ${skipCount * dataPerPage}
      ){
      id
      course {
        id
        title
      }
      sessionStartDate
      sessionEndDate
      sessionStatus
      isSubmittedForReview
      isFeedbackSubmitted
      sendSessionLink
      leadStatus
      isAudit
      isPostSalesAudit
      source
      createdAt
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
          phone{
            countryCode
            number
          }
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
          ${getUserData}
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
  }`
  }
  return query
}

const fetchCompletedSessions = async (
  {
    sessionType,
    filterQuery,
    skipCount = 0,
    country,
    queryNumberCount,
    sessionFilter,
    userId,
  }
) => duck.query({
  query: getSessionsQuery(sessionType, filterQuery, skipCount, country, sessionFilter, userId),
  type: 'completedSession/fetch',
  key: `completedSession/${queryNumberCount}`,
  changeExtractedData: (extractedData, originalData) => {
    const { showSessionLogs } = sessionFilter || {}
    extractedData.course = []
    if (showSessionLogs) {
      if (originalData.sessionLogs) {
        originalData.sessionLogs.forEach((data, index) => {
          if (data.client && data.client.id) {
            extractedData.sessionLogs[index].menteeId = get(data, 'client.id')
            extractedData.sessionLogs[index].menteeName = get(data, 'client.name')
            extractedData.sessionLogs[index].timezone = get(data, 'client.timezone')
            extractedData.sessionLogs[index].country = get(data, 'client.country')
            extractedData.sessionLogs[index].mentorName = get(data, 'mentor.name')
            extractedData.sessionLogs[index].parentsInfo = get(data, 'client.studentProfile.parents')
            extractedData.sessionLogs[index].course = get(data, 'course')
            extractedData.sessionLogs[index].mentorSession = {
              user: {
                name: get(data, 'mentor.name')
              }
            }
            extractedData.sessionLogs[index].menteeSession = {
              menteeId: get(data, 'client.id'),
              menteeName: get(data, 'client.name')
            }
            for (let i = 0; i < 24; i += 1) {
              if (get(data, `slot${i}`)) {
                extractedData.sessionLogs[index].slotId = i
                break
              }
            }
            if (data.topic) {
              extractedData.sessionLogs[index].topic = {
                ...data.topic
              }
            }
          }
        })
      }
    } else {
      if (originalData.mentorMenteeSessions) {
        localStorage.setItem('fetchedCompletedSessionLength', originalData.mentorMenteeSessions.length)
        originalData.mentorMenteeSessions.forEach(async (data, index) => {
          if (data.menteeSession && data.menteeSession.user && data.menteeSession.user.id) {
            extractedData.completedSession[index].menteeId = get(data.menteeSession, 'user.id')
            extractedData.completedSession[index].menteeName = get(data.menteeSession, 'user.name')
            extractedData.completedSession[index].timezone = get(data.menteeSession, 'user.timezone')
            extractedData.completedSession[index].country = get(data.menteeSession, 'user.country')
            extractedData.completedSession[index].mentorName = get(data.mentorSession, 'user.name')
            extractedData.completedSession[index].course = get(data, 'course')
            extractedData.completedSession[index].parentsInfo =
              data.menteeSession.user.studentProfile.parents
            for (let i = 0; i < 24; i += 1) {
              if (get(data.menteeSession, `slot${i}`)) {
                extractedData.completedSession[index].slotId = i
                break
              }
            }
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
    }
    return {
      ...extractedData,
    }
  }
})
export default fetchCompletedSessions
