import gql from 'graphql-tag'
import duck from '../../duck'

const removeFromWorkbookContentTag = async (contentTagId, workbookId) => duck.query({
  query: gql`
    mutation {
    removeFromWorkbookContentTag(
        contentTagId: "${contentTagId}"
        workbookId: "${workbookId}"
    ) {
        fieldName
    }
    }
  `,
  type: 'contentTag/delete',
  key: 'contentTags',
})

export default removeFromWorkbookContentTag
