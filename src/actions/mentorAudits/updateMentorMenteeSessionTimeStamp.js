import gql from 'graphql-tag'
import duck from '../../duck'

const updateMentorMenteeSessionTimestamp = async (mentorMenteeSessionAuditTimeStampId, input) =>
  duck.query({
    query: gql`
    mutation($input: MentorMenteeSessionTimestampUpdate!) {
    updateMentorMenteeSessionTimestamp(
        id:"${mentorMenteeSessionAuditTimeStampId}"
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
    type: 'mentorMenteeSessionTimestamp/update',
    key: 'mentorMenteeSessionTimestamp'
  })

export default updateMentorMenteeSessionTimestamp
