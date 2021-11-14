import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchQuizCount = async ({ filterOption, }) =>
  duck.query({
    query: gql`
    {
        questionBanksMeta(filter: {
            and: [${!filterOption ? '' : filterOption}
                { assessmentType: quiz }
            ]
        }) {
            count
        }
    }
    `,
    type: 'questionBanks/fetch',
    key: 'questionBanks',
  })

export default fetchQuizCount

