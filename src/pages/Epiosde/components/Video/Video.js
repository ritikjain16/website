import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { message, Popconfirm } from 'antd'
import Main from './Video.style'
import VideoDropzone from './components/VideoDropzone'
import { getDataById } from '../../../../utils/data-utils'

let videoFile
const Video = ({ ...props }) => {
  const topicId = props.match.params.id
  const { parentState, setParentState } = props
  const { videoLink, shouldUploadVideoFile, shouldDeleteVideoFile } = parentState
  const { setVideoLink,
    setShouldUploadVideoFile,
    setShouldVideo,
    setShouldDeleteVideoFile } = setParentState
  const {
    removeVideoEpisodeError,
    addVideoEpisodeError,
    videoPlayerFromEpisode
  } = props
  // lifecycles
  useEffect(() => {
    if (removeVideoEpisodeError !== null) {
      message.error(removeVideoEpisodeError)
      setShouldDeleteVideoFile(true)
    }
  }, [removeVideoEpisodeError])

  useEffect(() => {
    if (addVideoEpisodeError !== null) {
      message.error(addVideoEpisodeError)
      setShouldUploadVideoFile(true)
    }
  }, [addVideoEpisodeError])

  const onVideoDrop = file => {
    videoFile = file
  }

  const onUpload = async () => {
    const { episodes } = props
    const topic = getDataById(episodes, topicId)
    if (topic.id) {
      const hideUploading = message.loading('Uploading video...', 0)
      setShouldUploadVideoFile(false)
      setShouldDeleteVideoFile(false)
      const res = await props.addVideoTopic(videoFile, topic.id)
      setShouldDeleteVideoFile(true)
      hideUploading()
      if (res.video) {
        setShouldVideo(true)
        message.success('Video Uploaded')
      }
    }
  }

  const deleteVideo = async () => {
    const { episodes } = props
    const topic = getDataById(episodes, topicId)
    if (topic.id && topic.video) {
      setShouldUploadVideoFile(false)
      setShouldDeleteVideoFile(false)
      const isDeletingFromCache = topic.video === null
      if (isDeletingFromCache) {
        setShouldVideo(false)
        setVideoLink('')
        message.success('Video Deleted')
        return
      }
      const hideDeleting = message.loading('Deleting Video...', 0)
      const res = await props.removeVideoTopic(topicId, topic.video.id)
      hideDeleting()
      if (res) {
        // initiating endTime and startTime in props to 0 when video is deleted
        if (props.learningObjectives && props.learningObjectives.length) {
          for (let i = 0; i < props.learningObjectives.length;) {
            props.learningObjectives[i].videoStartTime = 0
            props.learningObjectives[i].videoEndTime = 0
            i += 1
          }
        }
        message.success('Video Deleted')
        setShouldVideo(false)
        setVideoLink('')
      }
    } else {
      const isDeletingFromCache = topic.video === null
      if (isDeletingFromCache) {
        setShouldUploadVideoFile(false)
        setShouldDeleteVideoFile(false)
        setShouldVideo(false)
        setVideoLink('')
        message.success('Video Deleted')
      } else { message.error('Something went wrong') }
    }
  }

  const videoPlayerFromVideo = async (vp) => {
    videoPlayerFromEpisode(vp)
  }

  return (
    <Main>
      <VideoDropzone
        onVideoDrop={onVideoDrop}
        parentState={{ videoLink, shouldUploadVideoFile, shouldDeleteVideoFile }}
        setParentState={{ setVideoLink,
          setShouldUploadVideoFile,
          setShouldDeleteVideoFile }}
        videoPlayerFromVideo={videoPlayerFromVideo}

      />
      <Main.ButtonsWrapper>
        <Main.TextSpan>
          Video
        </Main.TextSpan>
        <Popconfirm
          title='Do you want to delete the video?'
          placement='topRight'
          onConfirm={deleteVideo}
          okText='Yes'
          cancelText='Cancel'
          key='delete'
        >
          <Main.DeleteButton
            icon='delete'
            disabled={!shouldDeleteVideoFile}
          >Delete
          </Main.DeleteButton>
        </Popconfirm>
        <Main.Button
          icon='upload'
          onClick={onUpload}
          disabled={!shouldUploadVideoFile}
        >Upload
        </Main.Button>
      </Main.ButtonsWrapper>
    </Main>
  )
}
Video.defaultProps = {
  addVideoEpisodeError: null,
  removeVideoEpisodeError: null
}
Video.propTypes = {
  learningObjectives: PropTypes.arrayOf(PropTypes.shape({
    /** id of the Learning Objective */
    id: PropTypes.string.isRequired,
    /** Title of the Learning Objective */
    title: PropTypes.string.isRequired,
    /** Order of the Learning Objective */
    order: PropTypes.number.isRequired,
    /** Video time stamps at which LO is starting */
    videoStartTime: PropTypes.number,
    /** Video time stamps at which LO is ending */
    videoEndTime: PropTypes.number
  })).isRequired,
  addVideoTopic: PropTypes.func.isRequired,
  removeVideoTopic: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  episodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  addVideoEpisodeError: PropTypes.instanceOf(Error),
  removeVideoEpisodeError: PropTypes.instanceOf(Error),
  videoPlayerFromEpisode: PropTypes.func.isRequired,
  parentState: PropTypes.shape({}).isRequired,
  setParentState: PropTypes.shape({}).isRequired,
}

export default Video
