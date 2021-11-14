import gql from 'graphql-tag'
import duck from '../../duck'
import getIdArrForQuery from '../../utils/getIdArrForQuery'

const deleteSchoolClasses = async (classesIds) => duck.query({
  query: gql`
    mutation {
      deleteSchoolClasses(filter: { id_in:[${getIdArrForQuery(classesIds)}] }) {
        id
      }
    }
  `,
  type: 'schoolClasses/delete',
  key: 'schoolClasses',
})

export default deleteSchoolClasses
