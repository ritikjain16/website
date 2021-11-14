// import moment from 'moment'
import gql from 'graphql-tag'
// import { filter } from 'lodash'
import duck from '../../duck'

// const dataPerPage = 20
// {amount: ${amount}}
const fetchUserPaymentLinks = async () =>
  duck.query({
    query: gql`
    query{
      userPaymentLinks(filter:{
        or:[
          {type: variable}
        ]
      }){
        id
        type
        amount
        link
      }
    }
    `,
    type: 'userPaymentLinks/fetch',
    key: 'userPaymentLinks'
  })

export default fetchUserPaymentLinks
