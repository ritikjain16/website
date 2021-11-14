import gql from 'graphql-tag'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const fetchCampaignDetails = async (campaignId) =>
  duck.query({
    query: gql`
    {
    campaign(id: "${campaignId}") {
        id
        batchRules {
        batchSize
        batchCreationBasis
        }
        classes {
          grade
          section
          studentsMeta {
            count
          }
        }
        batchCreationStatus
        timeTableRules {
          mentorSession {
            id
          }
        bookingDate
        ${getSlotNames()}
        allottedMentor {
            id
            name
        }
        }
    }
    }
    `,
    type: 'campaignDetails/fetch',
    key: 'campaignDetails',
    changeExtractedData: (extractedData, originalData) => {
      let data = {}
      if (originalData && originalData.campaign) {
        data = originalData.campaign
      }
      extractedData.campaignDetails = data
      return { ...extractedData }
    },
  })

export default fetchCampaignDetails

