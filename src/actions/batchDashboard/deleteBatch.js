import gql from 'graphql-tag'
import duck from '../../duck'

const deleteBatch = async (id) => duck.query({
  query: gql`
      mutation {
      deleteBatch(id: "${id}") {
      id
      course {
        createdAt
        updatedAt
      }
      code
      type
      description
      studentsMeta {
        count
      }
      allottedMentor {
        name
      }
      currentComponent {
        currentTopic {
          title
          order
        }
      }
    }
  }
  `,
  variables: {
    callBatchAPI: true
  },
  type: 'batch/delete',
  key: 'deleteBatch',
})

export default deleteBatch
