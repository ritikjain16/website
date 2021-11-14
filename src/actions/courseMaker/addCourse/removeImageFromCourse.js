import gql from 'graphql-tag'
import duck from '../../../duck'

const removeFromCourseThumbnails = async (courseId, fileId, bannerThumbnail) => duck.query({
  query: gql`
  ${
  !bannerThumbnail ? `
    mutation {
      removeFromCourseThumbnail(courseId: "${courseId}", fileId: "${fileId}") {
        course {
          id
        }
      }
    }
    ` : `
    mutation {
      removeFromCourseBannerThumbnail(courseId: "${courseId}", fileId: "${fileId}") {
        course {
          id
        }
      }
    }

    `
}
  `,
  type: 'courses/delete',
  key: !bannerThumbnail ? 'removeFromCourseThumbnail' : 'removeFromCourseBannerThumbnail',
})

export default removeFromCourseThumbnails
