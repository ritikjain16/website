import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const fetchBatchStudents = async (id, studentSearch, grades = []) =>
  duck.query({
    query: gql`
    {
        studentProfiles(
          ${
  studentSearch && grades ? `
            filter: {
                  and: [
                    { school_some: { id: "${id}" } }
                    { grade_in: [${grades.map(g => g)}] }
                    { batch_exists: false }
                  ]
                }
            ` : `
            filter: { batch_some: { id: "${id}" } }`
}
          ) {
            id
            user {
            id
            name
            }
            batch {
              id
            }
            school {
              id
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
    }
    `,
    type: 'studentProfiles/fetch',
    key: studentSearch || 'studentProfiles',
    changeExtractedData: (extractedData, originalData) => {
      const studentProfiles = []
      const getParentData = (data) => get(data, 'parents', []).length > 0 && get(data, 'parents[0].user') ? get(data, 'parents[0].user') : {}
      get(originalData, 'studentProfiles', []).forEach((student, i) => {
        if (!studentSearch) {
          if (get(student, 'batch.id') === id) {
            studentProfiles.push({
              index: i + 1,
              studentName: get(student, 'user.name'),
              parentName: get(getParentData(student), 'name'),
              phone: `${get(getParentData(student), 'phone.countryCode')}${get(getParentData(student), 'phone.number')}`,
              email: get(getParentData(student), 'email'),
              ...student
            })
          }
          /* eslint-disable no-lonely-if */
        } else {
          if (get(student, 'school.id') === id) {
            studentProfiles.push({
              index: i + 1,
              studentName: get(student, 'user.name'),
              parentName: get(getParentData(student), 'name'),
              phone: `${get(getParentData(student), 'phone.countryCode')}${get(getParentData(student), 'phone.number')}`,
              email: get(getParentData(student), 'email'),
              ...student
            })
          }
        }
      })
      extractedData.studentProfiles = studentProfiles
      return { ...extractedData }
    }
  })

export default fetchBatchStudents

