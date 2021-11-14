import gql from 'graphql-tag'
import duck from '../../../duck'


const updateComicImagesOrder = async (input) =>
  duck.query({
    query: gql`
    mutation($input: [ComicImagesUpdate]!) {
        updateComicImages(input: $input) {
            id
            image {
                id
                uri
            }
            order
        }
    }
    `,
    variables: {
      input
    },
    type: 'comicStrips/update',
    key: 'updateComicImages',
  })

export default updateComicImagesOrder
