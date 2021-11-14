import { UploadOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import React from 'react'
import AudioPlayerStyle from './AudioPlayer.style'

const AudioDropzone = (props) => {
  const { setAudioFile } = props
  const inputRef = React.useRef(null)
  const openFileUploader = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.click()
    }
  }
  return (
    <AudioPlayerStyle.StyledInputLabel >
      <input
        accept='audio/mp3'
        id='fileInput'
        type='file'
        name='audioFile'
        style={{ display: 'none' }}
        ref={inputRef}
        onChange={(event) => setAudioFile(event)}
        autoComplete='off'
      />
      <Tooltip title='Add new audio'>
        <Button onClick={openFileUploader}>
          <UploadOutlined />
        </Button>
      </Tooltip>
    </AudioPlayerStyle.StyledInputLabel>
  )
}

export default AudioDropzone

