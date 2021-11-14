import * as Yup from 'yup'

const stringRequired = Yup.string().required('Required')

const addCampaignSchema = Yup.object().shape({
  campaignTitle: stringRequired,
  campaignType: stringRequired
})

export default addCampaignSchema
