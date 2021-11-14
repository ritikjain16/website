import React from 'react'
import { useField } from 'formik'
import { Input as InputField } from 'antd'

const Input = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <div style={{ marginBottom: '10px' }}>
      <InputField
        autoComplete='off'
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <p style={{ fontSize: 'small', color: 'red' }} >{meta.error}</p>) : null}
    </div>
  )
}

export default Input
