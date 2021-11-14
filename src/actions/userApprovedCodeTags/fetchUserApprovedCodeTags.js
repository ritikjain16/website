import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const fetchUserApprovedCodeTags = async (filterQuery, last, skip) => duck.query({
  query: gql`
    query {
      userApprovedCodeTags(filter: { and: [${filterQuery}] }, orderBy: createdAt_DESC, first: ${last},skip: ${last *
      skip}) {
        title
        codeCount
        id
        status
        createdAt
        updatedAt
      }   
      
      userApprovedCodeTagsMeta(filter: { and: [${filterQuery}] }) {
         count
      }
    }
  `,
  type: 'userApprovedCodeTags/fetch',
  key: 'userApprovedCodeTags',
  changeExtractedData: (extractedData, originalData) => {
    if (originalData.userApprovedCodeTags.length > 0) {
      return { ...originalData, userApprovedCodeTags: get(originalData, 'userApprovedCodeTags') }
    }
    return { ...originalData, userApprovedCodeTags: [] }
  }
})

export default fetchUserApprovedCodeTags
