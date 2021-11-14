import gql from 'graphql-tag'
import duck from '../../duck'

const addSchoolsToBDE = async ({ updateSchoolsQuery }) =>
  duck.query({
    query: gql`
    mutation {
      ${updateSchoolsQuery}
    }
    `,
    type: 'bdeProfiles/update',
    key: 'bdeProfiles',
    changeExtractedData: (extractedData) => {
      extractedData.schools = []
      return { ...extractedData }
    },
  })

export default addSchoolsToBDE
