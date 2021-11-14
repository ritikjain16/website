import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import Header from './LearningObjectiveHeader.style'
import LOModal from '../LearningObjectiveModal'
/**
* it is responsible for rendering the headerRow of the LO SessionTable
* which contains the total counts of lo and provides buttons for
* adding new cards and/or concepts
* @param {Object} props
* @returns {React.ReactElement}
*/

const LearningObjectiveHeader = props => {
  const onReOrderClick = () => {
    props.setIsReOrdering(true)
  }
  const onSaveClick = () => {
    props.onSave()
    props.setIsReOrdering(false)
  }
  const onCancelClick = () => {
    props.setIsReOrdering(false)
    props.onCancel()
  }

  return (
    <Header>
      <div>
        {props.isReOrdering
        ? [
          <Button type='dashed' onClick={onCancelClick} style={{ marginRight: 15 }}>Cancel</Button>,
          <Button onClick={onSaveClick} type='primary'>Save</Button>
          ]
        : (
          <Button
            type='primary'
            onClick={onReOrderClick}
            disabled={!props.loLength}
          >Re-order
          </Button>
        )
      }

      </div>
      <div>
        <Header.Text>Total Learning Objective : {props.loLength}</Header.Text>
        <Header.ButtonContainer>
          <LOModal {...props} />
        </Header.ButtonContainer>

      </div>

    </Header>
  )
}

LearningObjectiveHeader.propTypes = {
  /** Total number of learning objectives */
  loLength: PropTypes.number.isRequired,
  isReOrdering: PropTypes.bool.isRequired,
  setIsReOrdering: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
}
export default LearningObjectiveHeader
