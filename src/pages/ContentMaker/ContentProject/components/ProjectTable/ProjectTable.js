import { notification, Popconfirm } from 'antd'
import { get, sortBy } from 'lodash'
import moment from 'moment'
import React from 'react'
import { deleteContentProject } from '../../../../../actions/contentMaker'
import MainTable from '../../../../../components/MainTable'
import { PROJECT } from '../../../../../constants/CourseComponents'
import { getFailureStatus, getSuccessStatus } from '../../../../../utils/data-utils'
import parseChatStatement from '../../../../../utils/parseStatement'
import AssignModal from '../../../AssignModal'
import AssignedView from '../../../AssignModal/AssignedView'
import { MDTable } from '../../ContentProject.styles'
import ProjectView from './ProjectView'
import PublishSwitcher from './PublishSwitcher'

class ProjectTable extends React.Component {
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
    const { projectsFetchingStatus, projectAddStatus,
      projectUpdateStatus, projectUpdateFailure,
      projectDeleteStatus, projectDeleteFailure,
      fetchCounts, projectAddFailure } = this.props
    if (getSuccessStatus(projectsFetchingStatus, prevProps.projectsFetchingStatus)) {
      this.convertDataToTable()
    }
    if (getSuccessStatus(projectAddStatus, prevProps.projectAddStatus)) {
      this.convertDataToTable()
      fetchCounts()
      notification.success({
        message: 'Project added successfully'
      })
    } else if (projectAddStatus && !get(projectAddStatus.toJS(), 'loading')
      && get(projectAddStatus.toJS(), 'failure') &&
      (prevProps.projectAddFailure !== projectAddFailure)) {
      if (projectAddFailure && projectAddFailure.toJS().length > 0) {
        notification.error({
          message: get(get(projectAddFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }

    if (getSuccessStatus(projectUpdateStatus, prevProps.projectUpdateStatus)) {
      this.convertDataToTable()
      notification.success({
        message: 'Project updated successfully'
      })
    } else {
      getFailureStatus(projectUpdateStatus,
        projectUpdateFailure, prevProps.projectUpdateFailure)
    }
    if (getSuccessStatus(projectDeleteStatus, prevProps.projectDeleteStatus)) {
      notification.success({
        message: 'Project deleted successfully'
      })
      fetchCounts()
      this.convertDataToTable()
    } else {
      getFailureStatus(projectDeleteStatus,
        projectDeleteFailure, prevProps.projectDeleteFailure)
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
    const { opneEditModal, blockBasedProjects,
      selectedCourse, selectedOption, searchKey, selectedTopic } = this.props
    let projectsData = blockBasedProjects &&
        blockBasedProjects.toJS() ? this.props.blockBasedProjects.toJS() : []
    if (searchKey === 'course' && selectedCourse) {
      projectsData = projectsData.filter(project =>
        get(project, 'courses', []).map(course => course.id).includes(selectedCourse))
    } else if (searchKey === 'topic' && selectedTopic) {
      projectsData = projectsData.filter(project =>
        get(project, 'topics', []).map(topic => topic.id).includes(selectedTopic))
    } else if (selectedOption === 'UnAllocated Project') {
      projectsData = projectsData.filter(project => get(project, 'courses', []).length === 0)
    } else if (selectedOption === 'UnAllocated topics') {
      projectsData = projectsData.filter(project => get(project, 'topics', []).length === 0)
    }
    this.setState({
      tableData: sortBy(projectsData, 'createdAt').reverse()
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
            title: 'Project Name & Thumbnail',
            dataIndex: 'title',
            key: 'title',
            align: 'center',
            width: 200,
            render: (_, record) => <ProjectView record={record} type='title' />
          },
          {
            title: 'Project Description',
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
            render: (_, record) => <ProjectView record={record} type='platform' />
          },
          {
            title: 'Difficulty',
            dataIndex: 'difficulty',
            key: 'difficulty',
            align: 'center',
            width: 200,
            render: (_, record) => <ProjectView record={record} type='difficulty' />
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
            render: (_, record) => <ProjectView record={record} type='externalPlatformLink' />
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
                  title='Do you want to delete this Project ?'
                  placement='topRight'
                  onConfirm={async () => { await deleteContentProject({ projectId: id, key: 'project' }) }}
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
    const { projectsFetchingStatus, projectUpdateStatus,
      coursesList, coursesFetchStatus, tableLoading } = this.props
    return (
      <>
        <AssignModal
          openAssignModal={openAssignModal}
          assignModalData={assignModalData}
          coursesList={coursesList}
          saveLoading={projectUpdateStatus && get(projectUpdateStatus.toJS(), 'loading')}
          coursesFetchStatus={coursesFetchStatus && get(coursesFetchStatus.toJS(), 'loading')}
          componentName={PROJECT}
          onCloseAssignModal={this.onCloseAssignModal}
        />
        <MDTable
          columns={columns}
          dataSource={tableData}
          loading={tableLoading && projectsFetchingStatus && get(projectsFetchingStatus.toJS(), 'loading')}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </>
    )
  }
}

export default ProjectTable
