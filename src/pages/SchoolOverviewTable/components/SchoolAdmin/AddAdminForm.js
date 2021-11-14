import { Button, Select } from 'antd'
import { Formik, Form } from 'formik'
import React from 'react'
import { get } from 'lodash'
import Input from './FormElements/Input'
import COUNTRY_CODES from '../../../../constants/countryCodes'
import { addAdminValidation } from './FormElements/formValidation'

const { Option } = Select

const AddAdminForm = (props) => {
  const { addFormData, handleAddAdmin, userAddStatus } = props
  const generateRandomString = length => {
    const randomString = Math.random()
      .toString(36)
      .slice(2)
    return randomString.substring(0, length)
  }
  const renderBefore = (value) => <div>{value} <span style={{ color: 'red' }}>*</span></div>
  return (
    <Formik
      initialValues={{
        ...addFormData,
        password: generateRandomString()
      }}
      validateOnBlur
      onSubmit={handleAddAdmin}
      validationSchema={addAdminValidation}
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
            <Input
              value={values.password || ''}
              onChange={handleChange}
              placeholder='One time Password'
              name='password'
              addonBefore={renderBefore('One time Password: ')}
            />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                style={{ margin: '0 10px' }}
                type='primary'
                loading={userAddStatus && get(userAddStatus.toJS(), 'loading')}
                htmlType='submit'
              >Save
              </Button>
            </div>
          </>
        </Form>
      )}
    </Formik>
  )
}

export default AddAdminForm
