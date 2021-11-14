import gql from 'graphql-tag'
import { get } from 'lodash'
import addThumbnailToTopic from './addThumbnailToTopic'
import duck from '../../../duck'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'
import { getQuizAndAssignmentQuery } from './fetchTopicSessions'


const updateTopicSession = async ({ topicId, input, assignmentConnectId = [],
  questionsConnectId = [], videoConnectId = [], loConnectId = [],
  topicQuestionsConnectIds = [], courseId,
  blockBasedConnectId = [], chapterConnectId, updateComponentQuery,
  thumbnail, smallThumbnail }, courseIdValue) =>
  duck.query({
    query: gql`
      mutation($input: TopicUpdate) {
        updateTopic(id: "${topicId}", input: $input,
        ${videoConnectId.length > 0 ? `videoContentConnectIds: [${getIdArrForQuery(videoConnectId)}]` : ''}
        ${loConnectId.length > 0 ? `learningObjectivesConnectIds: [${getIdArrForQuery(loConnectId)}]` : ''}
        ${assignmentConnectId.length > 0 ? `assignmentQuestionsConnectIds: [${getIdArrForQuery(assignmentConnectId)}]` : ''}
        ${questionsConnectId.length > 0 ? `questionsConnectIds: [${getIdArrForQuery(questionsConnectId)}]` : ''}
        ${blockBasedConnectId.length > 0 ? `blockBasedProjectsConnectIds: [${getIdArrForQuery(blockBasedConnectId)}]` : ''}
        ${topicQuestionsConnectIds.length > 0 ? `topicQuestionsConnectIds:[${getIdArrForQuery(topicQuestionsConnectIds)}]` : ''}
        coursesConnectIds: ["${courseId}"]
        ${chapterConnectId ? `chapterConnectId: "${chapterConnectId}"` : ''}
        ) {
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
        ${updateComponentQuery || ''}
      }
    `,
    variables: {
      input
    },
    type: 'topics/update',
    key: `topics/${courseIdValue}`,
    changeExtractedData: async (extractedData, originalData) => {
      if (get(originalData, 'updateTopic')) {
        let thumbnailData = null
        let thumbnailSmall = null
        let updatedTopic = get(originalData, 'updateTopic')
        if (thumbnail) {
          thumbnailData = await addThumbnailToTopic({
            file: thumbnail,
            topicId,
            typeField: 'thumbnail',
            prevFileId: get(updatedTopic, 'thumbnail.id')
          })
          updatedTopic = {
            ...updatedTopic,
            thumbnail: thumbnailData
          }
        }
        if (smallThumbnail) {
          thumbnailSmall = await addThumbnailToTopic({
            file: smallThumbnail,
            typeField: 'thumbnailSmall',
            topicId,
            prevFileId: get(updatedTopic, 'thumbnailSmall.id')
          })
          updatedTopic = {
            ...updatedTopic,
            thumbnailSmall
          }
        }
        extractedData.topic = {
          ...updatedTopic
        }
      }
      return extractedData
    },
  })

export default updateTopicSession
