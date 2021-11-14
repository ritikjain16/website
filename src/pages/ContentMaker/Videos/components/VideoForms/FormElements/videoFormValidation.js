import * as Yup from 'yup'

const stringRequired = Yup.string().trim().required('Required')
const timeError = Yup.number().integer('Value should be integer').typeError('Enter number value')

const videoFormValidation = Yup.object().shape({
  title: stringRequired,
  videoStartTime: timeError,
  videoEndTime: timeError,
  storyStartTime: timeError,
  storyEndTime: timeError
})

export default videoFormValidation
