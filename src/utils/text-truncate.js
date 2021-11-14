function stringTruncate(str, n) {
  return str && str.length > n ? `${str.substr(0, n - 1)}...` : str
}
export default stringTruncate
