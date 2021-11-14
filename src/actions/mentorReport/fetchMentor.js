import gql from 'graphql-tag'
import { get } from 'lodash'
// import { get } from 'lodash'
import duck from '../../duck'
import convertReportData from './convertReportData'

const FETCH_MENTOR_REPORT_DATA = (filterQuery) => gql`
query{
  mentorReports(
    orderBy: createdAt_DESC,
    filter:{
    and:[
      ${filterQuery}
    ]
  }){
    id
    mentor{
      id
      name
      email
      mentorProfile{
        status
        isMentorActive
        salesExecutive{
          user{
            name
          }
        }
      }createdAt
      phone{
        number
        countryCode
      }
    }
    slotsOpened
    bookingsAssigned
    bookingsRescheduled
    formFilled
    sessionLinkUploaded
    trialsCompleted
    unfit
    lost
    cold
    pipeline
    hot
    won
    oneToOneConversion
    oneToTwoConversion
    oneToThreeConversion
    reportDate
  }mentorReportsMeta(filter:{
    and:[
      ${filterQuery}
    ]
  }){
    count
  }
}
`
const fetchMentorData = async (filterQuery, mentorsList) => duck.query({
  query: FETCH_MENTOR_REPORT_DATA(filterQuery),
  type: 'mentorReports/fetch',
  key: 'mentorReports',
  changeExtractedData: (extractedData, originalData) => {
    let mentorReportsArray = []
    if (originalData.mentorReports.length > 0) {
      const mentorReports = get(originalData, 'mentorReports')
      mentorReportsArray = convertReportData(mentorReports, mentorsList)
    } else {
      mentorReportsArray = convertReportData([], mentorsList)
      extractedData.mentorReports = []
    }
    return {
      ...extractedData,
      mentorReportData: mentorReportsArray,
    }
  }
})

export default fetchMentorData
