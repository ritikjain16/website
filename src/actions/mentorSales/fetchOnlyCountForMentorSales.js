import moment from 'moment'
import gql from 'graphql-tag'
import duck from '../../duck'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import { TRANSFORMATION_TEAM, TRANSFORMATION_ADMIN } from '../../constants/roles'

const fetchOnlyCountForMentorSales = async (filterQuery, filterQueryDate, country = 'india', userId) => {
  const savedRole = getDataFromLocalStorage('login.role')
  const transformationQuery = '{source: transformation}'
  const transformationQueryNot = '{source_not:school}'
  return duck.query({
    query: gql`
    query{
      mentorMenteeSessionsMeta(filter:{
        and:[
          {topic_some:{order:1}}
          ${(savedRole === TRANSFORMATION_TEAM || savedRole === TRANSFORMATION_ADMIN) ? transformationQuery : transformationQueryNot}
           ${userId ? `{ menteeSession_some: { user_some: { id: "${userId}" } } }` : ''}
          {sessionStatus:completed}
           ${!filterQuery ? '' : `${userId ? '' : filterQuery}`}
          ${!filterQueryDate ? '' : filterQueryDate}
          ${country === 'all' ? '' : `{country:${country}}`}
        ]
      }groupBy: leadStatus){
        count
        groupByData {
          count
          groupByFieldValue
        }
        groupByFieldName
      }
      actionDueToday: salesOperationsMeta ( filter: {
        and: [
          ${country === 'all' ? '' : `{country:${country}}`}
          { nextCallOn_gte: "${moment().startOf('day').toDate().toISOString()}" }
          { nextCallOn_lte: "${moment().endOf('day').toDate().toISOString()}" }
          ${!filterQuery ? '' : `${userId ? '' : filterQuery}`}
          ${userId ? `{ client_some: { id: "${userId}" } }` : ''}
        ]
      } ) {
        count
      }
      dueLater: salesOperationsMeta ( filter: {
        and: [
          ${country === 'all' ? '' : `{country:${country}}`}
          { nextCallOn_gt: "${moment().endOf('day').toDate().toISOString()}" }
          ${!filterQuery ? '' : filterQuery}
          ${userId ? `{ client_some: { id: "${userId}" } }` : ''}
        ]
      } ) {
        count
      }
      needAttention: salesOperationsMeta ( filter: {
        and: [
          ${country === 'all' ? '' : `{country:${country}}`}
          { nextCallOn_lt: "${moment().startOf('day').toDate().toISOString()}" }
            ${!filterQuery ? '' : filterQuery}
          ${userId ? `{ client_some: { id: "${userId}" } }` : ''}
        ]
      } ) {
        count
      }
    }
    `,
    type: 'mentorSalesMeta/update',
    key: 'mentorSalesMeta',
    changeExtractedData: (extractedData, originalData) => {
      const countData = {}
      const countLabels = ['actionDueToday', 'dueLater', 'needAttention']
      countLabels.forEach(tags => {
        countData[tags] = originalData[tags]
      })
      return {
        countData: { ...originalData.mentorMenteeSessionsMeta, ...countData }
      }
    }
  })
}

export default fetchOnlyCountForMentorSales
