import React from 'react'
import { DatePicker, Pagination, Button } from 'antd'
import moment from 'moment'
import ApprovedCodeTagsStyle from './ApprovedCodeTags.style'
import fetchUserApprovedCodeTags from '../../actions/userApprovedCodeTags/fetchUserApprovedCodeTags'
import MDTable from './components/MDTable'
import SearchBox from './components/SearchBox'
import TagsModal from './components/TagsModal'
import { fetchContentTags } from '../../actions/contentTags'

class ApprovedCodeTags extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fromDate: null,
      toDate: null,
      perPage: 20,
      skip: 0,
      currentPage: 1,
      searchKey: 'Search By',
      searchValue: '',
      filterQuery: '',
      addTags: false,
      updateTags: null,
      tagType: 'Approved Tags'
    }
  }

  componentDidMount = async () => {
    const { tagType, filterQuery, perPage, skip } = this.state
    if (tagType === 'Approved Tags') {
      await fetchUserApprovedCodeTags(filterQuery, perPage, skip)
    } else if (tagType === 'Content Tags') {
      fetchContentTags(filterQuery, perPage, skip)
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
    }, () => {
      if (this.state.tagType === 'Approved Tags') {
        fetchUserApprovedCodeTags(this.state.filterQuery, this.state.perPage, this.state.skip)
      } else {
        fetchContentTags(this.state.filterQuery, this.state.perPage, this.state.skip)
      }
    })
  }

  setFilters = (state) => {
    if (state.searchKey === 'Search By') {
      this.setState({
        filterQuery: '',
        fromDate: null,
        toDate: null,
        skip: 0,
        currentPage: 1,
      }, () => {
        if (this.state.tagType === 'Approved Tags') {
          fetchUserApprovedCodeTags(this.state.filterQuery, this.state.perPage, 0)
        } else {
          fetchContentTags(this.state.filterQuery, this.state.perPage, 0)
        }
      })
    }
    this.setState({
      ...state,
      skip: 0,
      currentPage: 1
    },
    () => {
      if (this.state.searchKey && this.state.searchValue !== '') {
        this.searchByFilter()
      }
    })
  }

  searchByFilter = (shouldFetch = false) => {
    const {
      fromDate,
      toDate,
      searchKey,
      perPage,
      tagType
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
    if (!toDate && !fromDate) {
      shouldFetch = true
    }
    if (shouldFetch && searchValue === '') {
      if (tagType === 'Approved Tags') {
        fetchUserApprovedCodeTags(filteredQuery, perPage, 0)
      } else {
        fetchContentTags(filteredQuery, perPage, 0)
      }
      shouldFetch = false
    }

    if (searchValue !== '') {
      searchValue = searchValue.toLowerCase()
      switch (searchKey) {
        case 'Tag Name':
          filteredQuery += `{title_contains:"${searchValue}"}`
          if (tagType === 'Approved Tags') {
            fetchUserApprovedCodeTags(filteredQuery, perPage, 0)
          } else {
            fetchContentTags(filteredQuery, perPage, 0)
          }
          break
        default:
          break
      }
    }
    this.setState({
      filterQuery: filteredQuery,
    })
  }

  clearFilter = () => {
    this.setState({
      searchKey: 'Search by',
      searchValue: '',
      fromDate: null,
      toDate: null,
      skip: 0,
      currentPage: 1,
      filterQuery: ''
    }, () => this.searchByFilter(true))
  }

  render() {
    const {
      toDate,
      fromDate,
      perPage,
      currentPage,
      addTags,
      updateTags,
      tagType } = this.state
    const { userApprovedCodeTags, userApprovedCodeTagsCount, contentTags,
      isContentTagsFetching, isContentTagsFetched, contentTagsCount } = this.props
    return (
      <>
        <ApprovedCodeTagsStyle.TopContainer>
          <div style={{ marginRight: '20px', minWidth: '438px' }}>
            <SearchBox setFilters={this.setFilters} />
          </div>
          <ApprovedCodeTagsStyle.Select
            placeholder='Select type tags'
            value={tagType}
            onChange={(value) =>
              this.setState({ tagType: value }, () => this.searchByFilter())}
            style={{ position: 'absolute', top: '15px', left: '350px' }}
          >
            {['Approved Tags', 'Content Tags'].map(d => (
              <ApprovedCodeTagsStyle.Option
                key={d}
                value={d}
              >{d}
              </ApprovedCodeTagsStyle.Option>
            ))}
          </ApprovedCodeTagsStyle.Select>
          <div>
            <Pagination
              total={tagType === 'Approved Tags' ?
                (userApprovedCodeTagsCount && userApprovedCodeTagsCount || 0) :
                (contentTagsCount && contentTagsCount || 0)}
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
        </ApprovedCodeTagsStyle.TopContainer>
        <ApprovedCodeTagsStyle.PaginationContainer>
          <Button type='primary' onClick={this.clearFilter} style={{ marginRight: '10px' }} >
            Clear Filter
          </Button>
          <h3 style={{ margin: '0px' }} >
            Total Count: {
              tagType === 'Approved Tags' ?
                (userApprovedCodeTagsCount && userApprovedCodeTagsCount || 0) :
                (contentTagsCount && contentTagsCount || 0)}
          </h3>
          <ApprovedCodeTagsStyle.StyledButton
            type='primary'
            icon='plus'
            id='add-btn'
            onClick={() => this.setState({ addTags: true })}
          >
            Add New Tag
          </ApprovedCodeTagsStyle.StyledButton>
          <TagsModal
            visible={addTags || Boolean(updateTags)}
            operation={addTags ? 'add' : 'update'}
            searchByFilter={this.searchByFilter}
            updateTagsData={updateTags}
            tagType={tagType}
            closeUpdateModal={() => this.setState({ updateTags: null })}
            setUpdateTags={(value) => this.setState({ updateTags: value },
              () => this.searchByFilter(true))}
            setAddTags={(value) => this.setState({ addTags: value })}
            TagsAddedStatus={this.props.TagsAddedStatus && this.props.TagsAddedStatus}
            TagsAddedFailure={this.props.TagsAddedFailure && this.props.TagsAddedFailure.toJS()}
            TagsUpdateStatus={this.props.TagsUpdateStatus && this.props.TagsUpdateStatus}
            contentTagAddStatus={this.props.contentTagAddStatus && this.props.contentTagAddStatus}
            contentTagAddFailure={this.props.contentTagAddFailure &&
              this.props.contentTagAddFailure.toJS()}
            contentTagUpdateStatus={this.props.contentTagUpdateStatus &&
              this.props.contentTagUpdateStatus}
          />
        </ApprovedCodeTagsStyle.PaginationContainer>
        <MDTable
          searchByFilter={this.searchByFilter}
          setUpdateTags={(value) => this.setState({ updateTags: value })}
          userApprovedCodeTags={userApprovedCodeTags}
          contentTags={contentTags}
          tagType={tagType}
          isUserApprovedCodeTagsUpdating={this.props.isUserApprovedCodeTagsUpdating}
          isUserApprovedCodeTagsFetched={this.props.isUserApprovedCodeTagsFetched}
          isContentTagsFetched={isContentTagsFetched}
          isContentTagsFetching={isContentTagsFetching}
          isUserApprovedCodeTagsFetching={this.props.isUserApprovedCodeTagsFetching}
          TagsDeleteFailure={this.props.TagsDeleteFailure && this.props.TagsDeleteFailure.toJS()}
          TagsDeleteStatus={this.props.TagsDeleteStatus && this.props.TagsDeleteStatus}
          contentTagsDeleteFailure={this.props.contentTagsDeleteFailure
            && this.props.contentTagsDeleteFailure}
          contentTagsDeleteStatus={this.props.contentTagsDeleteStatus
            && this.props.contentTagsDeleteStatus}
        />
      </>
    )
  }
}

export default ApprovedCodeTags
