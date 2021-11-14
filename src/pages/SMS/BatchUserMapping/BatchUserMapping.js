/* esling-disable max-len */
import { Pagination, notification } from 'antd'
import React, { Component } from 'react'
import { sortBy } from 'lodash'
import PropTypes from 'prop-types'
import { get } from 'immutable'
import { withRouter } from 'react-router-dom'
import fetchBatchInfo from '../../../actions/batchUserMap/fetchBatchInfo'
import withNav from '../../../components/withNav'
import BatchUserMappingStyle from './BatchUserMapping.style'
import BatchSearch from './components/BatchSearch'
import BatchUserTable from './components/BatchUserTable'
import fetchMentors from '../../../actions/assignTime/fetchMentors'
import getDataFromLocalStorage from '../../../utils/extract-from-localStorage'
import { SCHOOL_ADMIN } from '../../../constants/roles'
import fetchAllSchools from '../../../actions/smsDashboard/fetchAllSchools'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'

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
      datasArray: [],
      schools: []
    }
  }

  async componentWillMount() {
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
    const savedRole = getDataFromLocalStorage('login.role')
    if (this.state.batchCode) {
      if (savedRole === SCHOOL_ADMIN) {
        const savedId = getDataFromLocalStorage('login.id')
        const { schools } = await fetchAllSchools(savedId)
        this.setState({
          schools: schools.map(({ id }) => id)
        }, () => fetchBatchInfo({
          first: this.state.perPage,
          skip: this.state.currentPage - 1,
          typeFilter: '{type_not: normal}',
          filter: `{code: "${this.state.batchCode}"} {
          students_some: {
            school_some: { id_in: [${getIdArrForQuery(this.state.schools)}] }
          }
        }`
        }))
      } else {
        await fetchBatchInfo({
          first: this.state.perPage,
          skip: this.state.currentPage - 1,
          typeFilter: '{type_not: normal}',
          filter: `{code: "${this.state.batchCode}"}`
        })
      }
    } else if (!this.state.batchCode) {
      if (savedRole === SCHOOL_ADMIN) {
        const savedId = getDataFromLocalStorage('login.id')
        const { schools } = await fetchAllSchools(savedId)
        this.setState({
          schools: schools.map(({ id }) => id)
        }, () => fetchBatchInfo({
          first: this.state.perPage,
          skip: this.state.currentPage - 1,
          typeFilter: `{type_not: normal} {
          students_some: {
            school_some: { id_in: [${getIdArrForQuery(this.state.schools)}] }
          }
        }`,
        }))
      } else {
        await fetchBatchInfo({
          first: this.state.perPage,
          skip: this.state.currentPage - 1,
          typeFilter: '{type_not: normal}'
        })
      }
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
    const savedRole = getDataFromLocalStorage('login.role')
    const { schools, batchCode } = this.state
    if (prevProps.isDeletingStudent && this.props.hasDeletedStudent) {
      fetchBatchInfo({
        first: this.state.perPage,
        skip: this.state.currentPage - 1,
        typeFilter: '{type_not: normal}',
        filter: `
          ${savedRole === SCHOOL_ADMIN && schools.length > 0 ? `
            {
              students_some: {
                school_some: { id_in: [${getIdArrForQuery(schools)}] }
              }
            }
          ` : ''},
          ${batchCode ? `{code: "${this.state.batchCode}"}` : ''}
        `
      })
    }
    if (prevProps.isAddingStudent && this.props.hasAddedStudent) {
      fetchBatchInfo({
        first: this.state.perPage,
        skip: this.state.currentPage - 1,
        typeFilter: '{type_not: normal}',
        filter: `
          ${savedRole === SCHOOL_ADMIN && schools.length > 0 ? `
            {
              students_some: {
                school_some: { id_in: [${getIdArrForQuery(schools)}] }
              }
            }
          ` : ''},
          ${batchCode ? `{code: "${this.state.batchCode}"}` : ''}
        `
      })
      notification.success({
        message: 'Student(s) added successfully!'
      })
    }
  }

  onPageChange = (page) => {
    const savedRole = getDataFromLocalStorage('login.role')
    const { schools } = this.state
    this.setState(
      {
        currentPage: page,
      },
      () => {
        fetchBatchInfo({
          first: this.state.perPage,
          skip: this.state.currentPage - 1,
          filter: `${
            savedRole === SCHOOL_ADMIN && schools.length > 0 ? `
          {
            students_some: {
              school_some: { id_in: [${getIdArrForQuery(schools)}] }
            }
          }
          ` : ''
          }`,
          typeFilter: '{type_not: normal}',
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
    const { searchKey, schools } = this.state
    let { searchValue } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    searchValue = searchValue.trim()
    switch (searchKey) {
      case 'Batch Code':
        this.setState(
          {
            filter: `{code_contains: "${searchValue}"}, ${
              savedRole === SCHOOL_ADMIN && schools.length > 0 ? `
          {
            students_some: {
              school_some: { id_in: [${getIdArrForQuery(schools)}] }
            }
          }
          ` : ''
            }`
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'Allotted Mentor':
        this.setState(
          {
            filter: `{allottedMentor_some: {id: "${searchValue}"}}, ${
              savedRole === SCHOOL_ADMIN && schools.length > 0 ? `
          {
            students_some: {
              school_some: { id_in: [${getIdArrForQuery(schools)}] }
            }
          }
          ` : ''
            }`
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
      schools
    } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    if (searchKey === 'All') {
      this.setState({
        searchKey: 'All',
        searchValue: '',
        filter: null,
        currentPage: 1
      }, async () => fetchBatchInfo({
        first: this.state.perPage,
        skip: this.state.currentPage - 1,
        typeFilter: '{type_not: normal}',
        filter: savedRole === SCHOOL_ADMIN && schools.length > 0 ? `
        {
          students_some: {
            school_some: { id_in: [${getIdArrForQuery(schools)}] }
          }
        }
        ` : ''
      })
      )
    } else if (searchKey !== 'All' && searchValue !== '') {
      this.setState({
        currentPage: 1
      }, async () => fetchBatchInfo({
        first: this.state.perPage,
        skip: this.state.currentPage - 1,
        filter,
        typeFilter: '{type_not: normal}'
      })
      )
    }
  }

  render() {
    const { students, batchesSearched } = this.props
    const { datasArray } = this.state
    return (
      <div>
        <BatchUserMappingStyle.TopContainer>
          <BatchSearch setFilters={this.setFilters} datasArray={datasArray} />
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
