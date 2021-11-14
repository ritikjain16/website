import { Select } from 'antd'
import React, { useRef, useState } from 'react'
import { Form, Formik } from 'formik'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import {
  AddCampaign, BackIcon, Error, FlexContainer, StyledButton, StyledSelect
} from '../../SchoolOnBoarding.style'
import campaignTypes from '../../../../constants/campaignType'
import SchoolInput from '../SchoolInput'
import Dropzone from '../../../../components/Dropzone'
import addCampaignSchema from '../school-utils/validationSchema'

const { Option } = Select

const { b2b, b2b2cEvent } = campaignTypes

const campaigntypesArray = [b2b, b2b2cEvent]

const CreateCampaignModal = (props) => {
  const [webUrl, setWebUrl] = useState(null)
  const [webImage, setWebImage] = useState(null)
  const [mobileUrl, setMobileUri] = useState(null)
  const [mobileImage, setMobielImage] = useState(null)
  const [webError, setWebError] = useState('')
  const [mobileError, setMobileError] = useState('')
  const {
    onParentStateChange, onSubmit,
    campaignsAddStatus, editCampaignId,
    coursesList
  } = props
  const dropzoneRef = useRef()
  const onDropWeb = (file) => {
    setWebError('')
    if (file) {
      const img = new Image()
      img.src = window.URL.createObjectURL(file)
      img.onload = () => {
        if (img && img.width > 605 && img.height > 430) {
          setWebError('Recommended Size: 430 x 605')
        } else {
          setWebImage(file)
          setWebError('')
        }
      }
    }
  }
  const onDropMobile = (file) => {
    setMobileError('')
    if (file) {
      const img = new Image()
      img.src = window.URL.createObjectURL(file)
      img.onload = () => {
        if (img && img.width > 1080 && img.height > 540) {
          setMobileError('Recommended Size: 540 x 1080')
        } else {
          setMobielImage(file)
          setMobileError('')
        }
      }
    }
  }
  const onCreateCampaign = async (values) => {
    if (!webError && !mobileError) {
      await onSubmit(values, webImage, mobileImage)
      setWebImage(null)
      setMobielImage(null)
    }
  }
  return (
    <AddCampaign>
      <BackIcon onClick={() => onParentStateChange('actionType', '')} />
      <Formik
        initialValues={{
          campaignTitle: '',
          campaignType: '',
          selectedCourse: get(coursesList, '[0].id')
        }}
        onSubmit={onCreateCampaign}
        validateOnBlur
        validationSchema={addCampaignSchema}
      >
        {({ errors, values, handleChange, setFieldValue }) => (
          <Form style={{ padding: '0 10px' }}>
            <FlexContainer style={{ alignItems: 'flex-start' }}>
              <FlexContainer noPadding style={{ flexDirection: 'column' }}>
                <h2 className='studentTab__selectTitle'
                  style={{ marginBottom: '10px', alignSelf: 'center' }}
                >Choose Model
                </h2>
                <StyledSelect
                  disabled={editCampaignId}
                  value={values.campaignType || ''}
                  selectCampaign
                  name='campaignType'
                  onChange={(value) => setFieldValue('campaignType', value)}
                >
                  {
                  campaigntypesArray.map(campaign =>
                    <Option value={campaign} key={campaign} >{campaign}</Option>)
                  }
                </StyledSelect>
                <Error>{errors.campaignType}</Error>
                <SchoolInput
                  name='campaignTitle'
                  type='text'
                  value={values.campaignTitle || ''}
                  onChange={handleChange}
                />
                <Error>{errors.campaignTitle}</Error>
                <StyledSelect
                  showSearch
                  placeholder='Select a Course'
                  optionFilterProp='children'
                  name='selectedCourse'
                  value={values.selectedCourse || ''}
                  onChange={(value) => handleChange('selectedCourse')(value)}
                  filterOption={(input, option) =>
                    option.props.children
                      ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      : false
                  }
                >
                  {
                    coursesList && coursesList.map(({ title, id }) =>
                      <Option key={id}
                        value={id}
                      >{title}
                      </Option>
                  )}
                </StyledSelect>
                <StyledButton
                  loading={campaignsAddStatus && get(campaignsAddStatus.toJS(), 'loading')}
                  type='primary'
                  style={{ marginTop: '1.5vw' }}
                  htmlType='submit'
                >{editCampaignId ? 'Edit' : 'Create'} Campaign
                </StyledButton>
              </FlexContainer>
              <div>
                <Dropzone
                  style={{ margin: '0 10px', width: '210px' }}
                  getDropzoneFile={onDropWeb}
                  ref={dropzoneRef}
                  defaultImage={webUrl}
                  defaultFile={webImage}
                  onImageUrl={imgUrlOne => !webError && setWebUrl(imgUrlOne)}
                >Click or drag to attach
                </Dropzone>
                <p>Campaign Banner - Web</p>
                <span style={{ fontSize: 'small', color: 'red' }}>{webError}</span>
              </div>
              <div>
                <Dropzone
                  style={{ margin: '0 10px', width: '210px' }}
                  getDropzoneFile={onDropMobile}
                  ref={dropzoneRef}
                  defaultImage={mobileUrl}
                  defaultFile={mobileImage}
                  onImageUrl={imgUrlTwo => !mobileError && setMobileUri(imgUrlTwo)}
                >Click or drag to attach
                </Dropzone>
                <p>Campaign Banner - Mobile</p>
                <span style={{ fontSize: 'small', color: 'red' }}>{mobileError}</span>
              </div>
            </FlexContainer>
          </Form>
      )}
      </Formik>
    </AddCampaign>
  )
}

CreateCampaignModal.propTypes = {
  onParentStateChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  campaignsAddStatus: PropTypes.shape({}).isRequired,
}

export default CreateCampaignModal
