const PENDING = 'pending'
const VERIFIED = 'verified'
const UNVERIFIED = 'unverified'
const INCORRECT = 'incorrect'
const INTERNAL = 'internal'
const FOR_REFERRAL_CREDITS = 'forReferralCredits'

const SALES_STATUS = [
  {
    id: 'PENDING',
    type: { PENDING }
  },
  {
    id: 'VERIFIED',
    type: { VERIFIED }
  },
  {
    id: 'UNVERIFIED',
    type: { UNVERIFIED }
  },
  {
    id: 'INCORRECT',
    type: { INCORRECT }
  },
  {
    id: 'INTERNAL',
    type: { INTERNAL }
  },
  {
    id: 'FOR_REFERRAL_CREDITS',
    type: { FOR_REFERRAL_CREDITS }
  }
]

export default SALES_STATUS
