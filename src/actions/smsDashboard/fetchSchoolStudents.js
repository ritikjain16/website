import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

// const getAdminDetails = (admin) => {
//   if (admin) {
//     return ' admins {id username name email phone{ countryCode number } }'
//   }
//   return ''
// }

const fetchSchoolStudents = ({ schoolId, page, skip }) =>
  duck.query({
    query: gql`
      query {
        studentsOfSchool: school(id: "${schoolId}"){
          students(
            first: ${page},
            skip: ${(skip - 1) * (page)}
          ){
            id
            user{
              id
              name
              city
              region
              state
              country
            }
            grade
            section
            rollNo
            parents{
              user{
                id
                name
                phone{
                  countryCode
                  number
                }
                email
              }
            }
          }
        }
        studentsOfSchoolCount: studentProfilesMeta(filter:{school_some:{id: "${schoolId}"}}){
          count
        }
}
    `,
    type: 'studentsOfSchool/fetch',
    key: 'studentsOfSchool',
    changeExtractedData: (extractedData, originalData) => ({
      // schoolAdmin: admin ? get(originalData, 'studentsOfSchool.admins') : [],
      studentsOfSchool: get(originalData, 'studentsOfSchool.students'),
      studentsOfSchoolCount: get(originalData, 'studentsOfSchoolCount')
    })
  })

export default fetchSchoolStudents
// students
