const PENDING = 'pending'
const DORMANT = 'dormant'
const IN_PIPELINE = 'inPipeline'
const CONVERTED = 'converted'
const CLOSED = 'closed'
const INTERESTED_IN_TRIAL = 'interestedInTrialSession'
const INTERESTED_IN_PURCHASING = 'interestedInPurchasing'
const INTERESTED_BUT_PRICING_ISSUE = 'interestedButPricingIssue'
const NOT_INTERESTED = 'notAtAllInterested'

const USER_RESPONSE_STATUS = [
  {
    id: 'PENDING',
    type: { PENDING }
  },
  {
    id: 'DORMANT',
    type: { DORMANT }
  },
  {
    id: 'IN_PIPELINE',
    type: { IN_PIPELINE }
  },
  {
    id: 'CONVERTED',
    type: { CONVERTED }
  },
  {
    id: 'CLOSED',
    type: { CLOSED }
  },
  {
    id: 'INTERESTED_IN_TRIAL',
    type: { INTERESTED_IN_TRIAL }
  },
  {
    id: 'INTERESTED_IN_PURCHASING',
    type: { INTERESTED_IN_PURCHASING }
  },
  {
    id: 'INTERESTED_BUT_PRICING_ISSUE',
    type: { INTERESTED_BUT_PRICING_ISSUE }
  },
  {
    id: 'NOT_INTERESTED',
    type: { NOT_INTERESTED }
  }
]

export default USER_RESPONSE_STATUS
