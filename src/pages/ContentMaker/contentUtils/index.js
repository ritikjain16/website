import { get } from 'lodash'
import * as Yup from 'yup'
import { PUBLISHED_STATUS, UNPUBLISHED_STATUS } from '../../../constants/questionBank'
import restrictedNumverValues from '../../../constants/restrictedNumberValues'

const filterOption = (input, option) => (
  get(option, 'props.children')
    ? get(option, 'props.children')
      .toLowerCase()
      .indexOf(input.toLowerCase()) >= 0
    : false
)

const getFilterOptions = ({ searchKey, searchValue, selectedCourse, selectedTopic }) => {
  let filterOptionText = ''
  if (searchKey === 'course' && selectedCourse) {
    filterOptionText = `{courses_some: { id: "${selectedCourse}" }}`
  } else if (searchKey === 'topic' && selectedTopic) {
    filterOptionText = `{topics_some: { id: "${selectedTopic}" }}`
  } else if (searchKey === 'Unallocated') {
    if (searchValue === 'all') filterOptionText = ''
    else if (searchValue === 'Unallocated course') filterOptionText = '{courses_exists: false}'
    else if (searchValue === 'UnAllocated topics') filterOptionText = '{topics_exists: false}'
  } else if (searchKey === 'published Status') {
    if (searchValue === PUBLISHED_STATUS) filterOptionText = `{status: ${PUBLISHED_STATUS}}`
    else if (searchValue === UNPUBLISHED_STATUS) filterOptionText = `{status: ${UNPUBLISHED_STATUS}}`
  } else if (searchKey === 'isHomework') {
    if (searchValue === true) filterOptionText = '{ isHomework: true }'
    else if (searchValue === false) filterOptionText = '{ isHomework: false }'
  } else if (searchKey === 'title' && searchValue) {
    filterOptionText = `{title_contains: "${searchValue}"}`
  } else if (searchKey === 'isHomework') {
    if (searchValue === true) filterOptionText = '{ isHomework: true }'
    else if (searchValue === false) filterOptionText = '{ isHomework: false }'
  } else if (searchKey === 'isSubmitAnswer') {
    if (searchValue === true) filterOptionText = '{ isSubmitAnswer: true }'
    else if (searchValue === false) filterOptionText = '{ isSubmitAnswer: false }'
  } else if (searchKey === 'questionType') {
    if (searchValue !== '') filterOptionText = `{ questionType: ${searchValue} }`
  }
  return filterOptionText
}

const onInputKeyDown = (e) => {
  if (restrictedNumverValues.includes(e.key)) {
    e.preventDefault()
  }
}

const stringRequired = Yup.string().trim().required('Required')
const numberRequired = Yup.number().typeError('Enter number value').integer('Order should be integer value').positive('value should be greater than 0')
  .required('Required')

const externalPlatformLink = Yup.string().trim().nullable(true)

const commonFormValidation = Yup.object().shape({
  title: stringRequired,
  order: numberRequired
})


const projectValidation = Yup.object().shape({
  title: stringRequired,
  order: numberRequired,
  externalPlatformLink
})

export {
  filterOption,
  getFilterOptions,
  commonFormValidation,
  onInputKeyDown,
  projectValidation
}
