import { Checkbox } from 'antd'
import { get } from 'lodash'
import React from 'react'
import sections from '../../../../../constants/sections'

class McqView extends React.Component {
  render() {
    const { data, isViewOnlyMode, auditDescStyle,
      auditStatementStyle, auditStatementh3Style } = this.props
    return (
      <div>
        <div style={auditStatementStyle}>
          <h3 style={auditStatementh3Style} >1. {get(data, 'statement')}</h3>
          <span style={auditDescStyle}>{get(data, 'description') || ''}</span>
        </div>
        {
            get(data, 'mcqOptions', []).map((option, ind) => (
              <div >
                <label htmlFor='trueOption' key={`${get(option, 'statement')}`} >
                  <Checkbox id='trueOption'
                    disabled={isViewOnlyMode}
                    checked={get(option, 'isCorrect')}
                  />{' '} <strong>{sections[ind]}</strong>. {get(option, 'statement')}
                </label>
              </div>
            ))
        }
      </div>
    )
  }
}

export default McqView
