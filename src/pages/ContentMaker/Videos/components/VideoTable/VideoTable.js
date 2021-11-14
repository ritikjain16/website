import { notification } from 'antd'
import { get, sortBy } from 'lodash'
import moment from 'moment'
import React from 'react'
import { VIDEO } from '../../../../../constants/CourseComponents'
import { getSuccessStatus } from '../../../../../utils/data-utils'
import getFullPath from '../../../../../utils/getFullPath'
import AssignModal from '../../../AssignModal'
import AssignedView from '../../../AssignModal/AssignedView'
import { MDTable } from '../../Videos.styles'
import PublishSwitcher from './PublishSwitcher'
import TableAction from './TableAction'

class VideoTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tableData: [],
      columns: [],
      openAssignModal: false,
      assignModalData: null
    }
  }
  componentDidUpdate = (prevProps) => {
    const { videosFetchingStatus, videoAddStatus,
      videosUpdateStatus, videosUpdateFailure,
      videoDeleteStatus, videoDeleteFailure,
      videoAddFailure, fetchVideoCount } = this.props
    if (getSuccessStatus(videosFetchingStatus, prevProps.videosFetchingStatus)) {
      this.convertDataToTable()
    }

    if (getSuccessStatus(videoAddStatus, prevProps.videoAddStatus)) {
      this.convertDataToTable()
      fetchVideoCount()
      notification.success({
        message: 'Video added successfully'
      })
    } else if (videoAddStatus && !get(videoAddStatus.toJS(), 'loading')
      && get(videoAddStatus.toJS(), 'failure') &&
      (prevProps.videoAddFailure !== videoAddFailure)) {
      if (videoAddFailure && videoAddFailure.toJS().length > 0) {
        const errors = videoAddFailure.toJS().pop()
        if (get(get(errors, 'error').errors[0], 'message').split(':')[0] ===
          'E11000 duplicate key error collection') {
          notification.error({
            message: 'Video with similar title/description already exist.'
          })
        } else {
          notification.error({
            message: get(get(errors, 'error').errors[0], 'message').split(':')[0]
          })
        }
      }
    }

    if (getSuccessStatus(videosUpdateStatus, prevProps.videosUpdateStatus)) {
      this.convertDataToTable()
      notification.success({
        message: 'Video updated successfully'
      })
    } else if (videosUpdateStatus && !get(videosUpdateStatus.toJS(), 'loading')
      && get(videosUpdateStatus.toJS(), 'failure') &&
      (prevProps.videosUpdateFailure !== videosUpdateFailure)) {
      if (videosUpdateFailure && videosUpdateFailure.toJS().length > 0) {
        const errors = videosUpdateFailure.toJS().pop()
        if (get(get(errors, 'error').errors[0], 'message').split(':')[0] ===
          'E11000 duplicate key error collection') {
          notification.error({
            message: 'Video with similar title/description already exist.'
          })
        } else {
          notification.error({
            message: get(get(errors, 'error').errors[0], 'message').split(':')[0]
          })
        }
      }
    }

    if (getSuccessStatus(videoDeleteStatus, prevProps.videoDeleteStatus)) {
      notification.success({
        message: 'Video deleted successfully'
      })
      fetchVideoCount()
      this.convertDataToTable()
    } else if (videoDeleteStatus && !get(videoDeleteStatus.toJS(), 'loading')
      && get(videoDeleteStatus.toJS(), 'failure') &&
      (prevProps.videoDeleteFailure !== videoDeleteFailure)) {
      if (videoDeleteFailure && videoDeleteFailure.toJS().length > 0) {
        const errors = videoDeleteFailure.toJS().pop()
        if (get(get(errors, 'error').errors[0], 'message').split(':')[0] ===
          'E11000 duplicate key error collection') {
          notification.error({
            message: 'Video with similar title/description already exist.'
          })
        } else {
          notification.error({
            message: get(get(errors, 'error').errors[0], 'message').split(':')[0]
          })
        }
      }
    }
  }

  onOpenAssignModal = (data) => {
    this.setState({
      assignModalData: data,
      openAssignModal: true
    })
  }

  onCloseAssignModal = () => {
    this.setState({
      assignModalData: null,
      openAssignModal: false
    })
  }
  convertDataToTable = () => {
    const { videoData, selectedCourse, searchKey, selectedTopic } = this.props
    const videosArray = videoData && videoData.toJS() ? videoData.toJS() : []
    let newVideoData = []
    if (videosArray && videosArray.length > 0) {
      videosArray.forEach((video, i) => {
        newVideoData.push({
          index: i + 1,
          ...video,
          title: get(video, 'title') || '-',
          description: get(video, 'description') || '-',
          storyStartTime: get(video, 'storyStartTime') || '-',
          storyEndTime: get(video, 'storyEndTime') || '-',
          videoStartTime: get(video, 'videoStartTime') || '-',
          videoEndTime: get(video, 'videoEndTime') || '-',
        })
      })
    }
    if (searchKey === 'course' && selectedCourse) {
      newVideoData = newVideoData.filter(video =>
        get(video, 'courses', []).map(course => course.id).includes(selectedCourse))
    } else if (searchKey === 'topic' && selectedTopic) {
      newVideoData = newVideoData.filter(video =>
        get(video, 'topics', []).map(topic => topic.id).includes(selectedTopic))
    }
    this.setState({
      tableData: sortBy(newVideoData, 'createdAt').reverse()
    }, () => {
      let columns = []
      if (this.state.tableData.length > 0) {
        columns = [
          {
            title: 'Sr No.',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            width: 100,
            render: (index) => <p>{index}</p>
          },
          {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            align: 'center',
            width: 200
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            align: 'center',
            width: 200
          },
          {
            title: 'Thumbnail',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            align: 'center',
            width: 200,
            render: (thumbnail) => thumbnail ? (
              <img
                src={getFullPath(get(thumbnail, 'uri'))}
                alt='thumbnail'
                style={{ width: '150px', objectFit: 'contain' }}
              />
            ) : ('-')
          },
          {
            title: 'Story Start Time',
            dataIndex: 'storyStartTime',
            key: 'storyStartTime',
            align: 'center',
            width: 200
          },
          {
            title: 'Story End Time',
            dataIndex: 'storyEndTime',
            key: 'storyEndTime',
            align: 'center',
            width: 200
          },
          {
            title: 'Video Start Time',
            dataIndex: 'videoStartTime',
            key: 'videoStartTime',
            align: 'center',
            width: 200
          },
          {
            title: 'Video End Time',
            dataIndex: 'videoEndTime',
            key: 'videoEndTime',
            align: 'center',
            width: 200
          },
          {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            width: 200,
            render: (createdAt) => moment(createdAt).format('ll')
          },
          {
            title: 'Assign Course & Topic',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: 400,
            render: (_, record) => (
              <AssignedView record={record} onAssignClick={() => this.onOpenAssignModal(record)} />
            )
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status, record) => (
              <PublishSwitcher status={status}
                videoId={record.id}
              />
            )
          },
          {
            title: 'Actions',
            dataIndex: 'id',
            key: 'id',
            render: (id, record) => (
              <TableAction
                id={id}
                record={record}
                openEditModal={this.props.openEditModal}
              />
            )
          }
        ]
        this.setState({
          columns
        })
      }
    })
  }
  render() {
    const { columns, tableData, openAssignModal, assignModalData } = this.state
    const { coursesList, videosUpdateStatus, coursesFetchStatus } = this.props
    return (
      <>
        <AssignModal
          openAssignModal={openAssignModal}
          assignModalData={assignModalData}
          coursesList={coursesList}
          saveLoading={videosUpdateStatus && get(videosUpdateStatus.toJS(), 'loading')}
          coursesFetchStatus={coursesFetchStatus && get(coursesFetchStatus.toJS(), 'loading')}
          componentName={VIDEO}
          onCloseAssignModal={this.onCloseAssignModal}
        />
        <MDTable
          columns={columns}
          dataSource={tableData}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </>
    )
  }
}

export default VideoTable
