import gql from 'graphql-tag'
import duck from '../../duck'

const updateProject = async ({ id, ...input }) =>
  duck.query({
    query: gql`
   mutation($input: ProjectUpdate) {
    updateProject(id: "${id}", input: $input) {
        id
        title
        status
        order
        createdAt
        topic {
          id
        }
    }
    }
    `,
    variables: {
      input,
    },
    type: 'project/update',
    key: 'projects',
  })

export default updateProject
