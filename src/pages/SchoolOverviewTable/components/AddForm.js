import { Button, Select } from 'antd'
import { Form, Formik } from 'formik'
import React, { useRef, useState } from 'react'
import { get } from 'lodash'
import COUNTRY_CODES from '../../../constants/countryCodes'
import SchoolOverviewTableStyle from '../SchoolOverviewTable.style'
import FormInput from './FormInput'
import addSchoolValidation from './formValidation'
import Dropzone from '../../../components/Dropzone'

const { Option } = Select

const AddForm = (props) => {
  const {
    coOrdinatorRoles, handleSubmit,
    addSchoolLoading, bdUsers
  } = props
  const getLetter = (value) => {
    const code = value.split(' ')
    let newCode = ''
    code.forEach(c => newCode += c ? `${c[0]}`.toUpperCase() : '')
    return newCode
  }
  const logoDropzoneRef = useRef()
  const [logoImageFile, setLogoImageFile] = useState(null)
  const [logoImageUrl, setLogoImageUrl] = useState(null)
  const onDropLogoFile = (file) => {
    setLogoImageFile(file)
  }

  const pictureDropzoneRef = useRef()
  const [pictureImageFile, setPictureImageFile] = useState(null)
  const [pictureImageUrl, setPictureImageUrl] = useState(null)
  const onDropPictureFile = (file) => {
    setPictureImageFile(file)
  }
  const handleFormSubmit = (value) => {
    handleSubmit(value, logoImageFile, pictureImageFile)
  }
  return (
    <Formik
      initialValues={{
        schoolName: '',
        coOrdinatorEmail: '',
        coOrdinatorPhoneNumber: '',
        coOrdinatorName: '',
        coOrdinatorPhoneCode: '+91',
        schoolCity: '',
        code: '',
        hubspotId: '',
        currentCoordinatorRole: '',
        selectedBd: ''
      }}
      onSubmit={handleFormSubmit}
      validationSchema={addSchoolValidation}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3>School Logo</h3>
                <Dropzone
                  style={{ height: '200px', width: '200px', marginBottom: '15px' }}
                  getDropzoneFile={onDropLogoFile}
                  ref={logoDropzoneRef}
                  defaultImage={logoImageUrl}
                  defaultFile={logoImageFile}
                  onImageUrl={imgUrl => setLogoImageUrl(imgUrl)}
                >Click or drag to attach
                </Dropzone>
              </div>
              <div>
                <h3>School Picture</h3>
                <Dropzone
                  style={{ height: '200px', width: '200px', marginBottom: '15px' }}
                  getDropzoneFile={onDropPictureFile}
                  ref={pictureDropzoneRef}
                  defaultImage={pictureImageUrl}
                  defaultFile={pictureImageFile}
                  onImageUrl={imgUrl => setPictureImageUrl(imgUrl)}
                >Click or drag to attach
                </Dropzone>
              </div>
            </div>
            <FormInput
              placeholder='Type School Name'
              addonBefore='School Name'
              type='text'
              name='schoolName'
              value={values.schoolName || ''}
              onChange={(e) => {
                handleChange(e)
                setFieldValue('code', values.schoolName ? getLetter(values.schoolName) : '')
              }}
            />
            <FormInput
              placeholder='Type School Code'
              addonBefore='School Code'
              type='text'
              name='code'
              value={values.code || ''}
              onChange={handleChange}
            />
            <FormInput
              placeholder='Type hubspotId'
              addonBefore='hubspotId'
              type='text'
              name='hubspotId'
              value={values.hubspotId || ''}
              onChange={handleChange}
            />
            <FormInput
              placeholder='Co-ordinator Name'
              addonBefore='Co-ordinator Name'
              type='text'
              name='coOrdinatorName'
              value={values.coOrdinatorName || ''}
              onChange={handleChange}
            />
            <FormInput
              placeholder='Co-ordinator Email'
              addonBefore='Co-ordinator Email'
              type='email'
              name='coOrdinatorEmail'
              value={values.coOrdinatorEmail || ''}
              onChange={handleChange}
            />
            <FormInput
              placeholder='Type Co-ordinator Phone Number'
              addonBefore={(
                <Select
                  defaultValue='+91'
                  style={{ width: 200 }}
                  name='coOrdinatorPhoneCode'
                  value={values.coOrdinatorPhoneCode || ''}
                  onChange={value => setFieldValue('coOrdinatorPhoneCode', value)}
                >
                  {
                    COUNTRY_CODES.map(country => (
                      <Option value={country.dial_code}>
                        {country.dial_code} {country.name}
                      </Option>
                    ))
                  }
                </Select>
              )}
              type='text'
              name='coOrdinatorPhoneNumber'
              value={values.coOrdinatorPhoneNumber || ''}
              onChange={handleChange}
            />
            <p style={{ margin: '0' }}>Select a Role</p>
            <Select
              placeholder='Select a Role'
              name='currentCoordinatorRole'
              value={values.currentCoordinatorRole || ''}
              style={{ marginBottom: '1.2vw' }}
              onChange={value => setFieldValue('currentCoordinatorRole', value)}
            >
              {
                coOrdinatorRoles.map(role => (
                  <Option key={role}>{role}</Option>
                ))
              }
            </Select>
            <p style={{ margin: '0' }}>Select a BDE</p>
            <Select
              placeholder='Select a BDE'
              name='selectedBd'
              value={values.selectedBd || ''}
              style={{ marginBottom: '1.2vw' }}
              onChange={value => setFieldValue('selectedBd', value)}
            >
              {
                bdUsers.map(user => (
                  <Option value={get(user, 'bdeId')} key={user.id}>{user.name}</Option>
                ))
              }
            </Select>
            <FormInput
              name='schoolCity'
              placeholder='School City'
              addonBefore='School City'
              type='text'
              value={values.schoolCity || ''}
              onChange={handleChange}
            />
            <SchoolOverviewTableStyle.ModalButtonWrapper>
              <Button
                htmlType='submit'
                type='primary'
                loading={addSchoolLoading && addSchoolLoading}
              >Add
              </Button>
            </SchoolOverviewTableStyle.ModalButtonWrapper>
          </>
        </Form>
      )}
    </Formik>
  )
}

export default AddForm
