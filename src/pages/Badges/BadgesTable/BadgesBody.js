import React from 'react'
import { Icon } from 'antd'
import PropTypes from 'prop-types'
import BadgesRow from './BadgesRow'
import MainTable from '../../../components/MainTable'
import BodyStyle from './BadgesBody.style'

/** @returns the Badge body */
const BadgesBody = (props) => {
  const { badges, isFetchingBadge, hasBadgesFetched, fetchingBadgesError } = props.badges
  // shows loader when badges is being fetched
  if (isFetchingBadge) {
    const loadingIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />
    return <div style={{ padding: '10px' }}>{loadingIcon}</div>
  }

  if (hasBadgesFetched && badges.length === 0) {
    return (
      <MainTable.EmptyTable>
        Add badges by clicking the add button
      </MainTable.EmptyTable>
    )
  }

  if (hasBadgesFetched && fetchingBadgesError !== null) {
    return (
      <MainTable.EmptyTable>
        {fetchingBadgesError}
      </MainTable.EmptyTable>
    )
  }

  const groupByType = badges.reduce((accumulator, currentValue) => {
    accumulator[currentValue.type] = accumulator[currentValue.type] || []
    accumulator[currentValue.type].push(currentValue)
    return accumulator
  }, {})

  return (
    <div>
      {
        Object.keys(groupByType).sort().map((type) => (
          <React.Fragment key={type}>
            <BodyStyle.TypeRow badgeCount={groupByType[type].length}>
              {`${type.substr(0, 1).toUpperCase()}${type.substring(1)}s`} {groupByType[type].length}
            </BodyStyle.TypeRow>
            {groupByType[type].map(badge =>
              <BadgesRow key={badge.id} badge={badge} {...props} />)
              }
          </React.Fragment>
          ))
      }
    </div>
  )
}

BadgesBody.propTypes = {
  badges: PropTypes.shape({
    badges: PropTypes.arrayOf(PropTypes.shape({})),
    isFetchingBadge: PropTypes.bool
  }).isRequired
}

export default BadgesBody
