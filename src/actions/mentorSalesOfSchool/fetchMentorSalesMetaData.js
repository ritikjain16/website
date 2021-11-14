// import { filter } from 'lodash'
import moment from 'moment'
import gql from 'graphql-tag'
import duck from '../../duck'

const fetchMentorSalesMeta = async (filterQuerySales, filterQueryDate, filterQuery) =>
  duck.query({
    query: gql`
    query{
      mentorMenteeSessionsMeta(filter:{
        and:[
          {topic_some:{order:1}}
          {source:school}
          {sessionStatus:completed}
          ${!filterQuery ? '' : filterQuery}
          ${!filterQueryDate ? '' : filterQueryDate}
        ]
      }groupBy: leadStatus){
        count
        groupByData {
          count
          groupByFieldValue
        }
        groupByFieldName
      }
      actionDueToday: salesOperationsMeta(filter: {
    and: [
      {nextCallOn_gte: "${moment()
    .startOf('day')
    .toDate()
    .toISOString()}"}, 
      {nextCallOn_lte: "${moment()
    .endOf('day')
    .toDate()
    .toISOString()}"},
    ${!filterQuerySales ? '' : filterQuerySales}
      {source:school}
      ]}) {
    count
  }
  dueLater: salesOperationsMeta(filter: {and: [
    { nextCallOn_gt: "${moment()
    .endOf('day')
    .toDate()
    .toISOString()}" }
    ${!filterQuerySales ? '' : filterQuerySales}
    {source:school}
  ]}) {
    count
  }
  needAttention: salesOperationsMeta(filter: {and: [
    { nextCallOn_lt: "${moment()
    .startOf('day')
    .toDate()
    .toISOString()}" }
    ${!filterQuerySales ? '' : filterQuerySales}
    {source:school}
  ]}) {
    count
  }
    }
    `,
    type: 'mentorSales/fetch',
    key: 'mentorSalesMeta',
    changeExtractedData: (extractedData, originalData) => {
      const countData = {}
      const countLabels = ['actionDueToday', 'dueLater', 'needAttention']
      countLabels.forEach(tags => {
        countData[tags] = originalData[tags]
      })
      return {
        ...extractedData,
        countData: { ...originalData.mentorMenteeSessionsMeta, ...countData }
      }
    }
  })

export default fetchMentorSalesMeta
