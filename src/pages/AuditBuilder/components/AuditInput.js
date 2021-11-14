import React, { memo } from 'react'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { StyledInput, StyledTextArea } from '../AuditBuilder.style'
import { BLOCK, BOLD } from '../../../constants/questionBank'
import { BlockIcon, BoldIcon } from '../../ContentMaker/ContentProject/ContentProject.styles'

const AuditInput = (props) => {
  const { value, setValue, inputType, inputRef, disabled, ...rest } = props
  const onAddSub = (type) => {
    if (type === 'sub') {
      if (value > 0) setValue(value - 1)
    } else if (type === 'add') {
      setValue(value + 1)
    }
  }
  const codeInsert = (type) => {
    if (inputRef) {
      const inputs = document.querySelector(`.${inputRef}`)
      if (inputs) {
        const { selectionStart, selectionEnd } = inputs
        let nextTextValue = ''
        if (type === BOLD) {
          nextTextValue =
            `${value.slice(0, selectionStart)}<bold>${value.slice(selectionStart, selectionEnd)}</bold>${value.slice(selectionEnd)}`
        } else if (type === BLOCK) {
          nextTextValue =
            `${value.slice(0, selectionStart)}<block>${value.slice(selectionStart, selectionEnd)}</block>${value.slice(selectionEnd)}`
          setValue(nextTextValue)
        }
        setValue(nextTextValue)
        inputs.focus()
      }
    }
  }
  return (
    <div style={{ width: '100%' }}>
      {
        inputType ? (
          <div style={{ position: 'relative', width: '80%' }}>
            <StyledTextArea
              autoComplete='off'
              value={value}
              className={inputRef}
              onChange={(e) => setValue(e.target.value)}
              {...props}
            />
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
                </div>
              )
            }
          </div>
        ) : (
          <StyledInput
            prefix={
              <MinusOutlined
                onClick={() => onAddSub('sub')}
              />
            }
            suffix={
              <PlusOutlined
                onClick={() => onAddSub('add')}
              />
            }
            disabled={disabled}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            {...rest}
          />
        )
      }
    </div>
  )
}

export default memo(AuditInput)
