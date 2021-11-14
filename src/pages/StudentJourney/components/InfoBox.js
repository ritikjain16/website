import { Tooltip } from 'antd'
import React from 'react'
import stringTruncate from '../../../utils/text-truncate'
import StudentJourneyStyle from '../StudentJourney.styles'

const InfoBox = ({ title, value, fourInOne, children, length, ...other }) => {
  const renderChild = () => {
    if (value &&
        stringTruncate(value, length) && stringTruncate(value, length).includes('...')) {
      return (
        <Tooltip placement='bottom' title={value}>
          {stringTruncate(value, length)}
        </Tooltip>
      )
    }
    return value
  }
  return (
    <StudentJourneyStyle.InfoBox title={title} {...other} >
      {fourInOne ? children : renderChild()}
    </StudentJourneyStyle.InfoBox>
  )
}

export default InfoBox
