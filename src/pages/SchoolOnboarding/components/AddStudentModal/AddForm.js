import { Select } from 'antd'
import { Form, Formik } from 'formik'
import React from 'react'
import { get } from 'lodash'
import { FlexContainer, SectionButton, StyledSelect } from '../../SchoolOnBoarding.style'
import AddInput from './AddInput'
import COUNTRY_CODES from '../../../../constants/countryCodes'
import getGrades from '../../../../utils/getGrades'
import sections from '../../../../constants/sections'
import studentValidationSchema from '../school-utils/studentValidationSchema'

const { Option } = Select

const AddForm = (props) => {
  const {
    parentSignUpStatus, handleStudentAdd, onModalClose,
    gradeToAdd, sectionToAdd
  } = props
  const gradeNumber = (grade) => grade.replace('Grade', '')
  const renderBefore = (value) => <div>{value} <span style={{ color: 'red' }}>*</span></div>
  return (
    <Formik
      initialValues={{
        parentName: '',
        childName: '',
        parentEmail: '',
        phoneNumber: '',
        countryCode: '+91',
        grade: gradeToAdd || '',
        section: sectionToAdd === 'All' ? '' : sectionToAdd || ''
      }}
      validateOnBlur
      onSubmit={handleStudentAdd}
      validationSchema={studentValidationSchema}
    >
      {({ values, setFieldValue, handleChange, errors }) => (
        <Form style={{ padding: '0 10px', width: '100%' }}>
          <>
            <AddInput
              placeholder='Type Parent Name'
              name='parentName'
              value={values.parentName || ''}
              onChange={handleChange}
              addonBefore={renderBefore('Parent Name: ')}
            />
            <AddInput
              value={values.childName || ''}
              onChange={handleChange}
              placeholder='Type Child Name'
              name='childName'
              addonBefore={renderBefore('Child Name: ')}
            />
            <AddInput
              value={values.parentEmail || ''}
              onChange={handleChange}
              placeholder='Type Parent Email'
              name='parentEmail'
              addonBefore={renderBefore('Parent Email: ')}
            />
            <AddInput
              value={values.phoneNumber || ''}
              onChange={(e) => {
                handleChange('phoneNumber')(e.target.value.substr(0, 10))
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
            <FlexContainer noPadding justify='flex-start' style={{ marginBottom: '1vw' }}>
              <h4 style={{ marginBottom: 0 }}>Grade: <span style={{ color: 'red' }}>*</span></h4>
              <StyledSelect
                value={values.grade || ''}
                style={{ width: 200, marginLeft: '10px' }}
                onChange={value => handleChange('grade')(value)}
                placeholder='Select Grade'
              >
                {getGrades().map(g =>
                  <Option key={g} value={g}>{gradeNumber(g)}</Option>)}
              </StyledSelect>
            </FlexContainer>
            <p style={{ fontSize: 'small', color: 'red' }} >{errors.grade}</p>
            <FlexContainer noPadding justify='flex-start' style={{ marginBottom: '1vw' }}>
              <h4 style={{ marginBottom: 0 }}>Section: </h4>
              <StyledSelect
                placeholder='Select Section (Optional)'
                value={values.section || ''}
                style={{ width: 200, marginLeft: '10px' }}
                onChange={value => handleChange('section')(value)}
              >
                {sections.map(s => <Option key={s} value={s}>{`Section ${s}`}</Option>)}
              </StyledSelect>
            </FlexContainer>
            <FlexContainer style={{ width: '60%', margin: '0 auto' }}>
              <SectionButton
                campaign
                onClick={onModalClose}
                style={{ margin: '0 10px' }}
                type='default'
              >Cancel
              </SectionButton>
              <SectionButton
                campaign
                loading={parentSignUpStatus && get(parentSignUpStatus.toJS(), 'loading')}
                style={{ margin: '0 10px' }}
                type='primary'
                htmlType='submit'
              >Save
              </SectionButton>
            </FlexContainer>
          </>
        </Form>
      )}
    </Formik>
  )
}

export default AddForm
