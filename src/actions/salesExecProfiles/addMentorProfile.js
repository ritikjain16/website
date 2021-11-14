import gql from 'graphql-tag'
import duck from '../../duck'

const addMentorToSalesExecutive = async (mentorQuery) =>
  duck.query({
    query: gql`
      mutation{
        ${mentorQuery}
      }
    `,
    type: 'mentors/update',
    key: 'addMentor',
  })

export default addMentorToSalesExecutive
