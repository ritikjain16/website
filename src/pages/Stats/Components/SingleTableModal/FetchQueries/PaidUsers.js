import gql from 'graphql-tag'
import moment from 'moment'
import requestToGraphql from '../../../../../utils/requestToGraphql'
import { get } from 'lodash'
import { flattenObject, getColumnsWithBoolFilters } from './utils'

const fetchPaidUsers = gql`{
  users: userCurrentTopicComponentStatuses(filter:{
      and:[
          {enrollmentType:pro}
          {user_some:{name_exists:true}}
      ]
  }){
    id
    currentCourse{
      course: title
    }
    currentTopic{
      topic: title order
    }
    user{
      fromReferral
      studentProfile{
        createdAt
        grade
        user{
          child_name: name
        }
        parents{
          user{
            name
            email
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
    title: 'Current Course',
    dataIndex: 'course',
    width: '180px'
  },
  {
    title: 'Current Topic',
    dataIndex: 'topic',
    width: '250px'
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

const getPaidUsers = async () => {
  let data = await requestToGraphql(fetchPaidUsers)
  let paidUsers = get(data, 'data.users')

  paidUsers = paidUsers.map(ele => flattenObject(ele))
  paidUsers.forEach(ele => {
    if (ele['countryCode'] && ele['number'])
      ele['phone'] = ele['countryCode'] + ' ' + ele['number']
    else
      ele['phone'] = ''
    if(ele['order'] ){
      ele['topic'] = '('+ ele['order'] + ')'+ ele['topic']
    }
    delete ele['countryCode']
    delete ele['number']
    delete ele['order']
  })

  const colsToAddBoolFilter = ['From Referral']
  let columns = columnsOriginal
  columns = getColumnsWithBoolFilters(columns, colsToAddBoolFilter)

  return [paidUsers || [], columns]
}

export default getPaidUsers
