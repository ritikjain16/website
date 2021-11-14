import gql from 'graphql-tag'
import { get } from 'lodash'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'
import duck from '../../../duck'
import addThumbnailToChapter from './addThumbnailToChapter'

const addChapter = async ({ input, courseId, topicIds = [], thumbnailFile }) =>
  duck.query({
    query: gql`
    mutation($input: ChapterInput!) {
        addChapter(input: $input,
          ${courseId ? `coursesConnectIds: ["${courseId}"]` : ''},
          ${topicIds.length > 0 ? `topicsConnectIds: [${getIdArrForQuery(topicIds)}]` : ''}
          ) {
            id
            order
            status
            courses{
                id
            }
            thumbnail {
                id
                uri
            }
            title
            description
            createdAt
            topics {
              id
            }
          }
    }
    `,
    variables: {
      input
    },
    type: 'chapters/add',
    key: 'chapters',
    changeExtractedData: async (extractedData, originalData) => {
      if (get(originalData, 'addChapter')) {
        const chapterId = get(originalData, 'addChapter.id')
        let thumbnailData = null
        let newChapter = get(originalData, 'addChapter')
        if (thumbnailFile) {
          thumbnailData = await addThumbnailToChapter({
            file: thumbnailFile,
            chapterId,
          })
          newChapter = {
            ...newChapter,
            thumbnail: thumbnailData
          }
        }
        extractedData.chapters = {
          ...newChapter
        }
      }
      return extractedData
    },
  })

export default addChapter
