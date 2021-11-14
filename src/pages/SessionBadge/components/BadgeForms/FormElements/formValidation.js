import * as Yup from 'yup'

const stringRequired = Yup.string().required('Required')
const numberRequired = Yup.number().typeError('Enter number value').positive('value should be greater than 0')
  .required('Required')

const formValidation = Yup.object().shape({
  name: stringRequired,
  type: stringRequired,
  order: numberRequired,
  unlockPoint: stringRequired
})

export default formValidation
