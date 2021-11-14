import React from 'react'
import { get } from 'lodash'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'
import ApprovedCodeTagsStyle from '../ApprovedCodeTags.style'
import TableActions from './MDTableColumns/TableActions'

class MDTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: []
    }
  }

  componentDidMount = () => {
    this.setTableData()
  };

  componentDidUpdate = (prevProps) => {
    const { isUserApprovedCodeTagsFetched, isUserApprovedCodeTagsFetching,
      isContentTagsFetched, isContentTagsFetching, tagType } = this.props
    if (tagType === 'Approved Tags') {
      if (!isUserApprovedCodeTagsFetching && isUserApprovedCodeTagsFetched) {
        if (
          get(prevProps, 'userApprovedCodeTags') !== get(this.props, 'userApprovedCodeTags')
        ) {
          this.setTableData()
        }
      }
    } else if (tagType === 'Content Tags') {
      if (!isContentTagsFetching && isContentTagsFetched) {
        if (
          get(prevProps, 'contentTags') !== get(this.props, 'contentTags')
        ) {
          this.setTableData()
        }
      }
    }
  };

  setTableData = () => {
    let data
    const { tagType } = this.props
    if (tagType === 'Approved Tags') {
      data = this.props.userApprovedCodeTags &&
        this.props.userApprovedCodeTags.toJS()
    } else {
      data = this.props.contentTags && this.props.contentTags.toJS()
    }
    let columns = []
    if (data.length > 0) {
      columns = [
        {
          title: 'Sr.No',
          dataIndex: 'srNo',
          key: 'srNo',
          width: 100,
          align: 'center',
          render: (text, record, index) => index + 1,
        },
        {
          title: 'Tag Name',
          dataIndex: 'title',
          key: 'title',
          width: 200,
          align: 'center',
          render: (title) => (
            <ApprovedCodeTagsStyle.TableContainer>
              {title || '-'}
            </ApprovedCodeTagsStyle.TableContainer>
          ),
        },
        {
          title: 'Tag Count',
          dataIndex: 'codeCount',
          key: 'codeCount',
          width: 150,
          align: 'center'
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          align: 'center',
          width: 150,
          render: (status) =>
            <ApprovedCodeTagsStyle.TableContainer>
              <Tooltip title={status} placement='top'>
                <ApprovedCodeTagsStyle.StatusIcon color={status === 'published' ? '#16d877' : '#d4d4d4'} />
              </Tooltip>
            </ApprovedCodeTagsStyle.TableContainer>
          ,
        },
        {
          title: 'Actions',
          dataIndex: 'id',
          key: 'id',
          align: 'center',
          width: 200,
          render: (id, record) =>
            <TableActions
              TagsDeleteFailure={this.props.TagsDeleteFailure
                && this.props.TagsDeleteFailure}
              TagsDeleteStatus={this.props.TagsDeleteStatus && this.props.TagsDeleteStatus}
              contentTagsDeleteFailure={this.props.contentTagsDeleteFailure
                && this.props.contentTagsDeleteFailure}
              contentTagsDeleteStatus={this.props.contentTagsDeleteStatus
                && this.props.contentTagsDeleteStatus}
              setUpdateTags={this.props.setUpdateTags}
              userApprovedCodeTags={record}
              contentTags={record}
              searchByFilter={this.props.searchByFilter}
              tagType={this.props.tagType}
            />
          ,
        },
        {
          title: 'Preview',
          dataIndex: 'title',
          key: 'title',
          width: 200,
          align: 'center',
          render: (title) => (
            <ApprovedCodeTagsStyle.TableContainer>
              <ApprovedCodeTagsStyle.Tag color='#750000'>
                {title}
              </ApprovedCodeTagsStyle.Tag>
            </ApprovedCodeTagsStyle.TableContainer>
          ),
        }
      ]
      if (tagType === 'Content Tags') {
        columns = columns.filter(({ title }) => title !== 'Tag Count')
      }
    }
    this.setState({
      columns
    })
  };

  render() {
    const { columns } = this.state
    const { userApprovedCodeTags, contentTags, tagType,
      isContentTagsFetching } = this.props
    const isUpdating = this.props.isUserApprovedCodeTagsUpdating &&
        this.props.isUserApprovedCodeTagsUpdating.toJS().loading
    return (
      <>
        <ApprovedCodeTagsStyle.MDTable
          dataSource={tagType === 'Approved Tags' ? userApprovedCodeTags.toJS() : contentTags.toJS()}
          columns={columns}
          loading={
            ((this.props.isUserApprovedCodeTagsFetching &&
              this.props.isUserApprovedCodeTagsFetching) ||
            isUpdating) || (isContentTagsFetching && isContentTagsFetching)
          }
          scroll={{ x: 'max-content' }}
          pagination={false}
          rowClassName={() => 'antdTable-row'}
          rowKey={(record) => record}
        />
      </>
    )
  }
}

MDTable.protoType = {
  userSavedCodes: PropTypes.arrayOf(PropTypes.object),
  isUserApprovedCodeTagsFetched: PropTypes.bool.isRequired,
  isUserApprovedCodeTagsUpdating: PropTypes.bool.isRequired,
  isUserApprovedCodeTagsFetching: PropTypes.bool.isRequired,
}

export default MDTable
