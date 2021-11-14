import gql from 'graphql-tag'
import duck from '../../duck'


const updateStudentProfile = (query) => {
  duck.query({
    query: gql`
       mutation {
        ${query}
       }
        `,
    type: 'studentProfiles/update',
    key: 'studentProfiles',
  })
}

export default updateStudentProfile
