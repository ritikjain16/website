import React, { useRef, useState } from 'react'
import { Form, Formik } from 'formik'
import { get } from 'lodash'
import { Checkbox, Select } from 'antd'
import { Input, PublishInput } from './FormElements'
import Dropzone from '../../../../../components/Dropzone'
import { FlexContainer, StyledButton } from '../../ContentPractice.styles'
import { projectValidation } from '../../../contentUtils'

const AddPracticeForm = (props) => {
  const { handleAddPractice, addFormData,
    practiceAddStatus, orderInUse, coursesFetchStatus, coursesList } = props
  const externalPlatformLogoRef = useRef()
  const [externalPlatformLogo, setExternalPlatformLogo] = useState(null)
  const [selectedCourses, setSelectedCourses] = useState([])
  const onDropPlatformLogo = (file) => {
    setExternalPlatformLogo(file)
  }

  const handleSubmit = (value, meta) => {
    handleAddPractice(value, meta, externalPlatformLogo, selectedCourses)
  }

  const onSelect = (value) => {
    setSelectedCourses([...selectedCourses, value])
  }

  const onDeselect = (value) => {
    const newCourse = selectedCourses.filter(course =>
      get(course, 'key') !== get(value, 'key'))
    setSelectedCourses(newCourse)
  }
  return (
    <Formik
      initialValues={addFormData}
      onSubmit={handleSubmit}
      validateOnBlur
      validationSchema={projectValidation}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form style={{ padding: '0 10px' }} id='form'>
          <FlexContainer style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <div style={{ flex: '0.6' }}>
              <Input
                label='Practice Name'
                placeholder='Practice Name'
                name='title'
                type='text'
                value={values.title || ''}
                onChange={handleChange}
                setFieldValue={setFieldValue}
              />
              <Input
                label='Practice Description'
                placeholder='Practice Description'
                name='projectDescription'
                type='text'
                textArea
                value={values.projectDescription || ''}
                onChange={handleChange}
                setFieldValue={setFieldValue}
                inputRef='projectDescription'
              />
            </div>
            <div style={{ width: '200px', flex: '0.4' }}>
              <h3>Select Courses</h3>
              <Select
                mode='multiple'
                labelInValue
                placeholder='Select Courses'
                loading={coursesFetchStatus && !get(coursesFetchStatus.toJS(), 'loading')}
                filterOption={false}
                value={selectedCourses}
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
          </FlexContainer>
          <FlexContainer justify='space-between' modalGrid>
            <FlexContainer style={{ alignItems: 'flex-start', flex: '0.3' }}>
              <h3>Platform Thumbnail:</h3>
              <Dropzone
                style={{ height: '200px', width: '100%', marginBottom: '15px' }}
                getDropzoneFile={onDropPlatformLogo}
                ref={externalPlatformLogoRef}
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
          <div style={{ marginBottom: '10px' }}>
            <label style={{ cursor: 'pointer' }} htmlFor='isSubmitAnswer'>Can kids submit this practice?
              <Checkbox
                id='isSubmitAnswer'
                style={{ marginLeft: '20px' }}
                checked={values.isSubmitAnswer}
                onChange={({ target: { checked } }) => setFieldValue('isSubmitAnswer', checked)}
              />
            </label>
          </div>
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
              loading={practiceAddStatus && get(practiceAddStatus.toJS(), 'loading')}
            >
              Save
            </StyledButton>
          </FlexContainer>
        </Form>
    )}
    </Formik>
  )
}

export default AddPracticeForm
