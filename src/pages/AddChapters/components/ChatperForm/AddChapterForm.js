import { Button, Select } from 'antd'
import { Form, Formik } from 'formik'
import { get } from 'lodash'
import { connect } from 'react-redux'
import React, { useEffect, useRef, useState } from 'react'
import { ChapterFlex } from '../../AddChapter.style'
import Input from './Input'
import Dropzone from '../../../../components/Dropzone'
import SelectInput from './SelectInput'
import { fetchTopicsForChapters } from '../../../../actions/courseMaker'
import chapterFormValidation from './chapterFormValidation'
import { PublishInput } from '../../../AddCourse/components/Forms/FormElements'

const AddChapterForm = (props) => {
  const { addFormData, chapterAddStatus,
    coursesList, coursesFetchStatus, orderInUse, courseId,
    handleAddChapter, topicFetchingStatus, topicsList } = props
  const thumbnailRef = useRef()
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailUrl, setThumbnailUrl] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState([])

  useEffect(() => {
    if (topicsList && topicsList.length === 0) {
      fetchTopicsForChapters(courseId)
    }
  }, [courseId])
  const handleSubmit = (value, meta) => {
    handleAddChapter(value, meta, thumbnailFile, selectedTopic)
  }

  const onDropThumbnail = (file) => {
    setThumbnailFile(file)
  }

  const onSelect = (value) => {
    setSelectedTopic([...selectedTopic, value])
  }

  const onDeselect = (value) => {
    const newCourse = selectedTopic.filter(topic =>
      get(topic, 'key') !== get(value, 'key'))
    setSelectedTopic(newCourse)
  }
  return (
    <Formik
      initialValues={addFormData}
      onSubmit={handleSubmit}
      validateOnBlur
      validationSchema={chapterFormValidation}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form style={{ padding: '0 10px' }} id='form'>
          <ChapterFlex justify='space-between' modalGrid style={{ gridTemplateColumns: '45% 45%' }}>
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
          </ChapterFlex>
          <Input
            label='Add Chapter Title'
            placeholder='Add Chapter Title'
            name='title'
            type='text'
            value={values.title || ''}
            onChange={handleChange}
            setFieldValue={setFieldValue}
          />
          <Input
            label='Add Chapter Description'
            placeholder='Add Chapter Description'
            name='description'
            type='text'
            value={values.description || ''}
            onChange={handleChange}
            setFieldValue={setFieldValue}
            textArea='textArea'
          />
          <ChapterFlex modalGrid style={{ gridTemplateColumns: '45% 30% 20%' }}>
            <div>
              <h3>Select Course</h3>
              <Select
                disabled
                placeholder='Select Course'
                loading={coursesFetchStatus && !get(coursesFetchStatus.toJS(), 'loading')}
                filterOption={false}
                value={courseId || ''}
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
            <PublishInput
              values={values}
              setFieldValue={setFieldValue}
            />
          </ChapterFlex>
          <div>
            <h3>Select Topics</h3>
            <SelectInput
              values={selectedTopic}
              loading={topicFetchingStatus && topicFetchingStatus.getIn([`topics/${courseId}`, 'loading'])}
              onSelect={onSelect}
              onDeselect={onDeselect}
              data={topicsList}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '10px' }}>
            <Button
              type='primary'
              icon='file'
              id='add-btn'
              htmlType='submit'
              loading={chapterAddStatus && get(chapterAddStatus.toJS(), 'loading')}
            >
              Save
            </Button>
          </div>
        </Form>
    )}
    </Formik>
  )
}

const mapStateToProps = (state) => ({
  topicFetchingStatus: state.data.getIn(['topics', 'fetchStatus']),
})

export default connect(mapStateToProps)(AddChapterForm)

