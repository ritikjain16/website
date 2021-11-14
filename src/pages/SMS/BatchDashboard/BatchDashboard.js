import { Button, DatePicker, notification, Pagination, Popconfirm, Select, Spin } from 'antd'
import { get } from 'lodash'
import { DeleteFilled } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import React from 'react'
import moment from 'moment'
import BatchDashboardStyle from './BatchDashboard.style'
import SearchBox from './components/SearchBox'
import MainTable from '../../../components/MainTable'
import BatchModal from './components/BatchModal'
import { ADMIN, MENTOR, SALES_EXECUTIVE, SCHOOL_ADMIN, UMS_ADMIN, UMS_VIEWER } from '../../../constants/roles'
import getDataFromLocalStorage from '../../../utils/extract-from-localStorage'
import fetchBatches from '../../../actions/batchDashboard/fetchBatch'
import fetchBatchDashboardDetails from '../../../actions/batchDashboard/fetchBatchDashboardDetails'
import deleteBatch from '../../../actions/batchDashboard/deleteBatch'
import fetchAssociatedMentors from '../../../actions/batchDashboard/fetchAssociatedMentors'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'
import fetchAllSchools from '../../../actions/smsDashboard/fetchAllSchools'
import fetchBatchTopics from '../../../actions/batchDashboard/fetchBatchTopic'

class BatchDashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchKey: 'Search by',
      searchCode: '',
      searchType: '',
      searchMentor: '',
      fromDate: null,
      toDate: null,
      addBatch: false,
      updateBatch: null,
      mentors: null,
      tableData: [],
      columns: null,
      perPage: 20,
      skip: 0,
      currentPage: 1,
      filterQuery: '',
      mentorsId: [],
      batchesTypes: [
        'normal', 'b2b', 'b2b2c'
      ],
      schools: [],
      filterDropdownOptions: [
        'Search by',
        'Batch Code',
        'Batch Type',
        'Alloted Mentors',
        'Student\'s Name',
        'Phone number'
      ],
      pageType: window.location.pathname.split('/')[1],
      coursesList: [],
      searchStudent: '',
      searchPhone: ''
    }
  }
  componentDidMount = async () => {
    const { pageType } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    if (pageType === 'ums') {
      let filterQuery = ''
      let mentorsId = []
      let filterDropdownOptions = [
        'Search by',
        'Batch Code',
        'Alloted Mentors',
        'Student\'s Name',
        'Phone number'
      ]
      if (savedRole && savedRole === SALES_EXECUTIVE) {
        const salesId = getDataFromLocalStorage('login.id')
        await fetchAssociatedMentors(salesId).then(res => {
          mentorsId = res.user.salesExecutiveProfile.mentors.map(({ user }) => user.id)
          filterQuery = `{allottedMentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}`
        })
      } else if (savedRole && savedRole === MENTOR) {
        const mentId = getDataFromLocalStorage('login.id')
        mentorsId = [mentId]
        filterQuery = `{allottedMentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}`
        filterDropdownOptions = ['Search by', 'Batch Code']
      }
      filterQuery += ',{type:normal}'
      this.setState({
        filterDropdownOptions,
        searchType: 'normal',
        filterQuery,
        mentorsId
      }, () => fetchBatches(this.state.perPage, this.state.skip, this.state.filterQuery))
    } else if (pageType === 'sms') {
      let filterQuery = ''
      let mentorsId = []
      let filterDropdownOptions = [
        'Search by',
        'Batch Code',
        'Batch Type',
        'Alloted Mentors',
        'Student\'s Name',
        'Phone number'
      ]
      if (savedRole && savedRole === SALES_EXECUTIVE) {
        const salesId = getDataFromLocalStorage('login.id')
        await fetchAssociatedMentors(salesId).then(res => {
          mentorsId = res.user.salesExecutiveProfile.mentors.map(({ user }) => user.id)
          filterQuery = `{allottedMentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}`
        })
      } else if (savedRole && savedRole === MENTOR) {
        const mentId = getDataFromLocalStorage('login.id')
        filterDropdownOptions = ['Search by', 'Batch Code', 'Batch Type']
        mentorsId = [mentId]
        filterQuery = `{allottedMentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}`
      } else if (savedRole && savedRole === SCHOOL_ADMIN) {
        const savedId = getDataFromLocalStorage('login.id')
        const { schools } = await fetchAllSchools(savedId)
        this.setState({
          schools: schools.map(({ id }) => id)
        }, () =>
          filterQuery = `{ students_some: { school_some: { id_in: [${getIdArrForQuery(this.state.schools)}] } } }`)
      }
      filterQuery += ',{type_not:normal}'
      this.setState({
        filterDropdownOptions,
        batchesTypes: [
          'b2b', 'b2b2c',
        ],
        filterQuery,
        mentorsId
      }, () => fetchBatches(this.state.perPage, this.state.skip, this.state.filterQuery))
    }
    if (savedRole && (savedRole === UMS_ADMIN || savedRole === UMS_VIEWER || savedRole === ADMIN)) {
      await fetchBatchDashboardDetails().then(res => {
        this.setState({
          mentors: res.users,
          coursesList: get(res, 'courses', [])
        })
      })
    }
    if (savedRole && savedRole === SALES_EXECUTIVE) {
      const salesId = getDataFromLocalStorage('login.id')
      await fetchBatchDashboardDetails(salesId).then(res => {
        this.setState({
          coursesList: get(res, 'courses', []),
          mentors: res.user.salesExecutiveProfile.mentors.map(({ user }) => user)
        })
      })
    }
    if (savedRole && savedRole === MENTOR) {
      await fetchBatchDashboardDetails().then(res => {
        this.setState({
          coursesList: get(res, 'courses', []),
        })
      })
    }
    window.addEventListener('click', this.changeType)
  }
  changeType = () => {
    const { pageType } = this.state
    if (localStorage && pageType !== localStorage.getItem('type')) {
      this.setState({
        pageType: localStorage.getItem('type') || 'india'
      })
    }
  }
  searchByFilter = () => {
    const {
      fromDate,
      toDate,
      searchKey,
      searchCode,
      searchMentor,
      searchType,
      pageType,
      perPage,
      mentorsId,
      schools,
      searchStudent,
      searchPhone,
      skip } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    let filteredQuery = ''
    if (pageType === 'sms') {
      if (savedRole === SCHOOL_ADMIN && schools.length > 0) {
        filteredQuery = `{ students_some: { school_some: { id_in: [${getIdArrForQuery(schools)}] } } }`
      }
      filteredQuery += '{type_not:normal},'
    } else {
      filteredQuery += '{type:normal},'
    }
    if (fromDate) {
      filteredQuery += `{createdAt_gte: "${fromDate !== null ? fromDate : ''}"},`
    }
    if (toDate) {
      filteredQuery += `{createdAt_lte: "${toDate !== null ? toDate : ''}"},`
    }
    if (searchKey === 'Batch Code' && searchCode !== '') {
      filteredQuery += `{code_contains:"${searchCode}"},`
    }
    if (pageType === 'ums' && searchType !== '') {
      filteredQuery += `{type:${searchType}},`
    }
    if (searchKey === 'Batch Type' && searchType !== '') {
      filteredQuery += `{type:${searchType}},`
    }
    if (searchKey === 'Alloted Mentors' && searchMentor !== '') {
      filteredQuery += `{allottedMentor_some:{name_contains:"${searchMentor}"}},`
    }
    if (searchKey === 'Student\'s Name' && searchStudent !== '') {
      filteredQuery += `{ students_some: { user_some: { name_contains: "${searchStudent}" } } }`
    }
    if (searchKey === 'Phone number' && searchPhone !== '') {
      filteredQuery += `{
      students_some: {
        parents_some: { user_some: { phone_number_subDoc_contains: "${searchPhone}" } }
      }
    }`
    }
    if (savedRole && (savedRole === SALES_EXECUTIVE || savedRole === MENTOR)) {
      filteredQuery += `{allottedMentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}`
    }
    this.setState({
      filterQuery: filteredQuery
    }, () => fetchBatches(perPage, skip, this.state.filterQuery))
  }
  componentDidUpdate = async (prevProps, prevState) => {
    let courseId = ''
    const {
      isBatchFetching,
      hasBatchFetched, batchAddedStatus,
      batchAddedFailure, batchUpdateStatus, batchUpdateFailure,
      batchDeleteStatus, batchDeleteFailure } = this.props
    const { pageType, updateBatch, coursesList } = this.state
    if (prevState.updateBatch !== updateBatch && updateBatch) {
      if (get(updateBatch, 'course.id')) {
        courseId = get(updateBatch, 'course.id')
      } else {
        courseId = get(coursesList, '[0].id')
      }
      await fetchBatchTopics(courseId)
    }

    if (!isBatchFetching && hasBatchFetched) {
      if (get(prevProps, 'batchAdded') !==
        get(this.props, 'batchAdded')) {
        this.setTableFromData()
      }
    }

    if (batchAddedStatus && !get(batchAddedStatus.toJS(), 'loading')
      && get(batchAddedStatus.toJS(), 'success') &&
      (prevProps.batchAddedStatus !== batchAddedStatus)) {
      notification.success({
        message: 'Batch added successfully'
      })
      this.setStateAfterAdd()
    } else if (batchAddedStatus && !get(batchAddedStatus.toJS(), 'loading')
      && get(batchAddedStatus.toJS(), 'failure') &&
      (prevProps.batchAddedFailure !== batchAddedFailure)) {
      if (batchAddedFailure && batchAddedFailure.toJS().length > 0) {
        notification.error({
          message: get(get(batchAddedFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }

    if (batchUpdateStatus && !get(batchUpdateStatus.toJS(), 'loading')
      && get(batchUpdateStatus.toJS(), 'success') &&
      (prevProps.batchUpdateStatus !== batchUpdateStatus)) {
      notification.success({
        message: 'Batch updated successfully'
      })
      this.setState({
        updateBatch: false
      }, () => this.searchByFilter())
    } else if (batchUpdateStatus && !get(batchUpdateStatus.toJS(), 'loading')
      && get(batchUpdateStatus.toJS(), 'failure') &&
      (prevProps.batchUpdateFailure !== batchUpdateFailure)) {
      if (batchUpdateFailure && batchUpdateFailure.toJS().length > 0) {
        notification.error({
          message: get(get(batchUpdateFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }

    if (batchDeleteStatus && !get(batchDeleteStatus.toJS(), 'loading')
      && get(batchDeleteStatus.toJS(), 'success') &&
      (prevProps.batchDeleteStatus !== batchDeleteStatus)) {
      notification.success({
        message: 'Batch deleted successfully'
      })
      this.searchByFilter()
    } else if (batchDeleteStatus && !get(batchDeleteStatus.toJS(), 'loading')
      && get(batchDeleteStatus.toJS(), 'failure') &&
      (prevProps.batchDeleteFailure !== batchDeleteFailure)) {
      if (batchDeleteFailure && batchDeleteFailure.toJS().length > 0) {
        notification.error({
          message: get(get(batchDeleteFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }

    if (prevState.pageType !== pageType) {
      this.clearFilter()
    }
  }
  componentWillUnmount = () => {
    window.removeEventListener('click', this.changeType)
  }
  renderAction = (id, data) => (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        padding: '8px 0'
      }}
    >
      <MainTable.ActionItem.IconWrapper>
        <MainTable.ActionItem.EditIcon onClick={() =>
          this.setState({ updateBatch: data })}
        />
      </MainTable.ActionItem.IconWrapper>
      <div>
        <Popconfirm
          title='Do you want to delete this Batch?'
          placement='topRight'
          onConfirm={() => {
            deleteBatch(id)
          }}
          okText='Yes'
          cancelText='Cancel'
          key='delete'
          overlayClassName='popconfirm-overlay-primary'
        >
          <MainTable.ActionItem.IconWrapper>
            <DeleteFilled />
          </MainTable.ActionItem.IconWrapper>
        </Popconfirm>
      </div>
    </div>
  )
  setTableFromData = () => {
    const batchAdded = this.props.batchAdded && this.props.batchAdded.toJS()
    this.setState({
      tableData: batchAdded
    }, () => this.setTableData())
  }
  setTableData = () => {
    const batchAdded = this.props.batchAdded && this.props.batchAdded.toJS()
    let columns = []
    const savedRole = getDataFromLocalStorage('login.role')
    if (batchAdded.length > 0) {
      columns = [
        {
          title: 'Sr. No',
          dataIndex: 'srNo',
          key: 'srNo',
          align: 'center',
        },
        {
          title: 'Batch Code',
          dataIndex: 'code',
          key: 'code',
          align: 'center',
          render: (code) => (
            <div>
              <span>{this.setBatchCode(code)}</span>
            </div>
          )
        },
        {
          title: 'Batch Description',
          dataIndex: 'description',
          key: 'description',
          align: 'center',
        },
        {
          title: 'Batch Topic',
          dataIndex: 'topic',
          key: 'topic',
          align: 'center',
          render: (topic, row) => (
            <div>
              <span>{row.order}. </span>
              <span>{topic}</span>
            </div>
          )
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
          align: 'center'
        },
        {
          title: 'Student Count',
          dataIndex: 'studentCount',
          key: 'studentCount',
          align: 'center'
        },
        {
          title: 'Alloted Mentor',
          dataIndex: 'allotedMentorName',
          key: 'allotedMentorName',
          align: 'center',
        },
        ...((savedRole === ADMIN || savedRole === UMS_ADMIN) ?
          [{
            title: 'Payment Status',
            dataIndex: 'enrollmentType',
            key: 'enrollmentType',
            align: 'center',
            render: (type) =>
              type === 'pro' ?
                <span>Paid</span> :
                <span>Free</span>
          }] : []),
        {
          title: 'Created At',
          dataIndex: 'createdAt',
          key: 'createdAt',
          align: 'center',
        },
        {
          title: 'Modified At',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          align: 'center',
        },
        {
          title: 'Actions',
          dataIndex: 'id',
          key: 'actions',
          align: 'center',
          render: (id, data) => this.renderAction(id, data)
        }
      ]
      if (savedRole && (savedRole === SALES_EXECUTIVE || savedRole === SCHOOL_ADMIN)) {
        columns.pop()
      }
      if (this.state.pageType === 'ums') {
        columns = columns.filter(({ title }) => title !== 'Type')
      }
      if (savedRole && savedRole === MENTOR) {
        columns = columns.filter(({ title }) => title !== 'Alloted Mentor')
      }
    }
    this.setState({
      columns
    })
  }
  handleDateChange = (event, type) => {
    if (type === 'from') {
      if (event != null) {
        this.setState({
          fromDate: moment(event).format('MM/DD/YYYY')
        }, () => this.searchByFilter())
      } else {
        this.setState({
          fromDate: null
        }, () => this.searchByFilter())
      }
    } else if (type === 'to') {
      if (event !== null) {
        this.setState({
          toDate: moment(event).format('MM/DD/YYYY')
        }, () => this.searchByFilter())
      } else {
        this.setState({
          toDate: null
        }, () => this.searchByFilter())
      }
    }
  }
  onPageChange = (page) => {
    this.setState({
      currentPage: page,
      skip: page - 1
    }, () => this.searchByFilter())
  }
  setBatchCode = (code) => (
    <Link rel='noopener noreferrer' to={`/${this.state.pageType}/batchMapping/${code}`}>
      {code}
    </Link >
  )
  renderInput = () => {
    const { searchKey, searchType, searchCode, searchMentor,
      batchesTypes, mentors, searchStudent, searchPhone } = this.state
    const allottedMentors = mentors && mentors.length > 0 ?
      [...new Set(mentors.map(({ name }) => name))] : []
    if (searchKey === 'Batch Code') {
      return (
        <SearchBox
          placeholder='Search by Batch Code'
          value={searchCode}
          onChange={(e) => this.setState({ searchCode: e.target.value })}
          onKeyPress={(e) => {
            if (e.key === 'Enter') { this.searchByFilter() }
          }}
          searchByFilter={this.searchByFilter}
        />
      )
    } else if (searchKey === 'Alloted Mentors') {
      return (
        <Select
          style={{ width: '200px', marginLeft: '10px' }}
          showSearch
          placeholder='Search by Alloted Mentors'
          value={searchMentor}
          notFoundContent={allottedMentors.length > 0 ? 'No Match Found' : <Spin />}
          onChange={(value) => this.setState({ searchMentor: value })}
          onKeyPress={(e) => {
            if (e.key === 'Enter') { this.searchByFilter() }
          }}
          onSelect={(value) => this.setState({ searchMentor: value }, () => this.searchByFilter())}
          optionFilterProp='children'
          filterOption={(inputValue, option) => (
            option.props.children &&
            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          )}
        >
          {
            allottedMentors && allottedMentors.map((name) =>
              <Select.Option key={name}
                value={name}
              >{name}
              </Select.Option>
            )}
        </Select>
      )
    } else if (searchKey === 'Batch Type') {
      return (
        <BatchDashboardStyle.Select
          value={searchType}
          onChange={(value) => this.setState({ searchType: value },
            () => this.searchByFilter())}
        >
          {batchesTypes.map(type =>
            <BatchDashboardStyle.Option key={type}
              value={type}
            >{type}
            </BatchDashboardStyle.Option>
          )}
        </BatchDashboardStyle.Select>
      )
    } else if (searchKey === 'Student\'s Name') {
      return (
        <SearchBox
          placeholder='Search by Student Name'
          value={searchStudent}
          onChange={(e) => this.setState({ searchStudent: e.target.value })}
          onKeyPress={(e) => {
            if (e.key === 'Enter') { this.searchByFilter() }
          }}
          searchByFilter={this.searchByFilter}
        />
      )
    } else if (searchKey === 'Phone number') {
      return (
        <SearchBox
          placeholder='Search by Phone number'
          value={searchPhone}
          onChange={(e) => this.setState({ searchPhone: e.target.value })}
          onKeyPress={(e) => {
            if (e.key === 'Enter') { this.searchByFilter() }
          }}
          searchByFilter={this.searchByFilter}
        />
      )
    }
  }
  clearFilter = () => {
    if (this.state.pageType === 'ums') {
      this.setState({
        searchKey: 'Search by',
        searchCode: '',
        searchMentor: '',
        fromDate: null,
        toDate: null,
        skip: 0,
        currentPage: 1,
        filterQuery: '',
        batchesTypes: [
          'normal'
        ],
        searchPhone: '',
        searchStudent: ''
      }, () => this.searchByFilter())
    } else {
      this.setState({
        searchKey: 'Search by',
        searchCode: '',
        searchType: '',
        searchMentor: '',
        fromDate: null,
        toDate: null,
        skip: 0,
        currentPage: 1,
        filterQuery: '',
        batchesTypes: [
          'b2b', 'b2b2c'
        ],
        searchPhone: '',
        searchStudent: ''
      }, () => this.searchByFilter())
    }
  }

  setStateAfterAdd = () => {
    this.setState({
      currentPage: 1,
      skip: 0,
      addBatch: false
    }, this.searchByFilter)
  }
  render() {
    const {
      columns,
      tableData,
      addBatch,
      toDate,
      fromDate,
      searchKey,
      mentors,
      updateBatch,
      perPage,
      batchesTypes,
      pageType,
      filterDropdownOptions,
      coursesList,
      currentPage } = this.state
    const { batchesCount, topicFetchingStatus, batchAddedStatus,
      batchUpdateStatus, batchDeleteStatus } = this.props
    const savedRole = getDataFromLocalStorage('login.role')
    const isSchoolAdmin = savedRole === SCHOOL_ADMIN
    return (
      <>
        <BatchDashboardStyle.TopContainer>
          <div style={{ marginRight: '20px', minWidth: '438px' }}>
            <BatchDashboardStyle.Select
              value={searchKey}
              onChange={(value) => this.setState({ searchKey: value })}
            >
              {
                filterDropdownOptions.map((option) =>
                  <BatchDashboardStyle.Option
                    key={option}
                    value={option}
                  >{option}
                  </BatchDashboardStyle.Option>
                )
              }
            </BatchDashboardStyle.Select>
            {this.renderInput()}
          </div>
          <div>
            <Pagination
              total={!batchesCount ? 0 : batchesCount}
              onChange={this.onPageChange}
              current={currentPage}
              defaultPageSize={perPage}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DatePicker
              placeholder='Select From Date'
              dateRender={current => {
                const currentDate = fromDate ?
                  new Date(fromDate).setHours(0, 0, 0, 0) :
                  new Date().setHours(0, 0, 0, 0)
                const style = {}
                if (currentDate === new Date(current).setHours(0, 0, 0, 0)) {
                  style.backgroundColor = '#a8a6ee'
                  style.color = '#ffffff'
                }
                style.cursor = 'pointer'
                return (
                  <div className='ant-picker-cell-inner' style={style}>
                    {current.date()}
                  </div>
                )
              }}
              isClearable
              onChange={(event) => this.handleDateChange(event, 'from')}
              value={fromDate !== null ? moment(fromDate) : undefined}
            />
            <div style={{ marginLeft: '10px' }}>
              <DatePicker
                placeholder='Select To Date'
                dateRender={current => {
                  const currentDate = toDate ?
                    new Date(toDate).setHours(0, 0, 0, 0) :
                    new Date().setHours(0, 0, 0, 0)
                  const style = {}
                  if (currentDate === new Date(current).setHours(0, 0, 0, 0)) {
                    style.backgroundColor = '#a8a6ee'
                    style.color = '#ffffff'
                  }
                  style.cursor = 'pointer'
                  return (
                    <div className='ant-picker-cell-inner' style={style}>
                      {current.date()}
                    </div>
                  )
                }}
                isClearable
                onChange={(event) => this.handleDateChange(event, 'to')}
                value={toDate !== null ? moment(toDate) : undefined}
              />
            </div>
          </div>
        </BatchDashboardStyle.TopContainer>
        <BatchDashboardStyle.PaginationContainer>
          <Button type='primary' onClick={this.clearFilter} style={{ marginRight: '10px' }} >
            Clear Filter
          </Button>
          <h3 style={{ margin: '0px' }} >Total Batches {!batchesCount ? 0 : batchesCount}</h3>
          {!isSchoolAdmin && (
            <BatchDashboardStyle.StyledButton
              type='primary'
              icon='plus'
              id='add-btn'
              onClick={() => this.setState({ addBatch: true })}
            >
              ADD BATCH
            </BatchDashboardStyle.StyledButton>
          )}
          {
            savedRole === SCHOOL_ADMIN ? null : (
              <BatchModal
                visible={addBatch || Boolean(updateBatch)}
                mentors={mentors}
                topics={this.props.topics}
                operation={addBatch ? 'add' : 'update'}
                batchesTypes={pageType === 'ums' ? ['normal'] : batchesTypes}
                pageType={pageType}
                coursesList={coursesList}
                updateBatchData={updateBatch}
                closeUpdateModal={() => this.setState({ updateBatch: null })}
                setAddBatch={(value) => this.setState({ addBatch: value })}
                batchAddedStatus={batchAddedStatus}
                batchUpdateStatus={batchUpdateStatus}
                deleteStatus={batchDeleteStatus}
                topicFetchingStatus={topicFetchingStatus}
              />
            )
          }
        </BatchDashboardStyle.PaginationContainer>
        <BatchDashboardStyle.MDTable
          dataSource={tableData}
          columns={columns}
          rowClassName={() => 'antdTable-row'}
          loading={
            this.props.isBatchFetching && this.props.isBatchFetching
          }
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </>
    )
  }
}

export default BatchDashboard
