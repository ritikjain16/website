import { Radio } from 'antd'
import { get } from 'lodash'
import React from 'react'
import sections from '../../../../../constants/sections'

const BoolView = (props) => {
  const { data, auditDescStyle, auditStatementStyle, auditStatementh3Style } = props
  return (
    <div>
      <div style={auditStatementStyle}>
        <h3 style={auditStatementh3Style} >1. {get(data, 'statement')}</h3>
        <span style={auditDescStyle}>{get(data, 'description') || ''}</span>
      </div>
      {
        ['True', 'False'].map((option, ind) => (
          <div>
            <label htmlFor='trueOption' key={option} >
              <Radio id='trueOption' />{' '} <strong>{sections[ind]}</strong>. {option}
            </label>
          </div>
        ))
      }
    </div>
  )
}

export default BoolView
