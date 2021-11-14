import gql from 'graphql-tag'
import { capitalize, get } from 'lodash'
import duck from '../../duck'
import updateSheet from '../../utils/updateSheet'
import { leadStatusNextStepOptions } from '../../pages/UmsDashboard/components/SalesOperationModal/SalesOperationModal'
// import updateRescheduleSheet from './updateRescheduleSheet'

// const getLogConnectIds = (logIds) => {
//   if (logIds && logIds.length) {
//     return `salesOperationLogConnectIds:${logIds}`
//   }

//   return ''
// }

const updateMentorSales = async (
  id,
  input) => {
  duck.query({
    query: gql`
     mutation($input:SalesOperationUpdate!){
      updateSalesOperation(
        input:$input,
        id: "${id}",
      ){
        id
        userVerificationStatus
        userResponseStatus
        userResponseStatusUpdateDate
        overallFeedback
        client{
            id
            username
            email
            name
            phone {
                countryCode
                number
            }
            studentProfile {
              parents {
                user {
                  phone {
                    number
                  }
                }
              }
            }
        }
        monitoredBy{
          id
          username
          email
          name
          phone{
            countryCode
            number
          }
        }
        salesOperationActivities{
          id
          actionOn
          currentData
          oldData
          createdAt
        }
        createdAt
        leadStatus
        nextCallOn
        rescheduledDate
        rescheduledDateProvided
        nextSteps
        otherReasonForNextStep
        oneToOne
        oneToTwo
        oneToThree
        firstMentorMenteeSession{
            id
        }
      }
    }
  `,
    variables: {
      input
    },
    type: 'salesOperation/update',
    key: 'completedSession',
    changeExtractedData: (extractedData, originalData) => {
      const lsInput = {}
      lsInput.Phone = get(originalData, 'updateSalesOperation.client.studentProfile.parents[0].user.phone.number')
      if (get(originalData, 'updateSalesOperation.oneToOne')) {
        lsInput.mx_Lead_Conversion_Model = '1:1'
      }
      if (get(originalData, 'updateSalesOperation.oneToTwo')) {
        lsInput.mx_Lead_Conversion_Model = '1:2'
      }
      if (get(originalData, 'updateSalesOperation.oneToThree')) {
        lsInput.mx_Lead_Conversion_Model = '1:3'
      }
      if (get(originalData, 'updateSalesOperation.leadStatus')) {
        lsInput.mx_Lead_Conversion_Status = capitalize(get(originalData, 'updateSalesOperation.leadStatus'))
      }
      if (get(originalData, 'updateSalesOperation.nextSteps')) {
        lsInput.mx_Lead_Conversion_Reason = get(
          leadStatusNextStepOptions
            .find(option => option.value === get(originalData, 'updateSalesOperation.nextSteps')),
          'label',
          ''
        )
      }
      updateSheet({}, lsInput)
      return {
        ...extractedData,
        salesOperationForMentorSales: {
          id: originalData.updateSalesOperation.firstMentorMenteeSession.id,
          salesOperation: originalData.updateSalesOperation
        }
      }
    }
  })
}

export default updateMentorSales
