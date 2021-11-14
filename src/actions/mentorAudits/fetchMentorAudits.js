import { get } from 'lodash'
import gql from 'graphql-tag'
import duck from '../../duck'

const dataPerPage = 20

const getFilters = filterQuery => {
  if (filterQuery) {
    return filterQuery
  }
  return ''
}

const getMentorMenteeSessionFilters = (mentorMenteeSessionFilters) => {
  if (mentorMenteeSessionFilters) {
    return `{mentorMenteeSession_some:{and:[
        ${mentorMenteeSessionFilters}
      ]}
    }`
  }
  return ''
}

const getFiltersTotalCount = (filterQuery, mentorMenteeSessionFilters) => {
  if (filterQuery) {
    return `(filter:{and:[
      ${filterQuery}
      ${getMentorMenteeSessionFilters(mentorMenteeSessionFilters)}
    ]})`
  }
  return `(filter:{and:[
      ${getMentorMenteeSessionFilters(mentorMenteeSessionFilters)}
]})`
}

const fetchMentorAudits = async (
  filterQuery,
  MentorMenteeSessionFilterQuery,
  skipCount = 0,
) =>
  duck.query({
    query: gql`
  query{
    totalMentorAudits: mentorMenteeSessionAuditsMeta
    ${getFiltersTotalCount(filterQuery, MentorMenteeSessionFilterQuery)}
    {
        count
    }
    mentorMenteeSessionAudits(
      filter:{and:[
        ${getFilters(filterQuery)}
        ${getMentorMenteeSessionFilters(MentorMenteeSessionFilterQuery)}
      ]}
      orderBy:createdAt_DESC
      first: ${dataPerPage}
      skip: ${skipCount * dataPerPage}
      ){
    auditor {
      id
      name
      username
      email
      role
    }
    status
    score
    id
    timestampAnswer {
      rude
      distracted
      dormant
    }
    createdAt
    mentorMenteeSession {    
        id
        sessionStartDate
        sessionEndDate
        sessionStatus
        leadStatus
        source
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
        }
      }
      menteeSession{
        id
        user{
          id
          name
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
      }
    }
  }
  `,
    type: 'mentorAudits/fetch',
    key: 'mentorAudits',
    changeExtractedData: (extractedData, originalData) => {
      if (originalData.mentorMenteeSessionAudits) {
        originalData.mentorMenteeSessionAudits.forEach(async (data, index) => {
          if (get(data, 'mentorMenteeSession.menteeSession') &&
            data.mentorMenteeSession.menteeSession.user &&
            data.mentorMenteeSession.menteeSession.user.id) {
            extractedData.mentorAudits[index].menteeId = get(data.mentorMenteeSession.menteeSession, 'user.id')
            extractedData.mentorAudits[index].menteeName = get(data.mentorMenteeSession.menteeSession, 'user.name')
            extractedData.mentorAudits[index].timezone = get(data.mentorMenteeSession.menteeSession, 'user.timezone')
            extractedData.mentorAudits[index].country = get(data.mentorMenteeSession.menteeSession, 'user.country')
            extractedData.mentorAudits[index].mentorMenteeSession = {
              ...data.mentorMenteeSession
            }
          }
          if (get(data, 'mentorMenteeSession.salesOperation')) {
            extractedData.mentorAudits[index].salesOperation = {
              ...data.mentorMenteeSession.salesOperation,
              log: data.mentorMenteeSession.salesOperation.salesOperationLog
                ? data.mentorMenteeSession.salesOperation.salesOperationLog
                : null
            }
          }
          if (get(data, 'mentorMenteeSession.topic')) {
            extractedData.mentorAudits[index].topic = {
              ...data.mentorMenteeSession.topic
            }
          }
        })
      }
      if (originalData.mentorMenteeSessionAudits && originalData.mentorMenteeSessionAudits.length) {
        return extractedData
      }
      return {
        ...extractedData,
        mentorAudits: []
      }
    }
  })

export default fetchMentorAudits
