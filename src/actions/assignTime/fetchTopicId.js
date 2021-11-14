import gql from 'graphql-tag'
import duck from '../../duck'

const getQuery = (orderNumber, courseId) => (
  gql`
  {
  topics(
    filter: {
      and: [
        { order_gte : ${orderNumber} } 
        { status: published }
        { courses_some: { id: "${courseId}" } }
      ]
    }
    orderBy: order_ASC
  ) {
    id
    title
    order
  }
}
`
)


const fetchTopicId = (orderNumber, courseId) => (
  duck.query({
    query: getQuery(orderNumber, courseId),
    type: 'topicId/fetch',
    key: 'topicId'
  })
)
export default fetchTopicId
