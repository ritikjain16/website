import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const fetchConvertedUserInfo = async (
  {
    skipCount = 0,
    mentorId,
    manageKidsFilter,
    first = 20,
    showNotWonLeads = false
  }
) => duck.query({
  query: gql`{
    salesOperations(
      filter: {and: [
        {source_not:school},
        ${showNotWonLeads ? '{ leadStatus_not: won }' : '{leadStatus: won}'},
        ${mentorId ? `{allottedMentor_some: {id: "${mentorId}"}}` : ''},
        ${!manageKidsFilter ? '' : manageKidsFilter}
      ]},
      orderBy: createdAt_DESC,
      first: ${first},
      skip: ${skipCount}
    ) {
      id
      course{
        id
        title
      }
      client {
        id
        name
        gender
        studentProfile {
          id
          batch {
            id
            code
          }
          parents {
            id
            user {
              id
              name
              phone {
                countryCode
                number
              }
              email
            }
          }
        }
      }
      allottedMentor {
        id
        name
      }
    }
    salesOperationsMeta(filter:{and: [{source_not:school},${showNotWonLeads ? '{ leadStatus_not: won }' : '{leadStatus: won}'},${mentorId ? `{allottedMentor_some: {id: "${mentorId}"}}` : ''},${!manageKidsFilter ? '' : manageKidsFilter}]}) {
      count
    }
  }`,
  type: 'salesOperation/fetch',
  key: 'convertedUser',
  changeExtractedData: (extractedData, originalData) => {
    if (get(extractedData, 'salesOperation')) {
      extractedData.salesOperation.forEach((data, index) => {
        if (get(data, 'client.id') && extractedData.salesOperation[index]) {
          extractedData.salesOperation[index].studentId = get(data, 'client.id')
        }
        if (get(data, 'client.name') && extractedData.salesOperation[index]) {
          extractedData.salesOperation[index].studentName = get(data, 'client.name')
        }
        if (get(data, 'client.studentProfile.parents.0.user.name') && extractedData.salesOperation[index]) {
          extractedData.salesOperation[index].parentName = get(data, 'client.studentProfile.parents.0.user.name')
        }
        if (get(data, 'client.studentProfile.parents.0.user.email') && extractedData.salesOperation[index]) {
          extractedData.salesOperation[index].parentEmail = get(data, 'client.studentProfile.parents.0.user.email')
        }
        if (get(data, 'client.studentProfile.parents.0.user.phone.number') && extractedData.salesOperation[index]) {
          extractedData.salesOperation[index].parentPhone =
            `${get(data, 'client.studentProfile.parents.0.user.phone.countryCode')} ${get(data, 'client.studentProfile.parents.0.user.phone.number')}`
        }
        if (get(data, 'allottedMentor.id') && extractedData.salesOperation[index]) {
          extractedData.salesOperation[index].allottedMentorId = get(data, 'allottedMentor.id')
        }
        if (get(data, 'allottedMentor.name') && extractedData.salesOperation[index]) {
          extractedData.salesOperation[index].allottedMentorName = get(data, 'allottedMentor.name')
        }
        if (get(data, 'course') && extractedData.salesOperation[index]) {
          extractedData.salesOperation[index].course = get(originalData, `salesOperations[${index}].course`)
        }
      })
    }
    extractedData.course = []
    return extractedData
  }
})

export default fetchConvertedUserInfo
