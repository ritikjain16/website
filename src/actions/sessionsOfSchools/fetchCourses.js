import gql from 'graphql-tag'
import duck from '../../duck'

const fetchCourses = async () => duck.query({
  query: gql`
    query{
        courses(orderBy:order_ASC){
            id
            order
            title
            category
            status
        }
    }
  `,
  type: 'course/fetch',
  key: 'course'
})

export default fetchCourses
