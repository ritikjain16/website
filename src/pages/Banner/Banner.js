import React from 'react'
import moment from 'moment'
import { Button, notification, Pagination, Select } from 'antd'
import { EyeFilled } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { get } from 'lodash'
import BannerStyle from './Banner.style'
import SearchBox from './components/SearchBox'
import fetchBanners from '../../actions/banner/fetchBanners'
import Action from './components/Action'
import DateInput from './components/DateInput'
import getFullPath from '../../utils/getFullPath'
import PreviewBanner from './components/PreviewBanner'

class Banner extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fromDate: null,
      toDate: null,
      currentPage: 1,
      perPage: 10,
      skip: 0,
      searchKey: 'All',
      searchText: '',
      tableData: [],
      column: [],
      filterQuery: '',
      previewBanner: null
    }
  }
  componentDidMount = async () => {
    const { filterQuery, perPage, skip } = this.state
    await fetchBanners(filterQuery, perPage, skip)
  }
  searchByFilter = () => {
    const { fromDate, toDate, skip, perPage,
      searchKey, searchText } = this.state
    let filteredQuery = ''
    if (fromDate) {
      filteredQuery += `{createdAt_gte: "${fromDate !== null ? fromDate : ''}"},`
    }
    if (toDate) {
      filteredQuery += `{createdAt_lte: "${toDate !== null ? toDate : ''}"},`
    }
    if (searchKey === 'Banner Title' && searchText !== '') {
      filteredQuery += `{title_contains:"${searchText}"},`
    }
    if (searchKey === 'Banner Status' && searchText !== '') {
      filteredQuery += `{status:${searchText}},`
    }
    this.setState({
      filterQuery: filteredQuery
    }, () => fetchBanners(this.state.filterQuery, perPage, skip))
  }
  componentDidUpdate = (prevProps) => {
    const { isBannerFetching, hasBannerFetched, isBannerUpdating,
      bannerUpdateFailure, bannerUpdateFailed, isBannerUpdated,
      isBannerDeleting, isBannerDeleted, bannerDeleteFailed, bannerDeleteFailure } = this.props
    if (!isBannerFetching && hasBannerFetched) {
      if (
        get(prevProps, 'banners') !== get(this.props, 'banners')
      ) {
        this.createTableFromData()
      }
    }
    if (!isBannerUpdating && !isBannerUpdated &&
      (prevProps.bannerUpdateFailed !== bannerUpdateFailed)) {
      if (bannerUpdateFailure && bannerUpdateFailure.toJS().length > 0) {
        notification.error({
          message: get(get(bannerUpdateFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
    if (!isBannerDeleting && !isBannerDeleted &&
      (prevProps.bannerDeleteFailed !== bannerDeleteFailed)) {
      if (bannerDeleteFailure && bannerDeleteFailure.toJS().length > 0) {
        notification.error({
          message: get(get(bannerDeleteFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
  }
  createTableFromData = () => {
    const data = this.props.banners && this.props.banners.toJS()
    this.setState(
      {
        tableData: data,
      },
      () => this.setTableHeader()
    )
  }
  renderRow = (data) => data || '-'
  setTableHeader = () => {
    const data = this.props.banners && this.props.banners.toJS()
    let column = []
    if (data.length > 0) {
      column = [
        {
          title: 'Sr no',
          dataIndex: 'srNo',
          key: 'srNo',
          align: 'center',
          fixed: 'left'
        },
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
          align: 'center',
          fixed: 'left'
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          align: 'center',
          render: (description) => this.renderRow(description),
          fixed: 'left'
        },
        {
          title: 'Background Image',
          dataIndex: 'backgroundImg',
          key: 'backgroundImg',
          align: 'center',
          render: (uri) => <BannerStyle.Image src={getFullPath(uri)} />
        },
        {
          title: 'Text Before Discount',
          dataIndex: 'textBeforeDiscount',
          key: 'textBeforeDiscount',
          align: 'center',
          render: (textBeforeDiscount) => this.renderRow(textBeforeDiscount)
        },
        {
          title: 'Discount Text',
          dataIndex: 'discount',
          key: 'discount',
          align: 'center',
          render: (discount) => this.renderRow(discount)
        },
        {
          title: 'Text After Discount',
          dataIndex: 'textAfterDiscount',
          key: 'textAfterDiscount',
          align: 'center',
          render: (textAfterDiscount) => this.renderRow(textAfterDiscount)
        },
        {
          title: 'Width',
          dataIndex: 'width',
          key: 'width',
          align: 'center',
          render: (width) => this.renderRow(width)
        },
        {
          title: 'Height',
          dataIndex: 'height',
          key: 'height',
          align: 'center',
          render: (height) => this.renderRow(height)
        },
        {
          title: 'Inception Date',
          dataIndex: 'inception',
          key: 'inception',
          align: 'center',
        },
        {
          title: 'Expiry Date',
          dataIndex: 'expiry',
          key: 'expiry',
          align: 'center',
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
          align: 'center',
          render: (type) => this.renderRow(type)
        },
        {
          title: 'Disclaimer Text',
          dataIndex: 'disclaimerText',
          key: 'disclaimerText',
          align: 'center',
          render: (disclaimerText) => this.renderRow(disclaimerText)
        },
        {
          title: 'Preview',
          dataIndex: 'id',
          key: 'id',
          align: 'center',
          render: (id, row) =>
            <BannerStyle.PreviewButton
              onClick={() =>
                this.setState({ previewBanner: this.state.previewBanner === row ? null : row })}
            >
              {this.state.previewBanner && this.state.previewBanner.id === id ?
                <EyeFilled /> : <EyeFilled style={{ color: 'lightgray' }} />}
            </BannerStyle.PreviewButton>
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          align: 'center',
          render: (status, row) => <Action
            bannerId={row.id}
            status={status}
            searchByFilter={this.searchByFilter}
          />
        },
      ]
    }
    this.setState({
      column,
    })
  }
  renderInput = () => {
    const { searchKey, searchText } = this.state
    if (searchKey === 'Banner Title') {
      return (
        <SearchBox
          placeholder='Search by Banner Title'
          value={searchText}
          onChange={(e) => this.setState({ searchText: e.target.value })}
          onKeyPress={(e) => {
            if (e.key === 'Enter') { this.searchByFilter() }
          }}
          searchByFilter={this.searchByFilter}
        />
      )
    } else if (searchKey === 'Banner Status') {
      return (
        <Select
          style={{ width: '200px', marginLeft: '10px' }}
          placeholder='Search by Status'
          value={searchText}
          onChange={(value) => this.setState({ searchText: value },
            () => this.searchByFilter())}
        >
          {
            ['published', 'unpublished'].map((value) =>
              <Select.Option style={{ textTransform: 'capitalize' }} key={value} value={value}>{value}</Select.Option>)
          }
        </Select>
      )
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
    }, () => this.searchByFilter())
  }
  clearFilter = () => {
    this.setState({
      fromDate: null,
      toDate: null,
      currentPage: 1,
      perPage: 10,
      skip: 0,
      searchKey: 'All',
      searchText: '',
      filterQuery: '',
      previewBanner: null
    }, () => this.searchByFilter())
  }
  render() {
    const { isBannerFetching, bannerCount } = this.props
    const { fromDate, toDate, currentPage, perPage, searchKey, tableData,
      column, previewBanner } = this.state
    const filterDropdownOptions = ['All', 'Banner Title', 'Banner Status']
    return (
      <>
        <BannerStyle.TopContainer>
          <div style={{ marginRight: '20px', minWidth: '438px' }}>
            <BannerStyle.Select
              value={searchKey}
              onChange={(value) => this.setState({ searchKey: value })}
            >
              {
                filterDropdownOptions.map((option) =>
                  <BannerStyle.Option
                    key={option}
                    value={option}
                  >{option}
                  </BannerStyle.Option>
                )
              }
            </BannerStyle.Select>
            {this.renderInput()}
          </div>
          <Pagination
            total={bannerCount}
            onChange={this.onPageChange}
            current={currentPage}
            defaultPageSize={perPage}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DateInput
              placeholder='Select From Date'
              date={fromDate}
              type='from'
              handleDateChange={this.handleDateChange}
            />
            <div style={{ margin: '0 5px' }} />
            <DateInput
              placeholder='Select To Date'
              date={toDate}
              type='to'
              handleDateChange={this.handleDateChange}
            />
          </div>
        </BannerStyle.TopContainer>
        <BannerStyle.PaginationContainer>
          <Button type='primary' onClick={this.clearFilter} style={{ marginRight: '10px' }} >
            Clear Filter
          </Button>
          <h3 style={{ margin: '0px' }} >Total banners : {!bannerCount ? 0 : bannerCount}</h3>
          <Link to='/ums/banner/addBanner' >
            <BannerStyle.StyledButton
              type='link'
              icon='plus'
              id='add-btn'
              style={{ color: 'whitesmoke' }}
            >
              ADD BANNER
            </BannerStyle.StyledButton>
          </Link>
        </BannerStyle.PaginationContainer>
        {previewBanner && <PreviewBanner
          data={previewBanner}
        />}
        <BannerStyle.MDTable
          dataSource={tableData}
          columns={column}
          loading={isBannerFetching && isBannerFetching}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </>
    )
  }
}

export default Banner
