import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchTechTalk = async (loId) =>
  duck.query({
    query: gql`
    {
        messages(filter: { learningObjective_some: { id: "${loId}" } }) {
            id
            order
            type
            statement
            learningObjective {
              id
            }
            sticker {
            id
            code
            image {
              id
              uri
            }
            }
            emoji {
            id
            image {
              id
              uri
            }
            }
            image {
              id
              uri
            }
            question {
              id
              statement
            }
            terminalInput
            terminalOutput
            alignment
        }
    }
    `,
    type: 'messages/fetch',
    key: 'messages',
  })

export default fetchTechTalk

