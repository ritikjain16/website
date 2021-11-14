import { Icon, notification, Select } from 'antd'
import { get } from 'lodash'
import React from 'react'
import addUserCourse from '../../../actions/ums/addUserCourse'
import removeCourseFromUserCourse from '../../../actions/ums/removeCourseFromUserCourse'
import updateUserCourse from '../../../actions/ums/updateUserCourse'
import MainModal from '../../../components/MainModal'
import UmsDashboardStyle from '../UmsDashboard.style'

const { Option } = Select

class AddUserCourseModal extends React.Component {
  state = {
    selectedCourse: [],
    loading: true
  }

  componentDidUpdate = (prevprops) => {
    const { addCourseModalVisisble } = this.props
    if (prevprops.addCourseModalVisisble !== addCourseModalVisisble && addCourseModalVisisble) {
      this.setSelectedCourses()
    }
  }
  setSelectedCourses = () => {
    const { addUserCourseData } = this.props
    if (get(addUserCourseData, 'userCourse.courses', []).length > 0) {
      const selectedCourse = []
      get(addUserCourseData, 'userCourse.courses', []).forEach(course => {
        selectedCourse.push({
          key: get(course, 'id'),
          label: get(course, 'title')
        })
      })
      this.setState({
        selectedCourse
      })
    }
  }
  onClose = () => {
    const { onModalClose } = this.props
    this.setState({
      selectedCourse: [],
      loading: true
    }, onModalClose)
  }

  onSelectCourse = (value) => {
    const { selectedCourse } = this.state
    const newselectedCourse = [...selectedCourse, value]
    this.setState({
      selectedCourse: newselectedCourse
    })
  }

  onDeselectCourse = async (value) => {
    const { selectedCourse } = this.state
    const { addUserCourseData } = this.props
    const newselectedCourse = [...selectedCourse].filter(course =>
      get(course, 'key') !== get(value, 'key'))
    this.setState({
      selectedCourse: newselectedCourse
    })
    if (get(addUserCourseData, 'userCourse.id')) {
      const isAdded = get(addUserCourseData, 'userCourse.courses', []).find(course =>
        get(value, 'key') === get(course, 'id'))
      if (isAdded) {
        this.setState({
          loading: false
        })
        await removeCourseFromUserCourse({
          userCourseId: get(addUserCourseData, 'userCourse.id'),
          courseId: get(value, 'key')
        })
        this.setState({
          loading: true
        })
      }
    }
  }

  onSave = () => {
    const { addUserCourseData } = this.props
    let { selectedCourse } = this.state
    selectedCourse = selectedCourse.map(course => get(course, 'key'))
    if (get(addUserCourseData, 'action') && selectedCourse.length > 0) {
      if (get(addUserCourseData, 'userCourse.id')) {
        updateUserCourse({
          userCourseId: get(addUserCourseData, 'userCourse.id'),
          coursesConnectIds: selectedCourse
        }).then(res => {
          if (res && res.updateUserCourse && res.updateUserCourse.id) {
            notification.success({
              message: 'Courses updated successfully'
            })
            this.onClose()
          }
        })
      } else {
        addUserCourse({
          userConnectId: get(addUserCourseData, 'action'),
          coursesConnectIds: selectedCourse
        }).then(res => {
          if (res && res.addUserCourse && res.addUserCourse.id) {
            notification.success({
              message: 'Course added successfully'
            })
            this.onClose()
          }
        })
      }
    }
  }
  onSaveLoading = () => {
    const { userCourseAddStatus, userCourseUpdateStatus } = this.props
    const { loading } = this.state
    return loading && (userCourseAddStatus || userCourseUpdateStatus)
  }
  render() {
    const { addCourseModalVisisble, coursesList, addUserCourseData } = this.props
    const { selectedCourse } = this.state
    return (
      <MainModal
        visible={addCourseModalVisisble}
        title={`Add User Course for ${get(addUserCourseData, 'menteeName')}`}
        onCancel={this.onClose}
        maskClosable={false}
        width='500px'
        footer={
          [
            <MainModal.SaveButton
              type='primary'
              htmlType='submit'
              onClick={this.onSave}
              loading={this.onSaveLoading()}
            >
              {this.onSaveLoading() ? 'Adding...' : 'ADD'}
            </MainModal.SaveButton>
          ]}
      >
        <MainModal.FormItem label='Choose Courses to Add:'>
          <Select
            mode='multiple'
            labelInValue
            value={selectedCourse}
            placeholder='Select Course'
            filterOption={(input, option) =>
                get(option, 'props.children')
                    ? get(option, 'props.children')
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                    : false
                }
            style={{ width: '100%' }}
            onSelect={this.onSelectCourse}
            onDeselect={this.onDeselectCourse}
          >
            {coursesList.map(course => (
              <Option key={course.id} value={course.id}>{course.title}</Option>
            ))}
          </Select>
        </MainModal.FormItem>
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
          {selectedCourse.map(course => (
            <UmsDashboardStyle.CourseWrapper>
              <Icon
                type='close'
                onClick={() => this.onDeselectCourse(course)}
              />
              {get(course, 'label')}
            </UmsDashboardStyle.CourseWrapper>
          ))
        }
        </div>
      </MainModal>
    )
  }
}

export default AddUserCourseModal
