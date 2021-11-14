import gql from 'graphql-tag'
import duck from '../../duck'

const FETCH_NPS_QUERY = ({ first, skip, filter = '' }) => gql`
  query{
    netPromoterScore : netPromoterScores(
      orderBy: createdAt_DESC,
      first: ${first}
      skip: ${skip * first} 
      ${filter}
    ){
      id
      user{
        id
        name
        studentProfile{
          id
          parents{
            id
            user{
              id
              name
              phone{
                number
                countryCode
              }
            }
          }
        }
      }
      createdAt
      score
    }
  }
`

const fetchNPS = async ({ first, skip, filter = '' }) => duck.query({
  query: FETCH_NPS_QUERY({ first, skip, filter }),
  type: 'netPromoterScore/fetch',
  key: 'netPromoterScore',
  changeExtractedData: (extractedData, originalData) => ({
    netPromoterScore: originalData.netPromoterScore
  })
})

export default fetchNPS
