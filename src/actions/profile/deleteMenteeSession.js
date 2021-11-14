import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const deleteMenteeSession = async (id) => duck.query({
  query: gql`
    mutation{
        deleteMenteeSession(id:"${id}") {
          id
        }
    }
  `,
  type: 'menteeSession/delete',
  key: `menteeSession/${id}`,
  changeExtractedData: (extractedData, originalData) => {
    if (get(originalData, 'deleteMenteeSession')) {
      extractedData.menteeSession = {
        ...get(originalData, 'deleteMenteeSession')
      }
    }
    return extractedData
  }
})

export default deleteMenteeSession
