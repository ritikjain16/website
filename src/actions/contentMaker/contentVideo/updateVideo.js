import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../../duck'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'
import addAssetToVideo from './addAssetToVideo'


const updateVideo = async ({ videoId, input, coursesList = [], topicsList = [],
  videoFile, thumbnailFile, subTitleFile }) =>
  duck.query({
    query: gql`
    mutation($input: VideoUpdate) {
        updateVideo(id: "${videoId}", input: $input,
        ${coursesList.length > 0 ? `coursesConnectIds: [${getIdArrForQuery(coursesList)}]` : ''},
        ${topicsList.length > 0 ? `topicsConnectIds: [${getIdArrForQuery(topicsList)}]` : ''}
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
    type: 'videos/update',
    key: 'videos',
    changeExtractedData: async (extractedData, originalData) => {
      if (get(originalData, 'updateVideo')) {
        let updatedVideo = get(originalData, 'updateVideo')
        let videoFileData = null
        let thumbnailData = null
        let subtitleData = null
        if (thumbnailFile) {
          thumbnailData = await addAssetToVideo({
            file: thumbnailFile,
            videoId,
            typeField: 'thumbnail',
            prevFileId: get(updatedVideo, 'thumbnail.id')
          })
          updatedVideo = {
            ...updatedVideo,
            thumbnail: thumbnailData
          }
        }
        if (subTitleFile) {
          subtitleData = await addAssetToVideo({
            file: subTitleFile,
            videoId,
            typeField: 'subtitle',
            prevFileId: get(updatedVideo, 'subtitle.id')
          })
          updatedVideo = {
            ...updatedVideo,
            subtitle: subtitleData
          }
        }
        if (videoFile) {
          videoFileData = await addAssetToVideo({
            file: videoFile,
            videoId,
            typeField: 'videoFile',
            prevFileId: get(updatedVideo, 'videoFile.id')
          })
          updatedVideo = {
            ...updatedVideo,
            videoFile: videoFileData
          }
        }
        extractedData.videos = {
          ...updatedVideo
        }
        extractedData.videos = {
          ...updatedVideo
        }
      }
      extractedData.topic = []
      extractedData.course = []
      return extractedData
    },
  })

export default updateVideo
