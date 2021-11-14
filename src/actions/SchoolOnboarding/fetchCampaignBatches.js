import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const fetchCampaignBatches = async ({ perPage, skip, id }) =>
  duck.query({
    query: gql`
      {
        batches(
          filter: { campaign_some: { id: "${id}" } }
          first: ${perPage}
          skip: ${perPage * skip}
          orderBy: createdAt_ASC
        ) {
          id
          code
          classes {
            id
            grade
            section
          }
          campaign {
            id
            type
          }
          studentsMeta {
            count
          }
          course {
            id
            title
          }
          allottedMentor {
            id
            name
          }
          b2b2ctimeTable {
            bookingDate
            ${getSlotNames()}
          }
        }
        batchesMeta(filter: { campaign_some: { id: "${id}" } }) {
          count
        }
      }
    `,
    type: 'campaignBatches/fetch',
    key: 'campaignBatches',
    changeExtractedData: (extractedData, originalData) => {
      const batches = []
      get(originalData, 'batches', []).forEach((batch, index) => {
        const grades = [...new Set(get(batch, 'classes', []).map(({ grade }) => grade))]
        const sections = [...new Set(get(batch, 'classes', []).map(({ section }) => section))]
        const session = get(batch, 'b2b2ctimeTable')
        let slot = ''
        let bookingDate = ''
        for (const property in session) {
          if (property.startsWith('slot')) {
            if (session[property] === true) {
              slot = property
              bookingDate = get(session, 'bookingDate')
            }
          }
        }
        if (get(batch, 'campaign.id') === id) {
          batches.push({
            ...batch,
            index: index + 1,
            grade: grades,
            section: sections,
            students: get(batch, 'studentsMeta.count', 0),
            allottedMentor: get(batch, 'allottedMentor'),
            course: get(batch, 'course.title'),
            slot,
            bookingDate
          })
        }
      })
      return { ...extractedData, batches, campaignBatchesMeta: get(originalData, 'batchesMeta', {}) }
    }
  })

export default fetchCampaignBatches

