import gql from 'graphql-tag'
import duck from '../../../duck'

const removeAssetFromVideo = async (videoId, fileId, typeField) => duck.query({
  query: gql`
  mutation {
    ${
  typeField === 'videoFile' ? `
    removeFromVideoFile(videoId: "${videoId}", fileId: "${fileId}") {
    video {
      id
    }
  }
    ` : ''
}
${
  typeField === 'thumbnail' ? `
    removeFromVideoThumbnail(videoId: "${videoId}", fileId: "${fileId}") {
    video {
      id
    }
  }
    ` : ''
}
${
  typeField === 'subtitle' ? `
    removeFromVideoSubtitle(videoId: "${videoId}", fileId: "${fileId}") {
    video {
      id
    }
  }
    ` : ''
}
}
  `,
  type: 'videos/delete',
  key: 'removeFromVideo',
})

export default removeAssetFromVideo
