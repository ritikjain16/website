import * as Yup from 'yup'

const stringRequired = Yup.string().trim().required('Required')
const numberRequired = Yup.number().typeError('Enter number value').positive('value should be greater than 0').integer('should be integer')
  .required('Required')

const addAssignmentSchema = Yup.object().shape({
  statement: stringRequired,
  order: numberRequired,
  difficulty: numberRequired,
})

export default addAssignmentSchema
