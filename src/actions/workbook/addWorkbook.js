import gql from 'graphql-tag'
import duck from '../../duck'


const addWorkbook = async ({ topicId, tagsConnectIds, ...input }) =>
  duck.query({
    query: gql`
    mutation($input: WorkbookInput!
        $tagsConnectIds: [ID]
    ){
    addWorkbook(input:$input, topicConnectId:"${topicId}", tagsConnectIds:$tagsConnectIds){
        id
        order
        title
        statement
        difficulty
        status
        tags {
        id
        title
        }
        createdAt
        workbookExamples {
        order
        statement
        }
        hint
        codeHint
        answer
      }
    }
    `,
    variables: {
      input,
      tagsConnectIds
    },
    type: 'workbook/add',
    key: 'workbooks',
  })

export default addWorkbook
