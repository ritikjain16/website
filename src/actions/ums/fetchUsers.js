import gql from 'graphql-tag'
import { get } from 'lodash'
import moment from 'moment'
import duck from '../../duck'
import { PARENT_MENTEE, MENTEE, PARENT, MENTOR, ADMIN, UMS_ADMIN, UMS_VIEWER } from '../../constants/roles'
import bookedFirstSessions from '../sessions/fetchIfSessionBooked'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import fetchUserCourse from './fetchUserCourse'

// const getSourceFilter = (sourceType) => {
//   if (sourceType) {
//     if (sourceType === 'school') return '{ source: school }'
//     else if (sourceType === 'website') return '{source_not: school }'
//   }
//   return ''
// }

const menteeSessionQuery = (page, perPage, country = 'india', fromDate, toDate, searchGrade) => gql`{
      menteeSessions(
        filter: {
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
        }
        ${perPage ? `first: ${perPage}` : ''}
        skip: ${perPage ? perPage * (page - 1) : 0}
        orderBy: createdAt_DESC
      ) {
        id
        user {
          id
          role
          gender
          name
          status
          createdAt
          updatedAt
          email
          username
          timezone
          country
          city
          state
          region
          savedPassword
          fromReferral
          verificationStatus
          inviteCode
          source
          utmTerm
          utmSource
          utmMedium
          utmContent
          utmCampaign
          phone {
            countryCode
            number
          }
          studentProfile {
            id
            grade
            school {
              id
              name
            }
            batch {
              code
              type
            }
            parents {
              id
              user {
                id
                name
                email
                phoneVerified
                phone {
                  countryCode
                  number
                }
              }
              hasLaptopOrDesktop
            }
          }
        }
      }
    }
    `

const getQuery = (role, page, perPage, usersFilter, country = 'india', fromDate, toDate,
  verifiedAndBookedUser, searchGrade) => {
  if (role !== PARENT_MENTEE && role !== MENTEE && role !== PARENT) {
    return gql`{
        users(
          filter: {
            and: [
              {role: ${role}}
              ${!usersFilter ? '' : usersFilter}
              ${country === 'all' ? '' : `{country:${country}}`}
              ${fromDate ? `{ createdAt_gte: "${moment(fromDate).startOf('day').toDate()}" }` : ''}
              ${toDate ? `{ createdAt_lte: "${moment(toDate).endOf('day').toDate()}" }` : ''}
            ]
          },
          orderBy: createdAt_DESC,
          ${perPage ? `first: ${perPage}` : ''}
          skip: ${perPage ? perPage * (page - 1) : 0}
        ) {
        id
        name
        username
        email
        role
        country
        timezone
        phoneVerified
        ${role === MENTOR ? `
        profilePic {
          id
          uri
        }
        mentorProfile {
          id
          experienceYear
          sessionLink
          googleMeetLink
          meetingId
          meetingPassword
          pythonCourseRating5
          pythonCourseRating4
          pythonCourseRating3
          pythonCourseRating3
          pythonCourseRating2
          pythonCourseRating1
        }
        ` : ''}
        phone{
          countryCode
          number
        }
        status
        gender
        dateOfBirth
        createdAt
        updatedAt
        savedPassword
        fromReferral
      }
    }`
  } else if (role === PARENT) {
    if (verifiedAndBookedUser) return menteeSessionQuery(page, perPage, country = 'india', fromDate, toDate, searchGrade)
    return gql`
          {
        users(
          filter: { and: [
            {role: ${role}}
            ${!usersFilter ? '' : usersFilter}
            ${country === 'all' ? '' : `{country:${country}}`}
            ${fromDate ? `{ createdAt_gte: "${moment(fromDate).startOf('day').toDate()}" }` : ''}
            ${toDate ? `{ createdAt_lte: "${moment(toDate).endOf('day').toDate()}" }` : ''}
            ${searchGrade ? `{
            parentProfile_some: {
              children_some: { grade: ${searchGrade} }
            }
          }` : ''}
          ] }
          orderBy: createdAt_DESC,
          ${perPage ? `first: ${perPage}` : ''}
          skip: ${perPage ? perPage * (page - 1) : 0}
        ) {
          id
          name
          email
          role
          country
          city
          state
          region
          timezone
          phoneVerified
          utmTerm
          utmSource
          utmMedium
          utmContent
          utmCampaign
          phone {
            countryCode
            number
          }
          parentProfile {
            id
            user {
              id
            }
            children {
              id
              grade
              batch {
                code
                type
              }
              school {
                id
                name
              }
              user {
                id
                name
                verificationStatus
                inviteCode
              }
            }
          }
          gender
          dateOfBirth
          createdAt
          updatedAt
          fromReferral
          source
        }
      }
    `
    /* eslint-disable no-else-return */
  } else {
    /* eslint-disable no-lonely-if */
    if (verifiedAndBookedUser) {
      return menteeSessionQuery(page, perPage, country = 'india', fromDate, toDate, searchGrade)
    } else {
      return gql`{
          users(filter: {
              and: [
                {role: mentee}
                ${!usersFilter ? '' : usersFilter}
                ${searchGrade ? `{ studentProfile_some: { grade: ${searchGrade} } }` : ''}
                ${country === 'all' ? '' : `{country:${country}}`}
                ${fromDate ? `{ createdAt_gte: "${moment(fromDate).startOf('day').toDate()}" }` : ''}
                ${toDate ? `{ createdAt_lte: "${moment(toDate).endOf('day').toDate()}" }` : ''}
              ]
          },
          orderBy: createdAt_DESC,
          first: ${perPage}
          skip: ${perPage * (page - 1)}
          ) {
          id
          role
          gender
          name
          status
          createdAt
          updatedAt
          email
          username
          timezone
          country
          city
          state
          region
          savedPassword
          fromReferral
          verificationStatus
          inviteCode
          source
          utmTerm
          utmSource
          utmMedium
          utmContent
          utmCampaign
          phone{
            countryCode
            number
          }
          studentProfile {
            id
            grade
            school {
              id
              name
            }
            batch {
              code
              type
            }
            parents{
              id
              user{
                id
                name
                email
                phoneVerified
                phone {
                  countryCode
                  number
                }
              }
              hasLaptopOrDesktop
            }
          }
        }
      }`
    }
  }
}

const fetchUsers = async ({ role, page, perPage, filterQuery, country,
  fromDate, toDate, verifiedAndBookedUser, searchGrade }) =>
  duck.query({
    query: getQuery(role, page, perPage, get(filterQuery, 'usersFilter'), country, fromDate, toDate,
      verifiedAndBookedUser, searchGrade === 'All' ? '' : `Grade${searchGrade}`),
    type: 'user/fetch',
    key: country ? `user/${country}` : 'user',
    changeExtractedData: (extractedData, originalData) => {
      const savedRole = getDataFromLocalStorage('login.role')
      const isAdmin = savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER
      extractedData.batch = []
      if (!verifiedAndBookedUser) {
        if (role === MENTEE) {
          const userIds = []
          originalData.users.forEach(user => {
            userIds.push(`"${user.id}"`)
          })
          if (userIds.length > 0) {
            bookedFirstSessions(userIds)
            if (isAdmin) fetchUserCourse(userIds)
          }
        } else if (role === PARENT) {
          const userIds = []
          originalData.users.forEach(user => {
            if (get(user, 'parentProfile.children', []).length > 0) {
              get(user, 'parentProfile.children', []).forEach(child => {
                userIds.push(`"${get(child, 'user.id')}"`)
              })
            }
          })
          if (userIds.length > 0) {
            bookedFirstSessions(userIds)
            if (isAdmin) fetchUserCourse(userIds)
          }
        }
        if (extractedData.user && originalData.users) {
          extractedData.user = originalData.users
        }
      } else {
        const users = []
        const userIds = []
        get(extractedData, 'user', []).forEach(user => {
          if (get(user, 'role') === MENTEE) {
            userIds.push(`"${user.id}"`)
            users.push(user)
          }
        })
        if (userIds.length > 0) {
          bookedFirstSessions(userIds)
          if (isAdmin) fetchUserCourse(userIds)
        }
        extractedData.user = users
        extractedData.menteeSession = get(extractedData, 'menteeSession', [])
      }
      extractedData.course = []
      extractedData.schools = []
      return {
        ...extractedData,
        userForDashBoard: get(extractedData, 'user', [])
      }
    }
  })

export default fetchUsers
