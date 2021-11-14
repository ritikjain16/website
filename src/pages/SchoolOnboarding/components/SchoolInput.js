import { EditOutlined } from '@ant-design/icons'
import React from 'react'
import copyToClipboard from '../../../utils/copyToClipboard'
import {
  CopyIcon, SchoolInput as InputContainer
} from '../SchoolOnBoarding.style'

const SchoolInput = ({ bodyStyle, ...props }) => (
  <InputContainer style={{ margin: '1vw 0', ...bodyStyle }}>
    {
      !props.copyLink ? (
        <>
          <input {...props} style={{ width: bodyStyle ? '100%' : 'inherit' }} /><EditOutlined />
        </>
      ) : (
        <>
          <div className='campaign__link'>{props.value}</div>
          <CopyIcon onClick={() => copyToClipboard(props.value)} />
        </>
      )
    }
  </InputContainer>
)

export default SchoolInput
