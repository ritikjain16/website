import { notification } from 'antd'
import { get, sortBy } from 'lodash'
import moment from 'moment'
import React from 'react'
import parseStatement from '../../../../utils/parseStatement'
import WorkbookStyle from '../../Workbook.style'
import PublishSwitcher from './PublishSwitcher'
import TableAction from './TableAction'

class WorkbookTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tableData: [],
      columns: [],
      TagColors: ['#750000', '#e97c7c', '#d55cdf']
    }
  }
  componentDidUpdate = (prevProps) => {
    const { isWorkbookFetching, isWorkbookFetched,
      workbookUpdateStatus, workbookUpdateFailure,
      workbookDeleteStatus, workbookDeleteFailure } = this.props
    if (!isWorkbookFetching && isWorkbookFetched) {
      if (
        get(prevProps, 'workbooks') !== get(this.props, 'workbooks')
      ) {
        this.createTableFromData()
      }
    }
    if (workbookUpdateStatus && !get(workbookUpdateStatus.toJS(), 'loading')
      && get(workbookUpdateStatus.toJS(), 'success') &&
      (prevProps.workbookUpdateStatus !== workbookUpdateStatus)) {
      notification.success({
        message: 'Workbook updated successfully'
      })
    } else if (workbookUpdateStatus && !get(workbookUpdateStatus.toJS(), 'loading')
      && get(workbookUpdateStatus.toJS(), 'failure') &&
      (prevProps.workbookUpdateFailure !== workbookUpdateFailure)) {
      if (workbookUpdateFailure && workbookUpdateFailure.toJS().length > 0) {
        notification.error({
          message: get(get(workbookUpdateFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
    if (workbookDeleteStatus && !get(workbookDeleteStatus.toJS(), 'loading')
      && get(workbookDeleteStatus.toJS(), 'success') &&
      (prevProps.workbookDeleteStatus !== workbookDeleteStatus)) {
      notification.success({
        message: 'Workbook deleted successfully'
      })
    } else if (workbookDeleteStatus && !get(workbookDeleteStatus.toJS(), 'loading')
      && get(workbookDeleteStatus.toJS(), 'failure') &&
      (prevProps.workbookDeleteFailure !== workbookDeleteFailure)) {
      if (workbookDeleteFailure && workbookDeleteFailure.toJS().length > 0) {
        notification.error({
          message: get(get(workbookDeleteFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
  }
  createTableFromData = () => {
    const data = this.props.workbooks && this.props.workbooks.toJS()
    this.setState(
      {
        tableData: sortBy(data, 'order'),
      },
      () => {
        this.setTableHeader()
        this.props.setCount(this.state.tableData.length)
      }
    )
  }
  setTableHeader = () => {
    const data = this.props.workbooks && this.props.workbooks.toJS()
    let columns = []
    if (data.length > 0) {
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
          render: (title) => parseStatement({ statement: title })
        },
        {
          title: 'Statement',
          dataIndex: 'statement',
          key: 'statement',
          align: 'center',
          render: (statement) => parseStatement({ statement })
        },
        {
          title: 'Difficulty level',
          dataIndex: 'difficulty',
          key: 'difficulty',
          align: 'center',
        },
        {
          title: 'Tags',
          dataIndex: 'tags',
          key: 'tags',
          align: 'center',
          render: (tags) => (
            <WorkbookStyle.TopContainer style={{ justifyContent: 'flex-start', padding: '0 30px' }}>
              {
                tags && tags.length > 0 ? tags.slice(0, 3).map(({ id, title }, i) => (
                  <WorkbookStyle.Tag key={id} color={this.state.TagColors[i]} >
                    {title}
                  </WorkbookStyle.Tag>
                )) : <p style={{ textAlign: 'center', width: '100%' }}>-</p>
              }
            </WorkbookStyle.TopContainer>
          )
        },
        {
          title: 'Created At',
          dataIndex: 'createdAt',
          key: 'createdAt',
          align: 'center',
          render: (createdAt) => moment(createdAt).format('MM-DD-YY HH-MM-SS')
        },
        {
          title: 'Publish Status',
          dataIndex: 'status',
          key: 'status',
          align: 'center',
          render: (status, record) => (
            <PublishSwitcher status={status}
              workbookId={record.id}
              searchByFilter={this.props.searchByFilter}
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
    }
    this.setState({
      columns,
    })
  }
  render() {
    const { tableData, columns } = this.state
    const { isWorkbookFetching } = this.props
    return (
      <WorkbookStyle.MDTable
        dataSource={tableData}
        columns={columns}
        loading={isWorkbookFetching && isWorkbookFetching}
        scroll={{ x: 'max-content' }}
        pagination={false}
      />
    )
  }
}

export default WorkbookTable
