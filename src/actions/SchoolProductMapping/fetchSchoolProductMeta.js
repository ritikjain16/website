
import gql from 'graphql-tag'
import duck from '../../duck'


const fetchSchoolProductMeta = (searchQuery, fromDate, toDate, schools) => {
  duck.query({
    query: gql`
query schoolProductmeta{
  schoolsMeta(
    filter:{
      and:[
        
      ${!searchQuery ? '' : searchQuery}
      ${schools}
      ${fromDate ? `{createdAt_gt:"${fromDate}"}` : ''}
        ${toDate ? `{createdAt_lt:"${toDate}"}` : ''}
      ]
    }
  ){
    count
  }
}
`,
    type: 'schoolsMeta/fetch',
    key: 'schoolsMeta'
  })
}

export default fetchSchoolProductMeta
