import gql from 'graphql-tag'
import duck from '../../../duck'


const updateComicStrip = async ({ input, comicId }) =>
  duck.query({
    query: gql`
    mutation($input: ComicStripUpdate) {
        updateComicStrip(id: "${comicId}", input: $input) {
            id
            title
            description
            status
            learningObjectives {
              id
            }
            comicImages {
              id
              image {
                id
                uri
              }
              order
            }
        }
    }
    `,
    variables: {
      input
    },
    type: 'comicStrips/update',
    key: 'comicStrips',
  })

export default updateComicStrip
