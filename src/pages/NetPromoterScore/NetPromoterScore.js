/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import NPScoreTable from './components/NPScoreTable'
import NetPromoterScoreStyle from './NetPromoterScore.style'
import { ADMIN, UMS_ADMIN, UMS_VIEWER } from '../../constants/roles'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import FromToDatePicker from '../../components/FromToDatePicker/FromToDatePicker'
import SearchBox from './components/SearchBox'
import NPScoreScale from './components/NPScoreScale'
import { filter, get } from 'lodash'
import fetchRatingAndComments from '../../actions/netPromoterScore/fetchRatingAndComments'
import { Button, Pagination } from 'antd'
import fetchNPS from '../../actions/netPromoterScore'
import headerConfig from './components/headerConfig'
import { CSVLink } from 'react-csv'
import fetchCourses from '../../actions/profile/fetchCourses'

class NetPromoterScore extends Component {
  static propTypes = {
    fetchNPS: PropTypes.func.isRequired,
    hasNPSFetched: PropTypes.bool.isRequired,
    fetchingNPSError: PropTypes.bool,
    nps: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      fromDate: null,
      toDate: null,
      searchKey: 'Search By',
      searchValue: '',
      sessionTimeModalVisible: false,
      totalCount: 0,
      npsData: [],
      totalScore: 0,
      promoters: 0,
      detractors: 0,
      passives: 0,
      shouldFetchRatingAndComment: true,
      currentPage: 1,
      perPage: 10,
      studentIdArr: [],
      npsScore: null,
      regionScore: null,
      studentName: null,
      parentName: null,
      phoneNumber: null,
      course: null,
      courseid: "",
      verticalfilter: null
    }
  }

  setcourseid = (id) => {
    this.setState({
      courseid: id
    })
  }

  componentWillMount() {
    const { hasNPSFetched } = this.props
    if (!hasNPSFetched) {
      fetchNPS({ first: this.state.perPage, skip: this.state.currentPage - 1 })
    }
  }

  componentDidMount() {
    this.setState({
      npsData: this.props.nps ? this.props.nps.toJS() : [],
      countData: this.props.countData ? this.props.countData.toJS() : {}
    }, this.calculateNps)

    fetchCourses()


  }

  componentDidUpdate(prevProps) {
    const { nps, ratingAndCommentFetchStatus, ratingAndComment } = this.props
    if (prevProps.isFetchingNps && this.props.hasNPSFetched) {
      this.setState({
        npsData: this.props.nps ? this.props.nps.toJS() : [],
        countData: this.props.countData ? this.props.countData.toJS() : {},
      }, () => {
        this.calculateNps()
        this.setState({
          shouldFetchRatingAndComment: false
        }, () => {
          const studentIdArr = []
          this.state.npsData.forEach(item => studentIdArr.push(get(item, 'user.id')))
          if (!this.state.toDate && !this.state.fromDate && !this.state.studentName && !this.state.parentName && !this.state.phoneNumber && !this.state.npsScore && !this.state.regionScore && !this.state.verticalfilter && !this.state.course) {
            fetchRatingAndComments(studentIdArr).call()
          }
          else {
            fetchRatingAndComments(studentIdArr, `filter:${this.assignFilter()}`).call()
          }
        })
      })
    }

    const _nps = get(nps, 'nps')
    if (
      (ratingAndCommentFetchStatus && ratingAndCommentFetchStatus.getIn(['success'])) &&
      (prevProps.ratingAndCommentFetchStatus && !prevProps.ratingAndCommentFetchStatus.getIn(['success']))
    ) {
      if (_nps && _nps.length && ratingAndComment) {
        _nps.forEach((item, index) => {
          const filteredRatingAndComment = ratingAndComment.toJS().filter(_r => get(_r, 'menteeId') === get(item, 'studentId')) || []
          _nps[index].mentorName = filteredRatingAndComment.length && get(filteredRatingAndComment, '0.mentorName') !== null
            ? get(filteredRatingAndComment, '0.mentorName')
            : '-'
          _nps[index].rating = filteredRatingAndComment.length && get(filteredRatingAndComment, '0.rating') !== null
            ? get(filteredRatingAndComment, '0.rating').toString()
            : '-'
          _nps[index].comment = filteredRatingAndComment.length && get(filteredRatingAndComment, '0.comment') !== null
            ? get(filteredRatingAndComment, '0.comment')
            : '-'
        })
      }
      this.setState({
        npsData: _nps,
        countData: this.props.countData ? this.props.countData.toJS() : {}
      }, this.calculateNps)
    }
  }

  totalCount = 0

  setFilters = (state) => {
    this.setState({
      ...state
    })
  }


  fetchDataScore = (state) => {
    this.setState(() => {
      return { currentPage: 1, npsScore: state ? state : null, regionScore: null }
    }, () => {
      if (!this.state.toDate && !this.state.fromDate && !this.state.npsScore && !this.state.regionScore && !this.state.studentName && !this.state.parentName && !this.state.phoneNumber) {
        fetchNPS({ first: this.state.perPage, skip: this.state.currentPage - 1 })
      }
      else {
        fetchNPS({ first: this.state.perPage, skip: this.state.currentPage - 1, filter: `filter:${this.assignFilter()}` })
      }
    });
  }
  fetchDataRange = (state) => {
    this.setState(() => {
      return {
        currentPage: 1, npsScore: null, regionScore: state
      }
    }, () => {
      fetchNPS({ first: this.state.perPage, skip: this.state.currentPage - 1, filter: `filter:${this.assignFilter()}` })
    });

  }

  downloadRef = React.createRef()
  fetchAllProgress = async () => {
    const { isFetchingNps, hasNPSFetched, nps } = this.props
    if (!isFetchingNps && hasNPSFetched && nps) {
      this.downloadRef.current.link.click()
    }
  }

  setTotalCount = (totalCount) => {
    if (this.state.totalCount !== totalCount) {
      this.setState({ totalCount })
    }
  }

  fetchDataSearchQuery = (state) => {
    if (state.searchKey === 'All') {
      this.setState(() => {
        return { studentName: null, currentPage: 1, parentName: null, phoneNumber: null, course: null, verticalfilter: null }
      }, () => {
        fetchNPS({ first: this.state.perPage, skip: this.state.currentPage - 1, filter: `filter:${this.assignFilter()}` })
      })
    }
    if (state.searchKey === `Student's name` && state.searchValue) {
      this.setState(() => {
        return { studentName: state.searchValue, currentPage: 1, parentName: null, phoneNumber: null, course: null, verticalfilter: null }
      }, () => {
        fetchNPS({ first: this.state.perPage, skip: this.state.currentPage - 1, filter: `filter:${this.assignFilter()}` })
      })
    }
    if (state.searchKey === `Parent's name` && state.searchValue) {
      this.setState(() => {
        return { parentName: state.searchValue, currentPage: 1, studentName: null, phoneNumber: null, course: null, verticalfilter: null }
      }, () => {
        fetchNPS({ first: this.state.perPage, skip: this.state.currentPage - 1, filter: `filter:${this.assignFilter()}` })
      })
    }
    if (state.searchKey === 'Phone number' && state.searchValue) {
      this.setState(() => {
        return { phoneNumber: state.searchValue, currentPage: 1, studentName: null, parentName: null, course: null, verticalfilter: null }
      }, () => {
        fetchNPS({ first: this.state.perPage, skip: this.state.currentPage - 1, filter: `filter:${this.assignFilter()}` })
      })
    }
    if (state.searchKey === 'Course' && state.searchValue) {
      this.setState(() => {
        return { course: state.searchValue, currentPage: 1, studentName: null, parentName: null, phoneNumber: null, verticalfilter: null }
      }, () => {
        fetchNPS({ first: this.state.perPage, skip: this.state.currentPage - 1, filter: `filter:${this.assignFilter()}` })
      })
    }
    if (state.searchKey === 'Vertical' && state.searchValue) {
      this.setState(() => {
        return { verticalfilter: state.searchValue, currentPage: 1, studentName: null, parentName: null, phoneNumber: null, course: null }
      }, () => {
        fetchNPS({ first: this.state.perPage, skip: this.state.currentPage - 1, filter: `filter:${this.assignFilter()}` })
      })
    }
  }
  handleNPSAfterDateFilter = () => {
    this.setState({
      npsData: filter(this.props.nps.nps, item => {
        const { fromDate, toDate } = this.state
        const from = new Date(item.createdAt) >= new Date(fromDate).setHours(0, 0, 0, 0)
        const to = new Date(item.createdAt) <= new Date(toDate).setHours(23, 59, 59, 0)
        return (from && to)
      })
    }, this.calculateNps)
  }

  handleDateChange = (event, type) => {
    const { fromDate, toDate } = this.state
    let dateObj = {
      currentPage: 1
    }
    if (type == 'from') {
      dateObj['fromDate'] = !event ? null : new Date(event).setHours(0, 0, 0, 0)
    }
    else if (type == 'to') {
      dateObj['toDate'] = !event ? null : new Date(event).setHours(0, 0, 0, 0)
    }
    this.setState(() => {
      return dateObj
    }, () => {
      fetchNPS({ first: this.state.perPage, skip: this.state.currentPage - 1, filter: `filter:${this.assignFilter()}` })
    })
  }

  calculateNps = () => {
    let promoters = 0
    let detractors = 0
    let passives = 0
    if (!get(this.state.countData, 'count')) {
      this.setState({
        totalScore: 0,
        promoters,
        detractors,
        passives
      })
      return 0
    }
    get(this.state.countData, 'groupByData').map(score => {
      if (Number(get(score, 'groupByFieldValue')) > 8) {
        promoters += Number(get(score, 'count'))
      } else if (Number(get(score, 'groupByFieldValue')) <= 6) {
        detractors += Number(get(score, 'count'))
      } else {
        passives += Number(get(score, 'count'))
      }
    })
    let npsScore = (((promoters - detractors) / get(this.state.countData, 'count')) * 100)
    this.setState({
      totalScore: parseFloat(`${npsScore}`).toFixed(2),
      promoters,
      detractors,
      passives
    })
    return parseFloat(`${npsScore}`).toFixed(2)
  }

  getNpsScorePercentageColor = () => {
    const { totalScore } = this.state
    if (totalScore >= 35) {
      return '#00a64d'
    } else if (totalScore >= 25) {
      return '#eed307'
    }
    return '#c80202'
  }
  assignFilter = () => {
    let filterQuery = '{  and: ['
    if (this.state.npsScore != null) {
      filterQuery += `{score:${this.state.npsScore}}\n`
    }
    if (this.state.regionScore != null) {
      filterQuery += `{score_in:${JSON.stringify(this.state.regionScore)}}\n`
    }
    if (this.state.toDate != null) {
      filterQuery += `{createdAt_lte:"${new Date(this.state.toDate).toISOString()}"}\n`
    }
    if (this.state.fromDate != null) {
      filterQuery += `{createdAt_gt:"${new Date(this.state.fromDate).toISOString()}"}\n`
    }
    if (this.state.studentName != null) {
      filterQuery += `{ user_some: { name_contains:"${this.state.studentName}" }\n }`
    }
    if (this.state.parentName != null) {
      filterQuery += `{ user_some:{ studentProfile_some: {
        parents_some: {
          user_some: {
            name_contains: "${this.state.parentName}"
          }
        }
       }
       }\n
       }`
    }
    if (this.state.phoneNumber != null) {
      filterQuery += `{ user_some:{ studentProfile_some: {
        parents_some: {
          user_some: {
          phone_number_subDoc_contains:"${this.state.phoneNumber}"
        }
       }
      }
    }\n
    }`
    }
    if (this.state.course != null) {
      filterQuery += `{course_some: { id: "${this.state.course}" }} `
    }
    if (this.state.verticalfilter != null) {
      filterQuery += `{user_some:{vertical:${this.state.verticalfilter}}}`
    }
    filterQuery += ']}'
    return filterQuery;
  }

  onPageChange = page => {
    this.setState({
      currentPage: page
    }, () => {
      fetchNPS({ first: this.state.perPage, skip: this.state.currentPage - 1, filter: `filter:${this.assignFilter()}` })
    })
  }

  render() {
    const { npsData, totalScore, promoters, passives, detractors, searchKey } = this.state
    const { ratingAndCommentFetchStatus } = this.props
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole && !(savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)) {
      return (
        <div>Not Found</div>
      )
    }
    return (
      <div>
        <NetPromoterScoreStyle.TopContainer>
          <SearchBox
            savedRole={savedRole}
            setFilters={this.fetchDataSearchQuery}
            allCourses={this.props.courses && this.props.courses.toJS() || []}
            setcourseid={this.setcourseid}
          />
          <FromToDatePicker handleDateChange={this.handleDateChange} />
          <div>
            <span style={{ marginRight: '10px' }}>
              {`Total Count: ${get(this.state.countData, 'count')}`}
            </span>
            <span style={{ marginRight: '10px', color: this.getNpsScorePercentageColor() }}>
              {`NPS: ${totalScore}%`}
            </span>
          </div>
        </NetPromoterScoreStyle.TopContainer>
        <NPScoreScale
          data={this.state.countData}
          fetchDataScore={this.fetchDataScore}
          fetchDataRange={this.fetchDataRange}
          promoters={promoters}
          npsScore={this.state.npsScore}
          regionScore={this.state.regionScore}
          passives={passives}
          detractors={detractors}
          searchBy={searchKey === 'NPS score' || searchKey === 'Region'}
        />

        <div style={{
          display: "inline",
          float: "right",
          margin: "0px 5px"
        }}>
          <Button type='primary' icon='download' onClick={this.fetchAllProgress}>Download All Reports</Button>
        </div>
        <CSVLink
          style={{ display: 'none' }}
          filename='AllReport.csv'
          data={npsData ? npsData : ""}
          headers={headerConfig}
          ref={this.downloadRef}
        />

        <NPScoreTable
          {...this.props}
          npsData={npsData}
          filters={this.state}
          savedRole={savedRole}
          setTotalCount={this.setTotalCount}
          fetchStatus={this.props.hasNPSFetched}
          fetchingRatingAndComment={ratingAndCommentFetchStatus && ratingAndCommentFetchStatus.getIn(['loading'])}
        />
        <Pagination
          total={get(this.state.countData, 'count') ? get(this.state.countData, 'count') : 0}
          onChange={this.onPageChange}
          current={this.state.currentPage}
          defaultPageSize={this.state.perPage}
        />
      </div >
    )
  }
}

export default NetPromoterScore
