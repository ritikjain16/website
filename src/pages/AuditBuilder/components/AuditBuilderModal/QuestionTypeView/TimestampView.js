import { Icon } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { TagBox, Tags } from '../QuestionTypes/TypeView.styles'

const TimestampView = (props) => {
  const { data, auditDescStyle, auditStatementStyle, auditStatementh3Style } = props
  return (
    <div>
      <div style={auditStatementStyle}>
        <h3 style={auditStatementh3Style} >1. {get(data, 'statement')}</h3>
        <span style={auditDescStyle}>{get(data, 'description') || ''}</span>
      </div>
      <p>Add Tags for Mapping</p>
      <Tags>
        {get(data, 'timestampTags', []).map(tag => (
          <TagBox key={get(tag, 'order')} >
            <Icon type='close' style={{ visibility: 'visible' }} />
            {get(tag, 'title')}
          </TagBox>
        ))}
      </Tags>
    </div>

  )
}

export default TimestampView
