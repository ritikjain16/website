import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const fetchCampaigns = async (schoolId) =>
  duck.query({
    query: gql`
    {
      campaigns(filter: { school_some: { id: "${schoolId}" } }, orderBy: createdAt_DESC) {
        id
        type
        title
        code
        course {
          id
        }
        batchCreationStatus
        classes {
          id
          grade
          section
        }
        poster {
          id
          name
          uri
        }
        posterMobile{
          id
          name
          uri
        }
        school {
          id
        }
      }
    }
    `,
    type: 'campaigns/fetch',
    key: 'campaigns',
    changeExtractedData: (originalData, extractedData) => {
      const campaign = []
      if (originalData && originalData.campaigns && originalData.campaigns.length > 0) {
        const { campaigns } = originalData
        campaigns.forEach((data) => {
          if (data.school.id === schoolId) {
            let schoolClasses = []
            get(data, 'classes', []).forEach(schoolClass => {
              const datas = schoolClasses.find(d => get(d, 'grade') === get(schoolClass, 'grade'))
              if (datas) {
                datas.sections = [...datas.sections,
                  { section: get(schoolClass, 'section'), id: get(schoolClass, 'id') }]
                const newSchoolClasses = schoolClasses.filter((d) => get(d, 'grade') !== get(datas, 'grade'))
                schoolClasses = [...newSchoolClasses, datas]
              } else {
                schoolClasses.push({
                  id: get(schoolClass, 'id'),
                  grade: get(schoolClass, 'grade'),
                  sections: [{ section: get(schoolClass, 'section'), id: get(schoolClass, 'id') }],
                })
              }
            })
            campaign.push({ ...data, schoolClasses })
          }
        })
      }
      extractedData.campaigns = campaign
      return { ...extractedData }
    }
  })

export default fetchCampaigns

