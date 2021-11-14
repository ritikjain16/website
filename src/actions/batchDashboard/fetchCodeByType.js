import gql from 'graphql-tag'
import duck from '../../duck'

const FETCH_CODES_BY_TYPE = (type) => gql`
query {
  batches(
    orderBy: createdAt_DESC
    first: 1
    filter: { and: [{ type: ${type} }] }
  ) {
    id
    code
    type
  }
}
`
const fetchCodeByType = async (type) => duck.query({
  query: FETCH_CODES_BY_TYPE(type),
  type: 'courses/fetch',
  key: 'coursess',
})

export default fetchCodeByType

