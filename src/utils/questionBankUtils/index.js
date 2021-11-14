import { sortBy } from 'lodash'

const getKeysFibInput = (fibInputOptions) => {
  const keys = []
  if (!fibInputOptions || fibInputOptions.length === 0) {
    return keys
  }
  fibInputOptions.forEach(blank => {
    const optionLength = blank.answers.length
    const temp = []
    for (let i = 0; i < optionLength; i += 1) {
      temp.push(i + 1)
    }
    keys.push(temp)
  })
  return keys
}

const getAnswersFibInput = (fibInputOptions) => {
  const answers = []
  if (!fibInputOptions || fibInputOptions.length === 0) {
    return answers
  }
  fibInputOptions.forEach(blank => {
    const optionLength = blank.answers.length
    const temp = []
    for (let i = 0; i < optionLength; i += 1) {
      temp.push(blank.answers[i])
    }
    answers.push(temp)
  })
  return answers
}

const getKeys = (options) => {
  const keys = []
  if (options && options.length > 0) {
    for (let i = 0; i < options.length; i += 1) {
      keys.push(i)
    }
  }
  return keys
}


const getArrangeItems = options => {
  const items = []
  if (options && options.length > 0) {
    const sortedOptions = sortBy(options, 'correctPosition')
    for (let i = 0; i < sortedOptions.length; i += 1) {
      items.push({ id: sortedOptions[i].displayOrder - 1 })
    }
  }
  return items
}

const isEmptyOrUndefined = (data) => {
  if (typeof data === 'undefined' || data === 'undefined') {
    return true
  } else if (Array.isArray(data) && data.length === 0) {
    return true
  }
  return false
}

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export {
  getAnswersFibInput,
  getKeysFibInput,
  getKeys,
  getArrangeItems,
  isEmptyOrUndefined,
  reorder
}
