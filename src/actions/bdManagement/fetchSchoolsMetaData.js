import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const fetchSchoolsMetaData = async ({ fetchQuery, schoolsArray = [] }) =>
  duck.query({
    query: gql`
      {
      ${fetchQuery}
    }
    `,
    type: 'bdSchoolsMetaData/fetch',
    key: 'bdSchoolsMetaData',
    changeExtractedData: (extractedData, originalData) => {
      const bdSchoolsMetaData = []
      schoolsArray.forEach((school, index) => {
        const schoolMeta = {
          ...school
        }
        for (const property in originalData) {
          if (property) {
            if (property.includes(`totalBookings${index}`)) {
              schoolMeta.totalBookings = get(originalData[property], 'count')
            }
            if (property.includes(`attendance${index}`)) {
              let attendanceCount = 0
              if (originalData[property] && Array.isArray(originalData[property])) {
                originalData[property].forEach(bSession => {
                  if (get(bSession, 'attendance', []).length > 0) {
                    get(bSession, 'attendance').forEach(attendance => {
                      if (get(attendance, 'status') === 'present') {
                        attendanceCount += 1
                      }
                    })
                  }
                })
                schoolMeta.attendance = attendanceCount
              }
            }
            if (property.includes(`totalConversion${index}`)) {
              schoolMeta.totalConversion = get(originalData[property], 'count')
            }
            if (property.includes(`totalAmount${index}`)) {
              schoolMeta.totalAmount = get(originalData[property], 'totalAmount')
            }
            if (property.includes(`schoolClasses${index}`)) {
              schoolMeta.grades = []
              if (originalData[property] && Array.isArray(originalData[property])) {
                originalData[property].forEach(grd => {
                  const newGradeObj = {}
                  newGradeObj.grade = get(grd, 'grade', '')
                  newGradeObj.count = get(grd, 'studentsMeta.count', 0)
                  schoolMeta.grades.push(newGradeObj)
                })
              }
            }
          }
        }
        bdSchoolsMetaData.push(schoolMeta)
      })
      extractedData.bdSchoolsMetaData = bdSchoolsMetaData
      return { ...extractedData }
    },
  })

export default fetchSchoolsMetaData

