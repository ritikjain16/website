import * as Yup from 'yup'

const stringRequired = Yup.string().trim().required('Required')
const numberRequired = Yup.number().typeError('Enter number value').positive('value should be greater than 0')
  .required('Required')

const chapterFormValidation = Yup.object().shape({
  title: stringRequired,
  order: numberRequired
})

export default chapterFormValidation
