import gql from 'graphql-tag'
import duck from '../../duck'

const updateWorkbook = async ({ tagsConnectIds, id, ...input }) =>
  duck.query({
    query: gql`
    mutation($input: WorkbookUpdate
        $tagsConnectIds: [ID]
        ) {
      updateWorkbook(id: "${id}", input: $input, tagsConnectIds:$tagsConnectIds) {
        id
        tags{
            id
            title
        }
      }
    }
    `,
    variables: {
      input,
      tagsConnectIds
    },
    type: 'workbook/update',
    key: 'workbooks',
  })

export default updateWorkbook
