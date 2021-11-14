import gql from 'graphql-tag'
import { get } from 'lodash'
import addThumbnailToChapter from './addThumbnailToChapter'
import duck from '../../../duck'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'


const updateChapter = async ({ chapterId, input, courseId = '',
  topicIds = [], thumbnailFile }) =>
  duck.query({
    query: gql`
    mutation($input: ChapterUpdate) {
      updateChapter(id: "${chapterId}", input: $input,
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
    type: 'chapters/update',
    key: 'chapters',
    changeExtractedData: async (extractedData, originalData) => {
      if (get(originalData, 'updateChapter')) {
        let thumbnailData = null
        let updatedChapter = get(originalData, 'updateChapter')
        if (thumbnailFile) {
          thumbnailData = await addThumbnailToChapter({
            file: thumbnailFile,
            chapterId,
            prevFileId: get(updatedChapter, 'thumbnail.id')
          })
          updatedChapter = {
            ...updatedChapter,
            thumbnail: thumbnailData
          }
        }
        extractedData.chapters = {
          ...updatedChapter
        }
      }
      return extractedData
    },
  })

export default updateChapter
