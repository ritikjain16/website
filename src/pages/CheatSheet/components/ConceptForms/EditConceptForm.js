import React from 'react'
import { Form, Formik } from 'formik'
import { get } from 'lodash'
import { Button } from 'antd'
import { InputField, PublishInput, conceptValidation } from './FormItems'

const EditConceptForm = (props) => {
  const { handleEditConcept, editData, conceptUpdateStatus, orderInUse } = props
  return (
    <Formik
      initialValues={editData}
      onSubmit={handleEditConcept}
      validateOnBlur
      validationSchema={conceptValidation}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form style={{ padding: '0 10px' }} id='form'>
          <InputField
            label='Add CheatSheet Title'
            placeholder='Add CheatSheet Title'
            name='title'
            type='text'
            value={values.title || ''}
            onChange={(e) => handleChange(e)}
            setFieldValue={setFieldValue}
          />
          <InputField
            label='Add CheatSheet Description'
            placeholder='Add CheatSheet Description'
            name='description'
            type='text'
            value={values.description || ''}
            onChange={(e) => handleChange(e)}
            setFieldValue={setFieldValue}
            textArea='textArea'
          />
          <div
            style={{
              display: 'grid', gridTemplateColumns: '64% 30%', justifyContent: 'space-between', alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h3>Order :  </h3>
              <InputField
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
            <PublishInput
              values={values}
              setFieldValue={setFieldValue}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button
              type='primary'
              icon='file'
              id='add-btn'
              htmlType='submit'
              loading={conceptUpdateStatus && get(conceptUpdateStatus.toJS(), 'loading')}
            >
              Update
            </Button>
          </div>
        </Form>
    )}
    </Formik>
  )
}

export default EditConceptForm
