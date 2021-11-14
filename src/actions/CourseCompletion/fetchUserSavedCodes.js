import gql from 'graphql-tag'
// import { get } from 'lodash'
import duck from '../../duck'

const fetchUserSavedCodes = async ({ id }) =>
  duck.query({
    query: gql`
        query {
          userApprovedCodes(filter: {
            user_some:{id: "${id}"}
          }){
            id
            totalReactionCount
          }
          userSavedCodes(filter: {
            user_some:{id: "${id}"}
          }){
            id
          }
          userPracticeQuestionReportsMeta(filter: {
            user_some:{id: "${id}"}
          }){
            count
          }
          userQuizReportsMeta(filter: {
            user_some: {id: "${id}"}
          }){
            count
          }
      }
    `,
    type: 'userSavedCodes/fetch',
    key: 'userSavedCodes',
    changeExtractedData: (extractedData, originalData) => {
      extractedData = { ...originalData }
      return extractedData
    },
  })

export default fetchUserSavedCodes
