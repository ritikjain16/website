import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const updateMentorAudit = async (mentorMenteeSessionAuditId, auditorConectId, input, key) =>
  duck.query({
    query: gql`
    mutation($input: MentorMenteeSessionAuditUpdate!){
    updateMentorMenteeSessionAudit(
        id:"${mentorMenteeSessionAuditId}",
        ${auditorConectId || ''}
        input:$input
        ){
          id
          customSectionScore {
            questionSection {
              id
            }
            customScore
          }
      auditor {
        id
        name
        username
        email
        role
      }
      batchSession {
        id
        sessionStartDate
        sessionEndDate
        sessionRecordingLink
        sessionCommentByMentor
        isAudit
        sessionStatus
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
            phone {
            number
            countryCode
            }
        }
        }
        topic {
        id
        order
        title
        }
    }
      mentorMenteeSession {
          id
          sessionStartDate
          sessionEndDate
          sessionStatus
          leadStatus
          source
          topic{
          id
          title
          order
          }
          mentorSession{
          id
          user{
            id
            name
            username
            phone{
              countryCode
              number
            }
          }
        }
        menteeSession{
          id
          user{
            id
            name
          }
        }
        rating
        friendly
        motivating
        engaging
        helping
        enthusiastic
        patient
        conceptsPerfectlyExplained
        distracted
        rude
        slowPaced
        fastPaced
        notPunctual
        average
        boring
        poorExplanation
        averageExplanation
        comment
        sessionRecordingLink
      }
      briefedChat
      askedQuestionAroundEpisode
      activityBriefingScore
      chatSectionScore
      clarifiedDoubts
      classOpeningScore
      codingExerciseScore
      conceptsExplainedScore
      concludedSession
      coveredAllCases
      coveredHomework
      createdAt
      creativity
      dedication
      easilyAnsweredQuiz
      encouragedKid
      engagement
      enthusiasm
      flexibility
      friendliness
      id
      inspiring
      status
      isEpisodeExplained
      isMentorInternetDecent
      isProactive
      isStudentCameraOff
      isStudentProperlyHelped
      isVideoWatchedInFullScreen
      noiseDisturbanceFromMentor
      notClarifiedDoubtsComment
      notCoveredAllCasesComment
      notUsedCodePlaygroundComment
      offeredCounselling
      overallClassComment
      parentCounsellingScore
      patience
      practiceSectionScore
      productWalkthroughScore
      reportExplainedProperly
      score
      customScore
      totalScore
      rushed
      screenShareStoppedWhileRating
      switchedToComfortableLanguage
      updatedAt
      usedCodePlayground
      videoDiscussionScore
      timestampAnswer {
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
      }
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
    variables: {
      input,
    },
    type: 'mentorAudits/update',
    key: !key ? 'mentorMenteeSessionAudit' : key,
    changeExtractedData: (extractedData, originalData) => {
      if (originalData && get(originalData, 'updateMentorMenteeSessionAudit')) {
        const data = get(originalData, 'updateMentorMenteeSessionAudit')
        extractedData.mentorAudits = {
          ...get(originalData, 'updateMentorMenteeSessionAudit'),
          menteeId: get(data, 'mentorMenteeSession.menteeSession.user.id'),
          menteeName: get(data, 'mentorMenteeSession.menteeSession.user.name'),
          timezone: get(data, 'mentorMenteeSession.menteeSession.user.timezone'),
          country: get(data, 'mentorMenteeSession.menteeSession.user.country'),
          mentorMenteeSession: {
            ...data.mentorMenteeSession
          },
        }
      }
      return extractedData
    }
  })

export default updateMentorAudit
