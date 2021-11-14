import React from 'react'
import { DatePicker, Pagination } from 'antd'
import moment from 'moment'
import { get } from 'lodash'
import SearchBox from './components/SearchBox'
import { MENTOR } from '../../constants/roles'
import fetchUserSavedCodes from '../../actions/userSavedCodes/fetchUserSavedCodes'
import fetchUserApprovedCodeTags from '../../actions/userApprovedCodeTags/fetchUserApprovedCodeTags'
import fetchConvertedUserInfo from '../../actions/profile/fetchConvertedUserInfo'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import getIdArrForQuery from '../../utils/getIdArrForQuery'
import SavedCodeModal from './components/SavedCodeModal'
import CodeApprovalStyle from './CodeApproval.style'
import MDTable from './components/MDTable'
import CommentsModal from './components/CommentsModal'

class CodeApproval extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fromDate: null,
      toDate: null,
      perPage: 12,
      skip: 0,
      currentPage: 1,
      searchKey: 'Search By',
      searchValue: '',
      filterQuery: '',
      filterTagIds: [],
      menteeIds: [],
      isSavedCodeModalVisible: false,
      isCommentsModalVisible: false,
      selectedSavedCode: null,
      requestedByMentee: false,
      requestedByMentor: false,
    }
  }

  componentDidMount = async () => {
    const savedRole = getDataFromLocalStorage('login.role')
    const prevFilters = get(this.props.history, 'location.state.filterQuery')
    if (prevFilters) {
      await this.setState({
        requestedByMentee: get(prevFilters, 'requestedByMentee', false),
        requestedByMentor: get(prevFilters, 'requestedByMentor', false)
      })
    }
    if (savedRole && savedRole === MENTOR) {
      const savedId = getDataFromLocalStorage('login.id')
      await fetchConvertedUserInfo(0, savedId, null, 0)
      const salesOperations = this.props.salesOperation && this.props.salesOperation.toJS()
      const menteeIds = salesOperations.map(salesOperation => salesOperation.studentId)
      this.setState({
        menteeIds
      })
    }
    this.searchByFilter(true)
    fetchUserApprovedCodeTags('{and:[{status:published}]}', 0, 0)
  }

  fetchUserSavedCodeBasedOnUserRole = async (
    filteredQuery,
    perPageCount,
    skipCount
  ) => {
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole && savedRole === MENTOR) {
      const { menteeIds } = this.state
      if (menteeIds && menteeIds.length) {
        filteredQuery += `{user_some:{id_in:[${getIdArrForQuery(menteeIds)}]}},`
        await fetchUserSavedCodes(filteredQuery, perPageCount, skipCount)
      }
    } else {
      await fetchUserSavedCodes(filteredQuery, perPageCount, skipCount)
    }
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
        }, () => this.searchByFilter(true))
      }
    } else if (type === 'to') {
      if (event !== null) {
        this.setState({
          toDate: moment(event).format('MM/DD/YYYY')
        }, () => this.searchByFilter())
      } else {
        this.setState({
          toDate: null
        }, () => this.searchByFilter(true))
      }
    }
  }
  onPageChange = (page) => {
    this.setState({
      currentPage: page,
      skip: page - 1
    }, () => {
      this.fetchUserSavedCodeBasedOnUserRole(this.state.filterQuery,
        this.state.perPage, this.state.skip)
    })
  }

  getAdditionalFilter = () => {
    const isMentorLoggedIn = getDataFromLocalStorage('login.role') === MENTOR
    if (isMentorLoggedIn) {
      return ''
    }
    return '{isApprovedForDisplay_not: rejected}'
  }

  setFilters = (state, TagIds = []) => {
    if (state.searchKey === 'Search By') {
      let filterQuery = ''
      if (this.state.requestedByMentee) {
        filterQuery += `{hasRequestedByMentee: true},${this.getAdditionalFilter()}`
      }
      if (this.state.requestedByMentor) {
        filterQuery += `{hasRequestedByMentor: true},${this.getAdditionalFilter()}`
      }
      this.setState({
        filterQuery,
        fromDate: null,
        toDate: null,
        skip: 0,
        currentPage: 1,
      }, () => {
        this.fetchUserSavedCodeBasedOnUserRole(this.state.filterQuery, this.state.perPage, 0)
      })
    }
    this.setState({
      ...state,
      filterTagIds: TagIds,
      skip: 0,
      currentPage: 1
    },
    () => {
      if (this.state.searchKey && (this.state.searchValue !== '' || this.state.filterTagIds.length >= 0)) {
        this.searchByFilter()
      }
    })
  }

  searchByFilter = (shouldFetch = false) => {
    const {
      fromDate,
      toDate,
      searchKey,
      filterTagIds,
      perPage,
      requestedByMentee,
      requestedByMentor
    } = this.state
    let { searchValue } = this.state
    let filteredQuery = ''
    if (fromDate) {
      filteredQuery += `{createdAt_gte: "${fromDate !== null ? fromDate : ''}"},`
      shouldFetch = true
    }
    if (toDate) {
      filteredQuery += `{createdAt_lte: "${toDate !== null ? toDate : ''}"},`
      shouldFetch = true
    }

    if (searchKey !== 'Approval Status') {
      filteredQuery += `${this.getAdditionalFilter()}`
    }

    if (requestedByMentee) {
      filteredQuery += '{hasRequestedByMentee: true}'
    }
    if (requestedByMentor) {
      filteredQuery += '{hasRequestedByMentor: true}'
    }
    if (shouldFetch && searchValue === '') {
      this.fetchUserSavedCodeBasedOnUserRole(filteredQuery, perPage, 0)
      shouldFetch = false
    }

    if (searchValue !== '' || filterTagIds.length >= 0) {
      searchValue = searchValue.toLowerCase().trim()
      switch (searchKey) {
        case 'Student Name':
          filteredQuery += `{user_some:{name_contains:"${searchValue}"}},`
          this.fetchUserSavedCodeBasedOnUserRole(filteredQuery, perPage, 0)
          break
        case 'Title':
          filteredQuery += `{fileName_contains:"${searchValue}"},`
          this.fetchUserSavedCodeBasedOnUserRole(filteredQuery, perPage, 0)
          break
        case 'Approval Status':
          filteredQuery += `{isApprovedForDisplay: ${searchValue}},`
          this.fetchUserSavedCodeBasedOnUserRole(filteredQuery, perPage, 0)
          break
        case 'Published Status':
          filteredQuery += `{userApprovedCode_some:{status:${searchValue}}},`
          this.fetchUserSavedCodeBasedOnUserRole(filteredQuery, perPage, 0)
          break
        case 'Tags':
          if (filterTagIds.length > 0) {
            filteredQuery += `{
              userApprovedCode_some: {
                userApprovedCodeTagMappings_some: {
                  userApprovedCodeTag_some:{id_in:[${getIdArrForQuery(filterTagIds)}]}
                }
              }
            }`
          }
          this.fetchUserSavedCodeBasedOnUserRole(filteredQuery, perPage, 0)
          break
        default:
          break
      }
    }
    this.setState({
      filterQuery: filteredQuery,
    })
  }

  render() {
    const {
      toDate,
      fromDate,
      perPage,
      currentPage, selectedSavedCode } = this.state
    const isMentorLoggedIn = getDataFromLocalStorage('login.role') === MENTOR
    const { userSavedCodesCount, userApprovedCodeTags } = this.props
    return (
      <>
        <CodeApprovalStyle.TopContainer>
          <div style={{ marginRight: '20px', minWidth: '438px' }}>
            <SearchBox setFilters={this.setFilters}
              userApprovedCodeTags={userApprovedCodeTags && userApprovedCodeTags.toJS()}
            />
          </div>
          <div>
            <Pagination
              total={!userSavedCodesCount ? 0 : userSavedCodesCount}
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
        </CodeApprovalStyle.TopContainer>
        <CodeApprovalStyle.PaginationContainer>
          <div>
            <div>
              <CodeApprovalStyle.SwitchMD
                checked={this.state.requestedByMentee}
                onChange={(checked) => {
                  this.setState({
                    requestedByMentee: checked
                  }, () => {
                    this.searchByFilter(true)
                  })
                }}
                size='small'
              />
              Review Requested By Mentee
            </div>
            {!isMentorLoggedIn ? (
              <div style={{ marginTop: '8px' }}>
                <CodeApprovalStyle.SwitchMD
                  checked={this.state.requestedByMentor}
                  onChange={(checked) => {
                    this.setState({
                      requestedByMentor: checked
                    }, () => {
                      this.searchByFilter(true)
                    })
                  }}
                  size='small'
                />
                Review Requested By Mentor
              </div>
            ) : null}
          </div>
          <div>
            Total Count: {userSavedCodesCount && userSavedCodesCount || 0}
          </div>
        </CodeApprovalStyle.PaginationContainer>
        <MDTable
          history={this.props.history}
          openEditModal={(savedCode) => {
            this.setState({
              selectedSavedCode: savedCode,
              isSavedCodeModalVisible: true
            })
          }}
          openCommentsModal={(savedCode) => {
            this.setState({
              selectedSavedCode: savedCode,
              isCommentsModalVisible: true
            })
          }}
          isReviewRequested={this.state.requestedByMentee || this.state.requestedByMentor}
          filterQuery={{
            requestedByMentee: this.state.requestedByMentee,
            requestedByMentor: this.state.requestedByMentor
          }}
          searchByFilter={this.searchByFilter}
          userSavedCodes={this.props.userSavedCodes}
          isUserSavedCodeUpdating={this.props.isUserSavedCodeUpdating}
          isUserApprovedCodeUpdating={this.props.isUserApprovedCodeUpdating}
          isUserSavedCodeFetched={this.props.isUserSavedCodeFetched}
          isUserSavedCodeFetching={this.props.isUserSavedCodeFetching ||
            this.props.isSalesOperationFetching}
        />
        <CommentsModal
          id='Rejection Comments'
          visible={this.state.isCommentsModalVisible}
          title='Rejection Comment'
          closeCommentsModal={shouldStateUpdate => {
            const updateSavedCodeData = shouldStateUpdate ?
              { ...this.state.selectedSavedCode, isApprovedForDisplay: 'rejected' }
              : this.state.selectedSavedCode
             this.setState({
                selectedSavedCode: updateSavedCodeData,
                isCommentsModalVisible: false
              })
          }}
          rejectionComment={get(this.state.selectedSavedCode, 'rejectionComment')}
          selectedSavedCode={selectedSavedCode}
          isUserSavedCodeUpdating={this.props.isUserSavedCodeUpdating}
        />
        <SavedCodeModal
          isReviewRequested={this.state.requestedByMentee || this.state.requestedByMentor}
          isSavedCodeModalVisible={this.state.isSavedCodeModalVisible}
          selectedSavedCode={selectedSavedCode}
          isUserSavedCodeUpdating={this.props.isUserSavedCodeUpdating}
          userSavedCodes={this.props.userSavedCodes}
          history={this.props.history}
          setSelectedSavedCode={(userSavedCodesData, index) => {
            this.setState({
              selectedSavedCode: userSavedCodesData[index]
            })
          }}
          openCommentsModal={(savedCode) => {
            this.setState({
              selectedSavedCode: savedCode,
              isCommentsModalVisible: true
            })
          }}
          filterQuery={{
            requestedByMentee: this.state.requestedByMentee,
            requestedByMentor: this.state.requestedByMentor
          }}
          onModalClose={() => {
              this.setState({
                  selectedSavedCode: null,
                  isSavedCodeModalVisible: false
              })
          }}
        />
      </>
    )
  }
}

export default CodeApproval
