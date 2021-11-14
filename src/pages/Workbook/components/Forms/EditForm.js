import { Button, Tooltip } from 'antd'
import { FieldArray, Form, Formik } from 'formik'
import { get } from 'lodash'
import React from 'react'
import { getOrderAutoComplete, getOrdersInUse } from '../../../../utils/data-utils'
import WorkbookStyle from '../../Workbook.style'
import { DifficultySlider, InputField, TagSelector } from './FormElements'
import { editWorkbookSchema } from './formValidation'

const EditForm = (props) => {
  const { tags, editFormData: {
    id,
    difficulty,
    hint,
    codeHint,
    tags: formTags,
    statement: question,
    title,
    answer,
    workbookExamples: example,
    order
  }, handleEditForm, operation, workbookUpdateStatus, orderInUse } = props
  const addNewField = (values, setValues) => {
    const examples = [...values.example]
    const orders = getOrdersInUse(examples)
    const nextOrder = getOrderAutoComplete(orders)
    examples.push({ statement: '', order: nextOrder })
    setValues({ ...values, example: examples })
  }
  const deleteField = (values, setValues, Id) => {
    const examples = [...values.example]
    setValues({ ...values, example: examples.filter((d, i) => i !== Id) })
  }
  const getDecodedValue = (val) => {
    let decodedVal = ''
    if (val) {
      if (/\s/.test(val)) {
        decodedVal = val
      } else {
        try {
          decodedVal = decodeURIComponent(val)
        } catch (err) {
          decodedVal = val
        }
      }
    }

    return decodedVal
  }
  return (
    <Formik
      initialValues={{
        title,
        question,
        example,
        hint,
        codeHint,
        answer: answer ? getDecodedValue(answer) : '',
        formTags,
        difficulty,
        order
      }}
      onSubmit={handleEditForm}
      validateOnBlur
      validationSchema={editWorkbookSchema}
    >
      {({ values, handleChange, setFieldValue, errors, setValues }) => (
        <Form style={{ padding: '0 10px' }}>
          <InputField
            label='Add Workbook Title'
            placeholder='Add Workbook Title'
            name='title'
            type='text'
            value={values.title || ''}
            onChange={(e) => handleChange(e)}
            setFieldValue={setFieldValue}
            inputRef='title'
          />
          <InputField
            label='Add question'
            placeholder='Add question'
            name='question'
            type='text'
            value={values.question || ''}
            onChange={(e) => handleChange(e)}
            setFieldValue={setFieldValue}
            inputRef='question'
          />
          <FieldArray name='example'>
            {
              () => (
                values.example.map((eg, i) => (
                  <InputField
                    label={`Example ${i + 1}`}
                    name={`example.${i}.statement`}
                    deleteField={() => deleteField(values, setValues, i)}
                    i={i}
                  />
                ))
              )
            }
          </FieldArray>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title='Add Example'>
              <Button
                type='primary'
                icon='plus'
                onClick={() => addNewField(values, setValues)}
              />
            </Tooltip>
          </div>
          <InputField
            label='Hint'
            placeholder='Enter hint'
            type='text'
            name='hint'
            value={values.hint || ''}
            onChange={(e) => handleChange(e)}
            setFieldValue={setFieldValue}
            inputRef='hint'
          />
          <InputField
            label='Code Hint'
            placeholder='Enter Code Hint'
            type='text'
            name='codeHint'
            value={values.codeHint || ''}
            onChange={(e) => handleChange(e)}
            setFieldValue={setFieldValue}
            inputRef='codeHint'
          />
          <InputField
            label='Answer'
            placeholder='Enter Answer'
            type='text'
            name='answer'
            value={values.answer || ''}
            onChange={(e) => handleChange(e)}
            setFieldValue={setFieldValue}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '45% 45%', justifyContent: 'space-between' }} >
            <TagSelector
              values={values}
              setFieldValue={setFieldValue}
              tags={tags}
              workbookId={id}
              operation={operation}
              label='Select Tags'
            />
            <DifficultySlider
              label='Difficulty'
              value={values.difficulty || ''}
              setFieldValue={setFieldValue}
              errors={errors}
            />
            <InputField
              label='Order'
              placeholder='Enter Order'
              type='number'
              name='order'
              value={values.order || ''}
              order
              values={values}
              orderInUse={orderInUse}
              setFieldValue={setFieldValue}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <WorkbookStyle.StyledButton
              type='primary'
              icon='file'
              id='add-btn'
              htmlType='submit'
              loading={workbookUpdateStatus && get(workbookUpdateStatus.toJS(), 'loading')}
            >
              Update
            </WorkbookStyle.StyledButton>
          </div>
        </Form>
    )}
    </Formik>
  )
}

export default EditForm
