import gql from 'graphql-tag'
import duck from '../../duck'

const FETCH_CHEAT_SHEET = (topicId) => gql`
{
  cheatSheets(filter: { topic_some: { id: "${topicId}" } }) { id title status order description createdAt }
}
`
function fetchCheatSheet(topicId) {
  return duck.query({
    query: FETCH_CHEAT_SHEET(topicId),
    type: 'cheatSheets/fetch',
    key: 'cheatSheets',
  })
}

export default fetchCheatSheet
