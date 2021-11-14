import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchChapterCount = async (courseId) =>
  duck.query({
    query: gql`
        {
        chaptersMeta(filter: { courses_some: { id: "${courseId}" } }) {
          count
        }
      }
    `,
    type: 'chapters/fetch',
    key: 'chaptersCount',
  })

export default fetchChapterCount

