import { get } from 'lodash'
import React from 'react'
import { BigPlayButton, Player } from 'video-react'
import getFullPath from '../../../../../../utils/getFullPath'
import { CloseIcon } from '../../../../AddSessions.styles'
import { VideoCard, VideoWrapper } from './VideoView.style'

const VideoView = (props) => {
  const { video, onDelete } = props
  return (
    <VideoCard>
      <CloseIcon onClick={onDelete} />
      <h2 style={{ width: '80%' }}>{get(video, 'title')}</h2>
      <h4>{get(video, 'description')}</h4>
      <VideoWrapper>
        <Player
          className='react-player'
          playsInline
          src={getFullPath(get(video, 'videoFile.uri'))}
        >
          <BigPlayButton position='center' />
        </Player>
      </VideoWrapper>
    </VideoCard>
  )
}

export default VideoView
