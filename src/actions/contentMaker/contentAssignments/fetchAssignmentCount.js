import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchAssignmentCount = async (filterQuery) =>
  duck.query({
    query: gql`
      {
        assignmentQuestionsMeta(
          filter: {
            and: [
              ${!filterQuery ? '' : filterQuery}
            ]
          }
        ) {
          count
        }
     }
    `,
    type: 'assignmentQuestions/fetch',
    key: 'assignmentQuestionCount',
  })

export default fetchAssignmentCount

