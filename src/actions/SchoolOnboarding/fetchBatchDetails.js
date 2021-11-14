import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const fetchBatchDetails = async (batchId) =>
  duck.query({
    query: gql`
    {
        batch(id:"${batchId}") {
            id
            code
            classes {
                id
                grade
                section
            }
            studentsMeta {
                count
            }
            course {
                id
                title
            }
            createdAt
            allottedMentor {
                id
                name
                profilePic{
                    id
                    uri
                }
            mentorProfile {
                codingLanguages {
                value
                }
                experienceYear
                pythonCourseRating5
                pythonCourseRating4
                pythonCourseRating3
                pythonCourseRating2
                pythonCourseRating1
            }
            }
        }
    }
    `,
    type: 'batchesData/fetch',
    key: 'batchesData',
    changeExtractedData: (originalData, extractedData) => {
      let batchesData = {}
      if (originalData && originalData.batch
        && originalData.batch.id
        && extractedData.batch
        && originalData.batch.id === batchId) {
        batchesData = get(originalData, 'batch')
        const grades = [...new Set(get(originalData, 'batch.classes', []).map(({ grade }) => grade))]
        const sections = [...new Set(get(originalData, 'batch.classes', []).map(({ section }) => section))]
        batchesData.grades = grades
        batchesData.sections = sections
        batchesData.course = get(extractedData, 'batch.course')
      }
      extractedData.batchesData = batchesData
      return { ...extractedData }
    }
  })

export default fetchBatchDetails

