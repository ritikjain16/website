import React from 'react'
import { PUBLISHED_STATUS, UNPUBLISHED_STATUS } from '../../../../../constants/questionBank'
import CheatSheetStyle from '../../../CheetSheet.style'

const PublishInput = (props) => {
  const { values, setFieldValue } = props
  return (
    <div style={{ display: 'flex' }}>
      <h3>Status : </h3>
      <CheatSheetStyle.StyledSwitch
        bgcolor={values.status === PUBLISHED_STATUS ? '#64da7a' : '#ff5744'}
        checked={values.status === PUBLISHED_STATUS}
        onChange={() =>
            setFieldValue('status', values.status === PUBLISHED_STATUS ? UNPUBLISHED_STATUS : PUBLISHED_STATUS)}
        size='default'
      />
    </div>
  )
}

export default PublishInput
