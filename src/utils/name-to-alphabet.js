const nameFormat = (name) => {
  const nameArray = name.split(' ')
  if (nameArray && nameArray.length === 1) {
    return name[0].toUpperCase()
  } else if (nameArray && nameArray.length > 1) {
    return nameArray[0][0].toUpperCase() + nameArray[1][0].toUpperCase()
  }
  return null
}

export default nameFormat
