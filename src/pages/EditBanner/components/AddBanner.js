import React from 'react'
import { Form, Formik } from 'formik'
import { DatePicker } from 'antd'
import EditBannerStyle from '../EditBanner.style'
import DropZone from '../../../components/Dropzone'
import FileInput from './FileInput'
import InputField from './InputField'
import { addBannerSchema } from '../validations/editBannerSchema'

const AddBanner = (props) => {
  const { handleAddBanner, addBannerData, handleStateChange, handleFileChange } = props
  const eStyle = { fontSize: 'small', color: 'red' }
  return (
    <Formik
      initialValues={addBannerData}
      onSubmit={handleAddBanner}
      validateOnBlur
      validationSchema={addBannerSchema}
    >
      {({ errors, values, handleChange, setFieldValue }) => (
        <Form style={{ padding: '0 10px' }}>
          <EditBannerStyle.TopContainer>
            <div>
              <InputField
                label='Title'
                placeholder='Enter Title'
                name='title'
                type='text'
                value={values.title || ''}
                onChange={(e) => {
                  handleChange(e)
                  handleStateChange(e)
                }}
              />
              <InputField
                label='Description'
                placeholder='Enter Description'
                name='description'
                type='text'
                value={values.description || ''}
                onChange={(e) => {
                  handleChange(e)
                  handleStateChange(e)
                }}
              />
              <InputField
                label='Width'
                placeholder='Enter Width'
                type='number'
                name='width'
                value={values.width || ''}
                onChange={(e) => {
                  handleChange(e)
                  handleStateChange(e)
                }}
              />
              <InputField
                label='Height'
                placeholder='Enter Height'
                type='number'
                name='height'
                value={values.height || ''}
                onChange={(e) => {
                  handleChange(e)
                  handleStateChange(e)
                }}
              />
            </div>
            <div>
              <EditBannerStyle.StyledRow
                right
              >
                <InputField
                  label='Text before discount'
                  placeholder='Enter Text before discount'
                  type='text'
                  name='textBeforeDiscount'
                  value={values.textBeforeDiscount || ''}
                  onChange={(e) => {
                  handleChange(e)
                  handleStateChange(e)
                }}
                />
                <InputField
                  label='Font Color'
                  placeholder='Enter Font Color'
                  type='text'
                  name='beforeColor'
                  value={values.beforeColor || ''}
                  onChange={(e) => {
                  handleChange(e)
                  handleStateChange(e)
                }}
                />
                <InputField
                  label='Font Size'
                  placeholder='Enter Font Size'
                  type='number'
                  name='beforeFontSize'
                  value={values.beforeFontSize || ''}
                  onChange={(e) => {
                  handleChange(e)
                  handleStateChange(e)
                }}
                />
              </EditBannerStyle.StyledRow>
              <EditBannerStyle.StyledRow
                right
              >
                <InputField
                  label='Discount Text'
                  placeholder='Enter Discount Text'
                  type='text'
                  name='discount'
                  value={values.discount || ''}
                  onChange={(e) => {
                  handleChange(e)
                  handleStateChange(e)
                }}
                />
                <InputField
                  label='Font Color'
                  placeholder='Enter Font Color'
                  type='text'
                  name='discountColor'
                  value={values.discountColor || ''}
                  onChange={(e) => {
                  handleChange(e)
                  handleStateChange(e)
                }}
                />
                <InputField
                  label='Font Size'
                  placeholder='Enter Font Size'
                  type='number'
                  name='discountSize'
                  value={values.discountSize || ''}
                  onChange={(e) => {
                  handleChange(e)
                  handleStateChange(e)
                }}
                />
                <InputField
                  label='Background'
                  type='text'
                  placeholder='Enter Discount Background'
                  name='discountBackground'
                  value={values.discountBackground || ''}
                  onChange={(e) => {
                  handleChange(e)
                  handleStateChange(e)
                }}
                />
              </EditBannerStyle.StyledRow>
              <EditBannerStyle.StyledRow right>
                <InputField
                  label='Text after discount'
                  placeholder='Enter Text after discount'
                  type='text'
                  name='textAfterDiscount'
                  value={values.textAfterDiscount || ''}
                  onChange={(e) => {
                  handleChange(e)
                  handleStateChange(e)
                }}
                />
                <InputField
                  label='Font Color'
                  placeholder='Enter Font Color'
                  type='text'
                  name='afterColor'
                  value={values.afterColor || ''}
                  onChange={(e) => {
                  handleChange(e)
                  handleStateChange(e)
                }}
                />
                <InputField
                  label='Font Size'
                  placeholder='Enter Font Size'
                  type='number'
                  name='afterFontSize'
                  value={values.afterFontSize || ''}
                  onChange={(e) => {
                  handleChange(e)
                  handleStateChange(e)
                }}
                />
              </EditBannerStyle.StyledRow>
              <EditBannerStyle.StyledRow right>
                <InputField
                  label='Disclaimer'
                  placeholder='Enter Disclaimer Text'
                  type='text'
                  name='disclaimerText'
                  value={values.disclaimerText || ''}
                  onChange={(e) => {
                  handleChange(e)
                  handleStateChange(e)
                }}
                />
                <InputField
                  label='Disclaimer Color'
                  placeholder='Enter Font Color'
                  type='text'
                  name='disclaimerTextColor'
                  value={values.disclaimerTextColor || ''}
                  onChange={(e) => {
                  handleChange(e)
                  handleStateChange(e)
                }}
                />
                <InputField
                  label='Disclaimer Font'
                  placeholder='Enter Font Size'
                  type='number'
                  name='disclaimerTextFontSize'
                  value={values.disclaimerTextFontSize || ''}
                  onChange={(e) => {
                  handleChange(e)
                  handleStateChange(e)
                }}
                />
              </EditBannerStyle.StyledRow>
              <EditBannerStyle.StyledRow right >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3>Inception Date : </h3>
                  <DatePicker
                    name='inceptionDate'
                    placeholder='Enter Inception Date'
                    value={values.inceptionDate || ''}
                    onChange={(value) => setFieldValue('inceptionDate', value)}
                  />
                  <p style={eStyle} >{errors.inceptionDate}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3>Expiry Date : </h3>
                  <DatePicker
                    name='expiry'
                    placeholder='Enter Expiry Date'
                    value={values.expiry || ''}
                    onChange={(value) => {
                      setFieldValue('expiry', value)
                    }}
                  />
                  <p style={eStyle} >{errors.expiry}</p>
                </div>
              </EditBannerStyle.StyledRow>
            </div>
          </EditBannerStyle.TopContainer>
          <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <EditBannerStyle.StyledRow image>
                <h3>Background Image: </h3>
                <DropZone
                  width='60%'
                  name='backgroundImage'
                  getDropzoneFile={(file) => {
                    setFieldValue('backgroundImage', file)
                    handleFileChange(file, 'backgroundImage')
                  }}
                />
              </EditBannerStyle.StyledRow>
              <p style={eStyle} >{errors.backgroundImage}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <EditBannerStyle.StyledRow image>
                <h3>Lottie File: </h3>
                <FileInput
                  setFieldValue={setFieldValue}
                  handleFileChange={handleFileChange}
                />
              </EditBannerStyle.StyledRow>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <EditBannerStyle.StyledButton
              icon='file'
              id='add-btn'
              htmlType='submit'
            >
              Save
            </EditBannerStyle.StyledButton>
          </div>
        </Form>
    )}
    </Formik>
  )
}

export default AddBanner
