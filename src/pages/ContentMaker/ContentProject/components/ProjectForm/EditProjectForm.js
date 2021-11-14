import React, { useEffect, useRef, useState } from 'react'
import { Form, Formik } from 'formik'
import { get } from 'lodash'
import { Select } from 'antd'
import { DifficultyInput, Input, PublishInput } from './FormElements'
import Dropzone from '../../../../../components/Dropzone'
import { FlexContainer, StyledButton } from '../../ContentProject.styles'
import getFullPath from '../../../../../utils/getFullPath'
import { getSelectedValues } from '../../../../../utils/data-utils'
import { projectValidation } from '../../../contentUtils'
import { removeFromCourseComponent } from '../../../../../actions/contentMaker'
import { PROJECT } from '../../../../../constants/CourseComponents'

const EditProjectForm = (props) => {
  const { handleEditProject, editFormData, projectUpdateStatus,
    coursesFetchStatus, coursesList,
    orderInUse } = props
  const externalPlatformLogoRef = useRef()
  const projectThumbnailRef = useRef()
  const [externalPlatformLogo, setExternalPlatformLogo] = useState(null)
  const [projectThumbnail, setProjectThumbnail] = useState(null)
  const [selectedCourses, setSelectedCourses] = useState([])

  useEffect(() => {
    const newSelectedCourse = getSelectedValues(editFormData, coursesList, 'courses')
    setSelectedCourses(newSelectedCourse)
  }, [editFormData.id])

  const onDropPlatformLogo = (file) => {
    setExternalPlatformLogo(file)
  }

  const onDropThumbnail = (file) => {
    setProjectThumbnail(file)
  }

  const handleSubmit = (value, meta) => {
    handleEditProject(value, meta, externalPlatformLogo, projectThumbnail, selectedCourses)
  }

  const onSelect = (value) => {
    setSelectedCourses([...selectedCourses, value])
  }

  const onDeselect = (value) => {
    const newCourse = selectedCourses.filter(course =>
      get(course, 'key') !== get(value, 'key'))
    const addedCourses = get(editFormData, 'courses', []).map(course => get(course, 'id'))
    if (addedCourses.includes(get(value, 'key'))) {
      removeFromCourseComponent(get(value, 'key'), get(editFormData, 'id'), PROJECT)
    }
    setSelectedCourses(newCourse)
  }
  return (
    <Formik
      initialValues={editFormData}
      onSubmit={handleSubmit}
      validateOnBlur
      validationSchema={projectValidation}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form style={{ padding: '0 10px' }} id='form'>
          <FlexContainer style={{ alignItems: 'flex-start' }}>
            <div style={{ flex: '0.6' }}>
              <Input
                label='Project Name'
                placeholder='Project Name'
                name='title'
                type='text'
                value={values.title || ''}
                onChange={handleChange}
                setFieldValue={setFieldValue}
              />
              <Input
                label='Project Description'
                placeholder='Project Description'
                name='projectDescription'
                type='text'
                textArea
                value={values.projectDescription || ''}
                onChange={handleChange}
                setFieldValue={setFieldValue}
                inputRef='projectDescription'
              />
              <div style={{
                display: 'grid',
                alignItems: 'flex-start',
                gridTemplateColumns: '30% 60%',
              }}
              >
                <h3>Select Courses</h3>
                <Select
                  mode='multiple'
                  labelInValue
                  placeholder='Select Courses'
                  loading={coursesFetchStatus && !get(coursesFetchStatus.toJS(), 'loading')}
                  filterOption={false}
                  value={selectedCourses}
                  disabled
                  onSelect={onSelect}
                  onDeselect={onDeselect}
                  style={{ width: '100%' }}
                >
                  {
                    coursesList.map(item =>
                      <Select.Option
                        value={get(item, 'id')}
                        key={get(item, 'id')}
                      >
                        {get(item, 'title')}
                      </Select.Option>
                    )
                  }
                </Select>
              </div>
            </div>
            <FlexContainer style={{ alignItems: 'flex-start', flex: '0.3' }}>
              <h3>Project Thumbnail</h3>
              <Dropzone
                style={{ height: '200px', width: '100%', marginBottom: '15px' }}
                getDropzoneFile={onDropThumbnail}
                ref={projectThumbnailRef}
                defaultImage={getFullPath(get(editFormData, 'projectThumbnail.uri'))}
                defaultFile={projectThumbnail}
              >Click or drag to attach
              </Dropzone>
            </FlexContainer>
          </FlexContainer>
          <DifficultyInput value={values.difficulty} setFieldValue={setFieldValue} />
          <FlexContainer justify='space-between' modalGrid>
            <FlexContainer style={{ alignItems: 'flex-start', flex: '0.3' }}>
              <h3>Platform Thumbnail:</h3>
              <Dropzone
                style={{ height: '200px', width: '100%', marginBottom: '15px' }}
                getDropzoneFile={onDropPlatformLogo}
                ref={externalPlatformLogoRef}
                defaultImage={getFullPath(get(editFormData, 'externalPlatformLogo.uri'))}
                defaultFile={externalPlatformLogo}
              >Click or drag to attach
              </Dropzone>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer>
            <Input
              inputStyles={{ flex: '0.6' }}
              label='Create Description'
              placeholder='Create Description'
              name='projectCreationDescription'
              type='text'
              textArea
              value={values.projectCreationDescription || ''}
              onChange={handleChange}
              setFieldValue={setFieldValue}
              inputRef='projectCreationDescription'
            />
          </FlexContainer>
          <FlexContainer>
            <Input
              inputStyles={{ flex: '0.6' }}
              label='Create CTA link'
              placeholder='Create CTA link'
              name='externalPlatformLink'
              type='text'
              onBlur={() => setFieldValue('externalPlatformLink', get(values, 'externalPlatformLink', '').trim())}
              value={values.externalPlatformLink || ''}
              onChange={handleChange}
              setFieldValue={setFieldValue}
            />
          </FlexContainer>
          <FlexContainer>
            <Input
              inputStyles={{ flex: '0.6' }}
              label='Submit Description'
              placeholder='Submit Description'
              name='answerDescription'
              type='text'
              textArea
              value={values.answerDescription || ''}
              onChange={handleChange}
              setFieldValue={setFieldValue}
              inputRef='answerDescription'
            />
          </FlexContainer>
          <FlexContainer justify='flex-start'>
            <Input
              placeholder='Enter Order'
              inputStyles={{ marginBottom: '0' }}
              type='number'
              name='order'
              label='Order'
              value={values.order || ''}
              order
              values={values}
              orderInUse={orderInUse}
              setFieldValue={setFieldValue}
              onChange={(e) => handleChange(e)}
            />
            <PublishInput
              values={values}
              setFieldValue={setFieldValue}
            />
          </FlexContainer>
          <FlexContainer justify='center'>
            <StyledButton
              icon='file'
              id='add-btn'
              htmlType='submit'
              loading={projectUpdateStatus && get(projectUpdateStatus.toJS(), 'loading')}
            >
              Update
            </StyledButton>
          </FlexContainer>
        </Form>
    )}
    </Formik>
  )
}

export default EditProjectForm
