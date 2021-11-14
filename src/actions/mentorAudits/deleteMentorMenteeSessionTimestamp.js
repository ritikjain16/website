import gql from 'graphql-tag'
import duck from '../../duck'

const deleteMentorMenteeSessionTimestamp = async (mentorMenteeSessionAuditTimeStampId) =>
  duck.query({
    query: gql`
    mutation {
    deleteMentorMenteeSessionTimestamp(
        id:"${mentorMenteeSessionAuditTimeStampId}"
        ){
        id
    }
  }
  `,
    type: 'mentorMenteeSessionTimestamp/delete',
    key: 'mentorMenteeSessionTimestamp'
  })

export default deleteMentorMenteeSessionTimestamp
