import React from 'react'
import { useField } from 'formik'
import { Input as InputField } from 'antd'
import { StyledTextArea } from '../../../Videos.styles'
import { onInputKeyDown } from '../../../../contentUtils'
/* eslint-disable */

const Input = ({ label, order, values, setFieldValue, value, textArea, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', marginBottom: '5px' }}
    >
      <h3>{`${label ? `${label} : ` : ''}`}</h3>
      {
        textArea ? <StyledTextArea autoComplete='off' {...field} {...props} /> : <InputField autoComplete='off' {...field} {...props} onKeyDown={onInputKeyDown} />
      }
      {meta.touched && meta.error ? (
        <p style={{ fontSize: 'small', color: 'red' }}>{meta.error}</p>
      ) : null}
    </div>
  )
}

export default Input
