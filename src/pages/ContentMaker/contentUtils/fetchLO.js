import gql from 'graphql-tag'
import requestToGraphql from '../../../utils/requestToGraphql'

const fetchLO = async () => {
  const data = await requestToGraphql(gql`
  {
    learningObjectives {
    id
    title
    topics {
      id
      title
    }
    courses {
      id
      title
    }
  }
  }
  `)
  return data
}

export default fetchLO
