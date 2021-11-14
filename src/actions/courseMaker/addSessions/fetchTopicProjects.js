import gql from 'graphql-tag'
import { get } from 'lodash'
import { PROJECT } from '../../../constants/CourseComponents'
import duck from '../../../duck'

const fetchTopicProjects = async (courseId, type) =>
  duck.query({
    query: gql`
    {
    blockBasedProjects(
      filter: {
        and: [
          ${type === PROJECT ? '{ type: project }' : ' { type: practice }'}
          { courses_some: { id: "${courseId}" } }
        ]
      }
    ) {
      id
      title
      courses {
        id
        title
      }
    }
  }
    `,
    type: 'blockBasedProjects/fetch',
    key: type === PROJECT ? 'project' : 'practice',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.blockBasedProjects = get(originalData, 'blockBasedProjects')
      extractedData.course = []
      return { ...extractedData }
    },
  })

export default fetchTopicProjects

