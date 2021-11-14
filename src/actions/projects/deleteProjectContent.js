import gql from 'graphql-tag'
import duck from '../../duck'

const deleteProjectContent = async (id) => duck.query({
  query: gql`
    mutation {
    deleteProjectContent(id: "${id}") {
        id
        type
    }
    }
  `,
  type: 'projectContent/delete',
  key: 'projectContents',
})

export default deleteProjectContent
