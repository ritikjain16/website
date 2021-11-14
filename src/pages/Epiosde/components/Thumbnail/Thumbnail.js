import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { message, Popconfirm } from 'antd'
import Main from './Thumbnail.style'
import ThumbnailDropzone from './components/ThumbnailDropzone'
import { getDataById } from '../../../../utils/data-utils'

let thumbnailFile
const Thumbnail = ({ ...props }) => {
  const topicId = props.match.params.id
  const { parentState, setParentState } = props
  const { thumbnailLink,
    shouldUploadThumbnailFile,
    shouldDeleteThumbnailFile,
    shouldThumbnail } = parentState
  const { setThumbnailLink,
    setShouldUploadThumbnailFile,
    setShouldDeleteThumbnailFile,
    setShouldThumbnail } = setParentState
  const { removeVideothumbnailEpisodeError, addVideothumbnailEpisodeError } = props

  // lifecycles
  useEffect(() => {
    if (removeVideothumbnailEpisodeError !== null) {
      message.error(removeVideothumbnailEpisodeError)
      setShouldDeleteThumbnailFile(true)
    }
  }, [removeVideothumbnailEpisodeError])

  useEffect(() => {
    if (addVideothumbnailEpisodeError !== null) {
      message.error(addVideothumbnailEpisodeError)
      setShouldUploadThumbnailFile(true)
    }
  }, [addVideothumbnailEpisodeError])

  const onThumbnailDrop = file => {
    thumbnailFile = file
  }

  const onUpload = async () => {
    const { episodes } = props
    const topic = getDataById(episodes, topicId)
    if (topic.id) {
      const hideUploading = message.loading('Uploading thumbnail...', 0)
      setShouldUploadThumbnailFile(false)
      setShouldDeleteThumbnailFile(false)
      const res = await props.addVideoThumbnailTopic(thumbnailFile, topicId)
      setShouldDeleteThumbnailFile(true)
      hideUploading()
      if (res.videoThumbnail) {
        message.success('Thumbnail Uploaded')
      }
    }
  }

  const deleteThumbnail = async () => {
    const { episodes } = props
    const topic = getDataById(episodes, topicId)
    if (topic.id && topic.videoThumbnail) {
      setShouldUploadThumbnailFile(false)
      setShouldDeleteThumbnailFile(false)
      const isDeletingFromCache = topic.videoThumbnail === null
      if (isDeletingFromCache) {
        setShouldThumbnail(false)
        setThumbnailLink('')
        message.success('Thumbnail Deleted')
        return
      }
      const hideDeleting = message.loading('Deleting thumbnail...', 0)
      const res = await props.removeVideoThumbnailTopic(topicId, topic.videoThumbnail.id)
      hideDeleting()
      if (res) {
        setShouldThumbnail(false)
        setThumbnailLink('')
        message.success('Thumbnail Deleted')
      }
    } else {
      const isDeletingFromCache = topic.videoThumbnail === null
      if (isDeletingFromCache) {
        setShouldUploadThumbnailFile(false)
        setShouldDeleteThumbnailFile(false)
        setShouldThumbnail(false)
        setThumbnailLink('')
        message.success('Thumbnail Deleted')
      } else { message.error('Something went wrong') }
    }
  }

  return (
    <Main>
      <ThumbnailDropzone
        onThumbnailDrop={onThumbnailDrop}
        parentState={
          { thumbnailLink, shouldUploadThumbnailFile, shouldThumbnail, shouldDeleteThumbnailFile }
        }
        setParentState={
          { setThumbnailLink,
            setShouldUploadThumbnailFile,
            setShouldThumbnail,
            setShouldDeleteThumbnailFile }
        }
      />
      <Main.ButtonsWrapper>
        <Main.TextSpan>
          Thumbnail
        </Main.TextSpan>
        <Popconfirm
          title='Do you want to delete the thumbnail?'
          placement='topRight'
          onConfirm={deleteThumbnail}
          okText='Yes'
          cancelText='Cancel'
          key='delete'
        >
          <Main.DeleteButton
            icon='delete'
            disabled={!shouldDeleteThumbnailFile}
          >Delete
          </Main.DeleteButton>
        </Popconfirm>
        <Main.Button
          icon='upload'
          onClick={onUpload}
          disabled={!shouldUploadThumbnailFile}
        >Upload
        </Main.Button>
      </Main.ButtonsWrapper>
    </Main>
  )
}
Thumbnail.defaultProps = {
  removeVideothumbnailEpisodeError: null,
  addVideothumbnailEpisodeError: null
}
Thumbnail.propTypes = {
  addVideoThumbnailTopic: PropTypes.func.isRequired,
  removeVideoThumbnailTopic: PropTypes.func.isRequired,
  episodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  removeVideothumbnailEpisodeError: PropTypes.instanceOf(Error),
  addVideothumbnailEpisodeError: PropTypes.instanceOf(Error),
  parentState: PropTypes.shape({}).isRequired,
  setParentState: PropTypes.shape({}).isRequired,
}

export default Thumbnail
