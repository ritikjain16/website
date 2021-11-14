import gql from 'graphql-tag'
import duck from '../../duck'
import getIdArrForQuery from '../../utils/getIdArrForQuery'


const updateCampaign = async ({ input, campaignId, classesIds, key, courseConnectId = '' }) =>
  duck.query({
    query: gql`
      mutation($input: CampaignUpdate) {
        updateCampaign(
          id: "${campaignId}",
          ${classesIds ? `classesConnectIds: [${getIdArrForQuery(classesIds)}]` : ''},
          ${courseConnectId ? `courseConnectId: "${courseConnectId}"` : ''}
          input: $input) {
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
    type: 'campaigns/update',
    key: key || 'campaigns',
  })

export default updateCampaign
