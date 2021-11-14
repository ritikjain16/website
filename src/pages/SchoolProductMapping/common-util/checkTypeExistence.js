import { notification } from 'antd'
import { PUBLISHED_STATUS } from '../../../constants/questionBank'
import convertModelTypeFromTextToNumber from '../../../utils/convertModalTypeFromTextToNumber'

const checkExistence = (oldP, newP) => {
  const oldPTypes = oldP.map(({ type, status }) => ({ type, status }))
  const newPType = newP.map(({ type, status }) => ({ type, status }))
  const addedTypes = []
  const similarTypes = []
  let firstError = false
  newPType.forEach(t => {
    if (!addedTypes.map(({ type }) => type).includes(t.type)) {
      addedTypes.push(t)
    } else if (addedTypes.map(({ type }) => type).includes(t.type)) {
      const data = addedTypes.filter(ty => ty.type === t.type && ty.status === PUBLISHED_STATUS)
      if (data.length === 0) addedTypes.push(t)
      else {
        similarTypes.push(...data)
      }
    }
  })
  if (similarTypes && similarTypes.length > 0) {
    notification.error({
      message: `Cannot add similar products of type ${[...new Set(similarTypes)].map(({ type }) => convertModelTypeFromTextToNumber(type))} with publish status`
    })
    firstError = true
  }
  const addedInOld = []
  if (!firstError) {
    addedTypes.forEach(t => {
      const data = oldPTypes.filter(tv => tv.type === t.type && tv.status === PUBLISHED_STATUS)
      addedInOld.push(...data)
    })
    if (addedInOld.length > 0) {
      notification.error({
        message: `Products of type ${[...new Set(addedInOld)].map(({ type }) => convertModelTypeFromTextToNumber(type))} already added with publish status`
      })
      return false
    }
    return true
  }
  return false
}

export default checkExistence
