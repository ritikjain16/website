import { Icon, notification, Popconfirm, Select } from 'antd'
import { get, sortBy } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {
  addSchoolClass,
  deleteSchoolClasses,
  fetchBatchesForClass
} from '../../../actions/SchoolOnboarding'
import {
  FlexContainer, StyledButton, SectionButton,
  GradeButton, SectionSelect, SectionSelectDiv
} from '../SchoolOnBoarding.style'
import DeleteGrade from './GradesTab/DeleteGrade'
import sectionArray from '../../../constants/sections'

const { Option } = Select

const iconStyle = {
  padding: '5px', borderRadius: '999px', cursor: 'pointer', border: '1px solid black'
}

class GradeCards extends React.Component {
  state = {
    showSelect: false,
    selectValue: '',
  }
  deleteSection = async (classId) => {
    await fetchBatchesForClass([classId]).then(async res => {
      if (get(res, 'batches', []).length > 0 && get(res, 'batchesMeta.count') > 0) {
        notification.error({
          message: `Cannot delete this section as batch 
          ${get(res, 'batches', []).map(batch => `${get(batch, 'code')}`)} are already present.`
        })
      } else {
        await deleteSchoolClasses([classId])
      }
    })
  }
  addSection = async (data) => {
    const { selectValue } = this.state
    const { schoolId } = this.props
    if (data && selectValue) {
      const addSchoolClassQuery = `
        addSchoolClass(input: { grade: ${data}, section: ${selectValue} }, schoolConnectId: "${schoolId}") {
          id
          grade
          section
      }`
      await addSchoolClass(addSchoolClassQuery)
      this.setState({
        showSelect: false,
        selectValue: ''
      })
    }
  }
  render() {
    const {
      classData: { grade, sections, studentCount },
      viewStudents, selectedSection, selectGradeSection,
      schoolId, gradeButton, campaigns, ...rest
    } = this.props
    const { showSelect, selectValue } = this.state
    return (
      <FlexContainer grade {...rest}>
        <FlexContainer noPadding>
          <h1>
            {grade}
            {
              gradeButton && !campaigns && (
                <DeleteGrade sections={sections} studentCount={studentCount} />
              )
            }
          </h1>
          {viewStudents ? (
            <StyledButton
              onClick={() => viewStudents('/sms/schoolonboarding/students', grade)}
              type='primary'
            >View Students
            </StyledButton>
          ) : <div />}
        </FlexContainer>
        <FlexContainer noPadding style={{ marginTop: '2vw' }}>
          {
            gradeButton ? (
              <div>
                {sortBy(sections, 'section').map((section) =>
                  <div className='gradeCard__sectionButton'>
                    <GradeButton
                      key={get(section, 'id')}
                      type='primary'
                      style={{ marginRight: '2vw' }}
                      value={get(section, 'section')}
                      onClick={() => selectGradeSection ? selectGradeSection(section) : null}
                    >Section {get(section, 'section')}
                    </GradeButton>
                    {!campaigns && (
                      <Popconfirm
                        title={get(section, 'sectionStudentCount', 0) > 0 ?
                          'Can not delete section as student is already present in this section.'
                          : 'Do you want to delete this Section ?'}
                        placement='top'
                        onConfirm={get(section, 'sectionStudentCount', 0) > 0 ?
                          null : () => this.deleteSection(get(section, 'id'))}
                        okText={get(section, 'sectionStudentCount', 0) > 0 ? 'Close' : 'Yes'}
                        cancelText='Cancel'
                        key='delete'
                        overlayClassName='popconfirm-overlay-primary'
                      >
                        <Icon type='close' />
                      </Popconfirm>
                    )}
                  </div>)
                }
                {
                  showSelect ? (
                    <SectionSelectDiv>
                      <h4 style={{ opacity: '0.5' }} >Section</h4>
                      <SectionSelect
                        value={selectValue}
                        onChange={value => this.setState({ selectValue: value })}
                      >
                        {sectionArray.map(s => <Option value={s}>{s}</Option>)}
                      </SectionSelect>
                      <Icon type='plus' style={iconStyle} onClick={() => this.addSection(grade)} />
                    </SectionSelectDiv>
                  ) : (
                    !campaigns &&
                      <Icon type='plus' style={iconStyle} onClick={() => this.setState(prevState => ({ showSelect: !prevState.showSelect }))} />
                  )
                }
              </div>
            ) : (
              <div>
                <SectionButton
                  type={selectedSection === 'All' ? 'primary' : 'default'}
                  style={{ marginRight: '2vw' }}
                  value='All'
                  onClick={() => selectGradeSection ? selectGradeSection('All') : null}
                >All
                </SectionButton>
                {sortBy(sections, 'section').map((section) =>
                  <SectionButton
                    key={get(section, 'id')}
                    type={selectedSection === get(section, 'section') ? 'primary' : 'default'}
                    style={{ marginRight: '2vw' }}
                    value={get(section, 'section')}
                    onClick={() => selectGradeSection ? selectGradeSection(get(section, 'section')) : null}
                  >Section {get(section, 'section')}
                  </SectionButton>)
                }
              </div>
            )
          }
          <h3>
            Total Students:{studentCount}{' '}
            Total Sections:{sections.length}
          </h3>
        </FlexContainer>
      </FlexContainer>
    )
  }
}

GradeCards.propTypes = {
  classData: PropTypes.shape({
    grade: PropTypes.string.isRequired,
    sections: PropTypes.arrayOf({}).isRequired,
    studentCount: PropTypes.number.isRequired
  }).isRequired,
  viewStudents: PropTypes.func.isRequired,
  selectedSection: PropTypes.string.isRequired,
  selectGradeSection: PropTypes.func.isRequired,
  schoolId: PropTypes.string.isRequired,
  gradeButton: PropTypes.bool.isRequired,
  campaigns: PropTypes.bool.isRequired,
}

export default GradeCards
