import gql from 'graphql-tag'
import duck from '../../duck'

//  for friendly and ratings tags
const getFilters = (filterQuery, sessionType) => {
  if (filterQuery) {
    return `{source:school}
    ${sessionType === 'trial' ? '{topic_some: {order: 1}}' : '{topic_some: {order_not: 1}}'}
    ${filterQuery}
    `
  }
  return `{source:school}
  ${sessionType === 'trial' ? '{topic_some: {order: 1}}' : '{topic_some: {order_not: 1}}'}
  `
}

const fetchCompletedSessionsCountOfSchools = async (sessionType, filterQuery) =>
  duck.query({
    query: gql`
  query{
    rating5: mentorMenteeSessionsMeta(filter:{
      and: [{rating:5} ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
    rating4: mentorMenteeSessionsMeta(filter:{
      and:[{rating:4 } ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
    rating3: mentorMenteeSessionsMeta(filter:{
      and:[{rating:3} ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
    rating2: mentorMenteeSessionsMeta(filter:{
      and:[{rating:2} ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
    rating1: mentorMenteeSessionsMeta(filter:{
      and:[{rating:1 } ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
    friendly: mentorMenteeSessionsMeta(filter:{
      and:[{friendly:true} ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
    motivating: mentorMenteeSessionsMeta(filter:{
      and:[{motivating:true} ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
    engaging: mentorMenteeSessionsMeta(filter:{
      and:[{engaging:true} ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
    helping: mentorMenteeSessionsMeta(filter:{
      and:[{helping:true} ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
    enthusiastic: mentorMenteeSessionsMeta(filter:{
      and:[{enthusiastic:true} ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
      patient: mentorMenteeSessionsMeta(filter:{
      and:[{patient:true} ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
    conceptsPerfectlyExplained: mentorMenteeSessionsMeta(filter:{
      and:[{conceptsPerfectlyExplained:true} ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
    averageExplanation: mentorMenteeSessionsMeta(filter:{
      and:[{averageExplanation:true} ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
    distracted: mentorMenteeSessionsMeta(filter:{
      and:[{distracted:true} ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
    rude: mentorMenteeSessionsMeta(filter:{
      and:[{rude:true} ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
    slowPaced: mentorMenteeSessionsMeta(filter:{
      and:[{slowPaced:true} ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
    fastPaced: mentorMenteeSessionsMeta(filter:{
      and:[{fastPaced:true} ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
    notPunctual: mentorMenteeSessionsMeta(filter:{
      and:[{notPunctual:true} ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
    boring: mentorMenteeSessionsMeta(filter:{
      and:[{boring:true} ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
    poorExplanation: mentorMenteeSessionsMeta(filter:{
      and:[{poorExplanation:true} ${getFilters(filterQuery, sessionType)}]
    }){
      count
    }
  }
  `,
    type: 'completedSession/fetch',
    key: 'completedSession',
    changeExtractedData: (extractedData, originalData) => {
      const countData = {}
      const countTags = [
        'rating5',
        'rating4',
        'rating3',
        'rating2',
        'rating1',
        'totalCompletedSessions',
        'friendly',
        'motivating',
        'engaging',
        'helping',
        'enthusiastic',
        'patient',
        'conceptsPerfectlyExplained',
        'distracted',
        'rude',
        'slowPaced',
        'fastPaced',
        'notPunctual',
        'boring',
        'poorExplanation',
        'averageExplanation'
      ]
      countTags.forEach(tags => {
        countData[tags] = originalData[tags]
      })
      return { countData }
    }
  })

export default fetchCompletedSessionsCountOfSchools
