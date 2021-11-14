import { Pagination } from 'antd'
import { get } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {
  fetchStudentsProfile
} from '../../../../actions/SchoolOnboarding'
import MainTable from '../../../../components/MainTable'
import colors from '../../../../constants/colors'
import {
  FlexContainer, MDTable, StyledButton
} from '../../SchoolOnBoarding.style'
import GradeCards from '../GradeCards'
import SearchInput from '../SearchInput'

class StudentsTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      studentProfiles: [],
      selectedSection: '',
      currentPage: 1,
      perPage: 5,
      skip: 0,
      columns: []
    }
  }
  fetchStudents = async () => {
    const { perPage, skip, selectedSection } = this.state
    const { chosenSchool, chosenGrade } = this.props
    await fetchStudentsProfile({
      schoolId: chosenSchool,
      selectedGrade: chosenGrade,
      section: selectedSection,
      perPage,
      skip
    })
  }
  componentDidMount = async () => {
    const { classGrades } = this.props
    if (classGrades.length > 0) {
      this.setState({ selectedSection: 'All' })
    }
  }
  componentDidUpdate = async (prevProps, prevState) => {
    const { chosenGrade, chosenSchool, studentProfilesFetchStatus,
      classGrades, studentProfileUpdateStatus, parentSignUpStatus } = this.props
    const { selectedSection } = this.state
    const studentAddingStatus = parentSignUpStatus && !get(parentSignUpStatus.toJS(), 'loading')
      && get(parentSignUpStatus.toJS(), 'success') && (prevProps.parentSignUpStatus !== parentSignUpStatus)
    if (classGrades && classGrades.length > 0) {
      if (prevProps.chosenGrade !== chosenGrade) {
        this.setState({
          selectedSection: 'All'
        })
      }
    }

    if (prevProps.classGrades !== classGrades
      && classGrades.length > 0
      && selectedSection !== 'All') {
      this.setState({
        selectedSection: 'All'
      })
    }

    if (chosenGrade && chosenSchool &&
      prevState.selectedSection !== selectedSection && selectedSection) {
      this.fetchStudents()
    }
    const studentUpdatingStatus = studentProfileUpdateStatus && !get(studentProfileUpdateStatus.toJS(), 'loading')
      && get(studentProfileUpdateStatus.toJS(), 'success') && (prevProps.studentProfileUpdateStatus !== studentProfileUpdateStatus)
    if (studentUpdatingStatus || studentAddingStatus) {
      this.fetchStudents()
    }
    if ((studentProfilesFetchStatus && !get(studentProfilesFetchStatus.toJS(), 'loading')
      && get(studentProfilesFetchStatus.toJS(), 'success') &&
      (prevProps.studentProfilesFetchStatus !== studentProfilesFetchStatus))) {
      this.convertDataToTable()
    }
  }
  convertDataToTable = () => {
    const { onStudentEdit, chosenGrade } = this.props
    this.setState({
      studentProfiles: this.props.studentProfiles ? this.props.studentProfiles.toJS().filter(data => get(data, 'grade') === chosenGrade) : []
    }, () => {
      const { studentProfiles, selectedSection } = this.state
      let columns = []
      if (studentProfiles.length > 0) {
        columns = [
          {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
          },
          {
            title: 'Student Name',
            dataIndex: 'studentName',
            key: 'studentName',
            align: 'center',
          },
          {
            title: 'Grade',
            dataIndex: 'grade',
            key: 'grade',
            align: 'center',
          },
          {
            title: 'Section',
            dataIndex: 'section',
            key: 'section',
            align: 'center',
          },
          {
            title: 'Parent Name',
            dataIndex: 'parentName',
            key: 'parentName',
            align: 'center',
          },
          {
            title: 'Phone No.',
            dataIndex: 'phone',
            key: 'phone',
            align: 'center',
          },
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            align: 'center',
          },
          {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (row, data) =>
              <MainTable.ActionItem.IconWrapper>
                <MainTable.ActionItem.EditIcon
                  onClick={() => onStudentEdit(data)}
                  style={{ color: colors.table.editIcon }}
                />
              </MainTable.ActionItem.IconWrapper>
          },
        ]
        if (selectedSection !== 'All') {
          columns = columns.filter(({ title }) => title !== 'Section')
        }
        this.setState({
          columns
        })
      }
    })
  }
  onPageChange = (page) => {
    this.setState(
      {
        currentPage: page,
        skip: page - 1,
      },
      () => this.fetchStudents()
    )
  }
  selectGradeSection = (value) => {
    const {
      chosenGrade
    } = this.props
    if (chosenGrade) {
      this.setState({
        selectedSection: value,
        studentProfiles: [],
        currentPage: 1,
        perPage: 5,
        skip: 0,
      })
    }
  }
  renderGrades = () => {
    const { chosenGrade, classGrades } = this.props
    const { selectedSection } = this.state
    if (chosenGrade) {
      return classGrades.filter(({ grade }) => grade === chosenGrade)
        .map((classData) => (
          <GradeCards
            classData={classData}
            key={classData.id}
            gradeAction={null}
            selectGradeSection={this.selectGradeSection}
            selectedSection={selectedSection}
          />
        ))
    }
    return classGrades.map((classData) => (
      <GradeCards
        classData={classData}
        key={classData.id}
        gradeAction={null}
        selectGradeSection={this.selectGradeSection}
        selectedSection={selectedSection}
      />
    ))
  }
  renderStudentTable = () => {
    const {
      chosenGrade, studentProfilesFetchStatus, classGrades, studentProfilesMeta,
      onStudentAdd
    } = this.props
    const { selectedSection, studentProfiles, currentPage, perPage, columns } = this.state
    if (chosenGrade && selectedSection && classGrades.length > 0) {
      return (
        <>
          <FlexContainer section>
            <h2 style={{ color: 'white' }} >Section {selectedSection}</h2>
            <StyledButton
              type='primary'
              onClick={() =>
                onStudentAdd(selectedSection, chosenGrade)}
            >Add Students
            </StyledButton>
          </FlexContainer>
          <MDTable
            columns={columns}
            dataSource={studentProfiles}
            loading={studentProfilesFetchStatus && get(studentProfilesFetchStatus.toJS(), 'loading')}
            scroll={{ x: 'max-content' }}
            pagination={false}
          />
          {
            studentProfilesMeta > perPage && (
              <FlexContainer justify='center'>
                <Pagination
                  total={studentProfilesMeta || 0}
                  onChange={this.onPageChange}
                  current={currentPage}
                  defaultPageSize={perPage}
                />
              </FlexContainer>
            )
          }
        </>
      )
    }
    return null
  }
  render() {
    const {
      classGrades, chosenGrade, selectGrade
    } = this.props
    return (
      <>
        <FlexContainer justify='flex-start' noPadding>
          <h2 className='studentTab__selectTitle'>Choose Grade</h2>
          <SearchInput
            value={chosenGrade}
            placeholder='Select a grade'
            onChange={(value) => {
              this.setState({
                selectedSection: ''
              }, () => selectGrade(value))
            }}
            dataArray={classGrades}
            optionGrades
          />
        </FlexContainer>
        {this.renderGrades()}
        {this.renderStudentTable()}
      </>
    )
  }
}


StudentsTab.propTypes = {
  chosenSchool: PropTypes.string.isRequired,
  chosenGrade: PropTypes.string.isRequired,
  classGrades: PropTypes.arrayOf({}).isRequired,
  studentProfilesFetchStatus: PropTypes.shape({}).isRequired,
  studentProfileUpdateStatus: PropTypes.shape({}).isRequired,
  onStudentEdit: PropTypes.func.isRequired,
  studentProfiles: PropTypes.arrayOf({}).isRequired,
  studentProfilesMeta: PropTypes.number.isRequired,
  onStudentAdd: PropTypes.func.isRequired,
  selectGrade: PropTypes.func.isRequired
}


export default StudentsTab
