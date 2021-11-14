import { Button, Icon, Input, notification, Pagination, Select } from 'antd'
import Text from 'antd/lib/typography/Text'
import { get, sortBy } from 'lodash'
import moment from 'moment'
import React from 'react'
import fetchBdprofiles from '../../../actions/bdManagement/fetchBdProfiles'
import { fetchSchoolList } from '../../../actions/SchoolOnboarding'
import DateRangePicker from '../../../components/FromToDatePicker/DateRangePicker'
import { BDE } from '../../../constants/roles'
import getDataFromLocalStorage from '../../../utils/extract-from-localStorage'
import BDManagementStyle from './BDManagement.style'
import AddSchoolModal from './components/AddSchoolModal'
import BDManagementTable from './components/BDManagementTable'

const { Option } = Select

class BDManagementPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bdProfilesData: [],
      searchKey: 'All',
      searchValue: '',
      perPage: 15,
      skip: 0,
      currentPage: 1,
      fromDate: null,
      toDate: null,
      showAddSchoolModal: false,
      schoolsData: [],
      selectedBDId: '',
      addedSchools: [],
      loading: true
    }
  }
  componentDidMount = () => {
    this.fetchBDEProfileData()
  }

  fetchBDEProfileData = async (loading = true) => {
    if (!loading) this.setState({ loading })
    const { searchKey, searchValue, perPage, skip, fromDate, toDate } = this.state
    let filterQuery = ''
    if (fromDate) {
      filterQuery += ` { createdAt_gte: "${moment(fromDate).startOf('day')}" }`
    }
    if (toDate) {
      filterQuery += ` { createdAt_lte: "${moment(toDate).endOf('day')}" }`
    }
    if (searchKey === 'Phone' && searchValue) {
      filterQuery += `{ user_some: { phone_number_subDoc_contains: "${searchValue}" } }`
    }
    if (searchKey === 'Email' && searchValue) {
      filterQuery += `{ user_some: { email_contains: "${searchValue}" } }`
    }
    if (searchKey === 'School Name' && searchValue) {
      filterQuery += `{ schools_some: { name_contains: "${searchValue}" } }`
    }
    if (searchKey === 'Name' && searchValue) {
      filterQuery += `{ user_some: { name_contains: "${searchValue}" } }`
    }
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole === BDE) {
      const savedid = getDataFromLocalStorage('login.id')
      filterQuery += `{ user_some: { id: "${savedid}" } }`
    }
    await fetchBdprofiles({ filterQuery, perPage, skip })
    if (!this.state.loading) this.setState({ loading: true })
  }
  componentDidUpdate = (prevProps) => {
    const { bdProfileFetchStatus, schoolFetchingStatus,
      bdProfileUpdatingStatus, bdProfileUpdateFailure } = this.props
    if (bdProfileFetchStatus && !get(bdProfileFetchStatus.toJS(), 'loading')
      && get(bdProfileFetchStatus.toJS(), 'success') &&
      (prevProps.bdProfileFetchStatus !== bdProfileFetchStatus)) {
      this.setBDEProfiles()
    }
    if (schoolFetchingStatus && !get(schoolFetchingStatus.toJS(), 'loading')
      && get(schoolFetchingStatus.toJS(), 'success') &&
      (prevProps.schoolFetchingStatus !== schoolFetchingStatus)) {
      this.setState({
        schoolsData: this.props.schoolsData && this.props.schoolsData.toJS() || []
      })
    }

    if (bdProfileUpdatingStatus && !get(bdProfileUpdatingStatus.toJS(), 'loading')
      && get(bdProfileUpdatingStatus.toJS(), 'success') &&
      (prevProps.bdProfileUpdatingStatus !== bdProfileUpdatingStatus)) {
      this.setBDEProfiles()
    } else if (bdProfileUpdatingStatus && !get(bdProfileUpdatingStatus.toJS(), 'loading')
      && get(bdProfileUpdatingStatus.toJS(), 'failure') &&
      (prevProps.bdProfileUpdateFailure !== bdProfileUpdateFailure)) {
      if (bdProfileUpdateFailure && bdProfileUpdateFailure.toJS().length > 0) {
        notification.error({
          message: get(get(bdProfileUpdateFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
  }

  setBDEProfiles = () => {
    let { bdProfileData } = this.props
    bdProfileData = bdProfileData && bdProfileData.toJS() || []
    this.setState({
      bdProfilesData: sortBy(bdProfileData, 'createdAt')
    })
  }
  handleSearchKeyChange = (value) => {
    this.setState({
      searchKey: value,
      searchValue: ''
    }, () => {
      if (value === 'All') {
        this.fetchBDEProfileData()
      }
    })
  }

  handleDateChange = (event, type) => {
    if (type === 'from') {
      this.setState({
        fromDate: event && (new Date(event)).toDateString(),
      }, this.fetchBDEProfileData)
    } else if (type === 'to') {
      this.setState({
        toDate: event && (new Date(event)).toDateString()
      }, this.fetchBDEProfileData)
    }
  }
  onPageChange = (page) => {
    this.setState({
      currentPage: page,
      skip: page - 1
    }, this.fetchBDEProfileData)
  }

  handleClearFilter = () => {
    this.setState({
      searchKey: 'All',
      searchValue: '',
      fromDate: null,
      toDate: null,
      currentPage: 1,
      skip: 0
    }, this.fetchBDEProfileData)
  }

  onOpenAddSchoolModal = (selectedBDId, addedSchools) => {
    const { schoolsData } = this.state
    if (schoolsData.length === 0) fetchSchoolList()
    this.setState({
      selectedBDId,
      showAddSchoolModal: true,
      addedSchools
    })
  }
  onCloseAddSchoolModal = () => {
    this.setState({
      showAddSchoolModal: false,
      selectedBDId: '',
      addedSchools: []
    })
  }
  render() {
    const { searchKey, searchValue, bdProfilesData,
      fromDate, toDate, perPage, currentPage,
      selectedBDId, showAddSchoolModal,
      schoolsData, addedSchools, loading } = this.state
    const filterOptions = ['All', 'Name', 'Phone', 'Email', 'School Name']
    const { bdUserProfileMeta, bdProfileFetchStatus,
      schoolFetchingStatus, bdProfileAddingStatus, bdProfileUpdatingStatus } = this.props
    const fetchLoading = loading && bdProfileFetchStatus && get(bdProfileFetchStatus.toJS(), 'loading')
    const schoolFetchStatus = schoolFetchingStatus && get(schoolFetchingStatus.toJS(), 'loading')
    const savedRole = getDataFromLocalStorage('login.role')
    return (
      <>
        <BDManagementStyle.FlexContainer spacebetween>
          {
            savedRole !== BDE ? (
              <BDManagementStyle.FlexContainer>
                <Select
                  style={{ minWidth: '200px', marginRight: '10px' }}
                  value={searchKey}
                  onChange={this.handleSearchKeyChange}
                >
                  {
              filterOptions.map(option => (
                <Option
                  key={option}
                >{option}
                </Option>
              ))
            }
                </Select>
                {
              searchKey !== 'All' &&
              <BDManagementStyle.FlexContainer>
                <Input
                  placeholder={`Search by ${searchKey}`}
                  type='text'
                  value={searchValue}
                  onChange={(e) => this.setState({
                    searchValue: e.target.value
                  })}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      this.fetchBDEProfileData()
                    }
                  }}
                />
                <Button type='primary' onClick={this.fetchBDEProfileData} style={{ marginLeft: '10px' }}>
                  <Icon type='search' />
                </Button>
              </BDManagementStyle.FlexContainer>
            }
              </BDManagementStyle.FlexContainer>
            ) : <div />
          }
          {
            bdUserProfileMeta && bdUserProfileMeta > perPage ? (
              <Pagination
                total={bdUserProfileMeta || 0}
                onChange={this.onPageChange}
                current={currentPage}
                defaultPageSize={perPage}
              />
            ) : <div />
          }
          <div>
            {
              savedRole !== BDE && (
                <DateRangePicker
                  fromDate={fromDate}
                  toDate={toDate}
                  handleDateChange={this.handleDateChange}
                />
              )
            }
          </div>
        </BDManagementStyle.FlexContainer>
        {
          savedRole !== BDE && (
            <BDManagementStyle.ButtonContainer>
              <Button type='primary' onClick={this.handleClearFilter} >Clear Filter</Button>
              <Text >Total BD users {bdUserProfileMeta || 0}
              </Text>
            </BDManagementStyle.ButtonContainer>
          )
        }
        <AddSchoolModal
          selectedBDId={selectedBDId}
          schoolsData={schoolsData}
          showAddSchoolModal={showAddSchoolModal}
          schoolFetchStatus={schoolFetchStatus}
          addedSchools={addedSchools}
          onCloseAddSchoolModal={this.onCloseAddSchoolModal}
          bdProfileAddingStatus={bdProfileAddingStatus}
          bdProfileUpdatingStatus={bdProfileUpdatingStatus}
          fetchBDEProfileData={() => this.fetchBDEProfileData(false)}
        />
        <BDManagementTable
          showLoading={fetchLoading}
          bdProfilesData={bdProfilesData}
          onOpenAddSchoolModal={this.onOpenAddSchoolModal}
        />
        </>
    )
  }
}

export default BDManagementPage
