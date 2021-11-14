import { Button } from 'antd'
import { get } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {
  BatchActionButton, FlexContainer, StyledDivider, WhiteBox
} from '../../SchoolOnBoarding.style'

const BatchActionNav = (props) => {
  const {
    onBackClick, viewBatchDetails, batchId,
    changeTab, activeTab, schoolId
  } = props
  const canSchedule = localStorage.getItem('eventView') && JSON.parse(localStorage.getItem('eventView')) || false
  const isSelected = (value) => activeTab.includes(value)
  const gradeNumber = (grade) => grade.replace('Grade', '')
  const renderClass = (data, type) => {
    if (type === 'grade') {
      return (
        data.length > 0 ? data.map((g, i) => i === data.length - 1 ? `${gradeNumber(g)}` : `${gradeNumber(g)},`) : '-'
      )
      /* eslint-disable no-else-return */
    } else {
      return (
        data.length > 0 ? data.map((s, i) => i === data.length - 1 ? `${s}` : `${s},`) : '-'
      )
    }
  }
  const onBackClicked = () => {
    localStorage.setItem('eventView', false)
    onBackClick()
  }
  const boxStyle = { height: '6.5vw', minWidth: '6.5vw', width: 'fit-content', margin: '0 1vw' }
  return (
    <div style={{ padding: '1vw' }}>
      <Button onClick={onBackClicked} type='link' style={{ fontSize: '1.5vw' }} icon='left'>
        {get(viewBatchDetails, 'code')}
      </Button>
      <FlexContainer justify='center' WhiteBoxes style={{ maxWidth: '100%' }} noPadding >
        <WhiteBox style={boxStyle}>
          <h2>{renderClass(get(viewBatchDetails, 'grades', []), 'grade')}</h2><h3>Grade</h3>
        </WhiteBox>
        <WhiteBox style={boxStyle}>
          <h2>
            {renderClass(get(viewBatchDetails, 'sections', []))}
          </h2>
          <h3>Sections</h3>
        </WhiteBox>
        <WhiteBox style={boxStyle}>
          <h2>{get(viewBatchDetails, 'studentsMeta.count')}</h2><h3>Students</h3>
        </WhiteBox>
        <WhiteBox style={boxStyle}>
          <h2>{get(viewBatchDetails, 'course.title')}</h2><h3>Course</h3>
        </WhiteBox>
      </FlexContainer>
      <FlexContainer noPadding justify='flex-start'>
        {
          !canSchedule && (
            <BatchActionButton
              onClick={() => changeTab(`/sms/school-dashboard/${schoolId}/batches/${batchId}/scheduling`)}
              selected={isSelected('scheduling')}
            >
              Scheduling
            </BatchActionButton>
          )
        }
        <BatchActionButton
          onClick={() => changeTab(`/sms/school-dashboard/${schoolId}/batches/${batchId}/mentors`)}
          selected={isSelected('mentors')}
        >Mentors
        </BatchActionButton>
        <BatchActionButton
          onClick={() => changeTab(`/sms/school-dashboard/${schoolId}/batches/${batchId}/students`)}
          selected={isSelected('students')}
        >Students
        </BatchActionButton>
      </FlexContainer>
      <StyledDivider style={{ marginBottom: '1vw' }} />
    </div>
  )
}

BatchActionNav.propTypes = {
  onBackClick: PropTypes.func.isRequired,
  viewBatchDetails: PropTypes.shape({}).isRequired,
  batchId: PropTypes.string.isRequired,
  changeTab: PropTypes.func.isRequired,
  activeTab: PropTypes.func.isRequired,
  schoolId: PropTypes.string.isRequired,
}


export default BatchActionNav
