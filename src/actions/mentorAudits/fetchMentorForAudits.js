import { get } from 'lodash'
import gql from 'graphql-tag'
import duck from '../../duck'

const fetchMentorForAudits = async () =>
  duck.query({
    query: gql`
        {
            users(filter: { role: mentor}) {
                id
                name
            }
        }
  `,
    type: 'users/fetch',
    key: 'mentorsForAudits',
    changeExtractedData: (extractedData, originalData) => ({
      ...extractedData,
      mentorsForAudits: get(originalData, 'users', [])
    })
  })

export default fetchMentorForAudits
