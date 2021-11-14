import gql from 'graphql-tag'
import duck from '../../duck'

const fetchBatchMentor = (batchCode) => {
  duck.query({
    query: gql`
      query batchMentor{batches(filter: {
    code: "${batchCode}"
  }) {
    id
    type
    allottedMentor{
      name
      username
      id
    }
    course{
      id
      title
    }
  }
  }
  `,
    type: 'batches/fetch',
    key: 'batchMentor'
  })
}

export default fetchBatchMentor
