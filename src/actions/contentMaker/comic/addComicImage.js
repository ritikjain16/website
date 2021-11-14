import gql from 'graphql-tag'
import duck from '../../../duck'


const addComicImage = async ({ input, comicId }) =>
  duck.query({
    query: gql`
    mutation($input: ComicImageInput!) {
      addComicImage(input: $input, comicStripConnectId: "${comicId}") {
        id
        order
        image {
          id
          uri
        }
      }
    }
    `,
    variables: {
      input
    },
    type: 'comicImages/add',
    key: 'comicImages',
  })

export default addComicImage
