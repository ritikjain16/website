import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'
import fetchPostSalesAudit from '../audits/fetchPostSalesAudit'
import fetchMentorMenteeSessionAuditsForAudit from './fetchMentorMenteeSessionAuditsForAudit'

const fetchMentorMenteeSessionsForAudit = async ({
  filterQuery, mentorMenteeSessionFilters, perPageQueries, skipCount, auditType }) =>
  duck.query({
    query: gql`
        {
    mentorMenteeSessionsMeta(
        filter: {
        and: [
            { menteeSession_exists: true }
            { source_not: school }
            { sessionStatus: completed }
            ${filterQuery}
            ${mentorMenteeSessionFilters || ''}
        ]
        }
    ) {
        count
    }
    ${auditType !== 'postSales' ? `
    sessionCountWithLink: mentorMenteeSessionsMeta(
      filter: {
        and: [
          { menteeSession_exists: true }
          { source_not: school }
          { sessionStatus: completed }
          ${filterQuery}
          ${mentorMenteeSessionFilters || ''}
          { sessionRecordingLink_exists: true }
        ]
      }
    ) {
      count
    }
    sessionCountWithIsAudit: mentorMenteeSessionsMeta(
      filter: {
        and: [
          { menteeSession_exists: true }
          { source_not: school }
          { sessionStatus: completed }
          ${filterQuery}
          ${mentorMenteeSessionFilters || ''}
          { isAudit: true }
        ]
      }
    ) {
      count
    }
    sessionCountWith5Rating: mentorMenteeSessionsMeta(
      filter: {
        and: [
          { menteeSession_exists: true }
          { source_not: school }
          { sessionStatus: completed }
          ${filterQuery}
          ${mentorMenteeSessionFilters || ''}
          { rating: 5 }
        ]
      }
    ) {
      count
    }
    sessionCountWithLessThanFiveRating: mentorMenteeSessionsMeta(
      filter: {
        and: [
          { menteeSession_exists: true }
          { source_not: school }
          { sessionStatus: completed }
          ${filterQuery}
          ${mentorMenteeSessionFilters || ''}
          { rating_lt: 5 }
        ]
      }
    ) {
      count
    }
    ` : ''}
    ${auditType === 'postSales' ? `
    sessionCountWithIsPostSalesAudit: mentorMenteeSessionsMeta(
      filter: {
        and: [
          { menteeSession_exists: true }
          { source_not: school }
          { sessionStatus: completed }
          ${filterQuery}
          ${mentorMenteeSessionFilters || ''}
          { isPostSalesAudit: true }
        ]
      }
    ) {
      count
    }
    ` : ''}
    mentorMenteeSessions(
        filter: {
        and: [
            { menteeSession_exists: true }
            { source_not: school }
            { sessionStatus: completed }
            ${filterQuery}
            ${mentorMenteeSessionFilters || ''}
        ]
        }
        orderBy: sessionStartDate_DESC
        first: ${perPageQueries},
        skip: ${perPageQueries * skipCount}
    ) {
        id
        country
        sessionStartDate
        sessionEndDate
        sessionStatus
        isSubmittedForReview
        isFeedbackSubmitted
        sessionRecordingLink
        rating
        comment
        sendSessionLink
        leadStatus
        isPostSalesAudit
        isAudit
        source
        createdAt
        topic {
        id
        title
        order
        }
        mentorSession {
        id
        user {
            id
            name
            username
            phone {
            countryCode
            number
            }
        }
        }
        menteeSession {
        id
        bookingDate
        ${getSlotNames()}
        user {
            id
            name
            timezone
            country
            studentProfile {
            parents {
                user {
                name
                email
                phone {
                    countryCode
                    number
                }
                }
            }
            }
        }
        }
    }
    }
    `,
    type: 'mentorMenteeSessionsForAudit/fetch',
    key: 'mentorMenteeSessionsForAudit',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.completedSession = []
      extractedData.menteeSession = []
      extractedData.topic = []
      extractedData.user = []
      const mmSessionIds = []
      get(originalData, 'mentorMenteeSessions', []).forEach(mmSession => {
        mmSessionIds.push(`"${get(mmSession, 'id')}"`)
      })
      const filterQueryValue = `{ mentorMenteeSession_some: { id_in: [${mmSessionIds}] }}`
      if (auditType === 'postSales') {
        fetchPostSalesAudit({ filterQuery: filterQueryValue })
      } else {
        fetchMentorMenteeSessionAuditsForAudit({
          filterQuery: filterQueryValue
        })
      }
      extractedData.mentorMenteeSessionsForAudit = get(originalData, 'mentorMenteeSessions', [])
      return { ...extractedData }
    }
  })

export default fetchMentorMenteeSessionsForAudit

