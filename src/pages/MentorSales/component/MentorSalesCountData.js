import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Radio } from 'antd'
import { FieldTimeOutlined, WarningTwoTone } from '@ant-design/icons'
import MentorSalesStyle from '../MentorSales.style'

class MentorSalesCountData extends Component {
  static propTypes = {
    countData: PropTypes.shape({}).isRequired,
    setLeadStatusFilter: PropTypes.func.isRequired,
    setNextDateFilter: PropTypes.func.isRequired,
  }

  // eslint-disable-next-line no-unused-vars
  onChange = e => {
    const { value } = e.target
    if (value === 'lost' || value === 'cold' || value === 'pipeline' || value === 'hot' || value === 'won' || value === 'unfit') {
      this.props.setLeadStatusFilter(value)
    } else if (value === 'statusMissing') {
      this.props.setLeadStatusFilter('null')
    } else {
      this.props.setNextDateFilter(value)
    }
  }

  handleEnrollmentType = e => {
    this.props.setEnrollmentTypeFilter(e.target.value)
  }

  render() {
    // console.log(this.props.countData)
    const { countData } = this.props
    const data = countData && countData.groupByData ? JSON.parse(`{
      ${
  countData.groupByData.map(status => {
    if (status.groupByFieldValue !== null) {
      return `"${status.groupByFieldValue}": ${status.count}`
    }
    return `"statusMissing" : ${status.count}`
  })
}
    }`) : null
    const total = countData && countData.count ? countData.count - (get(data, 'unfit') ? get(data, 'unfit') : 0) : 0
    // console.log(data)
    // if (countData.data === {}) {
    //   return null
    // }
    return (
      <MentorSalesStyle.MentorSalesCountData>
        <MentorSalesStyle.FilterCheckBox checked={this.props.filterQueryLeadStatus.includes('unfit')} onChange={this.onChange} value='unfit'>
          <MentorSalesStyle.FilterBox style={{ backgroundColor: '#ececec', minWidth: 120 }}>
            <span>Unfit</span>
            <span>{data && data.unfit ? data.unfit : '-'} deals</span>
          </MentorSalesStyle.FilterBox>
        </MentorSalesStyle.FilterCheckBox>
        <MentorSalesStyle.FilterCheckBox checked={this.props.filterQueryLeadStatus.includes('pipeline')} onChange={this.onChange} value='pipeline'>
          <MentorSalesStyle.FilterBox style={{ backgroundColor: '#fbc46b', minWidth: 120 }}>
            <span>Pipeline</span>
            <span>{data && data.pipeline ? data.pipeline : '-'} deals</span>
            <MentorSalesStyle.SalesPercentage>
              {data && data.pipeline ? Math.floor((data.pipeline / total) * 100) : '-'}%
            </MentorSalesStyle.SalesPercentage>
          </MentorSalesStyle.FilterBox>
        </MentorSalesStyle.FilterCheckBox>
        <MentorSalesStyle.FilterCheckBox checked={this.props.filterQueryLeadStatus.includes('hot')} onChange={this.onChange} value='hot'>
          <MentorSalesStyle.FilterBox style={{ backgroundColor: '#b8e986' }}>
            <span>Hot</span>
            <span>{data && data.hot ? data.hot : '-'} deals</span>
            <MentorSalesStyle.SalesPercentage>
              {data && data.hot ? Math.floor((data.hot / total) * 100) : '-'}%
            </MentorSalesStyle.SalesPercentage>
          </MentorSalesStyle.FilterBox>
        </MentorSalesStyle.FilterCheckBox>
        <MentorSalesStyle.FilterCheckBox checked={this.props.filterQueryLeadStatus.includes('won')} onChange={this.onChange} value='won'>
          <MentorSalesStyle.FilterBox style={{ backgroundColor: '#6db921' }}>
            <span>Won {data && data.won ? data.won : '-'} deals</span>
            <Radio.Group
              value={this.props.enrollmentType}
              onChange={this.handleEnrollmentType}
              style={{ minWidth: 120, display: 'flex', justifyContent: 'space-between' }}
              size='small'
            >
              <Radio.Button value='free'>Unpaid</Radio.Button>
              <Radio.Button value='pro'>Paid</Radio.Button>
            </Radio.Group>
            <MentorSalesStyle.SalesPercentage>
              {data && data.won ? Math.floor((data.won / total) * 100) : '-'}%
            </MentorSalesStyle.SalesPercentage>
          </MentorSalesStyle.FilterBox>
        </MentorSalesStyle.FilterCheckBox>
        <MentorSalesStyle.FilterCheckBox checked={this.props.filterQueryLeadStatus.includes('lost')} onChange={this.onChange} value='lost'>
          <MentorSalesStyle.FilterBox style={{ backgroundColor: '#ff5744' }}>
            <span>Lost</span>
            <span>{data && data.lost ? data.lost : '-'} deals</span>
            <MentorSalesStyle.SalesPercentage>
              {data && data.lost ? Math.floor((data.lost / total) * 100) : '-'}%
            </MentorSalesStyle.SalesPercentage>
          </MentorSalesStyle.FilterBox>
        </MentorSalesStyle.FilterCheckBox>
        <MentorSalesStyle.FilterCheckBox checked={this.props.filterQueryLeadStatus.includes('cold')} onChange={this.onChange} value='cold'>
          <MentorSalesStyle.FilterBox style={{ backgroundColor: '#fa8679' }}>
            <span>Cold</span>
            <span>{data && data.cold ? data.cold : '-'} deals</span>
            <MentorSalesStyle.SalesPercentage>
              {data && data.cold ? Math.floor((data.cold / total) * 100) : '-'}%
            </MentorSalesStyle.SalesPercentage>
          </MentorSalesStyle.FilterBox>
        </MentorSalesStyle.FilterCheckBox>
        <MentorSalesStyle.Vl />
        <MentorSalesStyle.FilterCheckBox onChange={this.onChange} value='statusMissing'>
          <MentorSalesStyle.FilterBox style={{ backgroundColor: '#f8ed6b', minWidth: 200 }}>
            <span>Status Missing</span>
            <span>{data && data.statusMissing ? data.statusMissing : '-'} deals</span>
            <MentorSalesStyle.SalesPercentage>
              {data && data.statusMissing ? Math.floor((data.statusMissing / total) * 100) : '-'}%
            </MentorSalesStyle.SalesPercentage>
            <MentorSalesStyle.IconWrap>
              <WarningTwoTone twoToneColor='#e27e1b' />
            </MentorSalesStyle.IconWrap>
          </MentorSalesStyle.FilterBox>
        </MentorSalesStyle.FilterCheckBox>
        <MentorSalesStyle.Vl />
        <MentorSalesStyle.FilterCheckBox onChange={this.onChange} value='actionDueToday'>
          <MentorSalesStyle.FilterBox style={{ backgroundColor: '#f8ed6b' }}>
            <span>Due Today</span>
            <span>
              {countData.actionDueToday ? countData.actionDueToday.count : '-'} deals
            </span>
            <MentorSalesStyle.IconWrap>
              <FieldTimeOutlined twoToneColor='#e07414' />
            </MentorSalesStyle.IconWrap>
          </MentorSalesStyle.FilterBox>
        </MentorSalesStyle.FilterCheckBox>
        <MentorSalesStyle.FilterCheckBox onChange={this.onChange} value='dueLater'>
          <MentorSalesStyle.FilterBox style={{ backgroundColor: '#c9cbcc' }}>
            <span>Due Later</span>
            <span>{countData.dueLater ? countData.dueLater.count : '-'} deals</span>
          </MentorSalesStyle.FilterBox>
        </MentorSalesStyle.FilterCheckBox>
        <MentorSalesStyle.FilterCheckBox onChange={this.onChange} value='needAttention'>
          <MentorSalesStyle.FilterBox style={{ backgroundColor: '#f8998e' }}>
            <span>Need Attention</span>
            <span>
              {countData.needAttention ? countData.needAttention.count : '-'} deals
            </span>
            <MentorSalesStyle.IconWrap>
              <WarningTwoTone twoToneColor='#d0021b' />
            </MentorSalesStyle.IconWrap>
          </MentorSalesStyle.FilterBox>
        </MentorSalesStyle.FilterCheckBox>
      </MentorSalesStyle.MentorSalesCountData>
    )
  }
}

// const mapStateToProps = state => ({
//   loading : state.data.getIn([
//     'mentorSales',
//     'fetchStatus',
//     'mentorSalesMeta',
//     'loading'
//   ])
// })

export default MentorSalesCountData
// export default connect(mapStateToProps)(MentorSalesCountData)
