import gql from 'graphql-tag'
import moment from 'moment'
import requestToGraphql from '../../../../../utils/requestToGraphql'
import { MENTEE } from '../../../../../constants/roles'
import { get } from 'lodash'
import { flattenObject, getColumnsWithBoolFilters } from './utils'

const dateFilters = (fromDate, toDate) => {
  if (fromDate && toDate) {
    return `{createdAt_gt: "${fromDate}"}{createdAt_lt: "${toDate}"}`
  } else if (fromDate) {
    return `{createdAt_gt: "${fromDate}"}`
  } else if (toDate) {
    return `{createdAt_lt: "${toDate}"}`
  }
  return ''
}

const fetchBookedSessions = (fromDate, toDate) => gql`{
  menteeSessions(filter: {
    and:[
      {
        user_some:{
          and:[
            ${dateFilters(fromDate, toDate)}
          ]
        }
      },
      {
        topic_some:{order:1}
      }
    ]
  }) {
    user{
      id
    }
  }
}`

const fetchRegisteredAndNotBooked = (sessionsBookedUsersIds, fromDate, toDate) => gql`{
  users(filter: {
    and: [
      {role: ${MENTEE}},
      {studentProfile_exists: true},
      {id_not_in: ${JSON.stringify(sessionsBookedUsersIds)}},
      ${dateFilters(fromDate, toDate)}
    ]
  }){
    id
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

const getRegNotBookedUsers = async (fromDate, toDate) => {
  let data = await requestToGraphql(fetchBookedSessions(fromDate, toDate))
  const menteeSessions = get(data, 'data.menteeSessions') || []
  const bookedSessionsUsersIds = menteeSessions.map(session => get(session, 'user.id'))

  data = {}
  data = await requestToGraphql(fetchRegisteredAndNotBooked(bookedSessionsUsersIds, fromDate, toDate))
  let registeredNotBookedUsers = get(data, 'data.users')
  registeredNotBookedUsers = registeredNotBookedUsers.map(ele => flattenObject(ele))
  registeredNotBookedUsers.forEach(ele => {
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

  return [registeredNotBookedUsers || [], columns]
}

export default getRegNotBookedUsers