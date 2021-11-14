import React from 'react'
import { useField } from 'formik'
import { Button, Input } from 'antd'
import WorkbookStyle from '../../../Workbook.style'
import { BLOCK, BOLD } from '../../../../../constants/questionBank'

const InputField = ({ label, order, values, setFieldValue, deleteField, inputRef, ...props }) => {
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
        }
        inputs.focus()
      }
    }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
      <h3>{label} : </h3>
      {
        order ? (
          <div style={{ display: 'flex', alignItems: 'center' }} >
            <button type='button' onClick={() => values.order > 0 ? setFieldValue('order', values.order - 1) : null} >-</button>
            <Input
              autoComplete='off'
              {...field}
              {...props}
            />
            <button type='button' onClick={() => setFieldValue('order', values.order + 1)} >+</button>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <WorkbookStyle.StyledInput
              autoComplete='off'
              className={inputRef}
              {...field}
              {...props}
            />
            {
              inputRef && (
                <div style={{ position: 'absolute', top: '15px', right: '12px' }}>
                  <WorkbookStyle.BoldIcon
                    type='bold'
                    onMouseDown={(e) => { e.preventDefault() }}
                    onClick={() => codeInsert(BOLD)}
                  />
                  <WorkbookStyle.BlockIcon
                    type='bold'
                    onMouseDown={(e) => { e.preventDefault() }}
                    onClick={() => codeInsert(BLOCK)}
                  />
                </div>
              )
            }
            {deleteField &&
              <Button
                icon='delete'
                type='danger'
                onClick={deleteField}
                style={{ position: 'absolute', top: '15px', right: '12px' }}
              />}
          </div>
        )
      }
      {meta.touched && meta.error ? (
        <p style={{ fontSize: 'small', color: 'red' }} >{meta.error}</p>) : null}
    </div>
  )
}

export default InputField
