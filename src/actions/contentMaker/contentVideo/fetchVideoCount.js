import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchVideoCount = async (filterOption) =>
  duck.query({
    query: gql`
    {
      videosMeta(filter: { and: [${!filterOption ? '' : filterOption}] }) {
        count
      }
    }
    `,
    type: 'videos/fetch',
    key: 'videos',
  })

export default fetchVideoCount

