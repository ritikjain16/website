import gql from 'graphql-tag'
import moment from 'moment'
import { get } from 'lodash'
import duck from '../../duck'

const fetchUserSavedCodes = async (filterQuery, last, skip) => duck.query({
  query: gql`
    query {
      userSavedCodes (filter: { and: [${filterQuery}] }, orderBy: createdAt_DESC, first: ${last},skip: ${last *
      skip}) {
        id
        code
        fileName
        description
        user {
          name
          studentProfile {
            id
            grade
            profileAvatarCode
          }
          role
        }
        createdAt
        updatedAt
        isApprovedForDisplay
        rejectionComment
        hasRequestedByMentee
        hasRequestedByMentor
        userApprovedCode {
          id
          status
          approvedDescription
          approvedFileName
          approvedCode
          heartReactionCount
          celebrateReactionCount
          hotReactionCount
          totalReactionCount
          userApprovedCodeTagMappings{
            userApprovedCodeTag {
              title
              codeCount
              id
            }
            id
          }
        }
      }
      userSavedCodesMeta(filter: { and: [${filterQuery}] }) {
        count
      }
    }
  `,
  type: 'userSavedCodes/fetch',
  key: 'userSavedCodes',
  changeExtractedData: (extractedData, originalData) => {
    let tableData = []
    if (originalData.userSavedCodes.length > 0) {
      const userSavedCodes = get(originalData, 'userSavedCodes')
      userSavedCodes.forEach(savedCode => {
        tableData.push({
          id: get(savedCode, 'id'),
          studentName: get(savedCode, 'user.name', ''),
          studentProfileId: get(savedCode, 'user.studentProfile.id'),
          profileAvatarCode: get(savedCode, 'user.studentProfile.profileAvatarCode') || 'theo',
          grade: get(savedCode, 'user.studentProfile.grade', '-'),
          code: get(savedCode, 'code'),
          title: get(savedCode, 'fileName', ''),
          description: get(savedCode, 'description', ''),
          isApprovedForDisplay: get(savedCode, 'isApprovedForDisplay', 'pending'),
          rejectionComment: get(savedCode, 'rejectionComment', ''),
          hasRequestedByMentee: get(savedCode, 'hasRequestedByMentee', false),
          hasRequestedByMentor: get(savedCode, 'hasRequestedByMentor', false),
          userApprovedCode: savedCode.userApprovedCode && savedCode.userApprovedCode || null,
          createdAt: get(savedCode, 'createdAt'),
          updatedAt: moment(savedCode.updatedAt).format('L'),
        })
      })
    } else {
      tableData = []
    }
    return { ...originalData, userSavedCodes: tableData }
  }
})

export default fetchUserSavedCodes
