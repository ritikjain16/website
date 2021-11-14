import { Button, Select } from 'antd'
import { Formik, Form } from 'formik'
import { get } from 'lodash'
import React from 'react'
import COUNTRY_CODES from '../../../../constants/countryCodes'
import { editAdminValidation } from './FormElements/formValidation'
import Input from './FormElements/Input'

const { Option } = Select

const EditAdminForm = (props) => {
  const { editFormData, userUpdateStatus, handleEditAdmin } = props
  const renderBefore = (value) => <div>{value} <span style={{ color: 'red' }}>*</span></div>
  return (
    <Formik
      initialValues={{
        ...editFormData,
        phoneNumber: get(editFormData, 'phone.number'),
        countryCode: get(editFormData, 'phone.countryCode')
      }}
      validateOnBlur
      onSubmit={handleEditAdmin}
      validationSchema={editAdminValidation}
    >
      {({ values, setFieldValue, handleChange }) => (
        <Form style={{ padding: '0 10px', width: '100%' }}>
          <>
            <Input
              placeholder='Name'
              name='name'
              value={values.name || ''}
              onChange={handleChange}
              addonBefore={renderBefore('Name: ')}
            />
            <Input
              value={values.email || ''}
              onChange={handleChange}
              placeholder='Type Email'
              name='email'
              addonBefore={renderBefore('Email: ')}
            />
            <Input
              value={values.phoneNumber || ''}
              onChange={(e) => {
                if (values.countryCode === '+91') {
                  handleChange('phoneNumber')(e.target.value.substr(0, 10))
                } else {
                  handleChange('phoneNumber')(e.target.value)
                }
              }}
              placeholder='Type Phone Number'
              name='phoneNumber'
              type='text'
              addonBefore={(
                <Select
                  value={values.countryCode || ''}
                  className='select-before'
                  style={{ width: 200 }}
                  onChange={code => setFieldValue('countryCode', code)}
                >
                  {COUNTRY_CODES.map(country => (
                    <Option value={country.dial_code}>
                      {country.dial_code} {country.name}
                    </Option>
                  ))}
                </Select>
              )}
            />
            <Input
              value={values.username || ''}
              onChange={handleChange}
              placeholder='Type Username'
              name='username'
              addonBefore={renderBefore('Username: ')}
            />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                style={{ margin: '0 10px' }}
                type='primary'
                loading={userUpdateStatus && get(userUpdateStatus.toJS(), 'loading')}
                htmlType='submit'
              >Update
              </Button>
            </div>
          </>
        </Form>
      )}
    </Formik>
  )
}

export default EditAdminForm
