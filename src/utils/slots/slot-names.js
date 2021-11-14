const getSlotNames = () => {
  let slots = ''
  for (let i = 0; i < 24; i += 1) {
    slots += `slot${i}\n`
  }
  return slots
}

export default getSlotNames
