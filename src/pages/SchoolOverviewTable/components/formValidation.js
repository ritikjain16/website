import * as Yup from 'yup'

const stringRequired = Yup.string().required('Required')

const addSchoolValidation = Yup.object().shape({
  schoolName: stringRequired,
  code: stringRequired
})

export default addSchoolValidation
