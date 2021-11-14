import gql from 'graphql-tag'
import duck from '../../duck'


const addProject = async ({ topicId, ...input }) =>
  duck.query({
    query: gql`
      mutation($input: ProjectInput!) {
        addProject(input: $input, topicsConnectIds: ["${topicId}"]) {
          id
          title
          order
          status
          createdAt
          topics {
            id
          }
        }
    }
    `,
    variables: {
      input
    },
    type: 'project/add',
    key: 'projects',
  })

export default addProject
