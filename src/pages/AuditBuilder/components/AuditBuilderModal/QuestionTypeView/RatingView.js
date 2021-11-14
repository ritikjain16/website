import { Radio, Rate } from 'antd'
import RadioGroup from 'antd/lib/radio/group'
import { get } from 'lodash'
import React from 'react'
import { ratingDisplayType } from '../../../../../constants/auditQuestionConst'
import { AuditBuilderContainer } from '../../../AuditBuilder.style'

const { star, number } = ratingDisplayType


class RatingView extends React.Component {
  renderRatingView = () => {
    const { data, isViewOnlyMode } = this.props
    if (get(data, 'ratingDisplayType') === star) {
      return (
        <AuditBuilderContainer>
          <p>Unsatisfied</p>
          <Rate
            disabled={isViewOnlyMode}
            count={get(data, 'maxRating')}
            tooltips={[...Array(get(data, 'maxRating') + 1).keys()].slice(1)}
          />
          <p>Amazing</p>
        </AuditBuilderContainer>
      )
    } else if (get(data, 'ratingDisplayType') === number) {
      return (
        <AuditBuilderContainer>
          <p>Unsatisfied</p>
          <RadioGroup value={1}
            disabled={isViewOnlyMode}
            style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'space-around'
            }}
          >
            {[...Array(get(data, 'maxRating') + 1).keys()].map((num, ind) => (
              num > 0 && (
              <label htmlFor={`option${ind}`} >
                <p style={{ margin: 0 }}>{num}</p> <Radio value={num} id={`options${ind}`} />
              </label>)
          ))
        }
          </RadioGroup>
          <p>Amazing</p>
        </AuditBuilderContainer>)
    }
    return null
  }
  render() {
    const { data, auditDescStyle, auditStatementStyle, auditStatementh3Style } = this.props
    return (
      <div >
        <div style={auditStatementStyle}>
          <h3 style={auditStatementh3Style} >1. {get(data, 'statement')}</h3>
          <span style={auditDescStyle}>{get(data, 'description') || ''}</span>
        </div>
        {this.renderRatingView()}
      </div>
    )
  }
}

export default RatingView
