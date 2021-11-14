import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { message, Popconfirm } from 'antd'
import Main from './Subtitle.style'
import SubtitleDropzone from './components/SubtitleDropzone'
import { getDataById } from '../../../../utils/data-utils'

let subtitleFile
const Subtitle = ({ videoPlayer, ...props }) => {
  const topicId = props.match.params.id
  const { parentState, setParentState } = props
  const { subtitleLink,
    shouldUploadSubtitleFile,
    shouldDeleteSubtitleFile,
    shouldSubtitle } = parentState
  const { setSubtitleLink,
    setShouldUploadSubtitleFile,
    setShouldDeleteSubtitleFile,
    setShouldSubtitle } = setParentState
  const { removeVideosubtitleEpisodeError, addVideosubtitleEpisodeError } = props

  // lifecycles
  useEffect(() => {
    if (removeVideosubtitleEpisodeError !== null) {
      message.error(removeVideosubtitleEpisodeError)
      setShouldDeleteSubtitleFile(true)
    }
  }, [removeVideosubtitleEpisodeError])

  useEffect(() => {
    if (addVideosubtitleEpisodeError !== null) {
      message.error(addVideosubtitleEpisodeError)
      setShouldUploadSubtitleFile(true)
    }
  }, [addVideosubtitleEpisodeError])

  const onSubtitleDrop = file => {
    subtitleFile = file
  }

  const onUpload = async () => {
    const { episodes } = props
    const topic = getDataById(episodes, topicId)
    if (topic.id) {
      const hideUploading = message.loading('Uploading subtitle...', 0)
      setShouldUploadSubtitleFile(false)
      setShouldDeleteSubtitleFile(false)
      const res = await props.addVideoSubtitleTopic(subtitleFile, topicId)
      setShouldDeleteSubtitleFile(true)
      hideUploading()
      if (res.videoSubtitle) {
        message.success('Subtitle Uploaded')
      }
    }
  }

  const deleteSubtitle = async () => {
    const { episodes } = props
    const topic = getDataById(episodes, topicId)
    if (topic.id && topic.videoSubtitle) {
      setShouldUploadSubtitleFile(false)
      setShouldDeleteSubtitleFile(false)
      const isDeletingFromCache = topic.videoSubtitle === null
      if (isDeletingFromCache) {
        setShouldSubtitle(false)
        setSubtitleLink('')
        message.success('Subtitle Deleted')
        return
      }
      const hideDeleting = message.loading('Deleting subtitle...', 0)
      const res = await props.removeVideoSubtitleTopic(topicId, topic.videoSubtitle.id)
      hideDeleting()
      if (res) {
        setShouldSubtitle(false)
        setSubtitleLink('')
        message.success('Subtitle Deleted')
      }
    } else {
      const isDeletingFromCache = topic.videoSubtitle === null
      if (isDeletingFromCache) {
        setShouldUploadSubtitleFile(false)
        setShouldDeleteSubtitleFile(false)
        setShouldSubtitle(false)
        setSubtitleLink('')
        message.success('Subtitle Deleted')
      } else { message.error('Something went wrong') }
    }
  }

  return (
    <Main>
      <SubtitleDropzone
        onSubtitleDrop={onSubtitleDrop}
        parentState={
          { subtitleLink, shouldUploadSubtitleFile, shouldSubtitle, shouldDeleteSubtitleFile }
        }
        setParentState={
          { setSubtitleLink,
            setShouldUploadSubtitleFile,
            setShouldSubtitle,
            setShouldDeleteSubtitleFile }
        }
        videoPlayer={videoPlayer}
      />
      <Main.ButtonsWrapper>
        <Main.TextSpan>
          Transcript
        </Main.TextSpan>
        <Popconfirm
          title='Do you want to delete the subtitle?'
          placement='topRight'
          onConfirm={deleteSubtitle}
          okText='Yes'
          cancelText='Cancel'
          key='delete'
        >
          <Main.DeleteButton
            icon='delete'
            disabled={!shouldDeleteSubtitleFile}
          >Delete
          </Main.DeleteButton>
        </Popconfirm>
        <Main.Button
          icon='upload'
          onClick={onUpload}
          disabled={!shouldUploadSubtitleFile}
        >Upload
        </Main.Button>
      </Main.ButtonsWrapper>
    </Main>
  )
}
Subtitle.defaultProps = {
  removeVideosubtitleEpisodeError: null,
  addVideosubtitleEpisodeError: null,
  videoPlayer: null
}
Subtitle.propTypes = {
  addVideoSubtitleTopic: PropTypes.func.isRequired,
  removeVideoSubtitleTopic: PropTypes.func.isRequired,
  episodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  removeVideosubtitleEpisodeError: PropTypes.instanceOf(Error),
  addVideosubtitleEpisodeError: PropTypes.instanceOf(Error),
  videoPlayer: PropTypes.shape({}),
  parentState: PropTypes.shape({}).isRequired,
  setParentState: PropTypes.shape({}).isRequired,
}

export default Subtitle
