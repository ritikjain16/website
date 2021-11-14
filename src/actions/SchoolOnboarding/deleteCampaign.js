import gql from 'graphql-tag'
import duck from '../../duck'

const deleteCampaign = async (id) => duck.query({
  query: gql`
    mutation {
        deleteCampaign(id: "${id}") {
            id
            type
            title
            classes {
              id
              grade
            }
        }
    }
  `,
  variable: {
    callBatchAPI: true
  },
  type: 'campaigns/delete',
  key: 'campaigns',
})

export default deleteCampaign
