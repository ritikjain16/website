import { ArrowRightOutlined } from '@ant-design/icons'
import {
  message, Select
} from 'antd'
import {
  get, sortBy
} from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { addSchoolClass } from '../../../../actions/SchoolOnboarding'
import MainModal from '../../../../components/MainModal'
import sections from '../../../../constants/sections'
import getGrades from '../../../../utils/getGrades'
import {
  AddGradeButton, CloseIcon, FlexContainer, GradeBox,
  MDTable, StyledButton, StyledDivider, StyledSelect
} from '../../SchoolOnBoarding.style'

const { Option } = Select

const columns = [
  {
    title: 'Grade',
    dataIndex: 'grade',
    key: 'grade',
    align: 'left',
  },
  {
    title: 'Section',
    dataIndex: 'sections',
    key: 'sections',
    align: 'left',
    render: (data) =>
      <div>{data.map(({ section }, i) => i === data.length - 1 ? section : `${section},`)}</div>
  },
]

class GradeModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chosenGradeSection: [],
      gradeToAdd: {},
      gradeToEdit: {}
    }
  }
  componentDidUpdate = (prevProps) => {
    const { schoolClassesAddStatus } = this.props
    if ((schoolClassesAddStatus && !get(schoolClassesAddStatus.toJS(), 'loading')
      && get(schoolClassesAddStatus.toJS(), 'success') &&
        (prevProps.schoolClassesAddStatus !== schoolClassesAddStatus))) {
      this.closeModal()
    }
  }
  closeModal = () => {
    const { onModalClose } = this.props
    this.setState({
      gradeToAdd: {},
      chosenGradeSection: [],
      gradeToEdit: {}
    }, () => onModalClose())
  }
  onGradeSelect = (value) => {
    const { gradeToAdd } = this.state
    if (gradeToAdd && get(gradeToAdd, 'grade', '') === value) {
      this.setState({ gradeToAdd: { ...gradeToAdd, grade: '' } })
    } else {
      const newGradeToAdd = { grade: value, start: 'A', end: 'B' }
      if (get(gradeToAdd, 'start')) newGradeToAdd.start = get(gradeToAdd, 'start')
      if (get(gradeToAdd, 'end')) newGradeToAdd.end = get(gradeToAdd, 'end')
      this.setState({ gradeToAdd: newGradeToAdd })
    }
  }

  addGrade = () => {
    const { gradeToAdd, chosenGradeSection } = this.state
    const startInd = sections.findIndex(s => s === get(gradeToAdd, 'start'))
    const endInd = sections.findIndex(s => s === get(gradeToAdd, 'end'))
    if (!get(gradeToAdd, 'start')) {
      message.error('Please select the Section...')
    } else {
      // eslint-disable-next-line no-lonely-if
      if (startInd > endInd) {
        message.warning(`${get(gradeToAdd, 'start')} section cannot come before ${get(gradeToAdd, 'end')} section`)
      } else {
        const sectionData = []
        const rangeSection = sections.slice(startInd, endInd + 1)
        rangeSection.forEach(section => {
          sectionData.push({
            grade: get(gradeToAdd, 'grade'), section
          })
        })
        const gradeOrder = get(gradeToAdd, 'grade').match(/\d+/g)
        const newGrades = [...chosenGradeSection, {
          grade: get(gradeToAdd, 'grade'),
          sections: sectionData,
          start: get(gradeToAdd, 'start'),
          end: get(gradeToAdd, 'end'),
          gradeOrder: Number(get(gradeOrder, '[0]', 0))
        }]
        this.setState({
          chosenGradeSection: sortBy(newGrades, 'gradeOrder'), gradeToAdd: {}
        })
      }
    }
  }
  removeGrade = (grade) => {
    const { chosenGradeSection } = this.state
    const newGrade = [...chosenGradeSection]
    const isExist = newGrade.find(g => get(g, 'grade') === grade)
    if (isExist) {
      this.setState({
        chosenGradeSection: newGrade.filter(g => get(g, 'grade') !== grade)
      })
    }
  }
  editGrade = (prevData) => {
    const { chosenGradeSection, gradeToEdit } = this.state
    let startVal = get(gradeToEdit, 'start', '')
    let endVal = get(gradeToEdit, 'end', '')
    if (gradeToEdit && get(gradeToEdit, 'start') || get(gradeToEdit, 'end')) {
      if (!startVal) startVal = get(prevData, 'start')
      if (!endVal) endVal = get(prevData, 'end')
      const startInd = sections.findIndex(s => s === startVal)
      const endInd = sections.findIndex(s => s === endVal)
      if (startInd > endInd) {
        message.warning(`${startVal} section cannot come before ${endVal} section`)
      } else {
        const newGrades = chosenGradeSection.filter(g => get(g, 'grade') !== get(gradeToEdit, 'grade'))
        const sectionData = []
        const rangeSection = sections.slice(startInd, endInd + 1)
        rangeSection.forEach(section => {
          sectionData.push({ grade: get(gradeToEdit, 'grade'), section })
        })
        const gradeOrder = get(gradeToEdit, 'grade').match(/\d+/g)
        const updatedGrades = [...newGrades, {
          grade: get(gradeToEdit, 'grade'),
          sections: sectionData,
          start: startVal,
          end: endVal,
          gradeOrder: Number(get(gradeOrder, '[0]', 0))
        }]
        this.setState({
          chosenGradeSection: sortBy(updatedGrades, 'gradeOrder'), gradeToEdit: {}
        })
      }
    }
  }
  onSubmit = async () => {
    const { chosenGradeSection } = this.state
    const { schoolId } = this.props
    if (chosenGradeSection.length > 0) {
      let gradesSection = []
      chosenGradeSection.forEach((grades) => {
        gradesSection = [...gradesSection, ...get(grades, 'sections')]
      })
      let addSchoolClassQuery = ''
      let querycount = 0
      gradesSection.forEach(data => {
        querycount += 1
        addSchoolClassQuery += `
          addSchoolClass_${querycount}: 
          addSchoolClass(input: { grade: ${data.grade}, section: ${data.section} }, schoolConnectId: "${schoolId}") {
            id
            grade
            section
        }`
      })
      await addSchoolClass(addSchoolClassQuery)
    }
  }

  gradeNumber = (grade) => grade.replace('Grade', '')

  getGradeButtonType = (grade) => {
    const { chosenGradeSection, gradeToAdd } = this.state
    const { classGrades } = this.props
    let type = ''
    if (get(gradeToAdd, 'grade', '') === grade) type = 'primary'
    else if (chosenGradeSection.map(s => get(s, 'grade')).includes(grade) ||
    classGrades.map(s => get(s, 'grade')).includes(grade)) {
      type = 'selected'
    }
    return type
  }

  disableButton = (grade) => {
    const { chosenGradeSection } = this.state
    const { classGrades } = this.props
    if (chosenGradeSection.map(s => get(s, 'grade')).includes(grade) ||
    classGrades.map(s => get(s, 'grade')).includes(grade)) {
      return false
    }
    return true
  }

  remainingGrades = () => {
    const { chosenGradeSection } = this.state
    const { classGrades } = this.props
    return getGrades().filter(g =>
      !chosenGradeSection.map(s => get(s, 'grade')).includes(g)
      && !classGrades.map(s => get(s, 'grade')).includes(g))
  }

  renderAddedGrades = () => {
    const {
      chosenGradeSection, gradeToEdit
    } = this.state
    if (chosenGradeSection.length > 0) {
      return chosenGradeSection.map(({ grade, start, end }) => (
        <FlexContainer grade style={{ width: '100%', flexDirection: 'row' }} key={grade}>
          <FlexContainer
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
            noPadding
          >
            <FlexContainer noPadding style={{ marginBottom: '1vw' }}>
              <h1>Grade: </h1>
              <ArrowRightOutlined style={{ fontSize: '24px' }} />
              <GradeBox>{this.gradeNumber(grade) || ''}</GradeBox>
            </FlexContainer>
            <FlexContainer noPadding>
              <h1>Section: </h1>
              <ArrowRightOutlined style={{ fontSize: '24px' }} />
              <StyledSelect
                style={{ width: '70px', marginLeft: '10px' }}
                value={get(gradeToEdit, 'start') || start}
                onChange={value =>
                  this.setState({
                    gradeToEdit: { ...this.state.gradeToEdit, grade, start: value }
                  })
                }
              >
                {sections.map(s => <Option value={s}>{s}</Option>)}
              </StyledSelect>
              <div style={{ margin: '0 10px' }} ><strong>To</strong></div>
              <StyledSelect
                style={{ width: '70px' }}
                value={get(gradeToEdit, 'end') || end}
                onChange={value =>
                  this.setState({
                    gradeToEdit: { ...this.state.gradeToEdit, grade, end: value }
                  })
                }
              >
                {sections.map(s => <Option value={s}>{s}</Option>)}
              </StyledSelect>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer noPadding style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
            <StyledButton
              style={{ padding: '0 30px', marginBottom: '1vw' }}
              type='primary'
              onClick={() => this.editGrade({ grade, start, end })}
            >
              Edit
            </StyledButton>
            <StyledButton
              style={{ padding: '0 15px', backgroundColor: 'transparent', color: 'red' }}
              type='danger'
              onClick={() => this.removeGrade(grade)}
            >Remove
            </StyledButton>
          </FlexContainer>
        </FlexContainer>
      ))
    }
  }
  render() {
    const { visible, schoolName, schoolClassesAddStatus } = this.props
    const { gradeToAdd, chosenGradeSection } = this.state
    return (
      <MainModal
        visible={visible}
        onCancel={this.closeModal}
        maskClosable
        bodyStyle={{
            padding: 0,
            height: '800px',
        }}
        width='1173px'
        closable={false}
        centered
        destroyOnClose
        footer={null}
      >
        <>
          <FlexContainer
            noPadding
            justify='center'
            style={{ flexDirection: 'column', paddingBottom: '1vw', height: '100%' }}
          >
            <div style={{ width: '100%', padding: '0.5vw 1.5vw' }}>
              <h1>All Grade Details</h1>
              <h3>{schoolName}</h3>
              <CloseIcon onClick={this.closeModal} />
            </div>
            <StyledDivider style={{ marginBottom: '1vw' }} />
            <FlexContainer justify='space-between' style={{ width: '100%', alignItems: 'flex-start', flex: '1' }} >
              <div style={{ flex: '0.6' }} >
                <FlexContainer justify='space-between' >
                  <h2>Add Grade</h2>
                  <StyledDivider style={{ minWidth: '75%', width: 'auto' }} />
                </FlexContainer>
                <FlexContainer>
                  {getGrades().map(grade =>
                    <AddGradeButton
                      type={this.getGradeButtonType(grade)}
                      onClick={() =>
                        this.disableButton(grade) ? this.onGradeSelect(grade) : null}
                      shape='circle'
                      style={{
                        margin: '0 5px',
                        cursor: this.disableButton(grade) ? '' : 'not-allowed'
                      }}
                    >
                      {this.gradeNumber(grade)}
                    </AddGradeButton>
                  )
                  }
                </FlexContainer>
                <div style={{ maxHeight: '520px', overflow: 'auto', padding: '1vw' }}>
                  <FlexContainer createGrade style={{ width: '100%' }}>
                    <FlexContainer
                      style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                      noPadding
                    >
                      <FlexContainer noPadding style={{ marginBottom: '1vw' }}>
                        <h1>Grade: </h1>
                        <ArrowRightOutlined style={{ fontSize: '24px' }} />
                        <StyledSelect
                          style={{ width: '70px', marginLeft: '10px' }}
                          value={get(gradeToAdd, 'grade')}
                          onChange={this.onGradeSelect}
                        >
                          {this.remainingGrades()
                            .map(g => <Option value={g}>{this.gradeNumber(g)}</Option>)}
                        </StyledSelect>
                      </FlexContainer>
                      <FlexContainer noPadding>
                        <h1>Section: </h1>
                        <ArrowRightOutlined style={{ fontSize: '24px' }} />
                        <StyledSelect
                          disabled={!get(gradeToAdd, 'grade')}
                          style={{ width: '70px', marginLeft: '10px' }}
                          value={get(gradeToAdd, 'start')}
                          onChange={value =>
                            this.setState({
                              gradeToAdd: {
                                ...this.state.gradeToAdd, start: value
                              }
                            })
                          }
                        >
                          {sections.map(s => <Option value={s}>{s}</Option>)}
                        </StyledSelect>
                        <div style={{ margin: '0 10px' }} ><strong>To</strong></div>
                        <StyledSelect
                          disabled={!get(gradeToAdd, 'grade')}
                          style={{ width: '70px' }}
                          value={get(gradeToAdd, 'end')}
                          onChange={value =>
                            this.setState({
                              gradeToAdd: { ...this.state.gradeToAdd, end: value }
                            })
                          }
                        >
                          {sections.map(s => <Option value={s}>{s}</Option>)}
                        </StyledSelect>
                      </FlexContainer>
                    </FlexContainer>
                    <FlexContainer noPadding style={{ flexDirection: 'column' }}>
                      <StyledButton
                        style={{ padding: '0 30px' }}
                        type='primary'
                        disabled={!get(gradeToAdd, 'grade')}
                        onClick={this.addGrade}
                      >Add
                      </StyledButton>
                    </FlexContainer>
                  </FlexContainer>
                  {this.renderAddedGrades()}
                </div>
              </div>
              <div style={{ flex: '0.35' }}>
                <FlexContainer justify='space-between' >
                  <h2>Grades Overview</h2>
                  <StyledDivider style={{ minWidth: '40%', width: 'auto' }} />
                </FlexContainer>
                <MDTable
                  columns={columns}
                  dataSource={chosenGradeSection}
                  pagination={false}
                />
              </div>
            </FlexContainer>
            <FlexContainer justify='center'>
              <StyledButton
                type='primary'
                style={{ padding: '0px 30px' }}
                onClick={this.onSubmit}
                loading={schoolClassesAddStatus
                  && get(schoolClassesAddStatus.toJS(), 'loading', '')}
              >
                Add
              </StyledButton>
            </FlexContainer>
          </FlexContainer>
        </>
      </MainModal>
    )
  }
}

GradeModal.propTypes = {
  schoolClassesAddStatus: PropTypes.shape({}).isRequired,
  onModalClose: PropTypes.func.isRequired,
  classGrades: PropTypes.arrayOf({}).isRequired,
  schoolName: PropTypes.string.isRequired,
  schoolId: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired
}

export default GradeModal
