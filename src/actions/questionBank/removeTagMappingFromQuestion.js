import gql from 'graphql-tag'
import duck from '../../duck'

const removeTagMappingFromQuestion = async (questionId, tagId) => duck.query({
  query: gql`
    mutation {
    removeFromContentTagQuestionBank(questionBankId: "${questionId}", contentTagId: "${tagId}") {
      questionBank {
        id
      }
    }
    }
  `,
  type: 'contentTag/delete',
  key: 'contentTags',
})

export default removeTagMappingFromQuestion
