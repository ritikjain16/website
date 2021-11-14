import gql from 'graphql-tag'
import duck from '../../duck'


const addCampaign = async ({ input, courseConnectId = '', schoolConnectId }) =>
  duck.query({
    query: gql`
    mutation($input: CampaignInput!) {
        addCampaign(input: $input,
          ${courseConnectId ? `courseConnectId: "${courseConnectId}"` : ''}
          schoolConnectId: "${schoolConnectId}"
          ) {
            id
            type
            title
            code
            course {
              id
            }
            batchCreationStatus
            classes {
              id
              grade
            }
            poster {
              id
              name
              uri
            }
            posterMobile{
              id
              name
              uri
            }
            school {
              id
            }
        }
    }
    `,
    variables: {
      input,
      callBatchAPI: true
    },
    type: 'campaigns/add',
    key: 'campaigns',
  })

export default addCampaign
