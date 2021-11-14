import gql from 'graphql-tag'
import duck from '../../duck'

const FETCH_PROJECT_CONTENT = (projectId) => gql`
{
  project(id: "${projectId}") {
    id
    title
    content {
      id
      order
      type
      statement
      emoji {
        id
        code
        image {
          id
          uri
        }
      }
      image {
        id
        uri
      }
      terminalInput
      terminalOutput
    }
  }
}
`
function fetchProjectContents(projectId) {
  return duck.query({
    query: FETCH_PROJECT_CONTENT(projectId),
    type: 'project/fetch',
    key: 'projects',
  })
}

export default fetchProjectContents
