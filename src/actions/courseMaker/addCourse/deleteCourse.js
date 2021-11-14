import gql from 'graphql-tag'
import duck from '../../../duck'

const deleteCourse = async (id) => duck.query({
  query: gql`
      mutation {
        deleteCourse(id: "${id}") {
            id
        }
    }
  `,
  type: 'courses/delete',
  key: 'courses',
})

export default deleteCourse
