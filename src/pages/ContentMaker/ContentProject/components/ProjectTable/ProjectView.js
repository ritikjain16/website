import { LinkOutlined, ThunderboltFilled } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { get } from 'lodash'
import React from 'react'
import copyToClipboard from '../../../../../utils/copyToClipboard'
import getFullPath from '../../../../../utils/getFullPath'
import { FlexContainer } from '../../ContentProject.styles'

const ProjectView = (props) => {
  const { record, type } = props
  const renderView = () => {
    const imageStyle = { height: '150px', width: '100%', objectFit: 'contain' }
    if (type === 'title') {
      return (
        <FlexContainer style={{ flexDirection: 'column', width: '200px' }}>
          {
            get(record, 'projectThumbnail.id') && (
              <img src={getFullPath(get(record, 'projectThumbnail.uri'))} alt='project' style={imageStyle} />
            )
          }
          <p>{get(record, 'title')}</p>
        </FlexContainer>
      )
    } else if (type === 'platform') {
      return (
        <FlexContainer style={{ flexDirection: 'column', width: '200px' }}>
          {
            get(record, 'externalPlatformLogo.id') ? (
              <img src={getFullPath(get(record, 'externalPlatformLogo.uri'))} alt='project' style={imageStyle} />
            ) : '-'
          }
        </FlexContainer>
      )
    } else if (type === 'difficulty') {
      const newSelected = []
      const difficultyVal = get(record, 'difficulty')
      if (difficultyVal === 1) newSelected.push('One')
      if (difficultyVal === 2) newSelected.push('One', 'Two')
      if (difficultyVal === 3) newSelected.push('One', 'Two', 'Three')
      return (
        <FlexContainer justify='center'>
          <ThunderboltFilled style={{ color: newSelected.includes('One') ? '#FFDD09' : 'lightgray', fontSize: '35px' }} />
          <ThunderboltFilled style={{ color: newSelected.includes('Two') ? '#FFDD09' : 'lightgray', fontSize: '35px' }} />
          <ThunderboltFilled style={{ color: newSelected.includes('Three') ? '#FFDD09' : 'lightgray', fontSize: '35px' }} />
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

export default ProjectView
