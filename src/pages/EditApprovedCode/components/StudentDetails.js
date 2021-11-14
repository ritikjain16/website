import React, { memo } from 'react'
import PropTypes from 'prop-types'
import EditApprovedCodeStyle from '../EditApprovedCode.style'

const StudentDetails = ({ studentName, grade }) => (
  <EditApprovedCodeStyle.StyledRow>
    <EditApprovedCodeStyle.StyledCol span={24}>
      <EditApprovedCodeStyle.FlexContainer>
        <EditApprovedCodeStyle.TopDetails>
          <EditApprovedCodeStyle.TextPrimary color='#fff'>
                        Student Name: {studentName || '-'}
          </EditApprovedCodeStyle.TextPrimary>
          <EditApprovedCodeStyle.TextPrimary color='#fff'>
                        Grade : {grade || '-'}
          </EditApprovedCodeStyle.TextPrimary>
        </EditApprovedCodeStyle.TopDetails>
      </EditApprovedCodeStyle.FlexContainer>
    </EditApprovedCodeStyle.StyledCol>
  </EditApprovedCodeStyle.StyledRow>
)

StudentDetails.propTypes = {
  studentName: PropTypes.string.isRequired,
  grade: PropTypes.string.isRequired
}


export default memo(StudentDetails)
