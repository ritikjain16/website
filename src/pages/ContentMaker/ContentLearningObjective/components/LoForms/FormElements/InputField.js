import React from 'react'
import { useField } from 'formik'
import { Input as InputField } from 'antd'
import { StyledTextArea } from '../../../ContentLearningObjective.styles'
import { onInputKeyDown } from '../../../../contentUtils'
/* eslint-disable */

const Input = ({ label, order, values, setFieldValue, textArea, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px' }}
    >
      <h3>{`${label ? `${label} : ` : ''}`}</h3>
      {order ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            type='button'
            onClick={() =>
              values.order > 0 ? setFieldValue('order', values.order - 1) : null
            }
          >
            -
          </button>
          <InputField autoComplete='off' {...field} {...props} onKeyDown={onInputKeyDown}  />
          <button
            type='button'
            onClick={() => setFieldValue('order', values.order + 1)}
          >
            +
          </button>
        </div>
      ) : (
        textArea ? <StyledTextArea autoComplete='off' {...field} {...props} /> : <InputField autoComplete='off' {...field} {...props} />
      )}
      {meta.touched && meta.error ? (
        <p style={{ fontSize: 'small', color: 'red' }}>{meta.error}</p>
      ) : null}
    </div>
  )
}

export default Input
