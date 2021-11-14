import { Button, DatePicker, Icon, Pagination, Popconfirm, Switch, Tooltip } from 'antd'
import { get, sortBy } from 'lodash'
import moment from 'moment'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { updatePreSalesAudit } from '../../../actions/audits'
import fetchPreSalesAudit from '../../../actions/audits/fetchPreSalesAudit'
import fetchUsersDetails from '../../../actions/audits/fetchUsersDetails'
import updateUserAuditStatus from '../../../actions/audits/updateUserAuditStatus'
import MainTable from '../../../components/MainTable'
import { auditType as auditTypeValues } from '../../../constants/auditQuestionConst'
import colors from '../../../constants/colors'
import { AUDITOR, MENTOR, PRE_SALES } from '../../../constants/roles'
import { filterKey } from '../../../utils/data-utils'
import getDataFromLocalStorage from '../../../utils/extract-from-localStorage'
import AssignAuditorModal from '../components/AssignAuditorModal'
import MentorAuditListStyle from '../MentorAuditList.style'
import { PreSalesTable } from './PreSalesAudit.styles'

const { preSales } = auditTypeValues

const flexStyle = { alignItems: 'center', marginBottom: '10px' }

class PreSalesAuditTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fromDate: null,
      toDate: null,
      dateRanges: [
        { label: '1D', subtract: { duration: '0', unit: 'd' } },
        { label: '3D', subtract: { duration: '3', unit: 'd' } },
        { label: '1W', subtract: { duration: '7', unit: 'd' } },
        { label: '2W', subtract: { duration: '14', unit: 'd' } },
        { label: '3W', subtract: { duration: '21', unit: 'd' } },
        { label: '1M', subtract: { duration: '1', unit: 'M' } },
        { label: 'A', subtract: { duration: 'all' } },
      ],
      selectedRange: '{"duration":"3","unit":"d"}',
      tableData: [],
      perPage: 20,
      skip: 0,
      currentPage: 1,
      selectedAuditId: '',
      selectedAuditor: null,
      selectedPreSalesUser: null,
      isAssignAuditorModalVisible: false,
      isAssignPreSalesModalVisible: false,
      showDocumentsWithAuditStatus: false,
      currentUserAuditUpdating: '',
      currentUpdatingAuditVisible: '',
      currentUpdatingAudit: ''
    }
  }
  componentDidMount = () => {
    this.handleDateRange(this.state.selectedRange)
  }

  componentDidUpdate = (prevProps) => {
    const { usersfetchingStatus, preSalesAuditFetchStatus,
      preSalesAuditUpdateStatus, userAuditUpdateStatus } = this.props
    if (usersfetchingStatus && !get(usersfetchingStatus.toJS(), 'loading')
      && get(usersfetchingStatus.toJS(), 'success') &&
      (prevProps.usersfetchingStatus !== usersfetchingStatus)) {
      this.convertDataToTable()
    }
    if (preSalesAuditFetchStatus && !get(preSalesAuditFetchStatus.toJS(), 'loading')
      && get(preSalesAuditFetchStatus.toJS(), 'success') &&
      (prevProps.preSalesAuditFetchStatus !== preSalesAuditFetchStatus)) {
      this.convertDataToTable()
    }
    if (preSalesAuditUpdateStatus && !get(preSalesAuditUpdateStatus.toJS(), 'loading')
      && get(preSalesAuditUpdateStatus.toJS(), 'success') &&
      (prevProps.preSalesAuditUpdateStatus !== preSalesAuditUpdateStatus)) {
      this.convertDataToTable()
    }

    if (userAuditUpdateStatus && !get(userAuditUpdateStatus.toJS(), 'loading')
      && get(userAuditUpdateStatus.toJS(), 'success') &&
      (prevProps.userAuditUpdateStatus !== userAuditUpdateStatus)) {
      this.convertDataToTable()
    }
  }
  clubPreSalesDataToUsers = (preSalesAudits, users) => {
    const usersData = []
    users.forEach(user => {
      const preSalesAudit = preSalesAudits.find(audit => get(audit, 'client.id') === get(user, 'id'))
      usersData.push({
        ...user,
        preSalesAudit
      })
    })
    return usersData
  }
  convertDataToTable = () => {
    const { usersDetails, preSalesAudits } = this.props
    const usersData = usersDetails && usersDetails.toJS() || []
    const preSalesAuditsData = preSalesAudits && preSalesAudits.toJS() || []
    const savedRole = getDataFromLocalStorage('login.role')
    let usersDataWithPreSales = []
    if (savedRole === PRE_SALES || savedRole === AUDITOR) {
      preSalesAuditsData.forEach(preSalesAudit => {
        usersDataWithPreSales.push({
          ...preSalesAudit,
          name: get(preSalesAudit, 'client.name'),
        })
      })
    } else {
      usersDataWithPreSales = this.clubPreSalesDataToUsers(preSalesAuditsData, usersData)
    }
    this.setState({
      tableData: usersDataWithPreSales
    })
  }
  getUserIdAndFetchPreSales = () => {
    const { tableData } = this.state
    const userIds = tableData.map(user => `"${get(user, 'id')}"`)
    fetchPreSalesAudit(userIds)
  }
  isAuditorSameAsLoggedInUser = (auditor) => {
    const loggedInUserId = getDataFromLocalStorage('login.id')
    if (auditor && auditor.id === loggedInUserId) {
      return true
    }
    return false
  }
  renderStartAuditButton = (audit, isAuditAlloted) => {
    const { currentUpdatingAudit, currentUpdatingAuditVisible } = this.state
    if (!this.isAuditorSameAsLoggedInUser(audit.auditor)) {
      return (
        <>
          {get(audit, 'status', 'pending')}
          {!isAuditAlloted && (
            <Link to={`/audit/${preSales}/${audit.id}`}>
              <Tooltip title='View Audit' placement='top'>
                <MainTable.ActionItem.EyeIcon />
              </Tooltip>
            </Link>
          )}
        </>
      )
    }
    return (
      <>
        <Link to={`/audit/${preSales}/${audit.id}`}>
          <Button
            disabled={!audit.auditor}
            type='default'
          >
            <Icon
              type='play-circle'
              theme='filled'
              style={{ paddingRight: '2px', color: 'rgb(100,217,120)' }}
            />
            {get(audit, 'status', 'allotted') === 'allotted' ? 'Start Audit' : 'Continue Audit'}
          </Button>
        </Link>
        {
          get(audit, 'status', 'allotted') === 'started' && (
            <Popconfirm
              title='Do you want to complete this audit ?'
              placement='topRight'
              visible={currentUpdatingAuditVisible === audit.id}
              onCancel={() => this.setState({ currentUpdatingAuditVisible: '' })}
              onConfirm={async () => {
                this.setState({ currentUpdatingAudit: audit.id })
                await updatePreSalesAudit({
                  auditId: audit.id,
                  input: {
                    status: 'completed'
                  }
                })
                this.setState({ currentUpdatingAudit: '', currentUpdatingAuditVisible: '' })
              }}
              okText='Yes'
              cancelText='Cancel'
              key='delete'
              okButtonProps={{
                loading: currentUpdatingAudit === audit.id
              }}
              overlayClassName='popconfirm-overlay-primary'
            >
              <Button
                style={{ marginLeft: '10px' }}
                icon='check'
                onClick={() => this.setState({ currentUpdatingAuditVisible: audit.id })}
              />
            </Popconfirm>
          )
        }
        </>
    )
  }
  renderAuditorRow = (audit, mentorId, isAuditAlloted) => {
    const savedRole = getDataFromLocalStorage('login.role')
    if (!get(audit, 'preSalesUser')) {
      return (
        <Tooltip title='Please assign Pre-Sales user, to assign auditor'>
          <Button
            type='default'
            disabled
          >
        Assign Auditor
          </Button>
        </Tooltip>
      )
    }
    if (audit && audit.auditor) {
      return (
        <MainTable.Item style={{ width: 180, justifyContent: (isAuditAlloted && savedRole !== MENTOR && savedRole !== AUDITOR) && 'space-between' }}>
          <p style={{ width: '70%', textOverflow: 'ellipsis', margin: 0, overflow: 'hidden', whiteSpace: 'nowrap' }}>{get(audit.auditor, 'name')}</p>
          {(isAuditAlloted && savedRole !== MENTOR && savedRole !== AUDITOR) && (
            <MainTable.ActionItem.EditIcon
              style={{ color: `${colors.table.editIcon}` }}
              onClick={() => {
                this.setState({
                    isAssignAuditorModalVisible: true,
                    selectedAuditId: get(audit, 'id'),
                    selectedAuditor: get(audit, 'auditor')
                })
              }}
            />
          )}
        </MainTable.Item>
      )
    }
    if (savedRole === MENTOR || savedRole === PRE_SALES || savedRole === AUDITOR) {
      return '-'
    }
    return (
      <Button
        type='default'
        onClick={() => {
            this.setState({
                isAssignAuditorModalVisible: true,
                selectedAuditId: get(audit, 'id'),
            })
        }}
      >
        Assign Auditor
      </Button>
    )
  }
  getParentDetails = (record) => {
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole === PRE_SALES || savedRole === AUDITOR) {
      return get(record, 'client.studentProfile.parents[0].user.name') || '-'
    }
    return get(record, 'studentProfile.parents[0].user.name') || '-'
  }
  renderPreSalesUser = (record, type) => {
    const savedRole = getDataFromLocalStorage('login.role')
    let isAuditAlloted = false
    let totalScore = 0
    if (savedRole === PRE_SALES || savedRole === AUDITOR) {
      totalScore = get(record, 'totalScore') || 0
    } else {
      totalScore = get(record, 'preSalesAudit.totalScore') || 0
    }
    if (savedRole === PRE_SALES || savedRole === AUDITOR) {
      isAuditAlloted = get(record, 'status') === 'allotted'
    } else {
      isAuditAlloted = get(record, 'preSalesAudit.status') === 'allotted'
    }
    if (type === 'preSalesUser') {
      if ((savedRole === PRE_SALES || savedRole === AUDITOR) && get(record, 'preSalesUser')) {
        return (<p>{get(record, 'preSalesUser.name')}</p>)
      }
      if (savedRole !== PRE_SALES && get(record, 'preSalesAudit.preSalesUser')) {
        return (<p>{get(record, 'preSalesAudit.preSalesUser.name')}</p>)
      }
      if (!get(record, 'isPreSalesAudit') || !get(record, 'preSalesAudit')) {
        return (
          <Tooltip title='toggle preSales Audit to assign user'>
            <Button
              disabled
            >Assign Pre-Sales User
            </Button>
          </Tooltip>
        )
      }
      return (
        <Button
          disabled={savedRole === AUDITOR}
          onClick={() => {
            this.setState({
                isAssignPreSalesModalVisible: true,
                selectedAuditId: get(record, 'preSalesAudit.id'),
            })
        }}
        >Assign Pre-Sales User
        </Button>
      )
    } else if (type === 'auditor') {
      return this.renderAuditorRow(savedRole === PRE_SALES || savedRole === AUDITOR
        ? record : get(record, 'preSalesAudit'), '', isAuditAlloted)
    } else if (type === 'status') {
      if (savedRole === PRE_SALES || savedRole === AUDITOR) {
        return (
          <p>{isAuditAlloted || get(record, 'status') === 'started' ? (
              this.renderStartAuditButton(record, isAuditAlloted)
            ) : 'completed'}
          </p>
        )
      } else if (get(record, 'preSalesAudit')) {
        return (
          <p>{isAuditAlloted || get(record, 'preSalesAudit.status') === 'started' ? (
              this.renderStartAuditButton(get(record, 'preSalesAudit'), isAuditAlloted)
            ) : 'completed'}
          </p>
        )
      } return '-'
    } else if (type === 'isPreSalesAudit') {
      return (
        <Switch
          checked={get(record, 'isPreSalesAudit')}
          disabled={get(record, 'isPreSalesAudit') || savedRole === AUDITOR}
          loading={this.state.currentUserAuditUpdating === get(record, 'id')}
          onChange={checked => {
            this.setState({
              currentUserAuditUpdating: get(record, 'id')
            })
            updateUserAuditStatus({
              userId: get(record, 'id'),
              isPreSalesAudit: checked,
              auditType: preSales
            }).then(() => {
              this.setState({
                currentUserAuditUpdating: ''
              })
              this.getUserIdAndFetchPreSales()
            })
          }}
          size='default'
        />
      )
    } else if (type === 'score') {
      let qualityScore = 0
      if (savedRole === PRE_SALES || savedRole === AUDITOR) {
        qualityScore = get(record, 'score') || 0
      }
      qualityScore = get(record, 'preSalesAudit.score') || 0
      return `${qualityScore}/${totalScore}`
    } else if (type === 'customScore') {
      let customScore = 0
      if (savedRole === PRE_SALES || savedRole === AUDITOR) {
        customScore = get(record, 'customScore') || 0
      }
      customScore = get(record, 'preSalesAudit.customScore') || 0
      return `${customScore}/${totalScore}`
    }
  }
  getTableColumn = () => {
    const column = [
      {
        title: 'Sr. No',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        render: (_, record, index) => index + 1,
        width: 80
      },

      {
        title: 'Student Name',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 150,
      },
      {
        title: 'Pre-SalesUser',
        dataIndex: 'preSalesUser',
        key: 'preSalesUser',
        align: 'center',
        render: (_, record) => this.renderPreSalesUser(record, 'preSalesUser'),
        width: 150
      },
      {
        title: 'Auditor Name',
        dataIndex: 'auditorName',
        key: 'auditorName',
        align: 'center',
        width: 150,
        render: (_, record) => this.renderPreSalesUser(record, 'auditor')
      },
      {
        title: 'Audit Status',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 250,
        render: (_, record) => this.renderPreSalesUser(record, 'status')
      },
      {
        title: 'Parent Name',
        dataIndex: 'parentName',
        key: 'parentName',
        align: 'center',
        width: 150,
        render: (_, record) => this.getParentDetails(record)
      },
      {
        title: 'Custom Score',
        dataIndex: 'score',
        key: 'score',
        align: 'center',
        width: 150,
        render: (_, record) => this.renderPreSalesUser(record, 'customScore')
      },
      {
        title: 'Quality Score',
        dataIndex: 'score',
        key: 'score',
        align: 'center',
        width: 150,
        render: (_, record) => this.renderPreSalesUser(record, 'score')
      },
    ]
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole !== PRE_SALES && savedRole !== AUDITOR) {
      column.splice(2, 0, {
        title: 'Is Pre-Sales Audit',
        dataIndex: 'isPreSalesAudit',
        key: 'isPreSalesAudit',
        align: 'center',
        width: 150,
        render: (_, record) => this.renderPreSalesUser(record, 'isPreSalesAudit')
      })
    }
    return column
  }
  handleDateRange = rangeInString => {
    const range = JSON.parse(rangeInString)
    this.setState({
      selectedRange: rangeInString
    }, () => {
      if (range.duration === 'all') {
        this.handleDateChange([])
      } else {
        this.handleDateChange([
          moment().subtract(range.duration, range.unit),
          moment()
        ])
      }
    })
  }
  handleDateChange = (dates) => {
    this.setState({
      fromDate: dates && dates[0] ? dates[0] : '',
      toDate: dates && dates[1] ? dates[1] : '',
    }, this.fetchUsers)
  }
  fetchUsers = async () => {
    const { fromDate, toDate, perPage, skip, showDocumentsWithAuditStatus } = this.state
    let filterQuery = ''
    if (fromDate) filterQuery += `{ createdAt_gte: "${moment(fromDate).startOf('day').toDate()}" }`
    if (toDate) filterQuery += `{ createdAt_lte: "${moment(toDate).endOf('day').toDate()}" }`
    if (showDocumentsWithAuditStatus) filterQuery += '{ isPreSalesAudit: true }'
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole === PRE_SALES || savedRole === AUDITOR) {
      const savedId = getDataFromLocalStorage('login.id')
      if (savedRole === PRE_SALES) {
        filterQuery += `{ preSalesUser_some: { id: "${savedId}" } }`
      } else if (savedRole === AUDITOR) {
        filterQuery += `{ auditor_some: { id: "${savedId}" } }`
      }
      fetchPreSalesAudit(null, filterQuery)
    } else {
      await fetchUsersDetails({
        filterQuery,
        auditType: preSales,
        perPage,
        skip,
      })
    }
  }
  onPageChange = (page) => {
    this.setState({
      currentPage: page,
      skip: page - 1
    }, this.fetchUsers)
  }
  render() {
    const { fromDate, toDate, dateRanges, selectedRange,
      tableData, currentPage, perPage,
      isAssignAuditorModalVisible,
      selectedAuditId, selectedAuditor,
      selectedPreSalesUser, isAssignPreSalesModalVisible,
      showDocumentsWithAuditStatus } = this.state
    const { usersfetchingStatus, usersMeta,
      preSalesAuditFetchStatus } = this.props
    const savedRole = getDataFromLocalStorage('login.role')
    const loadingTable = savedRole === PRE_SALES || savedRole === AUDITOR ?
      preSalesAuditFetchStatus && get(preSalesAuditFetchStatus.toJS(), 'loading') :
      usersfetchingStatus && get(usersfetchingStatus.toJS(), 'loading')
    return (
        <>
          <MentorAuditListStyle.TopContainer style={flexStyle}>
            {
              savedRole !== PRE_SALES && savedRole !== AUDITOR && (
              <span>
                <Switch
                  checked={showDocumentsWithAuditStatus}
                  onChange={checked => {
                this.setState({
                    showDocumentsWithAuditStatus: checked
                  }, this.fetchUsers)
                }}
                  size='small'
                />
                <span style={{ marginLeft: '10px' }}>Show Users with Audits</span>
              </span>
              )
              }
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '5px 10px 0 auto',
              }}
            >
              <DatePicker.RangePicker
                value={[fromDate, toDate]}
                format='DD/MM/YYYY'
                onCalendarChange={this.handleDateChange}
              />
              <div>
                {
                  dateRanges.map(range =>
                    <Button
                      type={JSON.stringify(range.subtract) === selectedRange ? 'primary' : 'default'}
                      shape='circle'
                      onClick={() => this.handleDateRange(JSON.stringify(range.subtract))}
                      style={{
                        margin: '8px'
                      }}
                    >
                      {range.label}
                    </Button>
                  )
                }
              </div>
            </div>
          </MentorAuditListStyle.TopContainer>
          <MentorAuditListStyle.TopContainer>
            {savedRole === PRE_SALES || savedRole === AUDITOR ||
            (usersMeta && usersMeta < perPage) ? null : (
              <MentorAuditListStyle.PaginationHolder style={{ margin: '20px auto' }}>
                <Pagination
                  total={usersMeta || 0}
                  onChange={this.onPageChange}
                  current={currentPage}
                  defaultPageSize={perPage}
                />
              </MentorAuditListStyle.PaginationHolder>
            )}
          </MentorAuditListStyle.TopContainer>
          <AssignAuditorModal
            {...this.props}
            selectedAuditId={selectedAuditId}
            selectedAuditor={selectedAuditor}
            setSelectedAuditor={(auditor) => {
              this.setState({
                selectedAuditor: auditor
              })
            }}
            isAssignAuditorModalVisible={isAssignAuditorModalVisible}
            closeAssignAuditorModal={() => {
            this.setState({
              selectedAuditId: null,
              isAssignAuditorModalVisible: false,
              selectedAuditor: null
            })
            }}
            auditType={preSales}
          />
          <AssignAuditorModal
            {...this.props}
            selectedAuditId={selectedAuditId}
            selectedAuditor={selectedPreSalesUser}
            setSelectedAuditor={(auditor) => {
              this.setState({
                selectedPreSalesUser: auditor
              })
            }}
            isAssignAuditorModalVisible={isAssignPreSalesModalVisible}
            closeAssignAuditorModal={() => {
            this.setState({
              selectedAuditId: null,
              isAssignPreSalesModalVisible: false,
              selectedPreSalesUser: null
            })
            }}
            addSalesUser
            auditType={preSales}
          />
          <PreSalesTable
            loading={loadingTable}
            dataSource={sortBy(tableData, 'createdAt')}
            pagination={false}
            bordered
            scroll={{ x: 'max-content' }}
            columns={this.getTableColumn()}
          />
        </>
    )
  }
}


const mapStateToProps = (state) => ({
  usersfetchingStatus: state.data.getIn(['user', 'fetchStatus', `user/${preSales}`]),
  usersDetails: filterKey(state.data.getIn(['user', 'data']), `user/${preSales}`),
  usersMeta: state.data.getIn(['userMeta', 'data', 'count']),
  preSalesAuditFetchStatus: state.data.getIn(['preSalesAudits', 'fetchStatus', 'preSalesAudits']),
  preSalesAudits: state.data.getIn(['preSalesAudits', 'data']),
  usersForAudits: state.data.getIn([
    'usersForAudits',
    'data'
  ]),
  usersFetchStatus: state.data.getIn([
    'users',
    'fetchStatus',
    'users'
  ]),
  preSalesAuditUpdateStatus: state.data.getIn(['preSalesAudits', 'updateStatus', 'preSalesAudits']),
  userAuditUpdateStatus: state.data.getIn(['user', 'updateStatus', `user/${preSales}`])
})

export default connect(mapStateToProps)(PreSalesAuditTable)
