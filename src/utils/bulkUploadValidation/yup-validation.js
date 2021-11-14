/* eslint-disable import/no-duplicates */
import * as yup from 'yup'

const validationSchema = (excludeParentEmail, excludePhoneNumber) => yup.object().shape({
  srNo: yup.string().matches(/^\d+$/, 'srNo (Invalid format)'),
  grade: yup.string().required('grade (Not found)').matches(/^Grade[1-9]|1[0-2]*$/, 'grade (Invalid format)'),
  section: yup.string().matches(/^[A-Z]$/, 'section (Invalid format)'),
  rollNo: yup.string(),
  childName: yup.string().required('childName (Not found)').min(3, 'childName (Min. 3 characters)').max(30, 'childName (Max. 30 characters)')
    .matches(/^[a-zA-Z .]{3,}$/, 'childName (Invalid format)'),
  gender: yup.string().matches(/^male|Male$|^female|Female$/, 'gender (Should be either male or female)'),
  parentName: yup.string().required('parentName (Not Found)').min(3, 'parentName (Min. 3 characters)').max(30, 'parentName (Max. 30 characters)')
    .matches(/^[a-zA-Z .]{3,}$/, 'parentName (Invalid format)'),
  fatherOrMother: yup.string(),
  phoneNumber: (() => {
    if (!excludePhoneNumber) {
      return yup.string().required('phoneNumber (Not Found)')
        .matches(/^[6-9]\d{9}$/, 'phoneNumber (Invalid format)')
    }
    return yup.string()
  })(),
  secondNumber: yup.string(),
  parentEmail: (() => {
    if (!excludeParentEmail) {
      return yup.string().required('parentEmail (Not Found)').email('parentEmail (Invalid format)')
    }
    return yup.string()
  })(),
  studentEmail: yup.string().email('studentEmail (Invalid format)'),
})

export default validationSchema
