import { Checkbox, Icon } from 'antd'
import { get } from 'lodash'
import React, { useEffect, useState } from 'react'
import { AuditBuilderContainer } from '../../../AuditBuilder.style'
import { McqInput } from './TypeView.styles'

const iconStyle = {
  padding: '5px',
  borderRadius: '999px',
  cursor: 'pointer',
  border: '1px solid black',
  margin: '0 5px'
}

const Mcq = (props) => {
  const { mcqOptions, onUpdateMcqOption } = props
  const [optionError, setOptionError] = useState('')
  useEffect(() => {
    const statements = mcqOptions.map(opt => get(opt, 'statement').toLowerCase().trim())
    if (statements.includes('yes') && statements.includes('no')) {
      setOptionError('Mcq cannot have Yes/No type question.')
    } else setOptionError('')
  }, [mcqOptions])
  return (
    <AuditBuilderContainer style={{ flexDirection: 'column', width: '70%' }}>
      <h2 style={{ width: '100%' }}>Options</h2>
      {
        mcqOptions.map(option => (
          <AuditBuilderContainer style={{ width: '100%' }}>
            <McqInput
              value={get(option, 'statement')}
              name='statement'
              onChange={(event) =>
                onUpdateMcqOption('update', option, event)}
            />
            <Checkbox
              checked={get(option, 'isCorrect')}
              name='isCorrect'
              disabled={optionError}
              onChange={(event) =>
                onUpdateMcqOption('update', option, event)}
            />
            <Icon type='minus'
              style={iconStyle}
              onClick={() => onUpdateMcqOption('remove', option)}
            />
          </AuditBuilderContainer>
        ))
      }
      <span style={{ fontSize: 'small', color: 'red' }}>{optionError}</span>
      <Icon
        type='plus'
        style={iconStyle}
        onClick={() => onUpdateMcqOption('add')}
      />
    </AuditBuilderContainer>
  )
}

export default Mcq
