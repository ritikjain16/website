import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchProjectCount = async (key, filterOption) =>
  duck.query({
    query: gql`
{
  blockBasedProjectsMeta(
    filter: { and: [{ type: ${key} }, ${filterOption}] }
  ) {
    count
  }
}
    `,
    type: 'blockBasedProjects/fetch',
    key: 'projectCount',
  })

export default fetchProjectCount

