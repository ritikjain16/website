import fetchSchoolProduct from '../../../actions/SchoolProductMapping/fetchSchoolProduct'
import fetchSchoolProductMeta from '../../../actions/SchoolProductMapping/fetchSchoolProductMeta'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'

const fetchSchoolProductWithCount = (pageQueries, searchQuery, fromDate, toDate, schools) => {
  let schoolQuery = ''
  if (schools && schools.length > 0) {
    schoolQuery = `{id_in:[${getIdArrForQuery(schools.map(({ id }) => id))}]}`
  }
  fetchSchoolProduct(pageQueries, searchQuery, fromDate, toDate, schoolQuery)
  fetchSchoolProductMeta(searchQuery, fromDate, toDate, schoolQuery)
}

export default fetchSchoolProductWithCount
