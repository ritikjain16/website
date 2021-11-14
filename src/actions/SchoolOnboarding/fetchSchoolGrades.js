import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import convertSchoolCountAndGrade from './convertSchoolCountandGrade'

const fetchSchoolGrades = async (id) =>
  duck.query({
    query: gql`
    {
      school(id: "${id}") {
        id
        name
        hubspotId
        schoolCampaignCode
        logo {
          id
          uri
        }
        studentsMeta {
          count
        }
        classes {
          id
          grade
          section
          studentsMeta {
            count
          }
        }
      }
      campaignsMeta(filter: { school_some: { id: "${id}" } }) {
        count
      }
      batchesMeta(filter: { school_some: { id: "${id}" } }) {
        count
      }
      studentProfiles(filter:{
        and: [
          {school_some: {id: "${id}"}},
        ]
      }){
        grade
        section
      }
    }
    `,
    type: 'schoolClasses/fetch',
    key: 'schoolClasses',
    changeExtractedData: (extractedData, originalData) => {
      const { schoolClasses, grades, studentsMeta } = convertSchoolCountAndGrade(originalData)
      extractedData.schoolClasses = schoolClasses
      return {
        ...extractedData,
        schoolDashboardCount: {
          studentsMeta,
          gradeMeta: grades.length,
          campaignsMeta: get(originalData, 'campaignsMeta.count', 0),
          batchesMeta: get(originalData, 'batchesMeta.count', 0),
          logo: get(originalData, 'school.logo.uri', ''),
          hubspotId: get(originalData, 'school.hubspotId', '-'),
          schoolCampaignCode: get(originalData, 'school.schoolCampaignCode')
        }
      }
    }
  })

export default fetchSchoolGrades

