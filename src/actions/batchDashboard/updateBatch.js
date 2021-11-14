import gql from 'graphql-tag'
import duck from '../../duck'

const updateBatch = async (input, id, allotedMentorId, currentComponentId, topicId, courseConnectId = '', componentInput) =>
  duck.query({
    query: gql`
    mutation($input: BatchUpdate, $componentInput: BatchCurrentComponentStatusUpdate) {
    updateBatch(input: $input, id: "${id}", ${allotedMentorId ? `allottedMentorConnectId: "${allotedMentorId}"` : ''},
      ${courseConnectId ? `courseConnectId: "${courseConnectId}"` : ''}
  ) {
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
  updateBatchCurrentComponentStatus(input: $componentInput, id: "${currentComponentId}",
     ${topicId ? `currentTopicConnectId: "${topicId}"` : ''},
     ${courseConnectId ? `currentCourseConnectId: "${courseConnectId}"` : ''}
     ) {
    id
    currentTopic {
      id
      title
      order
    }
  }
}
    `,
    variables: {
      input,
      componentInput,
      callBatchAPI: true
    },
    type: 'batch/update',
    key: 'batches',
  })

export default updateBatch
