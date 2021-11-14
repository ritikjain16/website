import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchLearningObjective = async ({ perPage, skip, loId, filterOption }) =>
  duck.query({
    query: gql`
    {
        ${loId ? `
        learningObjectives(filter:{ id:"${loId}" }) {
            id
            order
            title
        }
        ` : `
        learningObjectives(
            filter: { and: [${!filterOption ? '' : filterOption}] }
            first: ${perPage}
            skip: ${perPage * skip}
            orderBy:createdAt_DESC
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
        `}
    }
    `,
    type: 'learningObjectives/fetch',
    key: 'learningObjectives',
    changeExtractedData: (extractedData, originalData) => {
      let data = []
      if (originalData && originalData.learningObjectives
        && originalData.learningObjectives.length > 0) {
        data = originalData.learningObjectives
      }
      extractedData.learningObjectives = data
      extractedData.topic = []
      extractedData.course = []
      return { ...extractedData }
    },
  })

export default fetchLearningObjective

