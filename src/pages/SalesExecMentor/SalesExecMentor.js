/* eslint-disable max-len */
import React, { Component, Fragment } from 'react'
import { Pagination } from 'antd'
import { get } from 'lodash'
import { ADMIN, SALES_EXECUTIVE, UMS_ADMIN, UMS_VIEWER } from '../../constants/roles'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import SearchBox from './components/SearchBox'
import SalesExecMentorStyle from './SalesExecMentor.style'
import SalesExecMentorTable from './components/SalesExecMentorTable'
import fetchMentors from '../../actions/salesExecProfiles/fetchMentors'
import fetchMentorsList from '../../actions/salesExecProfiles/fetchMentorsList'

export default class SalesExecMentor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      salesExecMentorData: [],
      salesExecutiveToDisplay: 0,
      currentPage: 1,
      perPage: 2,
      allMentorsData: [],
      searchKey: 'All',
      searchValue: '',
      salesExecFilter: null
    }
  }
  async componentWillMount() {
    const { hasSalesExecMentorFetched } = this.props
    const role = getDataFromLocalStorage('login.role')
    if (!hasSalesExecMentorFetched) {
      if (role === ADMIN || role === UMS_ADMIN || role === UMS_VIEWER) {
        fetchMentors({ first: this.state.perPage, skip: this.state.currentPage - 1 })
        await fetchMentorsList()
      } else {
        fetchMentors({ first: 1, skip: 0, salesExecFilter: `{user_some: {id: "${getDataFromLocalStorage('login.id')}"}}` })
        this.setState({
          salesExecFilter: `{user_some: {id: "${getDataFromLocalStorage('login.id')}"}}`
        })
        await fetchMentorsList()
      }
    }
  }

  componentDidMount() {
    this.setState({
      salesExecMentorData: this.props.fetchedMentors ? this.props.fetchedMentors.toJS() : [],
      allMentorsData: this.props.fetchedAllMentors ? this.props.fetchedAllMentors.toJS() : []
    })
  }

  componentDidUpdate(prevProps) {
    const { fetchedMentors, fetchedAllMentors } = this.props
    const { perPage, currentPage, salesExecFilter } = this.state
    if (prevProps.isFetchingSalesExecMentor && this.props.hasSalesExecMentorFetched) {
      this.setState({
        salesExecMentorData: fetchedMentors ? fetchedMentors.toJS() : [],
      })
    }
    const { notification } = this.props
    if (prevProps.isDeletingMentor && this.props.hasDeletedMentor) {
      fetchMentors({
        first: perPage,
        skip: currentPage - 1,
        salesExecFilter
      })
      this.setState({
        salesExecMentorData: fetchedMentors ? fetchedMentors.toJS() : [],
      })
      notification.success({
        message: 'Mentor deleted successfully!'
      })
    }
    if (prevProps.isMentorGroupStatusUpdating && this.props.hasMentorGroupStatusUpdated) {
      fetchMentors({
        first: perPage,
        skip: currentPage - 1,
        salesExecFilter
      })
      this.setState({
        salesExecMentorData: fetchedMentors ? fetchedMentors.toJS() : [],
      })
      notification.success({
        message: 'Mentors status updated successfully!'
      })
    }
    if ((prevProps.isMentorStatusUpdating && this.props.hasMentorStatusUpdated) ||
      (prevProps.isUpdatingMentor && this.props.hasUpdatedMentor)) {
      fetchMentors({
        first: perPage,
        skip: currentPage - 1,
        salesExecFilter
      })
      this.setState({
        salesExecMentorData: fetchedMentors ? fetchedMentors.toJS() : [],
      })
      notification.success({
        message: 'Mentor updated successfully!'
      })
    }
    if (prevProps.isFetchingAllMentors && this.props.hasFetchedAllMentors) {
      this.setState({
        allMentorsData: fetchedAllMentors ? fetchedAllMentors.toJS() : []
      })
    }
    if (prevProps.isAddingMentor && this.props.hasAddedMentor) {
      fetchMentors({
        first: perPage,
        skip: currentPage - 1,
        salesExecFilter
      })
      this.setState({
        salesExecMentorData: fetchedMentors ? fetchedMentors.toJS() : [],
      })
      notification.success({
        message: 'Mentor added successfully!'
      })
    }
  }
  setFilters = (state) => {
    this.setState({
      ...state
    }, function callbackToSearch() {
      this.handleSearchButton()
    })
  }

  handleSearchButton = () => {
    const { searchKey } = this.state
    let { searchValue } = this.state
    searchValue = searchValue.trim()
    switch (searchKey) {
      case 'Sales Exec Name':
        this.setState(
          {
            salesExecFilter: `{user_some:{name_contains: "${searchValue}"}}`
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'Mentor Name':
        this.setState(
          {
            salesExecFilter: `{mentors_some: {user_some: {name_contains: "${searchValue}"}}}`
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'Email':
        this.setState(
          {
            salesExecFilter: `{user_some: {email_contains:"${searchValue}"}}, 
            {mentors_some:
              {user_some:
                {email_contains:"${searchValue}"}
              }
            }`
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'Phone':
        this.setState(
          {
            salesExecFilter: `
            {user_some:
              {phone_number_subDoc_contains:"${searchValue}"}
            },{mentors_some: 
              {user_some:
                {phone_number_subDoc_contains:"${searchValue}"}
              }
            }`
          },
          this.callFetchQueryForFiltering
        )
        break
      default:
        this.setState(
          {
            salesExecFilter: null
          },
          this.callFetchQueryForFiltering
        )
        break
    }
  }

  callFetchQueryForFiltering = () => {
    const {
      searchKey,
      salesExecFilter,
      searchValue,
    } = this.state
    if (searchKey === 'All') {
      this.setState({
        searchKey: 'All',
        searchValue: '',
        salesExecFilter: null,
        currentPage: 1
      }, async () => fetchMentors({
        first: this.state.perPage,
        skip: this.state.currentPage - 1
      })
      )
    } else if (searchKey !== 'All' && searchValue !== '') {
      this.setState({
        currentPage: 1
      }, async () => fetchMentors({
        first: this.state.perPage,
        skip: this.state.currentPage - 1,
        salesExecFilter
      })
      )
    }
  }

  onPageChange = page => {
    this.setState({
      currentPage: page,
      salesExecutiveToDisplay: page
    }, async () => {
      fetchMentors({
        first: this.state.perPage,
        skip: this.state.currentPage - 1,
        salesExecFilter: this.state.salesExecFilter
      })
    })
  }

  render() {
    const { salesExecMentorData, currentPage, perPage,
      salesExecutiveToDisplay, allMentorsData } = this.state
    const { fetchedSalesExecCount } = this.props
    const savedRole = getDataFromLocalStorage('login.role')
    // const savedId = getDataFromLocalStorage('login.id')
    const isAdmin = savedRole === ADMIN
    const isUmsAdmin = savedRole === UMS_ADMIN
    const isUmsViewer = savedRole === UMS_VIEWER
    const isSalesExec = savedRole === SALES_EXECUTIVE
    if (savedRole && !(isAdmin || isUmsAdmin || isUmsViewer || isSalesExec)) {
      return <div>Not Found</div>
    }
    return (
      <Fragment>
        {
          (isAdmin || isUmsAdmin || isUmsViewer) && (
            <SalesExecMentorStyle.TopContainer>
              <SearchBox savedRole={savedRole} setFilters={this.setFilters} />
              <div
                style={{
                  margin: '0px 40px 30px 50px',
                  display: 'block',
                  justifyContent: 'flex-start',
                  width: '100%'
                }}
              >
                {fetchedSalesExecCount && get(fetchedSalesExecCount.toJS(), 'count') > 1 && (
                  <Pagination
                    total={fetchedSalesExecCount && get(fetchedSalesExecCount.toJS(), 'count')
                      ? get(fetchedSalesExecCount.toJS(), 'count') : 0}
                    onChange={this.onPageChange}
                    current={currentPage}
                    defaultPageSize={perPage}
                  />
                )}
              </div>
            </SalesExecMentorStyle.TopContainer>
          )
        }
        <SalesExecMentorTable
          {...this.props}
          mentorsData={salesExecMentorData}
          filters={this.state}
          savedRole={savedRole}
          // setTotalCount={() => this.setTotalCount}
          fetchStatus={this.props.hasSalesExecMentorFetched}
          salesExecutiveToDisplay={salesExecutiveToDisplay}
          allMentorsData={allMentorsData}
        />
      </Fragment>
    )
  }
}
