import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const fetchMentorAudit = async (mentorMenteeSessionAuditId) =>
  duck.query({
    query: gql`
    query{
    mentorMenteeSessionAudit(id:"${mentorMenteeSessionAuditId}"){
      auditor {
        id
        name
      }
      overallClassComment
      isBatchAudit
      timestampAnswer {
        id
        startTime
        endTime
        isGood
        needWork
        rude
        distracted
        dormant
        comment
        activityBriefing
        annoying
        chatSection
        classOpening
        clearingDoubts
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
        id
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
        auditQuestion {
          id
        }
        answerTimestampTags {
          title
          order
        }
      }
      customSectionScore {
        questionSection {
          id
          title
          order
        }
        customScore
      }
      mentorMenteeSession {
        id
        sessionStartDate
        sessionRecordingLink
        menteeSession {
          id
          user {
            id
            name
          }
          ${getSlotNames()}
        }
        mentorSession {
          id
          user {
            id
            name
          }
        }
      }
      batchSession {
        id
        sessionStartDate
        sessionRecordingLink
        ${getSlotNames()}
        batch {
          id
          code
          studentsMeta {
            count
          }
          type
        }
        mentorSession {
          id
          user {
              id
              name
          }
        }
      }
      createdAt
      id
      status
      score
      customScore
      totalScore
      updatedAt
      timestampAnswerMeta {
        count
      }
      auditQuestionsData: auditQuestions {
        mcqAnswers {
          statement
          isSelected
        }
        boolAnswers
        inputAnswer
        ratingAnswer
        customScore
        auditQuestion {
          id
          order
          statement
          score
          maxRating
          description
          section {
            id
            title
            order
          }
          subSection {
            id
            title
            order
          }
          questionType
          isMandatory
          mcqOptions {
            statement
            isCorrect
          }
          ratingDisplayType
          timestampTags {
            title
            showByDefault
            order
          }
        }
      }
    }
  }
  `,
    type: 'mentorMenteeSessionAudit/fetch',
    key: 'mentorMenteeSessionAudit',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.mentorMenteeSessionAudit = get(originalData, 'mentorMenteeSessionAudit')
      return { ...extractedData }
    }
  })

export default fetchMentorAudit
