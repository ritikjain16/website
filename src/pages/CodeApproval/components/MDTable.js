import React from 'react'
import { get } from 'lodash'
import moment from 'moment'
import { Tooltip, Typography, Button, Select } from 'antd'
import PropTypes from 'prop-types'
import { MENTOR } from '../../../constants/roles'
import updateStudentProfile from '../../../actions/userSavedCodes/updateStudentProfile'
import getDataFromLocalStorage from '../../../utils/extract-from-localStorage'
import colors from '../../../constants/colors'
import MainTable from '../../../components/MainTable'
import CodeApprovalStyle from '../CodeApproval.style'
import ApprovalToggle from './MDTableColumns/ApprovalToggle'
import TableActions from './MDTableColumns/TableActions'

const { Option } = Select

const profileAvatars = ['theo', 'zog', 'tyra', 'erby', 'zo', 'ozzy', 'auli']
class MDTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tableObj: {},
      childColumns: [],
      columns: [],
      TagColors: ['#750000', '#e97c7c', '#d55cdf']
    }
  }

  componentDidMount = () => {
    this.converDataForTable()
  }

  componentDidUpdate = (prevProps) => {
    const { isUserSavedCodeFetched, isUserSavedCodeFetching } = this.props
    if (!isUserSavedCodeFetching && isUserSavedCodeFetched) {
      if (get(prevProps, 'userSavedCodes') !== get(this.props, 'userSavedCodes')) {
        this.converDataForTable()
      }
    }
  }

  changeStudentProfileAvatar = async (studentProfileId, value) => {
    const input = {
      profileAvatarCode: value
    }
    await updateStudentProfile(studentProfileId, input)
    await this.props.searchByFilter(true)
  }

  converDataForTable = () => {
    const userSavedCodes = this.props.userSavedCodes && this.props.userSavedCodes.toJS()
    this.setState(
      {
        tableObj: {}
      },
      () => {
        const { tableObj } = this.state
        userSavedCodes.forEach(savedCode => {
          const savedCodeCreatedAt = moment(get(savedCode, 'createdAt')).format('DD-MM-YYYY')
          if (tableObj && tableObj[savedCodeCreatedAt]) {
            tableObj[savedCodeCreatedAt].push(savedCode)
            tableObj[savedCodeCreatedAt] = tableObj[savedCodeCreatedAt]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          } else {
            tableObj[savedCodeCreatedAt] = [savedCode]
          }
        })
        this.setState({
          tableObj
        })
        this.setTableData()
      }
    )
  }

  setTableData = () => {
    let columns = []
    let childColumns = []
    const isMentorLoggedIn = getDataFromLocalStorage('login.role') === MENTOR
    if (Object.keys(this.state.tableObj).length > 0) {
      columns = [
        {
          title: 'Sr.No',
          dataIndex: 'srNo',
          key: 'srNo',
          width: 100,
          align: 'center',
          render: (text, row) => ({
            props: {
              colSpan: 11
            },
            children: `${row} (${this.state.tableObj[row] && this.state.tableObj[row].length})`
          })
        },
        {
          title: 'Student Name',
          dataIndex: 'studentName',
          key: 'studentName',
          width: 150,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Grade',
          dataIndex: 'grade',
          key: 'grade',
          width: 120,
          align: 'center',
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Code Snippets',
          dataIndex: 'code',
          key: 'code',
          width: 300,
          align: 'center',
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
          width: '150px',
          align: 'center',
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          width: '200px',
          align: 'center',
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Approval',
          dataIndex: 'approval',
          key: 'approval',
          width: this.props.isReviewRequested || isMentorLoggedIn ? 350 : 250,
          align: 'center',
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'actions',
          align: 'center',
          width: 400,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Comments',
          dataIndex: 'rejectionComment',
          key: 'rejectionComment',
          align: 'center',
          width: 200,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Tags',
          dataIndex: 'tags',
          key: 'tags',
          width: 300,
          align: 'center',
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Reaction Count',
          dataIndex: 'reactionCount',
          key: 'reactionCount',
          align: 'center',
          width: 300,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Student Avatar',
          dataIndex: 'profileAvatarCode',
          key: 'profileAvatarCode',
          align: 'center',
          width: 200,
          render: () => ({ props: { colSpan: 0 } })
        },
      ]
      childColumns = [
        {
          title: 'Sr.No',
          dataIndex: 'srNo',
          key: 'srNo',
          width: 100,
          align: 'center',
          render: (text, record, index) => index + 1
        },
        {
          title: 'Student Name',
          dataIndex: 'studentName',
          key: 'studentName',
          width: 150,
          align: 'center'
        },
        {
          title: 'Grade',
          dataIndex: 'grade',
          key: 'grade',
          width: 120,
          align: 'center',
        },
        {
          title: 'Code Snippets',
          dataIndex: 'code',
          key: 'code',
          width: 300,
          align: 'center',
          render: (code) => (
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {code && code.length > 70 ? (
                <Tooltip title={code} placement='left' overlayStyle={{ whiteSpace: 'pre-wrap' }}>
                  <Typography.Text code>{code.substring(0, 60)}...</Typography.Text>
                </Tooltip>
              ) : (
                <Typography.Text code>{code || '-'}</Typography.Text>
              )}
            </div>
          )
        },
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
          width: 150,
          align: 'center',
          render: (title) => (
            <CodeApprovalStyle.TableContainer>
              {title || '-'}
            </CodeApprovalStyle.TableContainer>
          )
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          width: 200,
          align: 'center',
          render: (description) => (
            <CodeApprovalStyle.TableContainer>
              {description || '-'}
            </CodeApprovalStyle.TableContainer>
          )
        },
        {
          title: 'Approval',
          dataIndex: 'isApprovedForDisplay',
          key: 'isApprovedForDisplay',
          width: this.props.isReviewRequested || isMentorLoggedIn ? 350 : 250,
          align: 'center',
          render: (isApprovedForDisplay, record) => (
            <ApprovalToggle
              isMentorLoggedIn={isMentorLoggedIn}
              openCommentsModal={this.props.openCommentsModal}
              isReviewRequested={this.props.isReviewRequested}
              isApprovedForDisplay={isApprovedForDisplay}
              isUserSavedCodeUpdating={this.props.isUserSavedCodeUpdating}
              userSavedCode={record}
            />
          )
        },
        {
          title: 'Action',
          dataIndex: 'userApprovedCode',
          key: 'userApprovedCode',
          align: 'center',
          width: 400,
          render: (userApprovedCode, record) => (
            <TableActions
              history={this.props.history}
              openEditModal={this.props.openEditModal}
              userSavedCode={record}
              userApprovedCode={userApprovedCode}
              userSavedCodeId={record.id}
              userSavedCodeStatus={this.props.isUserSavedCodeUpdating
                && this.props.isUserSavedCodeUpdating.toJS()}
              userApprovedCodeStatus={this.props.isUserApprovedCodeUpdating
                && this.props.isUserApprovedCodeUpdating.toJS()}
              isApprovedForDisplay={record.isApprovedForDisplay}
              filterQuery={this.props.filterQuery}
              searchByFilter={this.props.searchByFilter}
            />
          )
        },
        {
          title: 'Comments',
          dataIndex: 'rejectionComment',
          key: 'rejectionComment',
          align: 'center',
          width: 200,
          render: (rejectionComment, record) => (
            <CodeApprovalStyle.TableContainer>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {rejectionComment && rejectionComment.length > 20 ? (
                  <Tooltip title={rejectionComment} placement='left' overlayStyle={{ whiteSpace: 'pre-wrap' }}>
                    <Typography.Text>{rejectionComment.substring(0, 20)}...</Typography.Text>
                  </Tooltip>
                ) : (
                  <Typography.Text>{rejectionComment || '-'}</Typography.Text>
                )}
              </div>
              {(rejectionComment && !isMentorLoggedIn) && (
                <MainTable.ActionItem.IconWrapper>
                  <Button type='link'
                    onClick={() => this.props.openCommentsModal(record)}
                    disabled={rejectionComment === null || rejectionComment === ''}
                  >
                    <MainTable.ActionItem.EditIcon
                      style={{ color: `${colors.table.editIcon}` }}
                    />
                  </Button>
                </MainTable.ActionItem.IconWrapper>
              )}
            </CodeApprovalStyle.TableContainer>
          )
        },
        {
          title: 'Tags',
          dataIndex: 'userApprovedCode.userApprovedCodeTagMappings',
          key: 'id',
          width: 300,
          align: 'center',
          render: (userApprovedCodeTagMappings) => (
            <CodeApprovalStyle.TableContainer>
              {userApprovedCodeTagMappings && userApprovedCodeTagMappings.length ?
                userApprovedCodeTagMappings.slice(0, 3).map((tag, index) => {
                  if (tag.userApprovedCodeTag) {
                    return (
                      <CodeApprovalStyle.Tag color={this.state.TagColors[index]}>
                        {tag.userApprovedCodeTag.title}
                      </CodeApprovalStyle.Tag>
                    )
                  }
                }) : '-'}
            </CodeApprovalStyle.TableContainer>
          )
        },
        {
          title: 'Reaction Count',
          dataIndex: 'userApprovedCode.totalReactionCount',
          key: 'userApprovedCode.totalReactionCount',
          align: 'center',
          width: 300,
          render: (totalReactionCount, record) => (
            <CodeApprovalStyle.TableContainer>
              { record.userApprovedCode && (
                <>
                  <CodeApprovalStyle.StyledReaction>
                    <span role='img' aria-label='heart'>💖</span> {record.userApprovedCode.heartReactionCount}
                  </CodeApprovalStyle.StyledReaction>
                  <CodeApprovalStyle.StyledReaction>
                    <span role='img' aria-label='party'>🎉</span> {record.userApprovedCode.celebrateReactionCount}
                  </CodeApprovalStyle.StyledReaction>
                  <CodeApprovalStyle.StyledReaction>
                    <span role='img' aria-label='fire'>🔥</span> {record.userApprovedCode.hotReactionCount}
                  </CodeApprovalStyle.StyledReaction>
                  <CodeApprovalStyle.StyledReaction>
                    Total : {totalReactionCount}
                  </CodeApprovalStyle.StyledReaction>
                </>
                ) || '-' }
            </CodeApprovalStyle.TableContainer>
          )
        },
        {
          title: 'Student Avatar',
          dataIndex: 'profileAvatarCode',
          key: 'profileAvatarCode',
          align: 'center',
          width: 200,
          render: (profileAvatarCode, record) => (
            <CodeApprovalStyle.TableContainer>
              <Select
                style={{ width: '90%' }}
                value={profileAvatarCode}
                onChange={(value) =>
                  this.changeStudentProfileAvatar(record.studentProfileId, value)}
              >
                {
                profileAvatars.map((option) =>
                  <Option
                    key={option}
                    value={option}
                  >{option}
                  </Option>
                )
              }
              </Select>
            </CodeApprovalStyle.TableContainer>
          )
        },
      ]
    }
    this.setState({
      columns,
      childColumns
    })
  }

  expandedRow = row => {
    const { tableObj, childColumns } = this.state
    return (
      <CodeApprovalStyle.MDTable
        bordered
        columns={childColumns}
        dataSource={tableObj[row]}
        pagination={false}
        showHeader={false}
        rowClassName={() => 'antdTable-row antdTable-child-row'}
      />
    )
  }

  render() {
    const {
      columns,
      tableObj } = this.state
    const isUpdating = this.props.isUserSavedCodeUpdating &&
      this.props.isUserSavedCodeUpdating.toJS().loading ||
      this.props.isUserApprovedCodeUpdating &&
      this.props.isUserApprovedCodeUpdating.toJS().loading
    return (
      <>
        <CodeApprovalStyle.MDTable
          dataSource={
            tableObj && Object.keys(tableObj).sort(
              (a, b) => moment(a, 'DD-MM-YYYY').diff(moment(b, 'DD-MM-YYYY')) * -1
            )
          }
          columns={columns}
          loading={
            (this.props.isUserSavedCodeFetching
              && this.props.isUserSavedCodeFetching) || isUpdating
          }
          scroll={{ x: 'max-content' }}
          pagination={false}
          rowClassName={() => 'antdTable-row'}
          defaultExpandAllRows={!false}
          expandIconAsCell={false}
          expandedRowRender={this.expandedRow}
          rowKey={record => record}
          expandedRowKeys={tableObj ? Object.keys(tableObj) : []}
          expandIcon={null}
        />
      </>
    )
  }
}

MDTable.protoType = {
  userSavedCodes: PropTypes.arrayOf(PropTypes.object),
  isUserSavedCodeFetched: PropTypes.bool.isRequired,
  isUserSavedCodeUpdating: PropTypes.bool.isRequired,
  isUserApprovedCodeUpdating: PropTypes.bool.isRequired,
  isUserSavedCodeFetching: PropTypes.bool.isRequired,
}

export default MDTable
