import { Select } from 'antd'
import { Form, Formik } from 'formik'
import { get } from 'lodash'
import React, { useState } from 'react'
import { PublishInput } from '../../../ContentLearningObjective/components/LoForms/FormElements'
import { AssignmentContainer, StyledButton } from '../../ContentAssignment.style'
import { DifficultySlider, Input, addAssignmentSchema } from './FormElements'

const AddAssignmentForm = (props) => {
  const { addFormData, addLoading,
    handleAddAssignment, coursesList } = props

  const [selectedCourses, setSelectedCourses] = useState([])

  const onSelect = (value) => {
    setSelectedCourses([...selectedCourses, value])
  }

  const onDeselect = (value) => {
    const newCourse = selectedCourses.filter(course =>
      get(course, 'key') !== get(value, 'key'))
    setSelectedCourses(newCourse)
  }

  const onSubmit = (value, meta) => {
    handleAddAssignment(value, meta, selectedCourses)
  }
  return (
    <Formik
      initialValues={addFormData}
      onSubmit={onSubmit}
      validateOnBlur
      validationSchema={addAssignmentSchema}
    >
      {({ values, handleChange, setFieldValue, errors }) => (
        <Form style={{ padding: '0 10px' }} id='form'>
          <Input
            label='Question Statement'
            placeholder='Question Statement'
            name='statement'
            type='text'
            value={values.statement || ''}
            onChange={handleChange}
            setFieldValue={setFieldValue}
          />
          <Input
            label='Question Code Snippet'
            placeholder='Question Code Snippet'
            name='questionCodeSnippet'
            type='text'
            textArea
            value={values.questionCodeSnippet || ''}
            onChange={handleChange}
            setFieldValue={setFieldValue}
            inputRef='questionCodeSnippet'
          />
          <Input
            label='Answer Code Snippet'
            placeholder='Answer Code Snippet'
            name='answerCodeSnippet'
            type='text'
            textArea
            value={values.answerCodeSnippet || ''}
            onChange={handleChange}
            setFieldValue={setFieldValue}
            inputRef='answerCodeSnippet'
          />
          <AssignmentContainer modalGrid style={{ gridTemplateColumns: '35% 35% 20%' }}>
            <DifficultySlider
              label='Difficulty'
              value={values.difficulty || ''}
              setFieldValue={setFieldValue}
              errors={errors}
            />
            <Input
              placeholder='Enter Order'
              inputStyles={{ marginBottom: '0' }}
              type='number'
              name='order'
              label='Order'
              value={values.order || ''}
              order
              values={values}
              setFieldValue={setFieldValue}
              onChange={(e) => handleChange(e)}
            />
            <PublishInput
              values={values}
              flex='column'
              setFieldValue={setFieldValue}
            />
          </AssignmentContainer>
          <Input
            label='Hint'
            placeholder='Hint'
            name='hint'
            type='text'
            textArea
            value={values.hint || ''}
            onChange={handleChange}
            setFieldValue={setFieldValue}
            inputRef='hint'
          />
          <Input
            label='Explanation'
            placeholder='Explanation'
            name='explanation'
            type='text'
            textArea
            value={values.explanation || ''}
            onChange={handleChange}
            setFieldValue={setFieldValue}
            inputRef='explanation'
          />
          <div style={{ marginBottom: '10px' }}>
            <h3>Select Courses</h3>
            <Select
              mode='multiple'
              labelInValue
              placeholder='Select Courses'
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
          <AssignmentContainer justify='center'>
            <StyledButton
              icon='file'
              id='add-btn'
              htmlType='submit'
              loading={addLoading && get(addLoading.toJS(), 'loading')}
            >
              Save
            </StyledButton>
          </AssignmentContainer>
        </Form>
    )}
    </Formik>
  )
}

export default AddAssignmentForm
