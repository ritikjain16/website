import * as Yup from 'yup'

const stringRequired = Yup.string().required('Required')
const numberRequired = Yup.number().typeError('Enter number value').positive('value should be greater than 0')
  .required('Required')

const addWorkbookSchema = Yup.object().shape({
  title: stringRequired,
  question: stringRequired,
})

const editWorkbookSchema = Yup.object().shape({
  title: stringRequired,
  question: stringRequired,
  order: numberRequired
})

export { addWorkbookSchema, editWorkbookSchema }
