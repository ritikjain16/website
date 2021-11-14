const changedatetoisostring = (date) => {
  const initialdate = date
  initialdate.setUTCHours(0, 0, 0, 0)
  const converteddate = initialdate.toISOString()
  const finaldate = converteddate.slice(0, -1)
  return finaldate
}

export default changedatetoisostring
