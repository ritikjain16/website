import React from 'react'
import { Form, Formik } from 'formik'
import { get } from 'lodash'
import { Button } from 'antd'
import { InputField, PublishInput, projectValidation } from '../FormElements'

const AddProject = (props) => {
  const { handleAddProject, addFormData, projectAddStatus, orderInUse } = props
  return (
    <Formik
      initialValues={addFormData}
      onSubmit={handleAddProject}
      validateOnBlur
      validationSchema={projectValidation}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form style={{ padding: '0 10px' }} id='form'>
          <InputField
            label='Add Project Title'
            placeholder='Add Project Title'
            name='title'
            type='text'
            value={values.title || ''}
            onChange={(e) => handleChange(e)}
            setFieldValue={setFieldValue}
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
              loading={projectAddStatus && get(projectAddStatus.toJS(), 'loading')}
            >
              Save
            </Button>
          </div>
        </Form>
    )}
    </Formik>
  )
}

export default AddProject
