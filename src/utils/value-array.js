const getValuesOfSpecificKeyFromArrayOfObjects = (arrayOfObjects, key) => {
  const valuesArray = []
  for (let i = 0; i < arrayOfObjects.length; i += 1) {
    valuesArray.push(arrayOfObjects[i][key])
  }

  return valuesArray
}

export default getValuesOfSpecificKeyFromArrayOfObjects
