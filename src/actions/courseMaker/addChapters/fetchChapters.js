import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchChapters = async (courseId) =>
  duck.query({
    query: gql`
        {
        chapters(filter: { courses_some: { id: "${courseId}" } }) {
            id
            order
            status
            courses{
              id
            }
            thumbnail {
              id
              uri
            }
            title
            description
            createdAt
            topics {
              id
            }
        }
        chaptersMeta(filter: { courses_some: { id: "${courseId}" } }) {
          count
        }
      }
    `,
    type: 'chapters/fetch',
    key: 'chapters',
  })

export default fetchChapters

