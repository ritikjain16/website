import { notification } from 'antd'
import { get, sortBy } from 'lodash'
import moment from 'moment'
import React from 'react'
import { LEARNING_OBJECTIVE } from '../../../../../constants/CourseComponents'
import { getFailureStatus, getSuccessStatus } from '../../../../../utils/data-utils'
import AssignModal from '../../../AssignModal'
import AssignedView from '../../../AssignModal/AssignedView'
import { MDTable } from '../../ContentLearningObjective.styles'
import LoComponent from './LoComponent'
import PublishSwitcher from './PublishSwitcher'
import TableAction from './TableAction'

class LoTable extends React.Component {
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
    const { learningObectiveFetchingStatus, learningObectiveAddStatus,
      learningObectiveUpdateStatus, learningObjectiveUpdateFailure,
      learningObectiveDeleteStatus, learningObectiveDeleteFailure,
      learningObectiveAddFailure, fetchLOCountValue } = this.props
    if (getSuccessStatus(learningObectiveFetchingStatus,
      prevProps.learningObectiveFetchingStatus)) {
      this.convertDataToTable()
    }

    if (getSuccessStatus(learningObectiveAddStatus, prevProps.learningObectiveAddStatus)) {
      this.convertDataToTable()
      notification.success({
        message: 'Lo added successfully'
      })
      fetchLOCountValue()
    } else if (learningObectiveAddStatus && !get(learningObectiveAddStatus.toJS(), 'loading')
      && get(learningObectiveAddStatus.toJS(), 'failure') &&
      (prevProps.learningObectiveAddFailure !== learningObectiveAddFailure)) {
      if (learningObectiveAddFailure && learningObectiveAddFailure.toJS().length > 0) {
        const errors = learningObectiveAddFailure.toJS().pop()
        if (get(get(errors, 'error').errors[0], 'message').split(':')[0] ===
          'E11000 duplicate key error collection') {
          notification.error({
            message: 'LO with similar title/Description already exist.'
          })
        } else {
          notification.error({
            message: get(get(errors, 'error').errors[0], 'message')
          })
        }
      }
    }

    if (getSuccessStatus(learningObectiveUpdateStatus, prevProps.learningObectiveUpdateStatus)) {
      this.convertDataToTable()
      notification.success({
        message: 'LO updated successfully'
      })
    } else if (learningObectiveUpdateStatus && !get(learningObectiveUpdateStatus.toJS(), 'loading')
      && get(learningObectiveUpdateStatus.toJS(), 'failure') &&
      (prevProps.learningObjectiveUpdateFailure !== learningObjectiveUpdateFailure)) {
      if (learningObjectiveUpdateFailure && learningObjectiveUpdateFailure.toJS().length > 0) {
        const errors = learningObjectiveUpdateFailure.toJS().pop()
        if (get(get(errors, 'error').errors[0], 'message').split(':')[0] ===
          'E11000 duplicate key error collection') {
          notification.error({
            message: 'LO with similar title/Description already exist.'
          })
        } else {
          notification.error({
            message: get(get(errors, 'error').errors[0], 'message')
          })
        }
      }
    }

    if (getSuccessStatus(learningObectiveDeleteStatus, prevProps.learningObectiveDeleteStatus)) {
      notification.success({
        message: 'LO deleted successfully'
      })
      this.convertDataToTable()
    } else {
      getFailureStatus(learningObectiveDeleteStatus,
        learningObectiveDeleteFailure, prevProps.learningObectiveDeleteFailure)
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
    const { learningObjectiveData, searchKey,
      selectedCourse, selectedTopic } = this.props
    let learningObjective = learningObjectiveData
      && learningObjectiveData.toJS() ? learningObjectiveData.toJS() : []
    if (searchKey === 'course' && selectedCourse) {
      learningObjective = learningObjective.filter(lo =>
        get(lo, 'courses', []).map(course => course.id).includes(selectedCourse) && get(lo, 'order'))
    } else if (searchKey === 'topic' && selectedTopic) {
      learningObjective = learningObjective.filter(lo =>
        get(lo, 'topics', []).map(topic => topic.id).includes(selectedTopic) && get(lo, 'order'))
    }
    this.setState({
      tableData: sortBy(learningObjective, 'createdAt').reverse()
    }, () => {
      let columns = []
      if (this.state.tableData.length > 0) {
        columns = [
          {
            title: 'Order',
            dataIndex: 'order',
            key: 'order',
            align: 'center',
          },
          {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            align: 'center',
            render: (title, data) => <LoComponent data={data} type='title' />
          },
          {
            title: 'Chats',
            dataIndex: 'title',
            key: 'title',
            align: 'left',
            render: (title, data) => <LoComponent data={data} type='chat' />
          },
          {
            title: 'Quiz',
            dataIndex: 'title',
            key: 'title',
            align: 'left',
            render: (title, data) => <LoComponent data={data} type='quiz' />
          },
          {
            title: 'PQ',
            dataIndex: 'title',
            key: 'title',
            align: 'left',
            render: (title, data) => <LoComponent data={data} type='PQ' />
          },
          {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            render: (createdAt) => moment(createdAt).format('MM-DD-YY')
          },
          {
            title: 'Assign Course & Topic',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: 400,
            render: (_, record) => (
              <AssignedView
                record={record}
                onAssignClick={() => this.onOpenAssignModal(record)}
              />
            )
          },
          {
            title: 'Publish Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status, record) => (
              <PublishSwitcher status={status}
                loId={record.id}
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
                fetchLOCountValue={this.props.fetchLOCountValue}
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
    const { learningObectiveFetchingStatus, coursesList,
      learningObectiveUpdateStatus, coursesFetchStatus, tableLoading } = this.props
    return (
      <>
        <AssignModal
          openAssignModal={openAssignModal}
          assignModalData={assignModalData}
          coursesList={coursesList}
          saveLoading={learningObectiveUpdateStatus && get(learningObectiveUpdateStatus.toJS(), 'loading')}
          coursesFetchStatus={coursesFetchStatus && get(coursesFetchStatus.toJS(), 'loading')}
          componentName={LEARNING_OBJECTIVE}
          onCloseAssignModal={this.onCloseAssignModal}
        />
        <MDTable
          columns={columns}
          dataSource={tableData}
          loading={tableLoading && learningObectiveFetchingStatus && get(learningObectiveFetchingStatus.toJS(), 'loading')}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </>
    )
  }
}

export default LoTable
