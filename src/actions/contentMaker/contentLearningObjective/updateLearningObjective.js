import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../../duck'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'
import addImageToLo from './addImageToLo'


const updateLearningObjective = async ({ loId, input, selectedCourses = [],
  selectedTopics = [], thumbnailFile, pqStoryImageFile }) =>
  duck.query({
    query: gql`
    mutation($input: LearningObjectiveUpdate) {
        updateLearningObjective(id: "${loId}", input: $input,
        ${selectedCourses.length > 0 ? `coursesConnectIds: [${getIdArrForQuery(selectedCourses)}]` : ''},
        ${selectedTopics.length > 0 ? `topicsConnectIds: [${getIdArrForQuery(selectedTopics)}]` : ''},
        ) {
            id
            order
            title
            createdAt
            updatedAt
            status
            description
            courses {
              id
              title
            }
            topics {
              id
              title
            }
            videoThumbnail {
            id
            uri
            }
            messageStatus
            pqStory
            leftTextMessagesCount: messagesMeta(
            filter: { and: [{ type: text }, { alignment: left }] }
            ) {
            count
            }
            rightTextMessagesCount: messagesMeta(
            filter: { and: [{ type: text }, { alignment: right }] }
            ) {
            count
            }
            terminalMessagesCount: messagesMeta(filter: { type: terminal }) {
            count
            }
            stickerMessagesCount: messagesMeta(filter: { type: sticker }) {
            count
            }
            imageMessagesCount: messagesMeta(filter: { type: image }) {
            count
            }
            messagesMeta {
            count
            }
            publishedPQCount: questionBankMeta(
            filter: {
                and: [{ assessmentType: practiceQuestion }, { status: published }]
            }
            ) {
            count
            }
            unpublishedPQCount: questionBankMeta(
            filter: {
                and: [{ assessmentType: practiceQuestion }, { status: unpublished }]
            }
            ) {
            count
            }
            publishedQuizCount: questionBankMeta(
            filter: { and: [{ assessmentType: quiz }, { status: published }] }
            ) {
            count
            }
            unpublishedQuizCount: questionBankMeta(
            filter: { and: [{ assessmentType: quiz }, { status: unpublished }] }
            ) {
            count
            }
            messages {
            emojiMessagesCount: emojiMeta(filter: { type: emoji }) {
                count
            }
            }
            videoStartTime
            videoEndTime
            thumbnail {
            id
            uri
            }
            pqStoryImage {
            id
            uri
            }
        }
    }
    `,
    variables: {
      input
    },
    type: 'learningObjectives/update',
    key: 'learningObjectives',
    changeExtractedData: async (extractedData, originalData) => {
      if (get(originalData, 'updateLearningObjective')) {
        let updatedLO = get(originalData, 'updateLearningObjective')
        let thumbnailData = null
        let pqStoryData = null
        if (thumbnailFile) {
          thumbnailData = await addImageToLo({
            file: thumbnailFile,
            loId,
            typeField: 'thumbnail',
            prevFileId: get(updatedLO, 'thumbnail.id')
          })
          updatedLO = {
            ...updatedLO,
            thumbnail: thumbnailData
          }
        }
        if (pqStoryImageFile) {
          pqStoryData = await addImageToLo({
            file: pqStoryImageFile,
            loId,
            typeField: 'pqStoryImage',
            prevFileId: get(updatedLO, 'pqStoryImage.id')
          })
          updatedLO = {
            ...updatedLO,
            pqStoryImage: pqStoryData
          }
        }
        extractedData.learningObjectives = {
          ...updatedLO
        }
      }
      extractedData.topic = []
      extractedData.course = []
      return extractedData
    },
  })

export default updateLearningObjective