import React from 'react'
import { useField } from 'formik'
import { Input } from 'antd'

const AddInput = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <div style={{ marginBottom: '1.2vw' }}>
      <Input
        autoComplete='off'
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <p style={{ fontSize: 'small', color: 'red' }} >{meta.error}</p>) : null}
    </div>
  )
}

export default AddInput
