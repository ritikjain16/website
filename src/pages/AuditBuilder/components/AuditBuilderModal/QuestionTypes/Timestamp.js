import { Icon, Input } from 'antd'
import { get } from 'lodash'
import React, { useState } from 'react'
import { AuditBuilderContainer } from '../../../AuditBuilder.style'
import { TagBox, Tags } from './TypeView.styles'

const iconStyle = {
  padding: '5px',
  borderRadius: '999px',
  cursor: 'pointer',
  border: '1px solid black',
  marginLeft: '10px'
}

const Timestamp = (props) => {
  const [tagValue, setTagValue] = useState('')
  const [showInput, setShowInput] = useState(false)
  const { onAddTimestampTags, timestampTags, onRemoveTag } = props
  const onAddTag = () => {
    if (tagValue) {
      onAddTimestampTags(tagValue)
      setTagValue('')
    }
  }
  return (
    <AuditBuilderContainer style={{ flexWrap: 'wrap' }}>
      <Tags>
        {timestampTags.map(tag => (
          <TagBox key={get(tag, 'order')} >
            <Icon type='close' onClick={() => onRemoveTag(tag)} />
            {get(tag, 'title')}
          </TagBox>
        ))}
      </Tags>
      {
        showInput ? (
          <AuditBuilderContainer>
            <h4 style={{ opacity: '0.5' }} >Tag</h4>
            <Input value={tagValue}
              onChange={(e) => setTagValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onAddTag()
                }
              }}
            />
            <Icon
              type='plus'
              style={iconStyle}
              onClick={onAddTag}
            />
          </AuditBuilderContainer>
        ) : (
          <Icon
            type='plus'
            style={iconStyle}
            onClick={() => setShowInput(!showInput)}
          />
        )
      }
    </AuditBuilderContainer>
  )
}

export default Timestamp
