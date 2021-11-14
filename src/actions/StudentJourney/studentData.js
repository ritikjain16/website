import gql from 'graphql-tag'
import { get } from 'lodash'
// import { get } from 'lodash'
import moment from 'moment'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'
import getSlotTime from '../../utils/slots/slot-time'
import { getDuration } from '../../utils/time'

const numberDivideAndTruncate = (number1, number2) => {
  let result = 0
  if (number2 === 0) {
    result = 0
  } else {
    result = ((number1 / number2) * 100)
    result = result % 1 === 0 ? result : result.toFixed(2)
  }
  return result
}

const FETCH_STUDENTS_DETAILS = (sid) => gql`
query {
  user(id: "${sid}") {
    name
    studentProfile {
      id
      grade
      parents {
        user {
          id
          name
          email
          phone {
            countryCode
            number
          }
        }
      }
    }
  }
  userPaymentPlans(filter: { user_some: { id: "${sid}" } }) {
    id
    finalSellingPrice
    collectedAmount
    lastSessionOn
    enrollmentStatus
    avgDaysPerSession
    sessionVelocityStatus
    lastSessionTopic{
      id
      order
    }
    nextPaymentDate
    isPaid
    sessionsPerMonth
    productPrice
    dateOfEnrollment
    enrollmentStatus
    product {
      type
      id
      course {
        id
        topicsMeta(filter: { status: published }) {
          count
        }
      }
    }
  }
  userProfiles(filter: { user_some: { id: "${sid}" } }) {
    totalTopicsMeta {
      count
    }
    proficientTopicsMeta {
      count
    }
    familiarTopicsMeta {
      count
    }
    masteredTopicsMeta {
      count
    }
  }
  mentorMenteeSessions(
    filter: {
      menteeSession_some: { user_some: { id: "${sid}" } }
    }
  ) {
    id
    menteeSession {
      id
      bookingDate
      ${getSlotNames()}
    }
    topic{
      id
      title
    }
    mentorSession {
      id
      user {
        id
        name
      }
    }
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
    boring
    poorExplanation
    averageExplanation
    isSubmittedForReview
    sessionCommentByMentor
    comment
    sessionRecordingLink
    rating
    sessionStatus
    sessionStartDate
    sessionEndDate
  }
  userQuizReports(
    filter: {
      and:[
        {
          topic_some:{
            status:published
          }
        }
        { user_some: { id: "${sid}" } }
      ]
    }
    orderBy: createdAt_DESC
  ) {
    id
    topic {
      id
      title
    }
    quizReport {
      totalQuestionCount
      correctQuestionCount
      inCorrectQuestionCount
      unansweredQuestionCount
      masteryLevel
    }
  }
}
`

function fetchStudentsDetails(sid) {
  return duck.query({
    query: FETCH_STUDENTS_DETAILS(sid),
    type: 'studentsJourney/fetch',
    key: 'studentsJourney',
    changeExtractedData: (originalData, extractedData) => {
      const studentsJourney = {}
      const sessions = []
      if (extractedData && extractedData.mentorMenteeSessions &&
          extractedData.mentorMenteeSessions.length > 0) {
        const { user: { name, studentProfile: { grade, parents } },
          userPaymentPlans, mentorMenteeSessions, userProfiles,
          userQuizReports } = extractedData
        let type = ''
        if (get(userPaymentPlans[0], 'product.type') === 'oneToOne') {
          type = '1:1'
        } else if (get(userPaymentPlans[0], 'product.type') === 'oneToTwo') {
          type = '1:2'
        } else if (get(userPaymentPlans[0], 'product.type') === 'oneToThree') {
          type = '1:3'
        } else {
          type = '-'
        }
        const totalTopicsMeta = get(userPaymentPlans[0], 'product.course.topicsMeta.count')
        let classType = ''
        if (get(userPaymentPlans[0], 'sessionsPerMonth') === 4) {
          classType = '1 class in 1 week'
        } else if (get(userPaymentPlans[0], 'sessionsPerMonth') === 6) {
          classType = '1 class in 5 days'
        } else if (get(userPaymentPlans[0], 'sessionsPerMonth') === 8) {
          classType = '1 class in 3-4 days'
        } else {
          classType = '-'
        }
        studentsJourney.studentName = name
        studentsJourney.grade = grade
        studentsJourney.parentName = get(parents[0], 'user.name')
        studentsJourney.parentEmail = get(parents[0], 'user.email')
        studentsJourney.phone = get(parents[0], 'user.phone.number')
        studentsJourney.type = type
        const completedSessions = mentorMenteeSessions.filter(({ sessionStatus }) =>
          sessionStatus === 'completed')
        if (userPaymentPlans && userPaymentPlans.length > 0) {
          studentsJourney.dateOfEnrollment =
            moment(userPaymentPlans[0].dateOfEnrollment).format('DD-MM-YYYY')
          studentsJourney.enrollmentStatus = userPaymentPlans[0].enrollmentStatus
          const completedStuSession = get(userPaymentPlans[0], 'lastSessionTopic.order', 0)
          const pendingSessions = totalTopicsMeta - completedStuSession
          studentsJourney.completedStudentSession = `${completedStuSession}
            (${numberDivideAndTruncate(completedStuSession, totalTopicsMeta)}%)`
          studentsJourney.pendingStudentSession = `${pendingSessions}
            (${numberDivideAndTruncate(pendingSessions, totalTopicsMeta)}%)`
          studentsJourney.avgDayPerClass = get(userPaymentPlans[0], 'avgDaysPerSession', 0)
          studentsJourney.classStatus = get(userPaymentPlans[0], 'sessionVelocityStatus', '-')
        } else {
          studentsJourney.dateOfEnrollment = '-'
          studentsJourney.enrollmentStatus = '-'
          studentsJourney.classStatus = '-'
          const completedStuSession = completedSessions.length
          const pendingSessions = totalTopicsMeta - completedStuSession
          studentsJourney.completedStudentSession = `${completedStuSession}
          (${numberDivideAndTruncate(completedStuSession, totalTopicsMeta)}%)`
          studentsJourney.pendingStudentSession = `${pendingSessions}
          (${numberDivideAndTruncate(pendingSessions, totalTopicsMeta)}%)`
          const avgDayPerClassDiff = completedSessions.length > 0 ?
            moment(completedSessions[completedSessions.length - 1].sessionStartDate)
              .diff(completedSessions[0].sessionStartDate, 'days') : 0
          studentsJourney.avgDayPerClass = avgDayPerClassDiff === 0 ? avgDayPerClassDiff :
            Math.round(avgDayPerClassDiff / completedSessions.length)
        }
        studentsJourney.classType = classType
        studentsJourney.userPaymentPlanId = get(userPaymentPlans[0], 'id')
        studentsJourney.trialOn = completedSessions.length > 0 ?
          moment(completedSessions[0].sessionStartDate).format('DD-MM-YYYY') : '-'
        studentsJourney.lastClassOn = userPaymentPlans[0] ?
          moment(userPaymentPlans[0].lastSessionOn).format('DD-MM-YYYY') : '-'
        studentsJourney.classMsg = userPaymentPlans[0] ?
          moment().diff(userPaymentPlans[0].lastSessionOn, 'd') : '-'
        const totalTopicCount = userProfiles[0].totalTopicsMeta.count
        const familiarCount = userProfiles[0].familiarTopicsMeta.count
        const masteredCount = userProfiles[0].masteredTopicsMeta.count
        const proficientCount = userProfiles[0].proficientTopicsMeta.count
        const homeworkCount = mentorMenteeSessions.filter(({ isSubmittedForReview }) =>
          isSubmittedForReview)
        studentsJourney.familiar = `${familiarCount} (${
          numberDivideAndTruncate(familiarCount, totalTopicCount)}%)`
        studentsJourney.mastered = `${masteredCount} (${
          numberDivideAndTruncate(masteredCount, totalTopicCount)}%)`
        studentsJourney.proficient = `${proficientCount}
          (${numberDivideAndTruncate(proficientCount, totalTopicCount)}%)`
        studentsJourney.homework = `${homeworkCount.length}
          (${numberDivideAndTruncate(homeworkCount.length, mentorMenteeSessions.length)}%)`
        if (userPaymentPlans && userPaymentPlans.length > 0) {
          studentsJourney.coursePrice = get(userPaymentPlans[0], 'finalSellingPrice', '-')
          studentsJourney.paidAmount = get(userPaymentPlans[0], 'collectedAmount', '-')
          let paymentStatus = ''
          studentsJourney.nextInstallmentOn = moment(get(userPaymentPlans[0], 'nextPaymentDate'))
            .format('DD-MM-YYYY')
          const isPaid = get(userPaymentPlans[0], 'isPaid')
          if (isPaid) {
            paymentStatus = 'Paid'
          } else {
            const nextInstallDate = get(userPaymentPlans[0], 'nextPaymentDate')
            if (nextInstallDate) {
              const today = new Date().toISOString()
              const nextDate = moment(nextInstallDate).toISOString()
              if (today > nextDate) {
                paymentStatus = 'OverDue'
              } else {
                paymentStatus = 'Pending'
              }
            } else {
              paymentStatus = '-'
            }
          }
          studentsJourney.paymentStatus = paymentStatus
        } else {
          studentsJourney.noPayment = 'noPayment'
        }
        mentorMenteeSessions.forEach(({ comment, id,
          isSubmittedForReview,
          mentorSession: { user }, menteeSession, rating,
          sessionCommentByMentor, sessionEndDate,
          sessionRecordingLink, sessionStartDate, sessionStatus, topic,
          friendly, motivating, engaging, helping, enthusiastic, patient,
          conceptsPerfectlyExplained, distracted, rude, slowPaced, fastPaced,
          notPunctual, boring, poorExplanation, averageExplanation },
        index) => {
          const quiz = userQuizReports.length > 0 ?
            userQuizReports.find((quizData) => quizData.topic.id === topic.id) : null
          let correctQuestionCount = 0
          let totalQuestionCount = 0
          let masteryLevel = 'none'
          if (quiz) {
            correctQuestionCount = get(quiz.quizReport, 'correctQuestionCount')
            totalQuestionCount = get(quiz.quizReport, 'totalQuestionCount')
            masteryLevel = get(quiz.quizReport, 'masteryLevel')
          }
          let sSession = ''
          if (sessionStatus === 'allotted') {
            if (moment().isAfter(moment(sessionStartDate))) {
              sSession = 'Delayed'
            } else {
              sSession = 'Pending'
            }
          } else {
            sSession = sessionStatus
          }
          sessions.push({
            srNo: index + 1,
            topicName: topic.title,
            bookingOn: moment(menteeSession.bookingDate).format('DD-MM-YYYY'),
            time: getSlotTime(menteeSession),
            duration: getDuration(sessionStartDate, sessionEndDate),
            status: sSession,
            mentor: user ? user.name : '-',
            classRating: !rating ? '-' : rating,
            link: !sessionRecordingLink ? '-' : sessionRecordingLink,
            studentComment: !comment ? '-' : comment,
            homework: isSubmittedForReview ? 'completed' : 'incomplete',
            mentorComment: !sessionCommentByMentor ? '-' : sessionCommentByMentor,
            id,
            quizTest: `${correctQuestionCount}/${totalQuestionCount}
              ${numberDivideAndTruncate(correctQuestionCount, totalQuestionCount)}%`,
            key: id,
            fpm: masteryLevel === 'none' ? '-' : masteryLevel,
            tags: {
              friendly,
              motivating,
              engaging,
              helping,
              enthusiastic,
              patient,
              conceptsPerfectlyExplained,
              distracted,
              rude,
              slowPaced,
              fastPaced,
              notPunctual,
              boring,
              poorExplanation,
              averageExplanation
            }
          })
        })
        studentsJourney.sessions = sessions
      }
      return { ...originalData, studentsJourney }
    }
  })
}

export default fetchStudentsDetails
