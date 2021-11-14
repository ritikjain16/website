import { Form, Formik } from 'formik'
import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { get } from 'lodash'
import { BadgeContainer, StyledDivider } from '../../SessionBadge.style'
import Dropzone from '../../../../components/Dropzone'
import { Input, FormSelect, formValidation } from './FormElements'
import { getOrderAutoComplete, getOrdersInUse } from '../../../../utils/data-utils'

const AddBadgeForm = (props) => {
  const { addFormData, badgesData, handleAddBadge } = props
  const activeImageRef = useRef(null)
  const inActiveImageRef = useRef(null)
  const [activeImage, setActiveImage] = useState(null)
  const [activeImageUrl, setActiveImageUrl] = useState(null)
  const [inActiveImage, setInActiveImage] = useState(null)
  const [inActiveImageUrl, setInActiveImageUrl] = useState(null)
  const onDropActiveImage = (file) => {
    if (file) setActiveImage(file)
  }
  const onDropInActiveImage = (file) => {
    if (file) setInActiveImage(file)
  }
  const handleSubmit = (value, meta) => {
    handleAddBadge(value, meta, activeImage, inActiveImage)
  }
  const handleTypeChange = (value, setFieldValue) => {
    setFieldValue('type', value)
    const filterArray = badgesData.filter(badge => get(badge, 'type') === value)
    const orders = getOrdersInUse(filterArray)
    const newOrder = getOrderAutoComplete(orders)
    setFieldValue('order', newOrder)
  }
  return (
    <Formik
      initialValues={addFormData}
      onSubmit={handleSubmit}
      validateOnBlur
      validationSchema={formValidation}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form style={{ padding: '0 10px' }} id='form'>
          <BadgeContainer justify='space-between' modalGrid style={{ alignItems: 'center' }}>
            <div>
              <h3>Active Image</h3>
              <Dropzone
                style={{ height: '200px', width: '100%', marginBottom: '15px' }}
                getDropzoneFile={onDropActiveImage}
                ref={activeImageRef}
                defaultImage={activeImageUrl}
                defaultFile={activeImage}
                onImageUrl={imgUrl => setActiveImageUrl(imgUrl)}
              >Click or drag to attach
              </Dropzone>
            </div>
            <StyledDivider type='vertical' style={{ width: '2px', height: '90%' }} />
            <div>
              <h3>InActive Image</h3>
              <Dropzone
                style={{ height: '200px', width: '100%', marginBottom: '15px' }}
                getDropzoneFile={onDropInActiveImage}
                ref={inActiveImageRef}
                defaultImage={inActiveImageUrl}
                defaultFile={inActiveImage}
                onImageUrl={imgUrl => setInActiveImageUrl(imgUrl)}
              >Click or drag to attach
              </Dropzone>
            </div>
          </BadgeContainer>
          <BadgeContainer>
            <FormSelect
              placeholder='Select Type'
              name='type'
              label='Select Type'
              value={values.type || ''}
              typeSelector
              onChange={value => handleTypeChange(value, setFieldValue)}
              setFieldValue={setFieldValue}
            />
            <FormSelect
              placeholder='Select unlockPoint'
              name='unlockPoint'
              label='Select unlockPoint'
              value={values.unlockPoint || ''}
              onChange={value => setFieldValue('unlockPoint', value)}
              setFieldValue={setFieldValue}
            />
            <Input
              placeholder='Enter Order'
              type='number'
              name='order'
              label='Order'
              value={values.order || ''}
              order
              values={values}
              setFieldValue={setFieldValue}
              onChange={handleChange}
            />
          </BadgeContainer>
          <Input
            label='Add Name'
            placeholder='Add Name'
            name='name'
            type='text'
            value={values.name || ''}
            onChange={handleChange}
            setFieldValue={setFieldValue}
          />
          <Input
            label='Add Description'
            placeholder='Add Description'
            name='description'
            type='text'
            value={values.description || ''}
            onChange={handleChange}
            setFieldValue={setFieldValue}
            textArea='textArea'
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '10px' }}>
            <Button
              type='primary'
              icon='file'
              id='add-btn'
              htmlType='submit'
            >
              Save
            </Button>
          </div>
        </Form>
    )}
    </Formik>
  )
}

export default AddBadgeForm
