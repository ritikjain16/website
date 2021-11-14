import gql from 'graphql-tag'
import duck from '../../duck'

const sendJourneySnapshotInMail = async (userId) =>
  duck.query({
    query: gql`
      mutation{
        sendJourneySnapshotInMail(input:
        {userId: "${userId}"}){
        result
        error
      }
      }
    `,
    type: 'sendJourneySnapshotInMail/update',
    key: 'sendJourneySnapshotInMail',
  })

export default sendJourneySnapshotInMail
