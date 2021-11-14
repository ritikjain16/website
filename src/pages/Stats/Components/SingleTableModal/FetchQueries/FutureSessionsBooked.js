import gql from 'graphql-tag'
import moment from 'moment'
import getSlotNames from '../../../../../utils/slots/slot-names'
import requestToGraphql from '../../../../../utils/requestToGraphql'
import { get } from 'lodash'
import { flattenObject, getColumnsWithBoolFilters } from './utils'

const fetchFutureBookedSessions = gql`{
  futureBookedSessions: 
    menteeSessions(filter: {bookingDate_gt: "${new Date().toDateString()}"}){
      id
      bookingDate
      user{
        createdAt
        studentProfile{
          grade
          user{
            child_name: name
          }
          parents{
            hasLaptopOrDesktop
            user{
              name,
              email,
              phone{
                countryCode
                number
              }
            }
          }
        }
      }
    }
  menteeSessions(filter: {
    bookingDate: "${moment().startOf('day')}"
  }){
    ${getSlotNames()}
    id
    bookingDate
    user{
      studentProfile{
        createdAt
        grade
        user{
          child_name: name
        }
        parents{
          hasLaptopOrDesktop
          user{
            name,
            email,
            phone{
              countryCode
              number
            }
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
    title: 'Has Laptop or Desktop',
    dataIndex: 'hasLaptopOrDesktop',
    width: '150px'
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
    render: (date) => `${moment(date).format('LLL')}`,
    sorter: (a, b) => {
      let dateA = moment(a.createdAt)
      let dateB = moment(b.createdAt)

      return dateA - dateB
    }
  },
]

const getFutureBookedSessions = async () => {
  let data = await requestToGraphql(fetchFutureBookedSessions)
  let todaysBookedSessions = get(data, 'data.menteeSessions')
  let futureBookedSessions = get(data, 'data.futureBookedSessions')

  if (todaysBookedSessions) {
    const currentHour = (new Date()).getHours()
    todaysBookedSessions.forEach(session => {
      Object.keys(session).forEach(slot => {
        if (session[slot] && slot > currentHour)
          futureBookedSessions.push(session)
      })
    })
  }

  futureBookedSessions = futureBookedSessions.map(ele => flattenObject(ele))
  futureBookedSessions.forEach(ele => {
    if (ele['countryCode'] && ele['number'])
      ele['phone'] = ele['countryCode'] + ' ' + ele['number']
    else
      ele['phone'] = ''
    delete ele['countryCode']
    delete ele['number']
  })

  const colsToAddBoolFilter = ['Has Laptop or Desktop']
  let columns = columnsOriginal
  columns = getColumnsWithBoolFilters(columns, colsToAddBoolFilter)

  return [futureBookedSessions || [], columns]
}

export default getFutureBookedSessions