import gql from 'graphql-tag'
import duck from '../../../duck'

const deleteQuestionBank = async ({ id, key }) => duck.query({
  query: gql`
    mutation {
      deleteQuestionBank(id: "${id}") {
        id
      }
    }
  `,
  type: 'questionBanks/delete',
  key: `questionBanks/${key}`,
})

export default deleteQuestionBank
