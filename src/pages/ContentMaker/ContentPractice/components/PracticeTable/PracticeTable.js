import { notification, Popconfirm } from 'antd'
import { get, sortBy } from 'lodash'
import moment from 'moment'
import React from 'react'
import { deleteContentProject } from '../../../../../actions/contentMaker'
import MainTable from '../../../../../components/MainTable'
import { PRACTICE } from '../../../../../constants/CourseComponents'
import { getFailureStatus, getSuccessStatus } from '../../../../../utils/data-utils'
import parseChatStatement from '../../../../../utils/parseStatement'
import AssignModal from '../../../AssignModal'
import AssignedView from '../../../AssignModal/AssignedView'
import { MDTable } from '../../ContentPractice.styles'
import PracticeView from './PracticeView'
import PublishSwitcher from './PublishSwitcher'

class PracticeTable extends React.Component {
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
    const { practiceFetchingStatus, practiceAddStatus,
      practiceUpdateStatus, practiceUpdateFailure,
      practiceDeleteStatus, practiceDeleteFailure,
      fetchProjectCount, practiceAddFailure } = this.props
    if (getSuccessStatus(practiceFetchingStatus, prevProps.practiceFetchingStatus)) {
      this.convertDataToTable()
    }

    if (getSuccessStatus(practiceAddStatus, prevProps.practiceAddStatus)) {
      this.convertDataToTable()
      fetchProjectCount()
      notification.success({
        message: 'Practice added successfully'
      })
    } else if (practiceAddStatus && !get(practiceAddStatus.toJS(), 'loading')
      && get(practiceAddStatus.toJS(), 'failure') &&
      (prevProps.practiceAddFailure !== practiceAddFailure)) {
      if (practiceAddFailure && practiceAddFailure.toJS().length > 0) {
        notification.error({
          message: get(get(practiceAddFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }

    if (getSuccessStatus(practiceUpdateStatus, prevProps.practiceUpdateStatus)) {
      notification.success({
        message: 'Practice updated successfully'
      })
      this.convertDataToTable()
    } else {
      getFailureStatus(practiceUpdateStatus, practiceUpdateFailure, prevProps.practiceUpdateFailure)
    }
    if (getSuccessStatus(practiceDeleteStatus, prevProps.practiceDeleteStatus)) {
      notification.success({
        message: 'Practice deleted successfully'
      })
      fetchProjectCount()
      this.convertDataToTable()
    } else {
      getFailureStatus(practiceDeleteStatus,
        practiceDeleteFailure, prevProps.practiceDeleteFailure)
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
    const { opneEditModal, practiceData,
      selectedCourse, searchKey,
      selectedTopic } = this.props
    let practicesData = practiceData && practiceData.toJS()
      ? practiceData.toJS() : []
    if (searchKey === 'course' && selectedCourse) {
      practicesData = practicesData.filter(practice =>
        get(practice, 'courses', []).map(course => course.id).includes(selectedCourse))
    } else if (searchKey === 'topic' && selectedTopic) {
      practicesData = practicesData.filter(practice =>
        get(practice, 'topics', []).map(topic => topic.id).includes(selectedTopic))
    }
    this.setState({
      tableData: sortBy(practicesData, 'createdAt').reverse()
    }, () => {
      let columns = []
      const descStyle = { height: '150px', overflow: 'auto' }
      if (this.state.tableData.length > 0) {
        columns = [
          {
            title: 'Order',
            dataIndex: 'order',
            key: 'order',
            align: 'center',
          },
          {
            title: 'Practice Name',
            dataIndex: 'title',
            key: 'title',
            align: 'center',
            width: 200,
          },
          {
            title: 'Practice Description',
            dataIndex: 'projectDescription',
            key: 'projectDescription',
            align: 'center',
            width: 400,
            render: (projectDescription) => (
              <div style={descStyle}>
                {parseChatStatement({ statement: projectDescription || '' })}
              </div>
            )
          },
          {
            title: 'Platform Thumbnail',
            dataIndex: 'title',
            key: 'title',
            align: 'center',
            width: 200,
            render: (_, record) => <PracticeView record={record} type='platform' />
          },
          {
            title: 'Create Description',
            dataIndex: 'projectCreationDescription',
            key: 'projectCreationDescription',
            align: 'center',
            width: 200,
            render: (projectCreationDescription) => (
              <div style={descStyle}>
                {parseChatStatement({ statement: projectCreationDescription || '' })}
              </div>
            )
          },
          {
            title: 'Create Link',
            dataIndex: 'externalPlatformLink',
            key: 'externalPlatformLink',
            align: 'center',
            render: (_, record) => <PracticeView record={record} type='externalPlatformLink' />
          },
          {
            title: 'Submit Description',
            dataIndex: 'answerDescription',
            key: 'answerDescription',
            align: 'center',
            width: 200,
            render: (answerDescription) => (
              <div style={descStyle}>
                {parseChatStatement({ statement: answerDescription || '' })}
              </div>
            )
          },
          {
            title: 'Is Submit Answer',
            dataIndex: 'isSubmitAnswer',
            key: 'isSubmitAnswer',
            align: 'center',
            width: 200,
            render: (isSubmitAnswer) => isSubmitAnswer === true ? 'Yes' : 'No'
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
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            width: 150,
            render: (createdAt) => moment(createdAt).format('ll')
          },
          {
            title: 'Publish Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status, record) => (
              <PublishSwitcher status={status}
                projectId={record.id}
              />
            )
          },
          {
            title: 'Edit',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            render: (_, record) => (
              <MainTable.ActionItem.IconWrapper>
                <MainTable.ActionItem.EditIcon onClick={() => opneEditModal(record)} />
              </MainTable.ActionItem.IconWrapper>
            )
          },
          {
            title: 'Delete',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            render: (id) => (
              <MainTable.ActionItem.IconWrapper>
                <Popconfirm
                  title='Do you want to delete this Practice ?'
                  placement='topRight'
                  onConfirm={async () => { await deleteContentProject({ projectId: id, key: 'practice' }) }}
                  okText='Yes'
                  cancelText='Cancel'
                  key='delete'
                  overlayClassName='popconfirm-overlay-primary'
                >
                  <MainTable.ActionItem.IconWrapper>
                    <MainTable.ActionItem.DeleteIcon />
                  </MainTable.ActionItem.IconWrapper>
                </Popconfirm>
              </MainTable.ActionItem.IconWrapper>
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
    const { practiceFetchingStatus, practiceUpdateStatus,
      coursesList, coursesFetchStatus, tableLoading } = this.props
    return (
      <>
        <AssignModal
          openAssignModal={openAssignModal}
          assignModalData={assignModalData}
          coursesList={coursesList}
          saveLoading={practiceUpdateStatus && get(practiceUpdateStatus.toJS(), 'loading')}
          coursesFetchStatus={coursesFetchStatus && get(coursesFetchStatus.toJS(), 'loading')}
          componentName={PRACTICE}
          onCloseAssignModal={this.onCloseAssignModal}
        />
        <MDTable
          columns={columns}
          dataSource={tableData}
          loading={tableLoading && practiceFetchingStatus && get(practiceFetchingStatus.toJS(), 'loading')}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </>
    )
  }
}

export default PracticeTable
