import React from 'react'
import { useField } from 'formik'
import EditBannerStyle from '../EditBanner.style'

const InputField = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
      <h3>{label} : </h3>
      <EditBannerStyle.StyledInput
        autoComplete='off'
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <p style={{ fontSize: 'small', color: 'red' }} >{meta.error}</p>) : null}
    </div>
  )
}

export default InputField
