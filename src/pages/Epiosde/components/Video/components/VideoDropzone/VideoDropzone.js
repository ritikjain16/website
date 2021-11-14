import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Player, BigPlayButton } from 'video-react'
import Main from './VideoDropzone.style'

const VideoDropzone = props => {
  const { parentState, setParentState, videoPlayerFromVideo } = props
  const { videoLink, shouldDeleteVideoFile } = parentState
  const { setVideoLink,
    setShouldUploadVideoFile,
    setShouldDeleteVideoFile } = setParentState
  const playerRef = React.createRef()
  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles[0]) {
      setVideoLink(URL.createObjectURL(acceptedFiles[0]))
      setShouldUploadVideoFile(true)
      setShouldDeleteVideoFile(true)
      props.onVideoDrop(acceptedFiles[0])
    }
  }

  const passVideoRef = async () => {
    if (shouldDeleteVideoFile) {
      videoPlayerFromVideo(playerRef.current)
    }
  }
  useEffect(() => { passVideoRef() }, [shouldDeleteVideoFile])
  return (
    <Main>
      <Main.VideoWrapper>
        {shouldDeleteVideoFile
            ? (
              <Player
                ref={playerRef}
                className='react-player'
                playsInline
                src={videoLink}
              >
                <BigPlayButton position='center' />
              </Player>
            )

            : (
              <Main.Dropzone
                activeClassName='active'
                accept='video/*'
                onDrop={onDrop}
                disabled={shouldDeleteVideoFile}
              >
                <Main.UploadContainer>
                  <Main.UploadIcon type='video-camera' />
                  <Main.UploadText>
                    Click or drag to attach
                  </Main.UploadText>
                </Main.UploadContainer>
              </Main.Dropzone>
            )
          }
      </Main.VideoWrapper>
    </Main>
  )
}
VideoDropzone.propTypes = {
  onVideoDrop: PropTypes.func.isRequired,
  parentState: PropTypes.shape({}).isRequired,
  setParentState: PropTypes.shape({}).isRequired,
  videoPlayerFromVideo: PropTypes.func.isRequired
}

export default VideoDropzone
