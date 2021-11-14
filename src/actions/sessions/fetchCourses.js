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
            minGrade
            maxGrade
            topics(filter: { order_gte: 1 }, first: 1) {
              id
            }
        }
    }
  `,
  type: 'course/fetch',
  key: 'course'
})

export default fetchCourses
