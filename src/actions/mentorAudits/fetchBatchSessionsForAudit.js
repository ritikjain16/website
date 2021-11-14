import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'
import fetchMentorMenteeSessionAuditsForAudit from './fetchMentorMenteeSessionAuditsForAudit'

const fetchBatchSessionsForAudit = async ({
  filterQuery, mentorMenteeSessionFilters, perPageQueries, skipCount, }) =>
  duck.query({
    query: gql`
        {
    mentorMenteeSessionsMeta: batchSessionsMeta(
        filter: {
        and: [
            { sessionStatus: completed }
            { batch_exists: true }
            ${filterQuery}
            ${mentorMenteeSessionFilters || ''}
        ]
        }
    ) {
        count
    }
    sessionCountWithLink: batchSessionsMeta(
      filter: {
        and: [
          { sessionStatus: completed }
          { batch_exists: true }
          ${filterQuery}
          ${mentorMenteeSessionFilters || ''}
          { sessionRecordingLink_exists:true }
        ]
      }
    ) {
      count
    }
    sessionCountWithIsAudit: batchSessionsMeta(
      filter: {
        and: [
          { sessionStatus: completed }
            { batch_exists: true }
            ${filterQuery}
            ${mentorMenteeSessionFilters || ''}
          { isAudit: true }
        ]
      }
    ) {
      count
    }
    batchSessions(
        filter: { and: [
            { sessionStatus: completed }
            { batch_exists: true }
            ${filterQuery}
            ${mentorMenteeSessionFilters || ''}
        ] }
        first: ${perPageQueries},
        skip: ${perPageQueries * skipCount}
        orderBy: sessionStartDate_DESC
    ) {
        id
        sessionStartDate
        sessionEndDate
        sessionRecordingLink
        sessionCommentByMentor
        isAudit
        sessionStatus
        ${getSlotNames()}
        batch {
        id
        code
        school {
          id
          name
        }
        studentsMeta {
            count
        }
        type
        }
        mentorSession {
        id
        user {
            id
            name
            phone {
            number
            countryCode
            }
        }
        }
        topic {
        id
        order
        title
        }
    }
    }
    `,
    type: 'mentorMenteeSessionsForAudit/fetch',
    key: 'mentorMenteeSessionsForAudit',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.batch = []
      extractedData.batchSessions = []
      extractedData.topic = []
      extractedData.user = []
      extractedData.schools = []
      const batchSessionIds = []
      get(originalData, 'batchSessions', []).forEach(batchSession => {
        batchSessionIds.push(`"${get(batchSession, 'id')}"`)
      })
      const filterQueryValue = `{ batchSession_some:{ id_in: [${batchSessionIds}] } }`
      fetchMentorMenteeSessionAuditsForAudit({
        filterQuery: filterQueryValue,
        fromBatchSession: true
      })
      extractedData.mentorMenteeSessionsForAudit = get(originalData, 'batchSessions', [])
      return { ...extractedData }
    }
  })

export default fetchBatchSessionsForAudit

