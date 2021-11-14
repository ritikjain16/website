import * as Yup from 'yup'

const stringRequired = Yup.string().required('Required')
// const numberRequired =
// Yup.number().typeError('Enter number value').positive('value should be greater than 0')
//   .required('Required')
const expiry = Yup.date().typeError('Enter valida date').required('Required')
const inceptionDate = Yup.date().typeError('Enter valid date').required('Required').max(Yup.ref('expiry'),
  'Date needs to be before expiry date')

const files = Yup.mixed().required('Required')

const addBannerSchema = Yup.object().shape({
  title: stringRequired,
  expiry,
  inceptionDate,
  backgroundImage: files,
})

const editBannerSchema = Yup.object().shape({
  title: stringRequired,
  expiry,
  inceptionDate,
})

export { addBannerSchema, editBannerSchema }
