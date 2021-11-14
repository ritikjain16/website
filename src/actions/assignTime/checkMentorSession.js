import gql from 'graphql-tag'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const checkMentorSession = (mentorUserID, availabilityDate, sessionType) => (
  duck.query({
    query: gql`
       {
  mentorSessions(filter: {and: [
    {availabilityDate: "${availabilityDate}"}, 
    {user_some: {id: "${mentorUserID}"}
    },
    ${sessionType ? `{sessionType:${sessionType}}` : '{sessionType:batch}'}
  ]}) {
    id
    availabilityDate
    ${getSlotNames()}
  }
}
  `,
    type: 'checkMentorSession/fetch',
    key: 'checkMentorSession',
    changeExtractedData: (extractedData, originalData) => {
      if (originalData.mentorSessions.length === 0) {
        extractedData.session = []
      }
      return extractedData
    }
  })
)

export default checkMentorSession
