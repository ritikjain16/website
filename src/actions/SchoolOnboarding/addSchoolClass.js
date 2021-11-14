import gql from 'graphql-tag'
import duck from '../../duck'


const addSchoolClass = async (query) =>
  duck.query({
    query: gql`
       mutation {
        ${query}
       }
        `,
    type: 'schoolClasses/add',
    key: 'schoolClasses'
  })

export default addSchoolClass
