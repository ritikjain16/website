import gql from 'graphql-tag'
import duck from '../../../duck'

const deleteComicImage = async (comicImageId) => duck.query({
  query: gql`
    mutation {
        deleteComicImage(id: "${comicImageId}") {
            id
        }
    }
  `,
  type: 'comicStrips/delete',
  key: 'deleteComicImage',
})

export default deleteComicImage
