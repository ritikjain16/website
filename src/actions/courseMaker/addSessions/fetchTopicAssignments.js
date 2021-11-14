import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../../duck'

const fetchTopicAssignments = async (courseId, type) =>
  duck.query({
    query: gql`
    {
        assignmentQuestions(
          filter: { and: [ { courses_some: { id: "${courseId}" } } ${type ? '{ isHomework: true }' : '{ isHomework: false }'} { status: published } ] }
        ) {
          id
          statement
          courses {
            id
            title
          }
        }
    }
    `,
    type: 'assignmentQuestions/fetch',
    key: type ? 'homeworkAssignment' : 'assignmentQuestions',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.course = []
      extractedData.assignmentQuestion = get(originalData, 'assignmentQuestions', [])
      return { ...extractedData }
    },
  })

export default fetchTopicAssignments

