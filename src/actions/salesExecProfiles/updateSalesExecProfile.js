import gql from 'graphql-tag'
import duck from '../../duck'

const updateSalesExecProfile = async ({ input }) => {
  duck.query({
    query: gql`
     mutation($input: [MentorProfilesUpdate]!){
      updateMentorProfiles(
        input:$input
      ){
        id
        status
        isMentorActive
      }
    }
  `,
    variables: {
      input
    },
    type: 'mentorProfiles/update',
    key: 'mentorProfiles',
  })
}

export default updateSalesExecProfile
