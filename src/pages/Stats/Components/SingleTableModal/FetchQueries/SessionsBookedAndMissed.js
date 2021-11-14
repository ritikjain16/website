import gql from 'graphql-tag'
import moment from 'moment'
import requestToGraphql from '../../../../../utils/requestToGraphql'
import { get } from 'lodash'
import { flattenObject, getColumnsWithBoolFilters } from './utils'

const fetchCompletedSessions = gql`{
  mentorMenteeSessions(filter: {
        topic_some:{order:1}
  }) {
    menteeSession{
      id
    }
  }
}`

const fetchBookedAndMissedSessions = (completedSessionsIds) => gql`{
  menteeSessions(filter: {
    and: [
      {topic_some: {order: 1}},
      {id_not_in: ${JSON.stringify(completedSessionsIds)}}
    ]
  }){
    id
    bookingDate
    user{
      fromReferral
      createdAt
      studentProfile{
        grade
        user{
          child_name: name
        }
        parents{
          hasLaptopOrDesktop
          user{
            name
            status
            email
            emailVerified
            phone{
              countryCode
              number
            }
            phoneVerified
          }
        }
      }
    }
  }
}`

let columnsOriginal = [
  {
    title: 'Parent Name',
    dataIndex: 'name',
    fixed: 'left',
    width: '150px'
  },
  {
    title: 'Parent Email',
    dataIndex: 'email',
    fixed: 'left',
    width: '220px'
  },
  {
    title: 'Parent Phone',
    dataIndex: 'phone',
    fixed: 'left',
    width: '180px'
  },
  {
    title: 'Child Name',
    dataIndex: 'child_name',
    width: '180px'
  },
  {
    title: 'Grade',
    dataIndex: 'grade',
    width: '120px',
    sorter: (a, b) => {
      let gradeA = a.grade
      let gradeB = b.grade
      gradeA = gradeA && gradeA.slice(5) || 0
      gradeB = gradeB && gradeB.slice(5) || 0

      return gradeA - gradeB
    }
  },
  {
    title: 'From Referral',
    dataIndex: 'fromReferral',
    width: '120px'
  },
  {
    title: 'Has Laptop or Desktop',
    dataIndex: 'hasLaptopOrDesktop',
    width: '150px'
  },
  {
    title: 'Status',
    dataIndex: `status`,
    width: '100px'
  },
  {
    title: 'Email Verified',
    dataIndex: 'emailVerified',
    width: '120px'
  },
  {
    title: 'Phone Verified',
    dataIndex: 'phoneVerified',
    width: '120px'
  },
  {
    title: 'Booking Date',
    dataIndex: 'bookingDate',
    width: '300px',
    render: (date) => `${moment(date).format('LLL')}`,
    sorter: (a, b) => {
      let dateA = moment(a.bookingDate)
      let dateB = moment(b.bookingDate)

      return dateA - dateB
    }
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    width: '300px',
    render: (date) => `${moment(date).format('LLL')}`,
    sorter: (a, b) => {
      let dateA = moment(a.createdAt)
      let dateB = moment(b.createdAt)

      return dateA - dateB
    }
  },
]

const getBookedAndMissedSessions = async () => {
  let data = await requestToGraphql(fetchCompletedSessions)
  const completedSessions = get(data, 'data.mentorMenteeSessions') || []
  const completedSessionsIds = completedSessions.map(session => get(session, 'menteeSession.id'))

  data = {}
  data = await requestToGraphql(fetchBookedAndMissedSessions(completedSessionsIds))
  let bookedAndMissedSessions = get(data, 'data.menteeSessions')
  bookedAndMissedSessions = bookedAndMissedSessions.map(ele => flattenObject(ele))
  bookedAndMissedSessions.forEach(ele => {
    if (ele['countryCode'] && ele['number'])
      ele['phone'] = ele['countryCode'] + ' ' + ele['number']
    else
      ele['phone'] = ''
    delete ele['countryCode']
    delete ele['number']
  })

  const colsToAddBoolFilter = ['From Referral', 'Has Laptop or Desktop', 'Email Verified', 'Phone Verified']
  let columns = columnsOriginal
  columns = getColumnsWithBoolFilters(columns, colsToAddBoolFilter)

  return [bookedAndMissedSessions || [], columns]
}

export default getBookedAndMissedSessions