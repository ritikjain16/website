import gql from 'graphql-tag'
import duck from '../../duck'

const FETCH_SESSION_LOGS_META = (menteeId) => gql`
  query {
    sessionLogsMeta(
      filter: { and: [{ client_some: { id: "${menteeId}" } }] },   
    ) {
        count
    }
  }
`
function fetchSessionLogsMeta(menteeId) {
  return duck.createQuery({
    query: FETCH_SESSION_LOGS_META(menteeId),
    type: 'sessionLogsMeta/fetch',
    key: 'sessionLogsMeta',
  })
}

export default fetchSessionLogsMeta
