import gql from 'graphql-tag'
import duck from '../../../duck'
import { isPythonCourse } from '../../../utils/data-utils'

export const getQuizAndAssignmentQuery = (courseId) => {
  // this is static code to get quiz and assignment directly
  // python course Id
  let query = ''
  if (isPythonCourse(courseId)) {
    query = `publishedQuizCount: questionsMeta(
        filter: { and: [{ assessmentType: quiz }, { status: published }] }
      ) {
        count
      }
      publishedAssignment: assignmentQuestionsMeta(
        filter: { status: published }
      ) {
        count
      }
      unPublishedAssignment: assignmentQuestionsMeta(
        filter: { status: unpublished }
      ) {
        count
      }
      unPublishedQuizCount: questionsMeta(
        filter: { and: [{ assessmentType: quiz }, { status: unpublished }] }
      ) {
        count
      }`
  } else {
    query = ''
  }
  return query
}

const fetchTopicSessions = async (courseId) =>
  duck.query({
    query: gql`
    {
      topics(filter: { courses_some: { id: "${courseId}" } }) {
        id
        title
        status
        order
        isTrial
        description
        thumbnail {
            id
            uri
        }
        thumbnailSmall {
          id
          uri
        }
        courses {
          id
        }
        publishedLOCount: learningObjectivesMeta(filter: { status: published }) {
          count
        }
        unPublishedLOCount: learningObjectivesMeta(
          filter: { status: unpublished }
        ) {
          count
        }
        publishedVideoCount: videoContentMeta(filter: { status: published }) {
          count
        }
        unPublishedVideoCount: videoContentMeta(filter: { status: unpublished }) {
          count
        }
        publishedComicCount: learningObjectives {
          comicStripsMeta(filter: { status: published }) {
            count
          }
        }
        unPublishedComicCount: learningObjectives {
          comicStripsMeta(filter: { status: unpublished }) {
            count
          }
        }
        publishedProjectCount: blockBasedProjectsMeta(
          filter: { and: [{ status: published }, { type: project }] }
        ) {
          count
        }
        unPublishedProjectCount: blockBasedProjectsMeta(
          filter: { and: [{ status: unpublished }, { type: project }] }
        ) {
          count
        }
        publishedPracticeCount: blockBasedProjectsMeta(
          filter: { and: [{ status: published }, { type: practice }] }
        ) {
          count
        }
        unPublishedPracticeCount: blockBasedProjectsMeta(
          filter: { and: [{ status: unpublished }, { type: practice }] }
        ) {
          count
        }
        ${getQuizAndAssignmentQuery(courseId)}
      }
    }
    `,
    type: 'topics/fetch',
    key: `topics/${courseId}`,
    changeExtractedData: (extractedData, originalData) => {
      let data = []
      if (originalData && originalData.topics && originalData.topics.length > 0) {
        data = originalData.topics
      }
      extractedData.topic = data
      return { ...extractedData }
    },
  })

export default fetchTopicSessions

