import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../../duck'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'
import addImageToLo from './addImageToLo'


const addLearningObjective = async ({ input, selectedCourses = [],
  thumbnailFile, pqStoryImageFile }) =>
  duck.query({
    query: gql`
    mutation($input: LearningObjectiveInput!) {
        addLearningObjective(input: $input,
          ${selectedCourses.length > 0 ? `coursesConnectIds: [${getIdArrForQuery(selectedCourses)}]` : ''}
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
    type: 'learningObjectives/add',
    key: 'learningObjectives',
    changeExtractedData: async (extractedData, originalData) => {
      if (get(originalData, 'addLearningObjective')) {
        const loId = get(originalData, 'addLearningObjective.id')
        let newLO = get(originalData, 'addLearningObjective')
        let thumbnailData = null
        let pqStoryData = null
        if (thumbnailFile) {
          thumbnailData = await addImageToLo({
            file: thumbnailFile,
            loId,
            typeField: 'thumbnail'
          })
          newLO = {
            ...newLO,
            thumbnail: thumbnailData
          }
        }
        if (pqStoryImageFile) {
          pqStoryData = await addImageToLo({
            file: pqStoryImageFile,
            loId,
            typeField: 'pqStoryImage'
          })
          newLO = {
            ...newLO,
            pqStoryImage: pqStoryData
          }
        }
        extractedData.learningObjectives = {
          ...newLO
        }
      }
      extractedData.topic = []
      extractedData.course = []
      return extractedData
    },
  })

export default addLearningObjective
