import RadioGroup from 'antd/lib/radio/group'
import React from 'react'
import MainModal from '../../../../../components/MainModal'
import { ratingDisplayType as ratingType } from '../../../../../constants/auditQuestionConst'
import { AuditBuilderContainer } from '../../../AuditBuilder.style'
import AuditInput from '../../AuditInput'

const { star, number } = ratingType
const Rating = (props) => {
  const { ratingDisplayType, onStateChanged,
    maxRating, setRatingValue } = props
  return (
    <AuditBuilderContainer
      style={{
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}
    >
      <h2>Ratings Meter</h2>
      <p style={{ marginTop: '15px' }}>type of rating</p>
      <RadioGroup
        name='ratingDisplayType'
        buttonStyle='solid'
        value={ratingDisplayType}
        style={{ margin: '10px 0' }}
        onChange={onStateChanged}
      >
        {
            [star, number].map(type => (
              <MainModal.StyledRadio
                style={{
                  textTransform: 'capitalize'
                }}
                value={type}
              >{type}
              </MainModal.StyledRadio>
            ))
          }
      </RadioGroup>
      <div style={{ width: '65%' }}>
        <p style={{ marginBottom: '10px' }}>max rating</p>
        <AuditInput
          value={maxRating || 0}
          name='maxRating'
          setValue={setRatingValue}
        />
      </div>
    </AuditBuilderContainer>
  )
}

export default Rating
