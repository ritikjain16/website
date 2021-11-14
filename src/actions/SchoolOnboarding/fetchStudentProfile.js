import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const fetchStudentsProfile = async ({ schoolId, selectedGrade, section, perPage, skip }) =>
  duck.query({
    query: gql`
    {
        studentProfiles(
            filter: {
            and: [
                { school_some: { id: "${schoolId}" } }
                ${selectedGrade ? `{ grade: ${selectedGrade} }` : ''}
                ${section && section !== 'All' ? `{ section: ${section} }` : ''}
            ]
            }
            first: ${perPage}
            skip: ${perPage * skip}
        ) {
            id
            user {
            id
            name
            }
            grade
            section
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
        studentProfilesMeta(
          filter: {
            and: [
                { school_some: { id: "${schoolId}" } }
                ${selectedGrade ? `{ grade: ${selectedGrade} }` : ''}
                ${section && section !== 'All' ? `{ section: ${section} }` : ''}
            ]
          }
        ) {
          count
      }
    }
    `,
    type: 'studentProfiles/fetch',
    key: 'studentProfiles',
    changeExtractedData: (extractedData, originalData) => {
      const studentProfiles = []
      const getParentData = (data) => get(data, 'parents', []).length > 0 && get(data, 'parents[0].user') ? get(data, 'parents[0].user') : {}
      get(originalData, 'studentProfiles', []).forEach((student, i) => {
        studentProfiles.push({
          index: i + 1,
          studentName: get(student, 'user.name'),
          parentName: get(getParentData(student), 'name'),
          phone: `${get(getParentData(student), 'phone.countryCode')}${get(getParentData(student), 'phone.number')}`,
          email: get(getParentData(student), 'email'),
          ...student
        })
      })
      extractedData.studentProfiles = studentProfiles
      return { ...extractedData }
    }
  })

export default fetchStudentsProfile

