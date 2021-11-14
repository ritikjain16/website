import { Button, DatePicker, Icon, Pagination, Popconfirm, Switch, Tooltip } from 'antd'
import { get, sortBy } from 'lodash'
import moment from 'moment'
import React from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import MainTable from '../../../components/MainTable'
import { auditType } from '../../../constants/auditQuestionConst'
import colors from '../../../constants/colors'
import { AUDITOR, MENTOR, POST_SALES } from '../../../constants/roles'
import getDataFromLocalStorage from '../../../utils/extract-from-localStorage'
import formatDate from '../../../utils/formatDate'
import { getDuration, T12HrFormat } from '../../../utils/time'
import AssignAuditorModal from '../components/AssignAuditorModal'
import MentorAuditListStyle from '../MentorAuditList.style'
import { PreSalesDiv, PreSalesTable } from '../PreSalesAudit/PreSalesAudit.styles'
import styles from '../../CompletedSessions/icon.module.scss'
import copyToClipboard from '../../../utils/copyToClipboard'
import fetchMentorMenteeSessionsForAudit from '../../../actions/mentorAudits/fetchMentorMenteeSessionsForAudit'
import updateMentorMenteeSessionForAudit from '../../../actions/mentorAudits/updateMentorMenteeSessionForAudit'
import fetchPostSalesAudit from '../../../actions/audits/fetchPostSalesAudit'
import { updatePostSalesAudit } from '../../../actions/audits'

const { postSales } = auditType

const flexStyle = { alignItems: 'center', marginBottom: '10px' }

class PostSalesAudit extends React.Component {
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
      currentSessionAuditUpdating: '',
      currentUpdatingAudit: '',
      currentUpdatingAuditVisible: ''
    }
  }
  componentDidMount = () => {
    this.handleDateRange(this.state.selectedRange)
  }
  componentDidUpdate = (prevProps) => {
    const { postSalesAuditFetchingStatus,
      postSalesUpdateStatus, mentorMenteeSessionsForAuditFetchStatus,
      mentorMenteeSessionsUpdateStatus } = this.props
    if (postSalesAuditFetchingStatus && !get(postSalesAuditFetchingStatus.toJS(), 'loading')
      && get(postSalesAuditFetchingStatus.toJS(), 'success') &&
      (prevProps.postSalesAuditFetchingStatus !== postSalesAuditFetchingStatus)) {
      this.convertDataToTable()
    }
    if (postSalesUpdateStatus && !get(postSalesUpdateStatus.toJS(), 'loading')
      && get(postSalesUpdateStatus.toJS(), 'success') &&
      (prevProps.postSalesUpdateStatus !== postSalesUpdateStatus)) {
      this.convertDataToTable()
    }
    if (mentorMenteeSessionsForAuditFetchStatus &&
    !get(mentorMenteeSessionsForAuditFetchStatus.toJS(), 'loading')
      && get(mentorMenteeSessionsForAuditFetchStatus.toJS(), 'success') &&
      (prevProps.mentorMenteeSessionsForAuditFetchStatus !==
        mentorMenteeSessionsForAuditFetchStatus)) {
      this.convertDataToTable()
    }

    if (mentorMenteeSessionsUpdateStatus && !get(mentorMenteeSessionsUpdateStatus.toJS(), 'loading')
      && get(mentorMenteeSessionsUpdateStatus.toJS(), 'success') &&
      (prevProps.mentorMenteeSessionsUpdateStatus !== mentorMenteeSessionsUpdateStatus)) {
      this.convertDataToTable()
    }
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
    }, this.fetchPostSalesAuditDetails)
  }
  fetchPostSalesAuditDetails = async () => {
    const { fromDate, toDate, perPage, skip, showDocumentsWithAuditStatus } = this.state
    let filterQuery = ''
    if (fromDate) filterQuery += `{ createdAt_gte: "${moment(fromDate).startOf('day').toDate()}" }`
    if (toDate) filterQuery += `{ createdAt_lte: "${moment(toDate).endOf('day').toDate()}" }`
    const savedRole = getDataFromLocalStorage('login.role')
    if (showDocumentsWithAuditStatus) {
      filterQuery += '{ isPostSalesAudit: true }'
    }
    if (savedRole === POST_SALES || savedRole === AUDITOR) {
      const savedId = getDataFromLocalStorage('login.id')
      if (savedRole === POST_SALES) {
        filterQuery += `{ postSalesUser_some: { id: "${savedId}" } }`
      } else if (savedRole === AUDITOR) {
        filterQuery += `{ auditor_some: { id: "${savedId}" } }`
      }
      await fetchPostSalesAudit({ filterQuery })
    } else {
      await fetchMentorMenteeSessionsForAudit({
        filterQuery,
        perPageQueries: perPage,
        skipCount: skip,
        auditType: postSales
      })
    }
  }
  onPageChange = (page) => {
    this.setState({
      currentPage: page,
      skip: page - 1
    }, this.fetchPostSalesAuditDetails)
  }

  convertDataToTable = () => {
    const { postSalesAudits, mentorMenteeSessionsForAudit } = this.props
    const mentorMenteeSessionData = mentorMenteeSessionsForAudit
      && mentorMenteeSessionsForAudit.toJS() || []
    const postSalesAuditsData = postSalesAudits && postSalesAudits.toJS() || []
    const tableData = []
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole === POST_SALES || savedRole === AUDITOR) {
      postSalesAuditsData.forEach(mmSession => {
        tableData.push({
          ...get(mmSession, 'mentorMenteeSession'),
          mentorName: get(mmSession, 'mentorMenteeSession.mentorSession.user.name'),
          mentorId: get(mmSession, 'mentorMenteeSession.mentorSession.user.id'),
          studentName: get(mmSession, 'mentorMenteeSession.menteeSession.user.name'),
          studentId: get(mmSession, 'mentorMenteeSession.menteeSession.user.id'),
          parentName: get(mmSession, 'mentorMenteeSession.menteeSession.user.studentProfile.parents[0].user.name'),
          parentEmail: get(mmSession, 'mentorMenteeSession.menteeSession.user.studentProfile.parents[0].user.email'),
          parentPhone: get(mmSession, 'mentorMenteeSession.menteeSession.user.studentProfile.parents[0].user.phone'),
          auditor: get(mmSession, 'auditor'),
          auditScore: get(mmSession, 'score'),
          auditStatus: get(mmSession, 'status'),
          auditCreatedAt: get(mmSession, 'createdAt'),
          auditUpdatedAt: get(mmSession, 'updatedAt'),
          audit: mmSession,
        })
      })
    } else {
      mentorMenteeSessionData.forEach(mmSession => {
        const auditData = postSalesAuditsData.find(auditDetails =>
          get(auditDetails, 'mentorMenteeSession.id') === get(mmSession, 'id'))
        tableData.push({
          ...mmSession,
          mentorName: get(mmSession, 'mentorSession.user.name'),
          mentorId: get(mmSession, 'mentorSession.user.id'),
          studentName: get(mmSession, 'menteeSession.user.name'),
          studentId: get(mmSession, 'menteeSession.user.id'),
          parentName: get(mmSession, 'menteeSession.user.studentProfile.parents[0].user.name'),
          parentEmail: get(mmSession, 'menteeSession.user.studentProfile.parents[0].user.email'),
          parentPhone: get(mmSession, 'menteeSession.user.studentProfile.parents[0].user.phone'),
          auditor: get(auditData, 'auditor'),
          auditScore: get(auditData, 'score'),
          auditStatus: get(auditData, 'status'),
          auditCreatedAt: get(auditData, 'createdAt'),
          auditUpdatedAt: get(auditData, 'updatedAt'),
          audit: auditData
        })
      })
    }
    this.setState({
      tableData
    })
  }
  renderAuditorRow = (audit, mentorId, isAuditAlloted) => {
    const savedRole = getDataFromLocalStorage('login.role')
    if (!get(audit, 'postSalesUser')) {
      return (
        <Tooltip title='Please assign Post-Sales user, to assign auditor'>
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
    if (savedRole === MENTOR || savedRole === POST_SALES || savedRole === AUDITOR) {
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
  isAuditorSameAsLoggedInUser = (auditor) => {
    const loggedInUserId = getDataFromLocalStorage('login.id')
    if (auditor && auditor.id === loggedInUserId) {
      return true
    }
    return false
  }
  renderStartAuditButton = (audit, isAuditAlloted) => {
    const { currentUpdatingAuditVisible, currentUpdatingAudit } = this.state
    if (!this.isAuditorSameAsLoggedInUser(audit.auditor)) {
      return (
        <>
          {get(audit, 'status', 'pending')}
          {!isAuditAlloted && (
            <Link to={`/audit/${postSales}/${audit.id}`}>
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
        <Link to={`/audit/${postSales}/${audit.id}`}>
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
                await updatePostSalesAudit({
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
  renderPostSalesAuditData = (record, type) => {
    const savedRole = getDataFromLocalStorage('login.role')
    const isAuditAlloted = get(record, 'audit.status') === 'allotted'
    const totalScore = get(record, 'audit.totalScore') || 0
    if (type === 'postSalesUser') {
      if (get(record, 'audit.postSalesUser')) {
        return (<p>{get(record, 'audit.postSalesUser.name')}</p>)
      }
      return (
        <Button
          disabled={!record.isPostSalesAudit || savedRole === AUDITOR || !get(record, 'audit')}
          onClick={() => {
            this.setState({
                isAssignPreSalesModalVisible: true,
                selectedAuditId: get(record, 'audit.id'),
            })
        }}
        >Assign Post-Sales User
        </Button>
      )
    } else if (type === 'auditor') {
      return this.renderAuditorRow(record.audit, '', isAuditAlloted)
    } else if (type === 'status') {
      if (get(record, 'audit.postSalesUser')) {
        return (
          <p>{isAuditAlloted || get(record, 'audit.status') === 'started' ? (
              this.renderStartAuditButton(record.audit, isAuditAlloted)
            ) : 'completed'}
          </p>
        )
      } return '-'
    } else if (type === 'sessionInterval') {
      return (
        <p>{`
            ${T12HrFormat(formatDate(get(record, 'sessionStartDate')).timeHM)}
            - 
            ${T12HrFormat(formatDate(get(record, 'sessionEndDate')).timeHM)}
            `}
        </p>)
    } else if (type === 'sessionVideoLink') {
      return get(record, 'sessionRecordingLink') ? (
        <Tooltip title='Copy link'>
          <PreSalesDiv className={cx(this.getIconName(true), styles.icon)}
            onClick={() => copyToClipboard(get(record, 'sessionRecordingLink'))}
          />
        </Tooltip>
      ) : (
        <div className={cx(this.getIconName(false), styles.icon)} />
      )
    } else if (type === 'ratings') return get(record, 'rating') || '-'
    else if (type === 'isPostSalesAudit') {
      return (
        <Switch
          checked={get(record, 'isPostSalesAudit')}
          disabled={get(record, 'isPostSalesAudit') || savedRole === AUDITOR}
          loading={this.state.currentSessionAuditUpdating === record.id}
          onChange={checked => {
            this.setState({
              currentSessionAuditUpdating: record.id
            })
            updateMentorMenteeSessionForAudit(record.id, checked, true).then(() => {
              this.setState({
                currentSessionAuditUpdating: ''
              })
              this.fetchPostSalesAuditData()
            })
          }}
          size='default'
        />
      )
    } else if (type === 'score') {
      return `${get(record, 'audit.score') || 0}/${totalScore}`
    } else if (type === 'customScore') {
      return `${get(record, 'audit.customScore') || 0}/${totalScore}`
    } else if (type === 'sessionDuration') {
      return getDuration(get(record, 'sessionStartDate'), get(record, 'sessionEndDate'))
    } else if (type === 'sessionStartDate') {
      return moment(get(record, 'sessionStartDate')).format('lll')
    }
  }

  fetchPostSalesAuditData = () => {
    const { tableData } = this.state
    const sessionIds = tableData.map(session => `"${get(session, 'id')}"`)
    fetchPostSalesAudit({
      filterQuery: `{ mentorMenteeSession_some: { id_in: [${sessionIds}] }}`
    })
  }
  getIconName = (status) => status ? styles.videoLinkYes : styles.videoLinkNo
  getStudentDetails = (details) => get(details, 'menteeSession')
  getMentorDetails = (details) => get(details, 'mentorSession')
  getColumn = () => {
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
        render: (_, record) => get(this.getStudentDetails(record), 'user.name')
      },
      {
        title: 'Post-SalesUser',
        dataIndex: 'postSalesUser',
        key: 'postSalesUser',
        align: 'center',
        render: (_, record) => this.renderPostSalesAuditData(record, 'postSalesUser'),
        width: 150
      },
      {
        title: 'Auditor Name',
        dataIndex: 'auditorName',
        key: 'auditorName',
        align: 'center',
        width: 150,
        render: (_, record) => this.renderPostSalesAuditData(record, 'auditor')
      },
      {
        title: 'Audit Status',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 250,
        render: (_, record) => this.renderPostSalesAuditData(record, 'status')
      },
      {
        title: 'Topic Name',
        dataIndex: 'topicName',
        key: 'topicName',
        align: 'center',
        width: 150,
        render: (_, record) => <p>{`(${get(record, 'topic.order')}) ${get(record, 'topic.title')}`}</p>
      },
      {
        title: 'Ratings',
        dataIndex: 'ratings',
        key: 'ratings',
        align: 'center',
        width: 100,
        render: (_, record) => this.renderPostSalesAuditData(record, 'ratings')
      },
      {
        title: 'Custom Score',
        dataIndex: 'score',
        key: 'score',
        align: 'center',
        width: 150,
        render: (_, record) => this.renderPostSalesAuditData(record, 'customScore')
      },
      {
        title: 'Quality Score',
        dataIndex: 'score',
        key: 'score',
        align: 'center',
        width: 150,
        render: (_, record) => this.renderPostSalesAuditData(record, 'score')
      },
      {
        title: 'Parent Name',
        dataIndex: 'parentName',
        key: 'parentName',
        align: 'center',
        width: 150,
        render: (_, record) => get(this.getStudentDetails(record), 'user.studentProfile.parents[0].user.name')
      },
      {
        title: 'Mentor Name',
        dataIndex: 'mentorName',
        key: 'mentorName',
        align: 'center',
        width: 150,
        render: (_, record) => get(this.getMentorDetails(record), 'user.name')
      },
      {
        title: 'Mentor Phone No.',
        dataIndex: 'mentorPhoneNo',
        key: 'mentorPhoneNo',
        align: 'center',
        width: 150,
        render: (_, record) => get(this.getMentorDetails(record), 'user.phone.number')
      },
      {
        title: 'Session Start Date',
        dataIndex: 'sessionStartDate',
        key: 'sessionStartDate',
        align: 'center',
        width: 150,
        render: (_, record) => this.renderPostSalesAuditData(record, 'sessionStartDate')
      },
      {
        title: 'Session Duration',
        dataIndex: 'sessionDuration',
        key: 'sessionDuration',
        align: 'center',
        width: 150,
        render: (_, record) => this.renderPostSalesAuditData(record, 'sessionDuration')
      },
      {
        title: 'Session Interval',
        dataIndex: 'sessionInterval',
        key: 'sessionInterval',
        align: 'center',
        width: 150,
        render: (_, record) => this.renderPostSalesAuditData(record, 'sessionInterval')
      },
      {
        title: 'Session Video Link',
        dataIndex: 'sessionVideoLink',
        key: 'sessionVideoLink',
        align: 'center',
        width: 150,
        render: (_, record) => this.renderPostSalesAuditData(record, 'sessionVideoLink')
      },
    ]
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole !== POST_SALES && savedRole !== AUDITOR) {
      column.splice(2, 0, {
        title: 'Is Post-Sales Audit',
        dataIndex: 'isPostSalesAudit',
        key: 'isPostSalesAudit',
        align: 'center',
        width: 150,
        render: (_, record) => this.renderPostSalesAuditData(record, 'isPostSalesAudit')
      })
    }
    return column
  }
  render() {
    const { fromDate, toDate, dateRanges,
      selectedRange, tableData, perPage, currentPage,
      selectedAuditor, selectedAuditId, selectedPreSalesUser,
      isAssignAuditorModalVisible, isAssignPreSalesModalVisible,
      showDocumentsWithAuditStatus } = this.state
    const { postSalesAuditFetchingStatus, mentorMenteeSessionsMeta,
      sessionCountWithIsPostSalesAudit, mentorMenteeSessionsForAuditFetchStatus } = this.props
    const savedRole = getDataFromLocalStorage('login.role')
    const tableLoading = savedRole === AUDITOR || savedRole === POST_SALES ?
      postSalesAuditFetchingStatus && get(postSalesAuditFetchingStatus.toJS(), 'loading') :
      mentorMenteeSessionsForAuditFetchStatus && get(mentorMenteeSessionsForAuditFetchStatus.toJS(), 'loading')
    return (
      <>
        <MentorAuditListStyle.TopContainer style={flexStyle}>
          {
            savedRole !== POST_SALES && savedRole !== AUDITOR && (
              <span>
                <Switch
                  checked={showDocumentsWithAuditStatus}
                  onChange={checked => {
                    this.setState({
                        showDocumentsWithAuditStatus: checked
                      }, this.fetchPostSalesAuditDetails)
                    }
                  }
                  size='small'
                />
                <span style={{ marginLeft: '10px' }}>Show Sessions with Audits ({sessionCountWithIsPostSalesAudit || 0})</span>
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
          {(mentorMenteeSessionsMeta &&
            mentorMenteeSessionsMeta < perPage) || savedRole === AUDITOR
            || savedRole === POST_SALES ? null : (
              <MentorAuditListStyle.PaginationHolder style={{ margin: '20px auto' }}>
                <Pagination
                  total={mentorMenteeSessionsMeta || 0}
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
          auditType={postSales}
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
          auditType={postSales}
        />
        <PreSalesTable
          loading={tableLoading}
          dataSource={sortBy(tableData, 'sessionStartDate')}
          pagination={false}
          bordered
          scroll={{ x: 'max-content' }}
          columns={this.getColumn()}
        />
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  postSalesAuditFetchingStatus: state.data.getIn(['postSalesAudits', 'fetchStatus', 'postSalesAudits']),
  postSalesAudits: state.data.getIn(['postSalesAudits', 'data']),
  postSalesUpdateStatus: state.data.getIn(['postSalesAudits', 'updateStatus', 'postSalesAudits']),
  postSalesAuditsMeta: state.data.getIn(['postSalesAuditsMeta', 'data', 'count']),
  usersForAudits: state.data.getIn([
    'usersForAudits',
    'data'
  ]),
  usersFetchStatus: state.data.getIn([
    'users',
    'fetchStatus',
    'users'
  ]),
  mentorMenteeSessionsForAudit: state.data.getIn(['mentorMenteeSessionsForAudit', 'data']),
  mentorMenteeSessionsForAuditFetchStatus: state.data.getIn(['mentorMenteeSessionsForAudit', 'fetchStatus', 'mentorMenteeSessionsForAudit']),
  mentorMenteeSessionsMeta: state.data.getIn(['mentorMenteeSessionsMeta', 'data', 'count']),
  sessionCountWithIsPostSalesAudit: state.data.getIn(['sessionCountWithIsPostSalesAudit', 'data', 'count']),
  mentorMenteeSessionsUpdateStatus: state.data.getIn(['mentorMenteeSessionsForAudit', 'updateStatus', 'mentorMenteeSessionsForAudit'])
})

export default connect(mapStateToProps)(PostSalesAudit)
