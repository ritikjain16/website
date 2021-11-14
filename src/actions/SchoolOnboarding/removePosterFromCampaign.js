import gql from 'graphql-tag'
import duck from '../../duck'

const removePosterFromCampaign = async (campaignId, fileId, mobile) => duck.query({
  query: gql`
  ${
  !mobile ? `
    mutation {
      removeFromCampaignPoster(campaignId: "${campaignId}", fileId: "${fileId}") {
        campaign {
          id
        }
      }
    }
    ` : `
    mutation {
      removeFromCampaignPosterMobile(campaignId: "${campaignId}", fileId: "${fileId}") {
        campaign {
          id
        }
      }
    }
    `
}
  `,
  type: 'campaigns/delete',
  key: !mobile ? 'removeFromCampaignPoster' : 'removeFromCampaignPosterMobile',
})

export default removePosterFromCampaign
