import gql from 'graphql-tag'
import duck from '../../duck'

const deleteSchool = async (id) => (
  duck.query({
    query: gql`
mutation deleteSchhol{
  deleteSchool(
    id:"${id}"
  ){
    id
  }
}
        `,
    type: 'schools/delete',
    key: 'schools'
  })
)

export default deleteSchool
