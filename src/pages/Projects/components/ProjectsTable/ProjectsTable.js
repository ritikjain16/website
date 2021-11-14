import { EyeFilled } from '@ant-design/icons'
import { notification } from 'antd'
import { get, sortBy } from 'lodash'
import moment from 'moment'
import React from 'react'
import { PreviewButton, ProjectTable } from './ProjectTable.style'
import PublishSwitcher from './PublishSwitcher'
import TableAction from './TableAction'

class ProjectsTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [
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
          align: 'center'
        },
        {
          title: 'Created At',
          dataIndex: 'createdAt',
          key: 'createdAt',
          align: 'center',
          render: (createdAt) => moment(createdAt).format('MM-DD-YY'),
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          align: 'center',
          render: (status, record) => (
            <PublishSwitcher status={status}
              projectId={record.id}
            />
          ),
        },
        {
          title: 'Actions',
          dataIndex: 'id',
          key: 'id',
          align: 'center',
          render: (id, record) => (
            <TableAction
              id={id}
              record={record}
              setEditModal={this.props.setEditModal}
            />
          )
        },
        {
          title: 'View',
          dataIndex: 'id',
          key: 'id',
          width: 70,
          render: (id) =>
            <PreviewButton
              onClick={() => this.props.selectProject(id)}
            >
              {this.props.selectedProject && this.props.selectedProject === id ?
                <EyeFilled /> : <EyeFilled style={{ color: 'lightgray' }} />}
            </PreviewButton>
        }
      ],
    }
  }
  componentDidUpdate = (prevProps) => {
    const { projectDeleteStatus, projectDeleteFailure } = this.props
    if (projectDeleteStatus && !get(projectDeleteStatus.toJS(), 'loading')
      && get(projectDeleteStatus.toJS(), 'success') &&
      (prevProps.projectDeleteStatus !== projectDeleteStatus)) {
      notification.success({
        message: 'Project deleted successfully'
      })
    } else if (projectDeleteStatus && !get(projectDeleteStatus.toJS(), 'loading')
      && get(projectDeleteStatus.toJS(), 'failure') &&
      (prevProps.projectDeleteFailure !== projectDeleteFailure)) {
      if (projectDeleteFailure && projectDeleteFailure.toJS().length > 0) {
        notification.error({
          message: get(get(projectDeleteFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
  }
  render() {
    const { isProjectsFetching, projectsData } = this.props
    const { columns } = this.state
    return (
      <ProjectTable
        dataSource={sortBy(projectsData, 'order')}
        columns={columns}
        loading={isProjectsFetching && isProjectsFetching}
        scroll={{ x: 'max-content' }}
        pagination={false}
        style={{ height: '100%' }}
      />
    )
  }
}

export default ProjectsTable
