import React from 'react'
import { useField } from 'formik'
import { Input } from 'antd'
import CheatSheetStyle from '../../../CheetSheet.style'
/* eslint-disable */

const InputField = ({ label, order, values, setFieldValue, textArea, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}
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
          <Input autoComplete='off' {...field} {...props} />
          <button
            type='button'
            onClick={() => setFieldValue('order', values.order + 1)}
          >
            +
          </button>
        </div>
      ) : (
        textArea ? <CheatSheetStyle.StyledTextArea autoComplete='off' {...field} {...props} /> : <CheatSheetStyle.Input autoComplete='off' {...field} {...props} />
      )}
      {meta.touched && meta.error ? (
        <p style={{ fontSize: 'small', color: 'red' }}>{meta.error}</p>
      ) : null}
    </div>
  )
}

export default InputField
