import React, { Component } from 'react'
// import moment from 'moment'
import PropTypes from 'prop-types'
// import { filter } from 'lodash'
import { ADMIN, UMS_ADMIN, UMS_VIEWER } from '../../../../constants/roles'
// import getDataFromLocalStorage from '../../../utils/extract-from-localStorage'
import CompletedSessionsStyle from '../CompletedSessions.style'

class SessionRatingsScale extends Component {
  static propTypes = {
    // data: PropTypes.arrayOf(PropTypes.object).isRequired,
    setFilters: PropTypes.func.isRequired,
    searchBy: PropTypes.bool.isRequired,
    fromDate: PropTypes.instanceOf(Date).isRequired,
    toDate: PropTypes.instanceOf(Date).isRequired,
    savedRole: PropTypes.string.isRequired,
    count: PropTypes.shape({}).isRequired,
  }

  callSetFilterForRating = rating => {
    const { savedRole } = this.props
    const admin = (savedRole
      && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER))
    if (admin) {
      const state = {
        searchKey: 'Ratings',
        searchValue: `${rating}`
      }
      this.props.setFilters(state)
    }
  }

  callSetFilterForRegion = rating => {
    const { savedRole } = this.props
    const admin = (savedRole
      && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER))
    if (admin) {
      let region = ''
      if (rating > 4) {
        region = 'Promoters'
      } else if (rating > 3) {
        region = 'Passives'
      } else if (rating > 0) {
        region = 'Detractors'
      }
      const state = {
        searchKey: 'Region',
        searchValue: region
      }
      this.props.setFilters(state)
    }
  }

  clearFilter = () => {
    const state = {
      searchKey: '',
      searchValue: ''
    }
    this.props.setFilters(state)
  }

  renderScaleColor = i => {
    if (i > 4) {
      return '#00a64d'
    } else if (i > 3) {
      return '#eed307'
    } else if (i > 0) {
      return '#c80202'
    }
    return '#858d89'
  }

  renderSessionRatingsCompWidth = rating => {
    const { count } = this.props
    let totalCount = 0
    let total = 0
    for (let i = 1; i <= 5; i += 1) {
      if (count[`rating${i}`]) {
        total += count[`rating${i}`].count
      }
    }
    if (count[`rating${rating}`]) {
      totalCount = count[`rating${rating}`].count
    }
    const width = totalCount ? parseFloat((totalCount / total) * 100).toFixed(2) : '0.00'
    return { width, totalCount }
  }

  renderScale = () => {
    const scale = []
    for (let i = 0; i <= 5; i += 1) {
      const { width, count } = this.renderSessionRatingsCompWidth(i)
      if (width !== '0.00') {
        scale.push(
          <CompletedSessionsStyle.SessionRatingsComponent style={{ width: `${width}%` }} >
            <CompletedSessionsStyle.SessionRatingsButton
              style={{ backgroundColor: `${this.renderScaleColor(i)}`, height: '20px' }}
              onClick={() => this.callSetFilterForRegion(i)}
            />
            <CompletedSessionsStyle.SessionRatingsButton
              onClick={() => this.callSetFilterForRating(i)}
            >
              {i !== 0 ? i : '-'}
            </CompletedSessionsStyle.SessionRatingsButton>
            <span style={{ fontWeight: '100' }} >{count}</span>
          </CompletedSessionsStyle.SessionRatingsComponent>
        )
      }
    }
    return scale.reverse()
  }

  renderScaleGroupCount = () => {
    const { count } = this.props
    let total = 0
    for (let i = 1; i <= 5; i += 1) {
      if (count[`rating${i}`]) {
        total += count[`rating${i}`].count
      }
    }
    return ['rating5', 'rating4', 'detractors'].map((item) => {
      if (item !== 'detractors' && count[item] && count[item].count) {
        return (
          <span
            style={{ width: `${parseFloat((count[item].count / total) * 100).toFixed(2)}%`, paddingBottom: '4px' }}
          >
            {count[item].count}
          </span>
        )
      } else if (item === 'detractors' && ((count.rating1 && count.rating1.count) || (count.rating2 && count.rating2.count) || (count.rating3 && count.rating3.count3))) {
        const detractors = count.rating1.count + count.rating2.count + count.rating3.count
        return (
          <span
            style={{ width: `${parseFloat((detractors / total) * 100).toFixed(2)}%`, paddingBottom: '4px' }}
          >
            {detractors}
          </span>
        )
      }
      return null
    })
  }

  render() {
    // if (!this.props.data.length) {
    //   return null
    // }
    return (
      <React.Fragment>
        <CompletedSessionsStyle.SessionRatingsGroup>
          {this.renderScaleGroupCount()}
        </CompletedSessionsStyle.SessionRatingsGroup>
        <CompletedSessionsStyle.SessionRatings>
          {this.renderScale()}
        </CompletedSessionsStyle.SessionRatings>
        {
          this.props.searchBy ?
            <CompletedSessionsStyle.ClearButton onClick={() => this.clearFilter()} >
              clear
            </CompletedSessionsStyle.ClearButton>
            : null
        }
      </React.Fragment>
    )
  }
}

export default SessionRatingsScale
