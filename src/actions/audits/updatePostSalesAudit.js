import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const updatePostSalesAudit = async ({ auditId, auditorConnectId, postSalesId, input = {} }) =>
  duck.query({
    query: gql`
    mutation($input:PostSalesAuditUpdate) {
    updatePostSalesAudit(id: "${auditId}",
    ${auditorConnectId || ''},
    ${postSalesId ? `postSalesUserConnectId: "${postSalesId}"` : ''},
    input: $input
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
    }
    `,
    variables: {
      input
    },
    type: 'postSalesAudits/update',
    key: 'postSalesAudits',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.auditQuestions = []
      extractedData.menteeSession = []
      extractedData.mentorSessions = []
      extractedData.user = []
      extractedData.topic = []
      extractedData.postSalesAudits = {
        ...get(originalData, 'updatePostSalesAudit')
      }
      return { ...extractedData }
    }
  })

export default updatePostSalesAudit
