import { isEmpty, omit, pick, get } from 'lodash'
import { List } from 'immutable'
import { notification } from 'antd'

export const getOrdersInUse = data => data.map(item => item.order)

export const getOrderAutoComplete = orders => {
  const defaultOrder = Math.max(...orders) + 1
  return Number.isFinite(defaultOrder)
    ? defaultOrder
    : 1
}

export const getItemByProp = (data, prop, value) => {
  const foundData = data.find(item =>
    get(item, prop) === value
  ) || {}
  return foundData
}

export const getDataByProp = (data, prop, value) => {
  if (!data) return []
  const foundData = data.filter(item =>
    get(item, prop) === value
  ) || []
  return foundData
}
export const getDataById = (data, id) => getItemByProp(data, 'id', id)

export const filterItems = (arr, itemsToRemove) =>
  arr.filter(item => !itemsToRemove.includes(item))

/**
 * takes a children property and makes it parent
 * @example
 * ```js
 * const a = [
 *  { id: 0, parent: {id: 0} },
 *  { id: 1, parent: {id: 0} }
 *  { id: 2, parent: {id: 1} },
 *  { id: 3, parent: { id: 1 }}
 * ]
 * nestChildrenIntoParent(a, 'child', 'parent')
 * result -> [
 * { id: 0, child: [{ id: 0 }, {id: 1}] }
 * { id: 1, child: [{ id: 2 }, {id: 3}] }
 * ]
 * ```
 */
export const nestChildrenIntoParent = (children, childrenName, parentName, propertyToExtract) => {
  const data = []
  children.forEach(child => {
    const parent = pick(child, [parentName])[parentName]
    const rest = omit(child, [parentName, propertyToExtract])
    if (!parent || isEmpty(parent)) return
    const item = getDataById(data, parent.id)
    if (isEmpty(item)) {
      const dataToPush = propertyToExtract !== undefined
        ? { ...parent, [propertyToExtract]: child[propertyToExtract], [childrenName]: [rest] }
        : { ...parent, [childrenName]: [rest] }
      data.push(dataToPush)
    } else {
      const parentIndex = data.map(x => x.id).indexOf(parent.id)
      data[parentIndex][childrenName].push(rest)
    }
  })
  return data
}

export const nestTopicsInChapter = topics =>
  nestChildrenIntoParent(topics, 'topics', 'chapter')

export const filterKey = (data, key) =>
  data ? data.filter(item => item.get('__keys').includes(key)) : List([])

export const sort = {}
sort.descend = (data, path = []) =>
  data.sort((a, b) => b.getIn(path) - a.getIn(path))
sort.ascend = (data, path) =>
  data.sort((a, b) => a.getIn(path) - b.getIn(path))

export const getSelectedValues = (data, dataList, type) => {
  const newSelectedData = []
  if (get(data, type, []).length > 0) {
    dataList.forEach((value) => {
      const addedValue = get(data, type, []).map(val => get(val, 'id'))
      if (addedValue.includes(get(value, 'id'))) {
        newSelectedData.push({
          key: get(value, 'id'),
          label: get(value, 'title')
        })
      }
    })
  }
  return newSelectedData
}

export const getSuccessStatus = (currentStatus, prevStatus) =>
  currentStatus && !get(currentStatus.toJS(), 'loading')
    && get(currentStatus.toJS(), 'success') &&
      (prevStatus !== currentStatus)

export const getFailureStatus = (currentStatus, currentFailStatus, prevStatus) => {
  if (currentStatus && !get(currentStatus.toJS(), 'loading') && get(currentStatus.toJS(), 'failure') &&
    (prevStatus !== currentFailStatus)) {
    if (currentFailStatus && currentFailStatus.toJS().length > 0) {
      const errors = currentFailStatus.toJS().pop()
      notification.error({
        message: get(get(errors, 'error').errors[0], 'message')
      })
    }
  }
}

export const isPythonCourse = (courseId) => courseId === 'cjs8skrd200041huzz78kncz5'
