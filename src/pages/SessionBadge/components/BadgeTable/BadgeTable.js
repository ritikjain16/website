import { notification } from 'antd'
import { get, sortBy } from 'lodash'
import moment from 'moment'
import React from 'react'
import getFullPath from '../../../../utils/getFullPath'
import { MDTable } from '../../SessionBadge.style'
import BadgePublisher from './BadgePublisher'
import BadgeAction from './BadgeAction'

class BadgeTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tableObj: {},
      columns: [],
      childColumn: []
    }
  }
  componentDidUpdate = (prevProps) => {
    const { badgeFetchingStatus, badgeAddStatus,
      badgeUpdateStatus, badgeUpdateFailure,
      badgeDeleteStatus, badgeDeleteFailure } = this.props
    if (badgeFetchingStatus && !get(badgeFetchingStatus.toJS(), 'loading')
      && get(badgeFetchingStatus.toJS(), 'success') &&
      (prevProps.badgeFetchingStatus !== badgeFetchingStatus)) {
      this.convertDataToTable()
    }
    if (badgeAddStatus && !get(badgeAddStatus.toJS(), 'loading')
      && get(badgeAddStatus.toJS(), 'success') &&
      (prevProps.badgeAddStatus !== badgeAddStatus)) {
      this.convertDataToTable()
    }
    if (badgeUpdateStatus && !get(badgeUpdateStatus.toJS(), 'loading')
      && get(badgeUpdateStatus.toJS(), 'success') &&
      (prevProps.badgeUpdateStatus !== badgeUpdateStatus)) {
      this.convertDataToTable()
    } else if (badgeUpdateStatus && !get(badgeUpdateStatus.toJS(), 'loading')
      && get(badgeUpdateStatus.toJS(), 'failure') &&
      (prevProps.badgeUpdateFailure !== badgeUpdateFailure)) {
      if (badgeUpdateFailure && badgeUpdateFailure.toJS().length > 0) {
        notification.error({
          message: get(get(badgeUpdateFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
    if (badgeDeleteStatus && !get(badgeDeleteStatus.toJS(), 'loading')
      && get(badgeDeleteStatus.toJS(), 'success') &&
      (prevProps.badgeDeleteStatus !== badgeDeleteStatus)) {
      notification.success({
        message: 'Badge deleted successfully'
      })
      this.convertDataToTable()
    } else if (badgeDeleteStatus && !get(badgeDeleteStatus.toJS(), 'loading')
      && get(badgeDeleteStatus.toJS(), 'failure') &&
      (prevProps.badgeDeleteFailure !== badgeDeleteFailure)) {
      if (badgeDeleteFailure && badgeDeleteFailure.toJS().length > 0) {
        notification.error({
          message: get(get(badgeDeleteFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
  }

  convertDataToTable = () => {
    const { topicId, badges, openEditModal } = this.props
    let newBadges = badges && badges.toJS() && badges.toJS().length > 0 ? badges.toJS() : []
    newBadges = newBadges.filter(badge => get(badge, 'topic.id') === topicId)
    const groupByType = newBadges.reduce((accumulator, currentValue) => {
      accumulator[currentValue.type] = accumulator[currentValue.type] || []
      accumulator[currentValue.type].push(currentValue)
      return accumulator
    }, {})
    this.setState({
      tableObj: groupByType
    }, () => {
      let columns = []
      columns = [
        {
          title: 'Order',
          dataIndex: 'order',
          key: 'order',
          align: 'center',
          width: 100,
          render: (text, row) => ({
            props: {
              colSpan: 10
            },
            children: `${row} (${this.state.tableObj[row] && this.state.tableObj[row].length})`
          })
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          width: 200,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          align: 'center',
          width: 200,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Unlock Point',
          dataIndex: 'unlockPoint',
          key: 'unlockPoint',
          align: 'center',
          width: 200,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Active Image',
          dataIndex: 'activeImage',
          key: 'activeImage',
          align: 'center',
          width: 200,
          render: () => ({ props: { colSpan: 0 } }),
        },
        {
          title: 'Inactive Image',
          dataIndex: 'inactiveImage',
          key: 'inactiveImage',
          align: 'center',
          width: 200,
          render: () => ({ props: { colSpan: 0 } }),
        },
        {
          title: 'Created At',
          dataIndex: 'createdAt',
          key: 'createdAt',
          align: 'center',
          width: 200,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          align: 'center',
          width: 100,
          render: () => ({ props: { colSpan: 0 } }),
        },
        {
          title: 'Actions',
          dataIndex: 'id',
          key: 'id',
          width: 200,
          align: 'center',
          render: () => ({ props: { colSpan: 0 } }),
        }
      ]
      const childColumn = [
        {
          title: 'Order',
          dataIndex: 'order',
          key: 'order',
          align: 'center',
          width: 100
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          width: 200
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          align: 'center',
          width: 200,
        },
        {
          title: 'Unlock Point',
          dataIndex: 'unlockPoint',
          key: 'unlockPoint',
          align: 'center',
          width: 200
        },
        {
          title: 'Active Image',
          dataIndex: 'activeImage',
          key: 'activeImage',
          align: 'center',
          width: 200,
          render: (activeImage) => activeImage ? (
            <img
              src={getFullPath(get(activeImage, 'uri'))}
              alt='activeImage'
              style={{ width: '100%', objectFit: 'contain' }}
            />
          ) : ('-')
        },
        {
          title: 'Inactive Image',
          dataIndex: 'inactiveImage',
          key: 'inactiveImage',
          align: 'center',
          width: 200,
          render: (inactiveImage) => inactiveImage ? (
            <img
              src={getFullPath(get(inactiveImage, 'uri'))}
              alt='inactiveImage'
              style={{ width: '100%', objectFit: 'contain' }}
            />
          ) : ('-')
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
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          align: 'center',
          width: 100,
          render: (status, record) => (
            <BadgePublisher status={status}
              badgeId={record.id}
            />
          )
        },
        {
          title: 'Actions',
          dataIndex: 'id',
          key: 'id',
          width: 200,
          align: 'center',
          render: (id, record) => (
            <BadgeAction
              id={id}
              record={record}
              openEditModal={openEditModal}
            />
          )
        }
      ]
      this.setState({
        columns,
        childColumn
      })
    })
  }

  expandedRow = row => {
    const { tableObj, childColumn } = this.state
    return (
      <MDTable
        columns={childColumn}
        dataSource={sortBy(tableObj[row], 'order')}
        pagination={false}
        showHeader={false}
      />
    )
  }
  render() {
    const { columns, tableObj } = this.state
    return (
      <MDTable
        dataSource={
          tableObj && Object.keys(tableObj)
        }
        columns={columns}
        scroll={{ x: 'max-content' }}
        pagination={false}
        defaultExpandAllRows
        expandIconAsCell={false}
        expandedRowRender={this.expandedRow}
        rowKey={record => record}
        expandedRowKeys={tableObj ? Object.keys(tableObj) : []}
        expandIcon={null}
      />
    )
  }
}

export default BadgeTable
