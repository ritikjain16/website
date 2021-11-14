import gql from 'graphql-tag'
import { get } from 'lodash'
import moment from 'moment'
import duck from '../../duck'
import { MENTEE, PARENT, PARENT_MENTEE } from '../../constants/roles'

// const getSourceFilter = (sourceType) => {
//   if (sourceType) {
//     if (sourceType === 'school') return '{ source: school }'
//     else if (sourceType === 'website') return '{source_not: school }'
//   }
//   return ''
// }

const getGradeFilter = (searchGrade, role) => {
  if (searchGrade) {
    if (role === MENTEE) {
      return `{ studentProfile_some: { grade: ${searchGrade} } }`
    } else if (role === PARENT) {
      return `{
        parentProfile_some: {
          children_some: { grade: ${searchGrade} }
        }
      }`
    }
    return ''
  }
  return ''
}

const getUserCountQuery = (role, usersFilter, country, fromDate,
  toDate, verifiedAndBookedUser, searchGrade) => {
  let query = ''
  if (verifiedAndBookedUser) {
    query = gql`{
      menteeSessionsMeta(filter: {
        and:[
            {topic_some:{order:1}}
            {
              user_some: {
                and: [
                  {role: mentee}
                  { verificationStatus: verified }
                  ${country === 'all' ? '' : `{country:${country}}`}
                  ${fromDate ? `{ createdAt_gte: "${moment(fromDate).startOf('day').toDate()}" }` : ''}
                  ${toDate ? `{ createdAt_lte: "${moment(toDate).endOf('day').toDate()}" }` : ''}
                  ${searchGrade ? `{ studentProfile_some: { grade: ${searchGrade} } }` : ''}
                ]
              }
            }
          ]
      }) {
        count
      }
    }`
  } else {
    query = gql`{
        usersMeta(filter: {
            and: [
              {role: ${role === PARENT_MENTEE ? 'mentee' : role}}
              ${!usersFilter ? '' : usersFilter}
              ${country === 'all' ? '' : `{country:${country}}`}
              ${role === PARENT_MENTEE || role === MENTEE ? '{source_not: school}' : ''}
              ${fromDate ? `{ createdAt_gte: "${moment(fromDate).startOf('day').toDate()}" }` : ''}
              ${toDate ? `{ createdAt_lte: "${moment(toDate).endOf('day').toDate()}" }` : ''}
              ${getGradeFilter(searchGrade, role)}
         ]
        }){
          count
        }
  }
  `
  }
  return query
}

const fetchUsersCount = async ({ role, filterQuery: { usersFilter }, country = 'india',
  fromDate, toDate, verifiedAndBookedUser, searchGrade }) =>
  duck.query({
    query: getUserCountQuery(role, usersFilter, country, fromDate, toDate,
      verifiedAndBookedUser, searchGrade === 'All' ? '' : `Grade${searchGrade}`),
    type: 'userMeta/fetch',
    key: 'userMeta',
    changeExtractedData: (extractedData) => {
      if (verifiedAndBookedUser) {
        extractedData.userMeta = get(extractedData, 'menteeSessionsMeta')
      }
      return { ...extractedData }
    }
  })

export default fetchUsersCount
