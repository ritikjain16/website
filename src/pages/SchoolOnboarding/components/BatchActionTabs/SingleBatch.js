import { Input, notification, Spin } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { fetchBatchStudents, updateSchoolBatch } from '../../../../actions/SchoolOnboarding'
import MainModal from '../../../../components/MainModal'
import {
  CloseIcon, FlexContainer,
  MDTable, SectionButton, StyledCheckbox,
  StyledDivider, UserIcon
} from '../../SchoolOnBoarding.style'

class SingleBatch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      columns: [],
      studentProfiles: [],
      search: '',
      studentKeys: [],
    }
  }
  componentDidMount = async () => {
    await fetchBatchStudents(this.props.batchId)
  }
  componentDidUpdate = async (prevProps) => {
    const { studentProfilesFetchStatus, batchUpdatingStatus,
      batchUpdatingError, batchId } = this.props
    if ((studentProfilesFetchStatus && !get(studentProfilesFetchStatus.toJS(), 'loading')
      && get(studentProfilesFetchStatus.toJS(), 'success') &&
      (prevProps.studentProfilesFetchStatus !== studentProfilesFetchStatus))) {
      this.convertDataToTable()
    }

    if ((batchUpdatingStatus && !get(batchUpdatingStatus.toJS(), 'loading')
      && get(batchUpdatingStatus.toJS(), 'success') &&
      (prevProps.batchUpdatingStatus !== batchUpdatingStatus))) {
      notification.success({
        message: 'Student Added Successfully'
      })
      this.onModalClose()
      await fetchBatchStudents(batchId)
    } else if (batchUpdatingStatus && !get(batchUpdatingStatus.toJS(), 'loading')
      && get(batchUpdatingStatus.toJS(), 'failure') &&
      (prevProps.batchUpdatingError !== batchUpdatingError)) {
      if (batchUpdatingError && batchUpdatingError.toJS().length > 0) {
        notification.error({
          message: get(get(batchUpdatingError.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
  }
  convertDataToTable = () => {
    this.setState({
      studentProfiles: this.props.studentProfiles && this.props.studentProfiles.toJS()
    }, () => {
      const { studentProfiles } = this.state
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
        ]
        this.setState({
          columns
        })
      }
    })
  }
  onModalClose = () => {
    this.setState({
      modalVisible: false,
      search: '',
      studentKeys: []
    })
  }
  onCheckStudent = (checked, studentId) => {
    const {
      studentKeys
    } = this.state
    const newStudents = [...studentKeys]
    if (checked) {
      const isExist = newStudents.find(Id => Id === studentId)
      if (!isExist) this.setState({ studentKeys: [...newStudents, studentId] })
    } else {
      const isExist = newStudents.find(Id => Id === studentId)
      if (isExist) {
        this.setState({
          studentKeys: newStudents.filter(Id => Id !== studentId)
        })
      }
    }
  }
  onAddStudent = async () => {
    await updateSchoolBatch({
      batchId: this.props.batchId,
      studentIds: this.state.studentKeys
    })
  }
  renderStudents = () => {
    const { studentProfiles, search, studentKeys } = this.state
    const { studentsSearch } = this.props
    const studentsList = []
    studentsSearch.forEach((student) => {
      const studentsId = studentProfiles.map(({ id }) => id)
      if (!studentsId.includes(student.id)) {
        studentsList.push(student)
      }
    })
    const students = []
    studentsList.filter(({ studentName }) =>
      studentName && studentName.toLowerCase().includes(search.toLowerCase())).forEach(item =>
      students.push(
        <div key={item.id}>
          <StyledCheckbox
            style={{ margin: '1vw 0' }}
            onChange={({ target: { checked } }) => this.onCheckStudent(checked, item.id)}
            checked={studentKeys.includes(item.id)}
            id={item.id}
          />
          <label htmlFor={item.id} style={{ cursor: 'pointer' }}>
            {`${get(item, 'studentName')} (${get(item, 'grade')}-${get(item, 'section')}), Parent ${get(item, 'parentName')}`}
          </label>
        </div>
      )
    )
    return students.length > 0 ? students : <h3>No Students Available</h3>
  }
  renderAddStudent = () => {
    const { modalVisible, studentKeys, search } = this.state
    const { isStudentsSearchFetching, batchUpdatingStatus } = this.props
    return (
      <MainModal
        visible={modalVisible}
        onCancel={this.onModalClose}
        maskClosable
        bodyStyle={{ padding: 0 }}
        closable={false}
        width='650px'
        centered
        destroyOnClose
        footer={null}
      >
        <FlexContainer noPadding style={{ width: '100%' }}>
          <div style={{ padding: '0.5vw 1.5vw' }}>
            <h1>Assign Student</h1>
            <CloseIcon onClick={this.onModalClose} />
          </div>
        </FlexContainer>
        <StyledDivider style={{ marginBottom: '1vw' }} />
        <FlexContainer
          noPadding
          justify='center'
          style={{ flexDirection: 'column', paddingBottom: '1vw', width: '80%', margin: '0 auto' }}
        >
          <Input
            value={search}
            onChange={e => this.setState({ search: e.target.value })}
          />
          <div style={{ marginTop: '1vw', width: '100%' }}>
            {
              isStudentsSearchFetching && get(isStudentsSearchFetching.toJS(), 'loading') ? (
                <Spin />
              ) : (
                  this.renderStudents()
              )
            }
          </div>
          <SectionButton
            type='primary'
            disabled={studentKeys.length === 0}
            style={{ marginTop: '2vw' }}
            onClick={this.onAddStudent}
            loading={batchUpdatingStatus && get(batchUpdatingStatus.toJS(), 'loading')}
          >
            Add<UserIcon />
          </SectionButton>
        </FlexContainer>
      </MainModal>
    )
  }
  render() {
    const { columns, studentProfiles } = this.state
    const { studentProfilesFetchStatus, batchesData } = this.props
    return (
      <>
        <FlexContainer justify='flex-end' >
          {this.renderAddStudent()}
          <SectionButton
            type='primary'
            onClick={() => this.setState({ modalVisible: true },
              () => fetchBatchStudents(this.props.schoolId,
                'batchStudents', get(batchesData, 'grades', [])))}
          >
            Assign Student<UserIcon />
          </SectionButton>
        </FlexContainer>
        <MDTable
          columns={columns}
          dataSource={studentProfiles}
          loading={studentProfilesFetchStatus && get(studentProfilesFetchStatus.toJS(), 'loading')}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </>
    )
  }
}

export default SingleBatch
