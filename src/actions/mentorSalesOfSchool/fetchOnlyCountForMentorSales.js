import moment from 'moment'
import gql from 'graphql-tag'
import duck from '../../duck'

const fetchOnlyCountForMentorSales = async (filterQuery) =>
  duck.query({
    query: gql`
    query{
      salesOperationsMeta(
        filter:{
          and:[
            {leadStatus_not_in:[unfit]}
            {
              firstMentorMenteeSession_some:
               {
                 and: [
                    {topic_some:
                      {order: 1}
                    }
                    {sessionStatus: completed}
                  ]
                }
              }
            ${!filterQuery ? '' : filterQuery}
          ]
        }
        groupBy:leadStatus
      ){
        count
        groupByData{
          count
          groupByFieldValue
        }
        groupByFieldName
      }
      actionDueToday: salesOperationsMeta ( filter: {
        and: [
          { nextCallOn_gte: "${moment().startOf('day').toDate().toISOString()}" }
          { nextCallOn_lte: "${moment().endOf('day').toDate().toISOString()}" }
            ${!filterQuery ? '' : filterQuery}
        ]
      } ) {
        count
      }
      dueLater: salesOperationsMeta ( filter: {
        and: [
          { nextCallOn_gt: "${moment().endOf('day').toDate().toISOString()}" }
            ${!filterQuery ? '' : filterQuery}
        ]
      } ) {
        count
      }
      needAttention: salesOperationsMeta ( filter: {
        and: [
          { nextCallOn_lt: "${moment().startOf('day').toDate().toISOString()}" }
            ${!filterQuery ? '' : filterQuery}
        ]
      } ) {
        count
      }
    }
    `,
    type: 'countData/update',
    key: 'countData',
    changeExtractedData: (extractedData, originalData) => {
      const countData = {}
      const countLabels = ['actionDueToday', 'dueLater', 'needAttention']
      countLabels.forEach(tags => {
        countData[tags] = originalData[tags]
      })
      return {
        countData: { ...originalData.salesOperationsMeta, ...countData }
      }
    }
  })

export default fetchOnlyCountForMentorSales
