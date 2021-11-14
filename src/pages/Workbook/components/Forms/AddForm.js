import React from 'react'
import { FieldArray, Form, Formik } from 'formik'
import { get } from 'lodash'
import { Button, Tooltip } from 'antd'
import { InputField, DifficultySlider, TagSelector } from './FormElements'
// import { addBannerSchema } from '../validations/editBannerSchema'
import WorkbookStyle from '../../Workbook.style'
import { getOrderAutoComplete, getOrdersInUse } from '../../../../utils/data-utils'
import { addWorkbookSchema } from './formValidation'

const AddForm = (props) => {
  const { handleAddForm, addFormData, tags, workbookAddStatus, orderInUse } = props
  const addNewField = (values, setValues) => {
    const example = [...values.example]
    const order = getOrdersInUse(example)
    const nextOrder = getOrderAutoComplete(order)
    example.push({ statement: '', order: nextOrder })
    setValues({ ...values, example })
  }
  const deleteField = (values, setValues, id) => {
    const example = [...values.example]
    setValues({ ...values, example: example.filter((d, i) => i !== id) })
  }
  return (
    <Formik
      initialValues={addFormData}
      onSubmit={handleAddForm}
      validateOnBlur
      validationSchema={addWorkbookSchema}
    >
      {({ values, handleChange, setFieldValue, setValues, errors }) => (
        <Form style={{ padding: '0 10px' }} id='form'>
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
          <InputField // added answer field
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
              loading={workbookAddStatus && get(workbookAddStatus.toJS(), 'loading', '')}
            >
              Save
            </WorkbookStyle.StyledButton>
          </div>
        </Form>
    )}
    </Formik>
  )
}

export default AddForm
