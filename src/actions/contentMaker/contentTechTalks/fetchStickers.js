import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchStickers = async () =>
  duck.query({
    query: gql`
    {
    stickerEmojis {
        id
        code
        type
        image {
        id
        uri
        signedUri
        }
    }
    }
    `,
    type: 'stickerEmojis/fetch',
    key: 'stickerEmojis',
  })

export default fetchStickers

