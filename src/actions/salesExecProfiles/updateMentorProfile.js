import gql from 'graphql-tag'
import duck from '../../duck'

const updateMentorToSalesExecutive = async (id, salesExecutiveProfileId) =>
  duck.query({
    query: gql`
      mutation($input: MentorProfileUpdate) {
        updateMentorProfile(
          id: "${id}"
          salesExecutiveConnectId: "${salesExecutiveProfileId}"
          input: $input
        ) {
          id
        }
      }

    `,
    type: 'mentors/update',
    key: 'updateMentor',
  })

export default updateMentorToSalesExecutive
