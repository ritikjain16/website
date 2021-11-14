import gql from 'graphql-tag'
import { get } from 'lodash'
import addAssetToVideo from './addAssetToVideo'
import duck from '../../../duck'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'


const addVideo = async (input, coursesList = [], videoFile, thumbnailFile, subTitleFile) =>
  duck.query({
    query: gql`
    mutation($input: VideoInput!) {
        addVideo(input: $input,
          ${coursesList.length > 0 ? `coursesConnectIds: [${getIdArrForQuery(coursesList)}]` : ''}
          ) {
            id
            status
            courses {
              id
              title
            }
            topics {
              id
              title
            }
            videoFile {
            id
            uri
            }
            title
            description
            subtitle {
            id
            uri
            }
            thumbnail {
            id
            uri
            }
            videoStartTime
            videoEndTime
            storyStartTime
            storyEndTime
            storyThumbnail {
            id
            uri
            }
            createdAt
        }
    }
    `,
    variables: {
      input
    },
    type: 'videos/add',
    key: 'videos',
    changeExtractedData: async (extractedData, originalData) => {
      if (get(originalData, 'addVideo')) {
        const videoId = get(originalData, 'addVideo.id')
        let newVideo = get(originalData, 'addVideo')
        let videoFileData = null
        let thumbnailData = null
        let subtitleData = null
        if (thumbnailFile) {
          thumbnailData = await addAssetToVideo({
            file: thumbnailFile,
            videoId,
            typeField: 'thumbnail'
          })
          newVideo = {
            ...newVideo,
            thumbnail: thumbnailData
          }
        }
        if (subTitleFile) {
          subtitleData = await addAssetToVideo({
            file: subTitleFile,
            videoId,
            typeField: 'subtitle'
          })
          newVideo = {
            ...newVideo,
            subtitle: subtitleData
          }
        }
        if (videoFile) {
          videoFileData = await addAssetToVideo({
            file: videoFile,
            videoId,
            typeField: 'videoFile'
          })
          newVideo = {
            ...newVideo,
            videoFile: videoFileData
          }
        }
        extractedData.videos = {
          ...newVideo
        }
      }
      extractedData.topic = []
      extractedData.course = []
      return extractedData
    },
  })

export default addVideo
