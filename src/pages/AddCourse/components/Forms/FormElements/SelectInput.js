import React from 'react'
import { useField } from 'formik'
import { StyledSelect } from '../../../AddCourse.styles'

const SelectInput = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}
    >
      <h3>{`${label ? `${label} : ` : ''}`}</h3>
      <StyledSelect
        {...field}
        {...props}
      >
        {props.children}
      </StyledSelect>
      {meta.touched && meta.error ? (
        <p style={{ fontSize: 'small', color: 'red' }}>{meta.error}</p>
      ) : null}
    </div>
  )
}

export default SelectInput
