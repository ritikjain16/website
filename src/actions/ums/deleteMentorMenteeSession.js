import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const deleteMentorMenteeSession = async (id) => duck.query({
  query: gql`
    mutation {
      deleteMentorMenteeSession(id: "${id}") {
        id
      }
    }
    `,
  type: 'mentorMenteeSessions/delete',
  key: 'bookedSessions',
  changeExtractedData: (extractedData, originalData) => {
    if (originalData && get(originalData, 'deleteMentorMenteeSession')) {
      extractedData.completedSession = []
      extractedData.mentorMenteeSessions = {
        ...get(originalData, 'deleteMentorMenteeSession')
      }
    }
    return { ...extractedData }
  }
})

export default deleteMentorMenteeSession
