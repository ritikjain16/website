import * as Yup from 'yup'

const AddBatchValidationSchema = Yup.object().shape({
  batchCode: Yup.number().typeError('Enter number value').positive('value should be greater than 0')
    .required('required'),
  batchType: Yup.string().required('Batch Type is required'),
  allotedMentor: Yup.string().required('Alloted Mentor is required'),
})

const UpdateBatchValidationSchema = Yup.object().shape({
  batchCode: Yup.string().required('Batch code is required'),
  batchType: Yup.string().required('Batch Type is required'),
  allotedMentor: Yup.string().required('Alloted Mentor is required'),
  topic: Yup.string().required('Topic is required')
})

export { AddBatchValidationSchema, UpdateBatchValidationSchema }
