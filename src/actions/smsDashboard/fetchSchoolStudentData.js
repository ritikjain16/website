import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const fetchSchoolStudentData = ({ schoolId }) =>
  duck.query({
    query: gql`
      {
        schoolStudentData: school(id: "${schoolId}"){
          students{
            id
            user{
              id
              name
            }
            grade
            section
            parents{
              id
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
    }
    `,
    type: 'schoolStudentData/fetch',
    key: `schoolStudentData/${schoolId}`,
    changeExtractedData: (extractedData, originalData) => {
      extractedData.user = []
      extractedData.schoolStudentData = get(originalData, 'schoolStudentData.students', [])
      return { ...extractedData }
    }
  })

export default fetchSchoolStudentData
