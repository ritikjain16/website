import gql from 'graphql-tag'
import duck from '../../duck'
import slotNames from '../../utils/slots/slot-names'

const FETCH_SESSION_LOGS = (menteeId, first, skip) => gql`
  query {
    sessionLogs(
      filter: { and: [{ client_some: { id: "${menteeId}" } }] },
      first: ${first}
      skip: ${first * skip}
      orderBy:createdAt_ASC
    ) {
      action
      id
      ${slotNames()}
      sessionDate
      createdAt
      sessionStatus
      actionBy {
        id
        username
        
      }
      mentor{
        id
        username
      }
    }
  }
`
function fetchSessionLogs(menteeId, first, skip) {
  return duck.createQuery({
    query: FETCH_SESSION_LOGS(menteeId, first, skip),
    type: 'sessionLogs/fetch',
    key: `sessionLogs/${menteeId}/${skip}`,
  })
}

export default fetchSessionLogs
