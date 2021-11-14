import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchCourses = async (onlyIdTitle) =>
  duck.query({
    query: gql`
    {
        courses {
            id
            title
            order
            ${
  !onlyIdTitle ? `
      courseComponentRule {
                componentName
                order
                min
                max
            }
              ` : ''
}
        }
    }
    `,
    type: 'courses/fetch',
    key: 'courses',
  })

export default fetchCourses

