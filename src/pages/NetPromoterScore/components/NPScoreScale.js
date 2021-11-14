import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { filter, get } from 'lodash'
import NetPromoterScoreStyle from '../NetPromoterScore.style'
import { Button } from 'antd'
import { CSVLink } from 'react-csv'
import headerConfig from './headerConfig'

class NPScoreScale extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    fetchDataScore: PropTypes.func.isRequired,
    fetchDataRange: PropTypes.func.isRequired,
    promoters: PropTypes.number,
    detractors: PropTypes.number,
    npsScore: PropTypes.number.isRequired,
    passives: PropTypes.number,
    searchBy: PropTypes.bool.isRequired,
  }


  callSetFilterForScore = score => {
    this.props.fetchDataScore(score)
  }

  callSetFilterForRegion = score => {
    let region = []
    if (score > 8) {
      region = [9, 10]
    } else if (score > 6) {
      region = [7, 8]
    } else {
      region = [1, 2, 3, 4, 5, 6]
    }
    this.props.fetchDataRange(region)
  }

  clearFilter = () => {
    this.props.fetchDataScore('')
  }

  renderScaleColor = i => {
    if (i > 8) {
      return '#00a64d'
    } else if (i > 6) {
      return '#eed307'
    }
    return '#c80202'
  }

  renderNpsScaleCompWidth = score => {
    const { data } = this.props
    const total = data.count
    const count = get(filter(data.groupByData, item => Number(item.groupByFieldValue) === score), '0.count')
    const width = parseFloat((count / total) * 100).toFixed(2)
    return { width, count }
  }

  renderScale = () => {
    const { npsScore, regionScore } = this.props
    const scale = []
    for (let i = 1; i <= 10; i += 1) {
      const { width, count } = this.renderNpsScaleCompWidth(i)
      if (width !== '0.00') {
        scale.push(
          <NetPromoterScoreStyle.NPSScaleComponent style={{ width: `${width}%` }} >
            <NetPromoterScoreStyle.NPSScaleButton
              style={regionScore && regionScore.includes(i) ? { border: '3px solid #440044', backgroundColor: `${this.renderScaleColor(i)}`, height: '20px' } : { border: 'none', backgroundColor: `${this.renderScaleColor(i)}`, height: '20px' }}
              onClick={() => this.callSetFilterForRegion(i)}
            />
            <NetPromoterScoreStyle.NPSScaleButton onClick={() => this.callSetFilterForScore(i)}
              style={npsScore === i ? { border: '3px solid #440044' } : { border: 'none' }}
            >
              {i}
            </NetPromoterScoreStyle.NPSScaleButton>
            <span style={{ fontWeight: '100' }} >{count}</span>
          </NetPromoterScoreStyle.NPSScaleComponent>
        )
      }
    }
    return scale.reverse()
  }

  renderScaleGroupCount = () => {
    const total = get(this.props.data, 'count')
    return ['promoters', 'passives', 'detractors'].map((item) =>
      <span
        style={{ width: `${parseFloat((this.props[item] / total) * 100).toFixed(2)}%`, paddingBottom: '4px' }}
      >
        {this.props[item]}
      </span>
    )
  }

  render() {
    if (!get(this.props.data, 'count')) {
      return null
    }
    return (
      <React.Fragment>
        <NetPromoterScoreStyle.NPSScaleGroup>
          {this.renderScaleGroupCount()}
        </NetPromoterScoreStyle.NPSScaleGroup>
        <NetPromoterScoreStyle.NPSScale>
          {this.renderScale()}
        </NetPromoterScoreStyle.NPSScale>
        {

          <NetPromoterScoreStyle.ClearButton onClick={() => this.clearFilter()} >
            clear
          </NetPromoterScoreStyle.ClearButton>

        }

      </React.Fragment>
    )
  }
}

NPScoreScale.defaultProps = {
  promoters: 0,
  detractors: 0,
  passives: 0,
}

export default NPScoreScale
