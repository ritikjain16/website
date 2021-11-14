import gql from 'graphql-tag'
import duck from '../../duck'

//  for friendly and ratings tags
const getFilters = (filterQuery, sessionType, country = 'india', userId) => {
  const transformationQueryNot = '{source_not:school}'
  if (filterQuery) {
    return `
    ${sessionType === 'trial' ? '{topic_some: {order: 1}}' : '{topic_some: {order_not: 1}}'}
    ${userId ? `{ menteeSession_some: { user_some: { id: "${userId}" } } }` : filterQuery}
    ${country === 'all' ? '' : `{country:${country}}`}
    ${transformationQueryNot}
    `
  }
  return `
  ${transformationQueryNot}
  ${userId ? `{ menteeSession_some: { user_some: { id: "${userId}" } } }` : ''} 
  ${sessionType === 'trial' ? '{topic_some: {order: 1}}' : '{topic_some: {order_not: 1}}'}
  ${country === 'all' ? '' : `{country:${country}}`}
  `
}

const fetchCompletedSessionsCount = async (sessionType, filterQuery, country, userId) =>
  duck.query({
    query: gql`
  query{
    rating5: mentorMenteeSessionsMeta(filter:{
      and: [{rating:5} ${getFilters(filterQuery, sessionType, country, userId)}]
    }){
      count
    }
    rating4: mentorMenteeSessionsMeta(filter:{
      and:[{rating:4 } ${getFilters(filterQuery, sessionType, country, userId)}]
    }){
      count
    }
    rating3: mentorMenteeSessionsMeta(filter:{
      and:[{rating:3} ${getFilters(filterQuery, sessionType, country, userId)}]
    }){
      count
    }
    rating2: mentorMenteeSessionsMeta(filter:{
      and:[{rating:2} ${getFilters(filterQuery, sessionType, country, userId)}]
    }){
      count
    }
    rating1: mentorMenteeSessionsMeta(filter:{
      and:[{rating:1 } ${getFilters(filterQuery, sessionType, country, userId)}]
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

export default fetchCompletedSessionsCount


// Query for fetching count on the basis of different tags.

// friendly: mentorMenteeSessionsMeta(filter:{
//   and:[{friendly:true} ${getFilters(filterQuery, sessionType, country)}]
// }){
//   count
// }
// motivating: mentorMenteeSessionsMeta(filter:{
//   and:[{motivating:true} ${getFilters(filterQuery, sessionType, country)}]
// }){
//   count
// }
// engaging: mentorMenteeSessionsMeta(filter:{
//   and:[{engaging:true} ${getFilters(filterQuery, sessionType, country)}]
// }){
//   count
// }
// helping: mentorMenteeSessionsMeta(filter:{
//   and:[{helping:true} ${getFilters(filterQuery, sessionType, country)}]
// }){
//   count
// }
// enthusiastic: mentorMenteeSessionsMeta(filter:{
//   and:[{enthusiastic:true} ${getFilters(filterQuery, sessionType, country)}]
// }){
//   count
// }
//   patient: mentorMenteeSessionsMeta(filter:{
//   and:[{patient:true} ${getFilters(filterQuery, sessionType, country)}]
// }){
//   count
// }
// conceptsPerfectlyExplained: mentorMenteeSessionsMeta(filter:{
//   and:[{conceptsPerfectlyExplained:true} ${getFilters(filterQuery, sessionType, country)}]
// }){
//   count
// }
// averageExplanation: mentorMenteeSessionsMeta(filter:{
//   and:[{averageExplanation:true} ${getFilters(filterQuery, sessionType, country)}]
// }){
//   count
// }
// distracted: mentorMenteeSessionsMeta(filter:{
//   and:[{distracted:true} ${getFilters(filterQuery, sessionType, country)}]
// }){
//   count
// }
// rude: mentorMenteeSessionsMeta(filter:{
//   and:[{rude:true} ${getFilters(filterQuery, sessionType, country)}]
// }){
//   count
// }
// slowPaced: mentorMenteeSessionsMeta(filter:{
//   and:[{slowPaced:true} ${getFilters(filterQuery, sessionType, country)}]
// }){
//   count
// }
// fastPaced: mentorMenteeSessionsMeta(filter:{
//   and:[{fastPaced:true} ${getFilters(filterQuery, sessionType, country)}]
// }){
//   count
// }
// notPunctual: mentorMenteeSessionsMeta(filter:{
//   and:[{notPunctual:true} ${getFilters(filterQuery, sessionType, country)}]
// }){
//   count
// }
// boring: mentorMenteeSessionsMeta(filter:{
//   and:[{boring:true} ${getFilters(filterQuery, sessionType, country)}]
// }){
//   count
// }
// poorExplanation: mentorMenteeSessionsMeta(filter:{
//   and:[{poorExplanation:true} ${getFilters(filterQuery, sessionType, country)}]
// }){
//   count
// }
