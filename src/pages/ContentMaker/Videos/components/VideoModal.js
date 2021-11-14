import { get } from 'lodash'
import React from 'react'
import { Spin } from 'antd'

import MainModal from '../../../../components/MainModal'
import {
  AddVideoForm, EditVideoForm
} from './VideoForms'
import {
  addVideo, updateVideo
} from '../../../../actions/contentMaker'
import { UNPUBLISHED_STATUS } from '../../../../constants/questionBank'

class VideoModal extends React.Component {
  state = {
    title: '',
    description: '',
    videoStartTime: 0,
    videoEndTime: 0,
    storyStartTime: 0,
    storyEndTime: 0,
    status: UNPUBLISHED_STATUS
  }
  handleAddVideo = async (value, videoFile, thumbnailFile, subTitleFile, selectedCourses = [],
    { setErrors }) => {
    const { closeModal } = this.props
    const { title, description, videoStartTime = 0, videoEndTime = 0,
      storyStartTime = 0, storyEndTime = 0, status } = value
    if (videoStartTime && (videoStartTime > videoEndTime)) {
      setErrors({ videoStartTime: 'Video start time cannot be greater than video end time.' })
    } else if (storyStartTime && (storyStartTime > storyEndTime)) {
      setErrors({ storyStartTime: 'Story start time cannot be greater than story end time.' })
    } else {
      await addVideo({
        title,
        description: description || '',
        videoStartTime: videoStartTime || 0,
        videoEndTime: videoEndTime || 0,
        storyStartTime: storyStartTime || 0,
        storyEndTime: storyEndTime || 0,
        status
      }, selectedCourses.map(course => get(course, 'key')),
      videoFile, thumbnailFile, subTitleFile).then(async res => {
        if (res && res.addVideo && res.addVideo.id) {
          closeModal()
        }
      })
    }
  }

  handleEditVideo = (value, videoFile, thumbnailFile, subTitleFile,
    selectedCourses = [], { setErrors }) => {
    const { editData, closeModal } = this.props
    const { title, description, videoStartTime = 0, videoEndTime = 0,
      storyStartTime = 0, storyEndTime = 0, status } = value
    if (videoStartTime && (videoStartTime > videoEndTime)) {
      setErrors({ videoStartTime: 'Video start time cannot be greater than video end time.' })
    } else if (storyStartTime && (storyStartTime > storyEndTime)) {
      setErrors({ storyStartTime: 'Story start time cannot be greater than story end time.' })
    } else {
      updateVideo({
        input: {
          title,
          description: description || '',
          videoStartTime: videoStartTime || 0,
          videoEndTime: videoEndTime || 0,
          storyStartTime: storyStartTime || 0,
          storyEndTime: storyEndTime || 0,
          status
        },
        coursesList: selectedCourses.map(course => get(course, 'key')),
        videoId: get(editData, 'id'),
        videoFile,
        thumbnailFile,
        subTitleFile
      }).then(async res => {
        if (res.updateVideo && res.updateVideo.id) {
          closeModal()
        }
      })
    }
  }
  render() {
    const { openModal, closeModal, operation, editData,
      coursesList, videoAddStatus, videosUpdateStatus } = this.props
    const spinning = operation === 'add' ? videoAddStatus && get(videoAddStatus.toJS(), 'loading', false)
      : videosUpdateStatus && get(videosUpdateStatus.toJS(), 'loading', false)
    return (
      <MainModal
        visible={openModal}
        title={operation === 'add' ? 'Add Video' : 'Edit Video'}
        onCancel={() => (videoAddStatus && get(videoAddStatus.toJS(), 'loading')
        || videosUpdateStatus && get(videosUpdateStatus.toJS(), 'loading')) ? null : closeModal()}
        maskClosable={false}
        width='750px'
        centered
        destroyOnClose
        footer={null}
      >
        <Spin spinning={Boolean(spinning)}>
          {
          operation === 'add' ? (
            <AddVideoForm
              addFormData={{ ...this.state }}
              handleAddVideo={this.handleAddVideo}
              coursesList={coursesList}
              videoAddStatus={videoAddStatus}
            />
          ) : (
            <EditVideoForm
              editFormData={editData}
              handleEditVideo={this.handleEditVideo}
              coursesList={coursesList}
              videosUpdateStatus={videosUpdateStatus}
            />
          )
        }
        </Spin>
      </MainModal>
    )
  }
}

export default VideoModal
