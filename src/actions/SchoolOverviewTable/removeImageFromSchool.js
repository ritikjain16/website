import gql from 'graphql-tag'
import duck from '../../duck'

const removeFromSchoolImage = async (schoolId, fileId, typeField) => duck.query({
  query: gql`
    mutation {
      ${typeField === 'logo' ? `
      removeFromSchoolLogo(schoolId: "${schoolId}", fileId: "${fileId}") {
          school {
              id
          }
      }
      ` : ''}
      ${typeField === 'schoolPicture' ? `
      removeFromSchoolPicture(schoolId: "${schoolId}", fileId: "${fileId}") {
        school {
          id
        }
      }
      ` : ''}
    }
  `,
  type: 'schools/delete',
  key: 'removeFromSchoolImage',
})

export default removeFromSchoolImage
