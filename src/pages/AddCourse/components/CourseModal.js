/* eslint-disable indent */
/* eslint-disable max-len */
import { get } from 'lodash'
import React from 'react'
import MainModal from '../../../components/MainModal'
import { UNPUBLISHED_STATUS } from '../../../constants/questionBank'
import { getOrderAutoComplete, getOrdersInUse } from '../../../utils/data-utils'
import { AddCourseForm, EditCourseForm } from './Forms'
import {
  updateCourse, addCourse
} from '../../../actions/courseMaker'

class CourseModal extends React.Component {
  state = {
    title: '',
    status: UNPUBLISHED_STATUS,
    description: '',
    bannerDescription: '',
    bannerTitle: '',
    secondaryCategory: '',
    primaryColor: '',
    secondaryColor: '',
    backdropColor: '',
    targetGroupt: null,
  }
  handleAddCourse = async (value,
    { setErrors }, thumbnailFile,
    bannerFile, selectedComponent, selectedTargetGroup,
    theme, selectedLoComponent, codingLanguages, grades) => {
    const { coursesData, closeModal } = this.props
    const orders = getOrdersInUse(coursesData && coursesData.toJS())
    const { title, order, status, description,
      bannerTitle, bannerDescription, secondaryCategory } = value
    if (orders.includes(order)) {
      setErrors({ order: 'Order Already in use' })
    } else {
      const components = []
      if (selectedComponent && selectedComponent.length > 0) {
        selectedComponent.forEach(({ componentName, min, max, ...data }) => {
          components.push({ componentName, order: get(data, 'order'), min, max })
        })
      }
      const loComponent = []
      if (selectedLoComponent && selectedLoComponent.length > 0) {
        selectedLoComponent.forEach(({ componentName, ...data }) => {
          loComponent.push({ componentName, order: get(data, 'order') })
        })
      }
      const newCourseLangauges = []
      codingLanguages.forEach(language => {
        if (get(language, 'key')) {
          newCourseLangauges.push({
            value: get(language, 'key')
          })
        }
      })
      let targetGroup = null
      if (selectedTargetGroup) {
        const newArr = []
        selectedTargetGroup.forEach(item => {
          newArr.push({ type: item.key })
        })
        targetGroup = newArr
      }
      await addCourse({
        input: {
          title: title.trim(),
          order,
          status,
          description,
          bannerTitle,
          bannerDescription,
          category: 'technology',
          courseComponentRule: components,
          secondaryCategory,
          theme,
          targetGroup,
          defaultLoComponentRule: loComponent,
          codingLanguages: newCourseLangauges,
          minGrade: Number(get(grades, 'minGrade', 0)),
          maxGrade: Number(get(grades, 'maxGrade', 0))
        },
        thumbnailFile,
        bannerFile,
      }).then(async res => {
        if (res.addCourse && res.addCourse.id) {
          closeModal()
        }
      })
    }
  }
  handleEditCourse = async (value,
    { setErrors }, thumbnailFile, bannerFile,
    selectedComponent, selectedTargetGroup,
    theme, selectedLoComponent, codingLanguages, grades) => {
    const { title, order, status, description,
      bannerDescription, bannerTitle, secondaryCategory } = value
    const { editData, coursesData, closeModal } = this.props
    const orders = getOrdersInUse(coursesData && coursesData.toJS())
    const orderArr = orders.filter(n => n !== editData.order)
    if (orderArr.includes(order)) {
      setErrors({ order: 'Order Already in use' })
    } else {
      const components = []
      if (selectedComponent && selectedComponent.length > 0) {
        selectedComponent.forEach(({ componentName, min, max, ...data }) => {
          components.push({ componentName, order: get(data, 'order'), min, max })
        })
      }
      const loComponent = []
      if (selectedLoComponent && selectedLoComponent.length > 0) {
        selectedLoComponent.forEach(({ componentName, ...data }) => {
          loComponent.push({ componentName, order: get(data, 'order') })
        })
      }
      const newCourseLangauges = []
      codingLanguages.forEach(language => {
        if (get(language, 'key')) {
          newCourseLangauges.push({
            value: get(language, 'key')
          })
        }
      })
      const inputObj = {
        title: title.trim(),
        order,
        status,
        theme,
        secondaryCategory: secondaryCategory || '',
        description: description || '',
        bannerDescription: bannerDescription || '',
        bannerTitle: bannerTitle || '',
        courseComponentRule: {
          replace: components
        },
        defaultLoComponentRule: {
          replace: loComponent
        },
        codingLanguages: {
          replace: newCourseLangauges
        },
        minGrade: Number(get(grades, 'minGrade', 0)),
        maxGrade: Number(get(grades, 'maxGrade', 0))
      }
      if (selectedTargetGroup && selectedTargetGroup.length > 0) {
        const newArr = []
        selectedTargetGroup.forEach(item => {
          newArr.push({ type: item.key })
        })
        inputObj.targetGroup = {
          replace: newArr
        }
      }
      await updateCourse({
        courseId: editData.id,
        input: inputObj,
        thumbnailFile,
        bannerFile
      }).then(async res => {
        if (res && res.updateCourse && res.updateCourse.id) {
          closeModal()
        }
      })
    }
  }
  render() {
    const { openModal, closeModal, editData } = this.props
    const { operation, coursesData, courseAddStatus, courseUpdateStatus } = this.props
    const orders = getOrdersInUse(coursesData && coursesData.toJS())
    const orderAutoComplete = getOrderAutoComplete(orders)
    if (editData) {
      editData.primaryColor = get(editData, 'theme.primaryColor')
      editData.secondaryColor = get(editData, 'theme.secondaryColor')
      editData.backdropColor = get(editData, 'theme.backdropColor')
    }
    return (
      <MainModal
        visible={openModal}
        title={operation === 'add' ? 'Add Course' : 'Edit Course'}
        onCancel={closeModal}
        maskClosable={false}
        width='780px'
        centered
        destroyOnClose
        footer={null}
      >
        {
          operation === 'add' ?
            <AddCourseForm
              addFormData={{ ...this.state, order: orderAutoComplete }}
              handleAddCourse={this.handleAddCourse}
              courseAddStatus={courseAddStatus}
            /> :
            <EditCourseForm
              editData={{ ...editData, description: get(editData, 'description') || '' }}
              handleEditCourse={this.handleEditCourse}
              courseUpdateStatus={courseUpdateStatus}
            />
        }
      </MainModal>
    )
  }
}

export default CourseModal
