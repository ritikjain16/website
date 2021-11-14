import gql from 'graphql-tag'
import duck from '../../../duck'


const addComicStrip = async ({ input, loId }) =>
  duck.query({
    query: gql`
    mutation($input: ComicStripInput!) {
    addComicStrip(input: $input, learningObjectivesConnectIds: "${loId}") {
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
    type: 'comicStrips/add',
    key: 'comicStrips',
  })

export default addComicStrip
