import gql from 'graphql-tag'
import { get } from 'lodash'
import { MENTEE, PARENT } from '../../constants/roles'
import duck from '../../duck'
import requestToGraphql from '../../utils/requestToGraphql'

const updateParent = async (id, input) => {
  const res = await requestToGraphql(
    gql`mutation($input:UserUpdate){
      updateUser(id:"${id}",input:$input){
        id
        name
        email
        phone{
          countryCode
          number
        }
      }
    }`,
    { input }
  )
  return res
}

const fetchStudentProfile = async (userId) => {
  const res = await requestToGraphql(
    gql`{
  studentProfiles(filter:{user_some:{id:"${userId}"}}){
    id
  }
}`)
  return res
}

const updateStudentProfile = async (id, grade) => {
  const res = await requestToGraphql(
    gql`mutation{
  updateStudentProfile(id:"${id}"
  input:{
    grade: ${grade}
  }){
    id
  }
}`)
  return res
}

const updateUser = async (id, data) => {
  let query = ''
  let input = {}
  let parentData = ''
  if (data.role === MENTEE || data.role === PARENT) {
    parentData = await updateParent(data.parentID, data.parentInput)
    input = {
      name: data.name,
    }
    if (data.country) {
      input.country = data.country
    }
    if (data.timezone) {
      input.timezone = data.timezone
    }
    if (data.city) {
      input.city = data.city
    }
    if (data.state) {
      input.state = data.state
    }
    if (data.region) {
      input.region = data.region
    }
    if (data.verificationStatus) {
      input.verificationStatus = data.verificationStatus
    }
    if (data.grade) {
      const studentProfileRes = await fetchStudentProfile(id)
      const studentProfileId = get(studentProfileRes, 'data.studentProfiles[0].id', '')
      await updateStudentProfile(studentProfileId, `Grade${data.grade}`)
    }
    query = `id
    name
    role
    email
    source
    phone {
      countryCode
      number
    }
    createdAt
    timezone
    country
    verificationStatus
    parentProfile {
      children {
        user {
          id
          source
          name
          studentProfile {
            id
            grade
            parents{
              id
              user{
                id
                name
                email
                phone {
                  countryCode
                  number
                }
              }
              hasLaptopOrDesktop
            }
          }
        }
        school {
          id
          name
        }
      }
    }`
  } else {
    input = data
    query = `
      id
      name
      username
      email
      role
      phone{
          countryCode
          number
      }
      status
      gender
      dateOfBirth
      createdAt
      updatedAt
      timezone
      country
      savedPassword
      fromReferral
    `
  }
  return duck.query({
    query: gql`
     mutation($input:UserUpdate){
        updateUser(id:"${id}",input:$input){
            ${query}
        }
     }
  `,
    variables: {
      input
    },
    type: 'user/update',
    key: 'user',
    changeExtractedData: extractedData => {
      if (data.role === MENTEE) {
        return {
          ...extractedData,
          userForDashBoard: {
            ...get(extractedData, 'user'),
            studentProfile: {
              parents: [
                {
                  id: parentData.data.updateUser.id,
                  user: { ...parentData.data.updateUser }
                }
              ]
            }
          }
        }
      }
      return {
        ...extractedData,
        userForDashBoard: get(extractedData, 'user')
      }
    }
  })
}

export default updateUser
