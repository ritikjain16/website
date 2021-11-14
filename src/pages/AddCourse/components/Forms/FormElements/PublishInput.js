import React from 'react'
import {
  PUBLISHED_STATUS, UNPUBLISHED_STATUS
} from '../../../../../constants/questionBank'
import { StyledSwitch } from '../../../AddCourse.styles'

const PublishInput = (props) => {
  const { values, setFieldValue } = props
  return (
    <div>
      <h3>Status : </h3>
      <StyledSwitch
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
