import gql from 'graphql-tag'
import duck from '../../duck'


const editProjectContents = async (input) =>
  duck.query({
    query: gql`
      mutation($input: [ProjectContentsUpdate]!) {
        updateProjectContents(input: $input) {
            id
            order
            type
            statement
            emoji {
            id
            code
            image {
                id
                uri
            }
            }
            image {
            id
            uri
            }
            terminalInput
            terminalOutput
        }
      }
    `,
    variables: {
      input
    },
    type: 'updateProjectContents/update',
    key: 'updateProjectContents',
  })

export default editProjectContents
