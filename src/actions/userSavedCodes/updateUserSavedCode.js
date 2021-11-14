import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import USER_SAVED_CODE_STATUS from '../../constants/userSavedCodeStatus'

const updateUserSavedCodes = async (id, input) => duck.query({
  query: gql`
    mutation($input:UserSavedCodeUpdate!) {
      updateUserSavedCode (input: $input, id: "${id}" ) {
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
    }
  `,
  variables: {
    input
  },
  type: 'userSavedCodes/update',
  key: 'updateUserSavedCodes',
  changeExtractedData: (extractedData, originalData) => {
    if (get(originalData, 'updateUserSavedCodes.isApprovedForDisplay') === USER_SAVED_CODE_STATUS.ACCEPTED) {
      extractedData.userSavedCodes.isApprovedForDisplay = {
        ...get(originalData, 'updateUserSavedCodes.isApprovedForDisplay')
      }
    }
    return extractedData
  }
})

export default updateUserSavedCodes
