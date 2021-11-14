import gql from 'graphql-tag'
import duck from '../../duck'

const fetchMentors = async () =>
  duck.query({
    query: gql` 
        {
      mentorProfiles(filter: {and: [{isMentorActive: true}]}, orderBy: createdAt_DESC){
        id
        user{
          id
          name
        }
      }
    }
    `,
    type: 'mentorProfiles/fetch',
    key: 'mentors'
  })


export default fetchMentors
