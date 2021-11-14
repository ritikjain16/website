import { Button } from 'antd'
import gql from 'graphql-tag'
import { get } from 'lodash'
import moment from 'moment'
import React, { useRef, useState } from 'react'
import { CSVLink } from 'react-csv'
import convertReportData from '../../../actions/mentorReport/convertReportData'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'
import requestToGraphql from '../../../utils/requestToGraphql'
import reportHeaderConfig from './reportHeaderConfig'

const mentorReportFields = `id
  mentor{
    id
    name
    mentorProfile{
      status
      isMentorActive
      salesExecutive{
        user{
          name
        }
      }
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
  reportDate`

const DownloadReport = (props) => {
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState([])
  const reportRef = useRef()
  const { mentorNames = [], fromDate, toDate } = props
  const fetchReportData = async () => {
    setLoading(true)
    const mentorIds = []
    for (let i = 0; i < mentorNames.length; i += 10) {
      const removedItem = mentorNames.filter((_, ind) => ind >= i && ind < i + 10)
      const filteredMentorId = removedItem.map(mentor => get(mentor, 'id'))
      mentorIds.push(filteredMentorId)
    }
    const mentorReports = []
    let dateFilter = ''
    if (fromDate) dateFilter += `{ reportDate_gte: "${moment(fromDate).startOf('day').toISOString()}" }`
    if (toDate) dateFilter += `{ reportDate_lte: "${moment(toDate).endOf('day').toISOString()}" }`
    for (let count = 0; count < mentorIds.length; count += 1) {
      const mentorId = mentorIds[count]
      /* eslint-disable no-await-in-loop */
      const { data } = await requestToGraphql(gql`
        {
          mentorReports(
            orderBy: createdAt_DESC,
            filter:{
              and:[
                {
                  mentor_some:{id_in:[${getIdArrForQuery(mentorId)}]}
                }
                ${dateFilter || ''}
              ]
            }){
            ${mentorReportFields}
          }
        }
      `)
      if (get(data, 'mentorReports', []).length > 0) {
        mentorReports.push(...get(data, 'mentorReports', []))
      }
    }
    const mentorsReportArray = convertReportData(mentorReports, mentorNames)
    mentorsReportArray.forEach(report => {
      for (const key in report) {
        if (key) {
          if (report[key] === 0) {
            report[key] = '-'
          }
          if (key === 'isMentorActive' && report[key] === true) {
            report[key] = 'Yes'
          }
          if (key === 'isMentorActive' && report[key] === false) {
            report[key] = 'No'
          }
        }
      }
    })
    setReportData(mentorsReportArray)
    setLoading(false)
    if (reportRef && reportRef.current) reportRef.current.link.click()
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
      <Button
        type='primary'
        icon='download'
        onClick={fetchReportData}
        loading={loading}
      >Download Report
      </Button>
      <CSVLink
        style={{ display: 'none' }}
        filename='MentorReport.csv'
        data={reportData}
        headers={reportHeaderConfig}
        ref={reportRef}
      />
    </div>
  )
}

export default DownloadReport
