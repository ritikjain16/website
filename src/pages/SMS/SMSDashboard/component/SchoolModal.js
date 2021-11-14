import React from 'react'
import { Button, notification, Select } from 'antd'
import { Form, Formik } from 'formik'
import { connect } from 'react-redux'
import { get } from 'lodash'
import MainModal from '../../../../components/MainModal'
import sections from '../../../../constants/sections'
import COUNTRY_CODES from '../../../../constants/countryCodes'
import getGrades from '../../../../utils/getGrades'
import Input from './Input'
import { updateStudentProfile } from '../../../../actions/SchoolOnboarding'
import countryAndState from '../../../../constants/CountryAndStates'

const { Option } = Select

class SchoolModal extends React.Component {
  componentDidUpdate = (prevProps) => {
    const { onClose, studentProfileUpdateStatus, studentProfileUpdateFailure,
      getSelectedSchoolStudents } = this.props
    if ((studentProfileUpdateStatus && !get(studentProfileUpdateStatus.toJS(), 'loading')
      && get(studentProfileUpdateStatus.toJS(), 'success') &&
      (prevProps.studentProfileUpdateStatus !== studentProfileUpdateStatus))) {
      notification.success({
        message: 'Student Updated Successfully'
      })
      onClose()
      getSelectedSchoolStudents()
    } else if (studentProfileUpdateStatus && !get(studentProfileUpdateStatus.toJS(), 'loading')
      && get(studentProfileUpdateStatus.toJS(), 'failure') &&
      (prevProps.studentProfileUpdateFailure !== studentProfileUpdateFailure)) {
      if (studentProfileUpdateFailure && studentProfileUpdateFailure.toJS().length > 0) {
        notification.error({
          message: get(get(studentProfileUpdateFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
  }
  gradeNumber = (grade) => grade.replace('Grade', '')
  renderBefore = (value) => <div>{value} <span style={{ color: 'red' }}>*</span></div>
  handleStudentEdit = async (values) => {
    const { editData } = this.props
    const prevParentName = get(editData, 'parentName')
    const prevParentEmail = get(editData, 'parents[0].user.email', '')
    const prevParentNumber = get(editData, 'parents[0].user.phone.number', '')
    const prevGrade = get(editData, 'grade')
    const prevSection = get(editData, 'section')
    const parentId = get(editData, 'parents[0].user.id')
    const studentId = get(editData, 'user.id')
    const profileId = get(editData, 'id')
    const {
      parentName, childName, parentEmail,
      countryCode, phoneNumber, grade, section,
      country, city, state, region
    } = values
    let updateQuery = ''
    if (prevParentName !== parentName
      || prevParentEmail !== parentEmail
      || prevParentNumber !== phoneNumber) {
      updateQuery += `
      updateParent: updateUser(
        id: "${parentId}"
        input: { name: "${parentName}", email: "${parentEmail}",
        phone: { countryCode: "${countryCode}", number: "${phoneNumber}" } }
      ) {
        id
      }`
    }
    updateQuery += `updateStudent: updateUser(id: "${studentId}",
      input: { name: "${childName}", ${country ? `country: ${country}` : ''},
      ${city ? `city: "${city}"` : ''}, ${state ? `state: "${state}"` : ''},
      ${region ? `region: "${region}"` : ''}
     }) { id }`
    if (prevGrade !== grade || prevSection !== section) {
      updateQuery += `updateStudentProfile(id: "${profileId}",
      input: { grade: ${grade}, section: ${section} }) {
        id
      }`
    }
    if (updateQuery) {
      await updateStudentProfile(updateQuery)
    } else {
      notification.warn({
        message: 'Please update some data'
      })
    }
  }
  render() {
    const { visible, onClose, editData, studentProfileUpdateStatus } = this.props
    return (
      <MainModal
        visible={visible}
        onCancel={onClose}
        title='Edit Student Details'
        maskClosable={false}
        width='568px'
        centered
        destroyOnClose
        footer={null}
      >
        <Formik
          initialValues={{
            parentName: get(editData, 'parentName'),
            childName: get(editData, 'studentName'),
            parentEmail: get(editData, 'parents[0].user.email', ''),
            phoneNumber: get(editData, 'parents[0].user.phone.number', ''),
            countryCode: get(editData, 'parents[0].user.phone.countryCode', ''),
            grade: get(editData, 'grade'),
            section: get(editData, 'section'),
            city: get(editData, 'user.city', ''),
            state: get(editData, 'user.state', ''),
            region: get(editData, 'user.region', ''),
            country: get(editData, 'user.country', '')
          }}
          validateOnBlur
          onSubmit={this.handleStudentEdit}
        >
          {({ values, setFieldValue, handleChange }) => (
            <Form style={{ padding: '0 10px', width: '100%' }}>
              <>
                <Input
                  placeholder='Type Parent Name'
                  name='parentName'
                  value={values.parentName || ''}
                  onChange={handleChange}
                  addonBefore={this.renderBefore('Parent Name: ')}
                />
                <Input
                  value={values.childName || ''}
                  onChange={handleChange}
                  placeholder='Type Child Name'
                  name='childName'
                  addonBefore={this.renderBefore('Child Name: ')}
                />
                <Input
                  value={values.parentEmail || ''}
                  onChange={handleChange}
                  placeholder='Type Parent Email'
                  name='parentEmail'
                  addonBefore={this.renderBefore('Parent Email: ')}
                />
                <Input
                  value={values.phoneNumber || ''}
                  onChange={(e) => {
                    handleChange('phoneNumber')(e.target.value)
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
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                  <div>
                    Country:{' '}
                    <Select
                      value={values.country || ''}
                      style={{ width: 200 }}
                      onChange={country => setFieldValue('country', country)}
                    >
                      {countryAndState.map(country => (
                        <Select.Option value={country.countryValue} label={country.country}>
                          {country.country}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    State:{' '}
                    <Select
                      value={values.state || ''}
                      style={{ width: 200 }}
                      onChange={s => setFieldValue('state', s)}
                      disabled={!values.country}
                    >
                      {get(countryAndState.find(country => get(country, 'countryValue') === values.country), 'states', []).map(s => (
                        <Select.Option value={s} label={s}>
                          {s}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>
                <Input
                  value={values.city || ''}
                  onChange={handleChange}
                  placeholder='Type your city'
                  name='city'
                  addonBefore={this.renderBefore('City: ')}
                />
                <Input
                  value={values.region || ''}
                  onChange={handleChange}
                  placeholder='Type your region'
                  name='region'
                  addonBefore={this.renderBefore('Region: ')}
                />
                <div justify='flex-start' style={{ display: 'flex', marginBottom: '10px' }}>
                  <h4 style={{ marginBottom: 0 }}>Grade: <span style={{ color: 'red' }}>*</span></h4>
                  <Select
                    value={values.grade || ''}
                    style={{ width: 200, marginLeft: '10px' }}
                    onChange={value => setFieldValue('grade', value)}
                    placeholder='Select Grade'
                  >
                    {getGrades().map(g =>
                      <Option key={g} value={g}>{this.gradeNumber(g)}</Option>)}
                  </Select>
                </div>
                <div justify='flex-start' style={{ display: 'flex', marginBottom: '10px' }}>
                  <h4 style={{ marginBottom: 0 }}>Section: </h4>
                  <Select
                    placeholder='Select Section (Optional)'
                    value={values.section || ''}
                    style={{ width: 200, marginLeft: '10px' }}
                    onChange={value => setFieldValue('section', value)}
                  >
                    {sections.map(s => <Option key={s} value={s}>{`Section ${s}`}</Option>)}
                  </Select>
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    campaign
                    style={{ margin: '0 10px' }}
                    loading={studentProfileUpdateStatus && get(studentProfileUpdateStatus.toJS(), 'loading')}
                    type='primary'
                    htmlType='submit'
                  >Save
                  </Button>
                </div>
              </>
            </Form>
        )}
        </Formik>
      </MainModal>
    )
  }
}

const mapStateToProps = (state) => ({
  studentProfileUpdateStatus: state.data.getIn(['studentProfiles', 'updateStatus', 'studentProfiles']),
  studentProfileUpdateFailure: state.data.getIn([
    'errors',
    'studentProfiles/update'
  ])
})

export default connect(mapStateToProps)(SchoolModal)
