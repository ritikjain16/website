import gql from 'graphql-tag'
import duck from '../../../duck'


const deleteContentProject = async ({ projectId, key }) =>
  duck.query({
    query: gql`
    mutation {
        deleteBlockBasedProject(id: "${projectId}") {
            id
        }
    }
    `,
    type: 'blockBasedProjects/delete',
    key,
  })

export default deleteContentProject
