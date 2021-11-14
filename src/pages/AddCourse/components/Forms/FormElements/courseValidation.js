import * as Yup from 'yup'

const stringRequired = Yup.string().trim().min(3, 'Minimum 3 characters').required('Required')
const numberRequired = Yup.number().typeError('Enter number value').positive('value should be greater than 0')
  .required('Required')
const description = Yup.string().trim().min(6, 'Minimum 6 characters')

const courseValidation = Yup.object().shape({
  title: stringRequired,
  order: numberRequired,
  description
})

export default courseValidation
