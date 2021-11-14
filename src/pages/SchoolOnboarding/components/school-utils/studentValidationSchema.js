/* eslint-disable import/no-duplicates */
import * as yup from 'yup'

const studentValidationSchema = yup.object().shape({
  grade: yup.string().required('grade (Not found)'),
  section: yup.string().matches(/^[A-Z]$/, 'section (Invalid format)'),
  childName: yup.string().required('childName (Not found)').min(3, 'childName (Min. 3 characters)').max(30, 'childName (Max. 30 characters)'),
  parentName: yup.string().required('parentName (Not Found)').min(3, 'parentName (Min. 3 characters)').max(30, 'parentName (Max. 30 characters)'),
  phoneNumber: yup.string().required('phoneNumber (Not Found)')
    .matches(/^[6-9]\d{9}$/, 'phoneNumber (Invalid format)'),
  parentEmail: yup.string().required('parentEmail (Not Found)').email('parentEmail (Invalid format)'),
})

export default studentValidationSchema
