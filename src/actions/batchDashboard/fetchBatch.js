import gql from 'graphql-tag'
import moment from 'moment'
import { get } from 'lodash'
import duck from '../../duck'

const FETCH_BATCHES = (first, skip, filterQuery) => gql`
query {
  batches(orderBy: createdAt_DESC, first: ${first},skip: ${first *
  skip} filter: { and: [${filterQuery}] }) {
    id
    code
    type
    description
    course {
      id
    }
    studentsMeta {
      count
    }
    allottedMentor {
      id
      name
    }
    currentComponent {
      id
      enrollmentType
      currentTopic {
        id
        title
        order
      }
    }
    createdAt
    updatedAt
  }
  batchesMeta(filter: { and: [${filterQuery}] }) {
    count
  }
}
`
const fetchBatches = async (last, skip, filterQuery) =>
  duck.query({
    query: FETCH_BATCHES(last, skip, filterQuery),
    type: 'batches/fetch',
    key: 'batches',
    changeExtractedData: (extractedData, originalData) => {
      let tableData = []
      if (originalData.batches.length > 0) {
        const batches = get(originalData, 'batches')
        batches.forEach((batch) => {
          tableData.push({
            ...batch,
            id: batch.id,
            code: batch.code,
            type: batch.type,
            studentCount: get(batch, 'studentsMeta.count', ''),
            description: batch.description || '-',
            allotedMentorId: get(batch, 'allottedMentor.id'),
            enrollmentType: get(batch, 'currentComponent.enrollmentType', ''),
            topicId: batch.currentComponent
              ? batch.currentComponent.currentTopic.id
              : '',
            currentComponentId: batch.currentComponent
              ? batch.currentComponent.id
              : '',
            topic: batch.currentComponent
              ? batch.currentComponent.currentTopic.title
              : '',
            order: batch.currentComponent
              ? batch.currentComponent.currentTopic.order
              : '',
            allotedMentorName: batch.allottedMentor
              ? batch.allottedMentor.name
              : '',
            createdAt: moment(batch.createdAt).format('L'),
            updatedAt: moment(batch.updatedAt).format('L'),
            srNo: tableData.length + 1,
          })
        })
      } else {
        tableData = []
      }
      return { ...originalData, batches: tableData }
    },
  })

export default fetchBatches
