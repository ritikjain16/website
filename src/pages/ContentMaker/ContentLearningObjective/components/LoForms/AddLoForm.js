import React, { useRef, useState } from 'react'
import { Form, Formik } from 'formik'
import { get } from 'lodash'
import { Button, Select } from 'antd'
import { Input, PublishInput } from './FormElements'
import Dropzone from '../../../../../components/Dropzone'
import { FlexContainer } from '../../ContentLearningObjective.styles'
import { commonFormValidation } from '../../../contentUtils'

const AddLoForm = (props) => {
  const { handleAddLo, addFormData, learningObectiveAddStatus,
    orderInUse, coursesFetchStatus, coursesList } = props
  const thumbnailRef = useRef()
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailUrl, setThumbnailUrl] = useState(null)
  const pqStoryImageRef = useRef()
  const [pqStoryImageFile, setPqStoryImageFile] = useState(null)
  const [pqStoryImageUri, setPqStoryImageUri] = useState(null)
  const [selectedCourses, setSelectedCourses] = useState([])
  const onDropThumbnail = (file) => {
    setThumbnailFile(file)
  }

  const onDropPqStoryImage = (file) => {
    setPqStoryImageFile(file)
  }

  const handleSubmit = (value) => {
    handleAddLo(value, thumbnailFile, pqStoryImageFile, selectedCourses)
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
      validationSchema={commonFormValidation}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form style={{ padding: '0 10px' }} id='form'>
          <FlexContainer justify='space-between' modalGrid>
            <div>
              <h3>Thumbnail</h3>
              <Dropzone
                style={{ height: '200px', width: '100%', marginBottom: '15px' }}
                getDropzoneFile={onDropThumbnail}
                ref={thumbnailRef}
                defaultImage={thumbnailUrl}
                defaultFile={thumbnailFile}
                onImageUrl={imgUrl => setThumbnailUrl(imgUrl)}
              >Click or drag to attach
              </Dropzone>
            </div>
            <div>
              <h3>Pq StoryImage</h3>
              <Dropzone
                style={{ height: '200px', width: '100%', marginBottom: '15px' }}
                getDropzoneFile={onDropPqStoryImage}
                ref={pqStoryImageRef}
                defaultImage={pqStoryImageUri}
                defaultFile={pqStoryImageFile}
                onImageUrl={imgUrl => setPqStoryImageUri(imgUrl)}
              >Click or drag to attach
              </Dropzone>
            </div>
          </FlexContainer>
          <FlexContainer modalGrid>
            <div>
              <Input
                label='Add Lo Title'
                placeholder='Add Lo Title'
                name='title'
                type='text'
                value={values.title || ''}
                onChange={handleChange}
                setFieldValue={setFieldValue}
              />
              <Input
                placeholder='Enter Order'
                type='number'
                name='order'
                label='Order'
                value={values.order || ''}
                order
                values={values}
                orderInUse={orderInUse}
                setFieldValue={setFieldValue}
                onChange={handleChange}
              />
            </div>
            <div style={{ flex: '0.8' }}>
              <Input
                label='Add Lo Description'
                placeholder='Add Lo Description'
                name='description'
                type='text'
                value={values.description || ''}
                onChange={handleChange}
                setFieldValue={setFieldValue}
                textArea='textArea'
              />
            </div>
          </FlexContainer>
          <FlexContainer modalGrid>
            <div>
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
              <div style={{ marginTop: 10 }}>
                <PublishInput
                  values={values}
                  setFieldValue={setFieldValue}
                />
              </div>
            </div>
            <Input
              label='Add PQ Story'
              placeholder='Add PQ Story'
              name='pqStory'
              type='text'
              value={values.pqStory || ''}
              onChange={handleChange}
              setFieldValue={setFieldValue}
              textArea='textArea'
            />
          </FlexContainer>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '10px' }}>
            <Button
              type='primary'
              icon='file'
              id='add-btn'
              htmlType='submit'
              loading={learningObectiveAddStatus && get(learningObectiveAddStatus.toJS(), 'loading')}
            >
              Save
            </Button>
          </div>
        </Form>
    )}
    </Formik>
  )
}

export default AddLoForm
