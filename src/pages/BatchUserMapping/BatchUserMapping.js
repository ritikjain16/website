/* eslint-disable max-len */
import { Pagination, notification } from 'antd'
import React, { Component } from 'react'
import { sortBy } from 'lodash'
import PropTypes from 'prop-types'
import { get } from 'immutable'
import { withRouter } from 'react-router-dom'
import fetchBatchInfo from '../../actions/batchUserMap/fetchBatchInfo'
import withNav from '../../components/withNav'
import BatchUserMappingStyle from './BatchUserMapping.style'
import BatchSearch from './components/BatchSearch'
import BatchUserTable from './components/BatchUserTable'
import fetchMentorsSales from '../../actions/batchUserMap/fetchMentorsSales'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import { MENTOR, SALES_EXECUTIVE } from '../../constants/roles'
import fetchMentors from '../../actions/assignTime/fetchMentors'

class BatchUserMapping extends Component {
  static propTypes = {
    fetchBatchInfo: PropTypes.func.isRequired,
    hasBatchesFetched: PropTypes.bool.isRequired,
    batches: PropTypes.arrayOf(PropTypes.object).isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      batchCode: this.props.match.params.code,
      currentPage: 1,
      perPage: 10,
      batchInfo: [],
      searchKey: 'All',
      searchValue: '',
      filter: null,
      mentorsId: [],
      role: '',
      datasArray: []
    }
  }

  async componentWillMount() {
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole && savedRole === SALES_EXECUTIVE) {
      const { batchCode } = this.state
      const salesId = getDataFromLocalStorage('login.id')
      await fetchMentorsSales(salesId).then(res => {
        this.setState({
          mentorsId: res.user.salesExecutiveProfile.mentors.map(({ user }) => user.id),
          role: savedRole
        })
      })
      fetchBatchInfo({
        first: this.state.perPage,
        skip: this.state.currentPage - 1,
        typeFilter: '{type: normal}',
        role: this.state.role,
        mentorsId: this.state.mentorsId,
        filter: batchCode ? `{code: "${batchCode}"}` : ''
      })
      await fetchMentors().then(() => {
        this.setState({
          datasArray: [...new Set(this.props.mentors.toJS().map(({ id, name }) => (
            {
              id,
              name
            }
          )))]
        })
      })
    } else if (savedRole && savedRole === MENTOR) {
      const savedId = getDataFromLocalStorage('login.id')
      const { batchCode } = this.state
      this.setState({
        mentorsId: [savedId],
        role: savedRole
      })
      fetchBatchInfo({
        first: this.state.perPage,
        skip: this.state.currentPage - 1,
        typeFilter: '{type: normal}',
        role: savedRole,
        mentorsId: [savedId],
        filter: batchCode ? `{code: "${batchCode}"}` : ''
      })
      await fetchMentors().then(() => {
        this.setState({
          datasArray: [...new Set(this.props.mentors.toJS().map(({ id, name }) => (
            {
              id,
              name
            }
          )))]
        })
      })
    } else {
      const { batchCode } = this.state
      fetchBatchInfo({
        first: this.state.perPage,
        skip: this.state.currentPage - 1,
        typeFilter: '{type: normal}',
        role: this.state.role,
        mentorsId: this.state.mentorsId,
        filter: batchCode ? `{code: "${batchCode}"}` : ''
      })
      await fetchMentors().then(() => {
        this.setState({
          datasArray: [...new Set(this.props.mentors.toJS().map(({ id, name }) => (
            {
              id,
              name
            }
          )))]
        })
      })
    }
  }

  componentDidMount() {
    this.setState(
      {
        batchInfo: this.props.batches.toJS(),
        datasArray: [...new Set(this.props.mentors.toJS().map(({ id, name }) => (
          {
            id,
            name
          }
        )))]
      }
    )
  }

  componentDidUpdate(prevProps) {
    const { batchCode } = this.state
    if (prevProps.isDeletingStudent && this.props.hasDeletedStudent) {
      fetchBatchInfo({
        first: this.state.perPage,
        skip: this.state.currentPage - 1,
        typeFilter: '{type: normal}',
        role: this.state.role,
        mentorsId: this.state.mentorsId,
        filter: batchCode ? `{code: "${batchCode}"}` : ''
      })
    }
    if (prevProps.isAddingStudent && this.props.hasAddedStudent) {
      fetchBatchInfo({
        first: this.state.perPage,
        skip: this.state.currentPage - 1,
        typeFilter: '{type: normal}',
        role: this.state.role,
        mentorsId: this.state.mentorsId,
        filter: batchCode ? `{code: "${batchCode}"}` : ''
      })
      notification.success({
        message: 'Student(s) added successfully!'
      })
    }
  }

  onPageChange = (page) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        fetchBatchInfo({
          first: this.state.perPage,
          skip: this.state.currentPage - 1,
          filter: this.state.filter,
          typeFilter: '{type: normal}',
          role: this.state.role,
          mentorsId: this.state.mentorsId
        })
      }
    )
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
      case 'Batch Code':
        this.setState(
          {
            filter: `{code_contains: "${searchValue}"}`
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'Allotted Mentor':
        this.setState(
          {
            filter: `{allottedMentor_some: {id: "${searchValue}"}}`
          },
          this.callFetchQueryForFiltering
        )
        break
      default:
        this.setState(
          {
            filter: null
          },
          this.callFetchQueryForFiltering
        )
        break
    }
  }
  callFetchQueryForFiltering = () => {
    const {
      searchKey,
      filter,
      searchValue,
    } = this.state
    if (searchKey === 'All') {
      this.setState({
        searchKey: 'All',
        searchValue: '',
        filter: null,
        currentPage: 1
      }, async () => fetchBatchInfo({
        first: this.state.perPage,
        skip: this.state.currentPage - 1,
        typeFilter: '{type: normal}',
        role: this.state.role,
        mentorsId: this.state.mentorsId
      })
      )
    } else if (searchKey !== 'All' && searchValue !== '') {
      this.setState({
        currentPage: 1
      }, async () => fetchBatchInfo({
        first: this.state.perPage,
        skip: this.state.currentPage - 1,
        filter,
        typeFilter: '{type: normal}',
        role: this.state.role,
        mentorsId: this.state.mentorsId
      })
      )
    }
  }

  render() {
    const { students, batchesSearched, isFetchingMentors } = this.props
    const { datasArray } = this.state
    return (
      <div>
        <BatchUserMappingStyle.TopContainer>
          <BatchSearch setFilters={this.setFilters} datasArray={datasArray} isFetchingMentors={isFetchingMentors} />
          <div style={{ width: '100%', display: 'flex', justifyContent: 'start' }}>
            <Pagination
              total={get(this.props.batchesMeta.toJS(), 'count', 0)}
              onChange={this.onPageChange}
              current={this.state.currentPage}
              defaultPageSize={this.state.perPage}
            />
          </div>
        </BatchUserMappingStyle.TopContainer>
        {sortBy(this.props.batches.toJS(), 'createdAt').reverse().map((items) => (
          <BatchUserTable
            {...this.props}
            batches={items}
            batchesSearched={!batchesSearched ? [] : batchesSearched.toJS()}
            batchesData={this.state.batchInfo}
            studentsInfo={!students ? [] : students.toJS()}
          />
        ))}
      </div>
    )
  }
}

export default withRouter(
  withNav(BatchUserMapping)({
    title: 'Batch-User Mapping',
    activeNavItem: 'Batch-User Mapping',
    showUMSAndSMSNavigation: true,
  })
)
