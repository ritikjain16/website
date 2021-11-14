import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const fetchContentTags = async (filterQuery, first, skip) => duck.query({
  query: gql`
    query {
      contentTags(filter: { and: [${filterQuery}] }, first: ${first}, skip: ${first * skip}) {
      id
      title
      status
      createdAt
      updatedAt
    }
    contentTagsMeta(filter: { and: [${filterQuery}] }) {
      count
    }
  }
  `,
  type: 'contentTags/fetch',
  key: 'contentTags',
  changeExtractedData: (extractedData, originalData) => {
    if (originalData && originalData.contentTags.length > 0) {
      return { ...extractedData, contentTags: get(originalData, 'contentTags') }
    }
    return { ...extractedData, contentTags: [] }
  }
})

export default fetchContentTags
