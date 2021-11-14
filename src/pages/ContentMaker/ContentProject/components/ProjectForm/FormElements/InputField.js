import React from 'react'
import { useField } from 'formik'
import { Input as InputField } from 'antd'
import { StyledTextArea, BoldIcon, BlockIcon } from '../../../ContentProject.styles'
import { BLOCK, BOLD, BULLET } from '../../../../../../constants/questionBank'
import { onInputKeyDown } from '../../../../contentUtils'
/* eslint-disable */

const Input = ({ label, order, values, setFieldValue, textArea, inputStyles, inputRef, ...props }) => {
  const [field, meta] = useField(props)
  const codeInsert = (type) => {
    if (inputRef) {
      const inputs = document.querySelector(`.${inputRef}`)
      if (inputs) {
        const { selectionStart, selectionEnd } = inputs
        const { value } = props
        if (type === BOLD) {
          const nextTextValue =
            `${value.slice(0, selectionStart)}<bold>${value.slice(selectionStart, selectionEnd)}</bold>${value.slice(selectionEnd)}`
          setFieldValue(`${inputRef}`, nextTextValue)
        } else if (type === BLOCK) {
          const nextTextValue =
            `${value.slice(0, selectionStart)}<block>${value.slice(selectionStart, selectionEnd)}</block>${value.slice(selectionEnd)}`
          setFieldValue(`${inputRef}`, nextTextValue)
        } else if (type === BULLET) {
          const nextTextValue =
            `${value.slice(0, selectionStart)}<bullet>${value.slice(selectionStart, selectionEnd)}</bullet>${value.slice(selectionEnd)}`
          setFieldValue(`${inputRef}`, nextTextValue)
        }
        inputs.focus()
      }
    }
  }
  return (
    <div
      style={{ display: 'grid', alignItems: 'flex-start', gridTemplateColumns: '30% 60%', marginBottom: '15px', ...inputStyles }}
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
          <InputField autoComplete='off' {...field} {...props} onKeyDown={onInputKeyDown} />
          <button
            type='button'
            onClick={() => setFieldValue('order', values.order + 1)}
          >
            +
          </button>
        </div>
      ) : (
        textArea ? <div style={{ position: 'relative' }}>
            <StyledTextArea autoComplete='off' className={inputRef} {...field} {...props} />
            {
              inputRef && (
                <div style={{ position: 'absolute', bottom: '5px', right: '12px' }}>
                  <BoldIcon
                    type='bold'
                    onMouseDown={(e) => { e.preventDefault() }}
                    onClick={() => codeInsert(BOLD)}
                  />
                  <BlockIcon
                    type='bold'
                    onMouseDown={(e) => { e.preventDefault() }}
                    onClick={() => codeInsert(BLOCK)}
                  />
                  <BoldIcon
                    type='bars'
                    onMouseDown={(e) => { e.preventDefault() }}
                    onClick={() => codeInsert(BULLET)}
                  />
                </div>
              )
            }
          </div> : <InputField autoComplete='off' {...field} {...props} />
      )}
      {meta.touched && meta.error ? (
        <p style={{ fontSize: 'small', color: 'red' }}>{meta.error}</p>
      ) : null}
    </div>
  )
}

export default Input
