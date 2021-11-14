import gql from 'graphql-tag'
import duck from '../../duck'

const fetchMentorPayData = async () =>
  duck.query({
    query: gql`
      query {
        mentorPricings(filter: { status: published }) {
          id
          sessionPrice {
            amount
          }
          bonusAmount {
            amount
          }
          modelType
        }
        topicsMeta(
          filter: {
            and: [{ status: published }, { chapter_some: { courses_some: {} } }]
          }
        ) {
          count
        }
      }
    `,
    type: 'fetchMentorPayData/fetch',
    key: 'fetchMentorPayData',
  })
export default fetchMentorPayData
