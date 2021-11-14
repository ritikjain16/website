import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const fetchStudents = async (filterQuery) =>
  duck.query({
    query: gql`
      query {
        users(filter:{
          and:[
            ${!filterQuery ? '' : filterQuery}
            {
              role:mentee
            }
          ]
        }){
          id
          name
          studentProfile{
            id
            parents{
              user{
                phone{
                  number
                }
              }
            }
            batch {
              id
              code
            }
          }
        }
      }
    `,
    type: 'users/fetch',
    key: 'fetchStudent',
    changeExtractedData: (originalData, extractedData) => {
      const users = get(extractedData, 'users', [])
      return { ...originalData, studentSearchData: users }
    }
  })
export default fetchStudents
