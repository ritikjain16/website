import queryString from 'query-string'

const updateSheet = async (params) => {
  if (process.env.REACT_APP_NODE_ENV === 'production') {
    await fetch(`${process.env.REACT_APP_SHEET_URL}?${queryString.stringify(params)}`)
  }
}

export default updateSheet
