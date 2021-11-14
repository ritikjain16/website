import gql from 'graphql-tag'
import duck from '../../duck'

const FETCH_WORKBOOK = (topicId) => gql`
{
  workbooks(filter: { topic_some: { id: "${topicId}" } }
  orderBy: order_ASC
  ) {
    id
    order
    title
    statement
    difficulty
    status
    topic{
      id
    }
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
  workbooksMeta(filter: { topic_some: { id: "${topicId}" } }) {
    count
  }
}

`
const fetchWorkbook = async (topicId) =>
  duck.query({
    query: FETCH_WORKBOOK(topicId),
    type: 'workbooks/fetch',
    key: 'workbooks',
    changeExtractedData: (originalData, extractedData) => {
      const workbook = []
      if (originalData && originalData.workbooks && originalData.workbooks.length > 0) {
        const { workbooks } = originalData
        workbooks.forEach((data) => {
          if (data.topic.id === topicId) {
            workbook.push(data)
          }
        })
      }
      extractedData.workbooks = workbook
      return { ...extractedData }
    }
  })

export default fetchWorkbook
