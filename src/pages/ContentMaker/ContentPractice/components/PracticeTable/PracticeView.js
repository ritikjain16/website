import { LinkOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { get } from 'lodash'
import React from 'react'
import copyToClipboard from '../../../../../utils/copyToClipboard'
import getFullPath from '../../../../../utils/getFullPath'
import { FlexContainer } from '../../ContentPractice.styles'

const PracticeView = (props) => {
  const { record, type } = props
  const renderView = () => {
    const imageStyle = { height: '150px', width: '100%', objectFit: 'contain' }
    if (type === 'platform') {
      return (
        <FlexContainer style={{ flexDirection: 'column', width: '200px' }}>
          {
            get(record, 'externalPlatformLogo.id') ? (
              <img src={getFullPath(get(record, 'externalPlatformLogo.uri'))} alt='project' style={imageStyle} />
            ) : '-'
          }
        </FlexContainer>
      )
    } else if (type === 'externalPlatformLink') {
      return (
        <Tooltip title={get(record, 'externalPlatformLink')}>
          {get(record, 'externalPlatformLink') ? (
            <LinkOutlined style={{ fontSize: '35px' }} onClick={() => copyToClipboard(get(record, 'externalPlatformLink'))} />
          ) : '-'}
        </Tooltip>
      )
    }
  }
  return renderView()
}

export default PracticeView
