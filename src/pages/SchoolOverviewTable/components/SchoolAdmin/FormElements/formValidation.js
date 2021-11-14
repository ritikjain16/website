import * as yup from 'yup'

const addAdminValidation = yup.object().shape({
  name: yup.string().required('Name (Not Found)').min(3, 'Name (Min. 3 characters)').max(30, 'Name (Max. 30 characters)'),
  phoneNumber: yup.string().required('phoneNumber (Not Found)'),
  email: yup.string().required('Email (Not Found)').email('Email (Invalid format)'),
  username: yup.string().required('Username (Not Found)').min(3, 'Username (Min. 3 characters)').max(30, 'Username (Max. 30 characters)'),
  password: yup.string().required('First time password (Not Found)').min(3, 'First time password (Min. 3 characters)').max(30, 'First time password (Max. 30 characters)')
})

const editAdminValidation = yup.object().shape({
  name: yup.string().required('Name (Not Found)').min(3, 'Name (Min. 3 characters)').max(30, 'Name (Max. 30 characters)'),
  phoneNumber: yup.string().required('phoneNumber (Not Found)'),
  email: yup.string().required('Email (Not Found)').email('Email (Invalid format)'),
  username: yup.string().required('Username (Not Found)').min(3, 'Username (Min. 3 characters)').max(30, 'Username (Max. 30 characters)'),
})

export { addAdminValidation, editAdminValidation }
