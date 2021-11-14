import { get } from 'lodash'
import React from 'react'
import { McqInput } from '../QuestionTypes/TypeView.styles'

const InputView = (props) => {
  const { data, isViewOnlyMode, auditStatementh3Style,
    auditStatementStyle, auditDescStyle } = props
  return (
    <div >
      <div style={auditStatementStyle}>
        <h3 style={auditStatementh3Style} >1. {get(data, 'statement')}</h3>
        <span style={auditDescStyle}>{get(data, 'description') || ''}</span>
      </div>
      <McqInput style={{ width: '50%' }}
        disabled={isViewOnlyMode}
        placeholder='Write a short text'
      />
    </div>
  )
}

export default InputView
