import gql from 'graphql-tag'
import duck from '../../../duck'

const deleteChapter = async (id) => duck.query({
  query: gql`
    mutation {
        deleteChapter(id: "${id}") {
            id
        }
    }
  `,
  type: 'chapters/delete',
  key: 'chapters',
})

export default deleteChapter
