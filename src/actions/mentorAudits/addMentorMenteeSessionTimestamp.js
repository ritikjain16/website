import gql from 'graphql-tag'
import { auditType } from '../../constants/auditQuestionConst'
import duck from '../../duck'

const addMentorMenteeSessionTimestamp = async ({ auditId, auditQuestionId, input, type }) =>
  duck.query({
    query: gql`
    mutation($input: MentorMenteeSessionTimestampInput!){
    addMentorMenteeSessionTimestamp(
      auditQuestionConnectId: "${auditQuestionId}"
      ${type === auditType.preSales ? `preSalesDocumentConnectId: "${auditId}"` : ''}
      ${type === auditType.postSales ? `postSalesDocumentConnectId: "${auditId}"` : ''}
      ${type === auditType.mentor ? `auditDocumentConnectId: "${auditId}"` : ''}
        input:$input
        ){
        id
        activityBriefing
        annoying
        chatSection
        clearingDoubts
        classOpening
        codingExercise
        comment
        conceptExplaination
        createdAt
        creativity
        dedication
        distracted
        dormant
        endTime
        engaging
        enthusiasm
        example
        flexibility
        friendliness
        inspiring
        isGood
        isTrainingMaterial
        needWork
        parentCounselling
        patience
        practiceSession
        rude
        senseOfHumor
        startTime
        updatedAt
        videoDiscussion
    }
  }
  `,
    variables: {
      input,
    },
    type: 'mentorMenteeSessionTimestamp/add',
    key: 'mentorMenteeSessionTimestamp'
  })

export default addMentorMenteeSessionTimestamp
