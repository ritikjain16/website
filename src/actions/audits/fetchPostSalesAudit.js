import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const fetchPostSalesAudit = async ({ filterQuery }) =>
  duck.query({
    query: gql`
    {
  postSalesAudits(filter: { and: [ ${filterQuery || ''} ] }
  ) {
    id
    postSalesUser {
      id
      name
      email
      role
    }
    auditor {
      id
      name
      email
      role
    }
    status
    score
    customScore
    totalScore
    createdAt
    updatedAt
    mentorMenteeSession {    
        id
        sessionStartDate
        sessionEndDate
        sessionStatus
        leadStatus
        source
        topic{
         id
         title
         order
        }
        mentorSession{
         id
         user{
           id
           name
           username
           phone{
            countryCode
            number
           }
        }
      }
      menteeSession{
        id
        user{
          id
          name
          studentProfile{
            id
            parents{
                id
                user{
                id
                name
                email
                phone{
                    countryCode
                    number
                }
                }
            }
            }
        }
      }
      rating
      friendly
      motivating
      engaging
      helping
      enthusiastic
      patient
      conceptsPerfectlyExplained
      distracted
      rude
      slowPaced
      fastPaced
      notPunctual
      average
      boring
      poorExplanation
      averageExplanation
      comment
      sessionRecordingLink
    }
  }
  postSalesAuditsMeta {
    count
  }
}
    `,
    type: 'postSalesAudits/fetch',
    key: 'postSalesAudits',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.auditQuestions = []
      extractedData.menteeSession = []
      extractedData.mentorSessions = []
      extractedData.user = []
      extractedData.topic = []
      const postSalesAudits = get(originalData, 'postSalesAudits', [])
      extractedData.postSalesAudits = postSalesAudits
      return { ...extractedData }
    }
  })

export default fetchPostSalesAudit

