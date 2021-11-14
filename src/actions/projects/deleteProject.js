import gql from 'graphql-tag'
import duck from '../../duck'

const deleteProject = async (id) => duck.query({
  query: gql`
      mutation {
        deleteProject(id: "${id}") {
            id
            title
            order
            status
            createdAt
            topic {
              id
            }
        }
    }
  `,
  type: 'project/delete',
  key: 'projects',
})

export default deleteProject
