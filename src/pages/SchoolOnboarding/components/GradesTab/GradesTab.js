import { notification } from 'antd'
import { get } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {
  FlexContainer, StyledButton
} from '../../SchoolOnBoarding.style'
import GradeCards from '../GradeCards'
import GradeModal from './GradeModal'

class GradesTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
    }
  }
  componentDidUpdate = async (prevProps) => {
    const { schoolClassesAddStatus, schoolClassAddFailure,
      schoolClassesDeleteStatus, schoolClassDeleteFailure } = this.props
    if ((schoolClassesAddStatus && !get(schoolClassesAddStatus.toJS(), 'loading')
      && get(schoolClassesAddStatus.toJS(), 'success') &&
      (prevProps.schoolClassesAddStatus !== schoolClassesAddStatus))) {
      notification.success({
        message: 'Added Successfully'
      })
    } else if (schoolClassesAddStatus && !get(schoolClassesAddStatus.toJS(), 'loading')
      && get(schoolClassesAddStatus.toJS(), 'failure') &&
      (prevProps.schoolClassAddFailure !== schoolClassAddFailure)) {
      if (schoolClassAddFailure && schoolClassAddFailure.toJS().length > 0) {
        notification.error({
          message: get(get(schoolClassAddFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
    if (schoolClassesDeleteStatus && !get(schoolClassesDeleteStatus.toJS(), 'loading')
      && get(schoolClassesDeleteStatus.toJS(), 'success') &&
      (prevProps.schoolClassesDeleteStatus !== schoolClassesDeleteStatus)) {
      notification.success({
        message: 'Deleted successfully'
      })
    } else if (schoolClassesDeleteStatus && !get(schoolClassesDeleteStatus.toJS(), 'loading')
      && get(schoolClassesDeleteStatus.toJS(), 'failure') &&
      (prevProps.schoolClassDeleteFailure !== schoolClassDeleteFailure)) {
      if (schoolClassDeleteFailure && schoolClassDeleteFailure.toJS().length > 0) {
        notification.error({
          message: get(get(schoolClassDeleteFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
  }
  onModalClose = () => {
    this.setState({ modalVisible: false })
  }
  render() {
    const {
      viewStudents, classGrades, schoolName, schoolId,
      schoolClassesAddStatus
    } = this.props
    const { modalVisible } = this.state
    return (
      <>
        <GradeModal
          visible={modalVisible}
          onModalClose={this.onModalClose}
          schoolName={schoolName}
          schoolId={schoolId}
          schoolClassesAddStatus={schoolClassesAddStatus}
          classGrades={classGrades}
        />
        <FlexContainer createGrade justify='center'>
          <StyledButton
            type='primary'
            onClick={() => this.setState({ modalVisible: true })}
          >
            Create Grade
          </StyledButton>
        </FlexContainer>
        {
          classGrades.map(classData => (
            <GradeCards
              gradeButton
              schoolId={schoolId}
              classData={classData}
              viewStudents={viewStudents}
              key={classData.id}
            />
          ))
        }
      </>
    )
  }
}

GradesTab.propTypes = {
  schoolClassesAddStatus: PropTypes.shape({}).isRequired,
  schoolClassesDeleteStatus: PropTypes.shape({}).isRequired,
  viewStudents: PropTypes.func.isRequired,
  classGrades: PropTypes.arrayOf({}).isRequired,
  schoolName: PropTypes.string.isRequired,
  schoolId: PropTypes.string.isRequired,
}


export default GradesTab
