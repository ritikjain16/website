import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchLOCount = async ({ filterOption }) =>
  duck.query({
    query: gql`
    {
        learningObjectivesMeta(filter: { and: [${!filterOption ? '' : filterOption}] }) {
            count
        }
    }
    `,
    type: 'learningObjectives/fetch',
    key: 'learningObjectivesCounts',
  })

export default fetchLOCount

