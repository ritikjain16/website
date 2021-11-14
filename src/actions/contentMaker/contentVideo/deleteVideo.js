import gql from 'graphql-tag'
import duck from '../../../duck'

const deleteVideo = async (id) => duck.query({
  query: gql`
    mutation {
        deleteVideo(id: "${id}") {
            id
        }
    }
  `,
  type: 'videos/delete',
  key: 'videos',
})

export default deleteVideo
