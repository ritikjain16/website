import gql from 'graphql-tag'
import duck from '../../duck'

const getQuery = (courseId) => (
  gql`
  {
  topics(
    filter: {
      and: [
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


const fetchTopicId = async (courseId) => duck.query({
  query: getQuery(courseId),
  type: 'topics/fetch',
  key: `topics${courseId}`
})
export default fetchTopicId
