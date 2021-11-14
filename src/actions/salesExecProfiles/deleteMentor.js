import gql from 'graphql-tag'
import duck from '../../duck'

const deleteMentor = (id, salesExecId) =>
  duck.createQuery({
    query: gql`
      mutation {
    removeFromSalesExecutiveProfileMentorProfile(
      mentorProfileId: "${id}"
      salesExecutiveProfileId: "${salesExecId}"
    ) {
      mentorProfile {
        id
      }
    }
  }
    `,
    type: 'mentors/delete',
    key: 'deleteMentor'
  })

export default deleteMentor
