import { notification } from 'antd'
import { Formik, Form } from 'formik'
import { get } from 'lodash'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import React, { useEffect, memo } from 'react'
import MainModal from '../../../components/MainModal'
import ApprovedCodeTagsStyle from '../ApprovedCodeTags.style'
import addUserApprovedCodeTag from '../../../actions/userApprovedCodeTags/addUserApprovedCodeTag'
import updateUserApprovedCodeTag from '../../../actions/userApprovedCodeTags/updateUserApprovedCodeTag'
import { addContentTag, updateContentTag } from '../../../actions/contentTags'

const TagsValidationSchema = Yup.object().shape({
  TagName: Yup.string().required('required'),
})

const TagsModal = (props) => {
  const {
    visible,
    setAddTags,
    TagsAddedStatus,
    closeUpdateModal,
    TagsAddedFailure,
    searchByFilter,
    setUpdateTags,
    updateTagsData,
    TagsUpdateStatus,
    tagType,
    contentTagAddStatus,
    contentTagAddFailure,
    contentTagUpdateStatus,
    operation } = props
  useEffect(() => {
    if (TagsAddedStatus && !get(TagsAddedStatus.toJS(), 'loading')
      && get(TagsAddedStatus.toJS(), 'success')) {
      notification.success({
        message: 'Tag added successfully'
      })
      setAddTags(false)
      searchByFilter(true)
    } else if (TagsAddedStatus && !get(TagsAddedStatus.toJS(), 'loading')
      && get(TagsAddedStatus.toJS(), 'failure')) {
      notification.error({
        message: get(get(TagsAddedFailure[0], 'error').errors[0], 'message').split(':')[0]
      })
    }
  }, [TagsAddedStatus])
  useEffect(() => {
    if (TagsUpdateStatus && !get(TagsUpdateStatus.toJS(), 'loading')
      && get(TagsUpdateStatus.toJS(), 'success')) {
      notification.success({
        message: 'Tag updated successfully'
      })
      setUpdateTags(false)
    } else if (TagsUpdateStatus && !get(TagsUpdateStatus.toJS(), 'loading')
      && get(TagsUpdateStatus.toJS(), 'failure')) {
      notification.error({
        message: get(get(TagsAddedFailure[0], 'error').errors[0], 'message').split(':')[0]
      })
    }
  }, [TagsUpdateStatus])

  useEffect(() => {
    if (contentTagAddStatus && !get(contentTagAddStatus.toJS(), 'loading')
      && get(contentTagAddStatus.toJS(), 'success')) {
      notification.success({
        message: 'Tag added successfully'
      })
      setAddTags(false)
      searchByFilter(true)
    } else if (contentTagAddStatus && !get(contentTagAddStatus.toJS(), 'loading')
      && get(contentTagAddStatus.toJS(), 'failure')) {
      notification.error({
        message: get(get(contentTagAddFailure[0], 'error').errors[0], 'message').split(':')[0]
      })
    }
  }, [contentTagAddStatus])

  useEffect(() => {
    if (contentTagUpdateStatus && !get(contentTagUpdateStatus.toJS(), 'loading')
      && get(contentTagUpdateStatus.toJS(), 'success')) {
      notification.success({
        message: 'Tag updated successfully'
      })
      setUpdateTags(false)
    } else if (contentTagUpdateStatus && !get(contentTagUpdateStatus.toJS(), 'loading')
      && get(contentTagUpdateStatus.toJS(), 'failure')) {
      notification.error({
        message: 'Unexpected error'
      })
    }
  }, [contentTagUpdateStatus])
  const handleSave = (value) => {
    const { TagName } = value
    if (tagType === 'Approved Tags') {
      addUserApprovedCodeTag({
        title: TagName
      })
    } else {
      addContentTag({
        title: TagName
      })
    }
  }
  const handleUpdate = (value) => {
    const { TagName } = value
    const inputs = {
      title: TagName
    }
    if (tagType === 'Approved Tags') {
      updateUserApprovedCodeTag(updateTagsData.id, inputs)
    } else {
      updateContentTag(updateTagsData.id, inputs)
    }
  }
  const closeModal = () => {
    if (operation === 'add') {
      setAddTags(false)
    } else {
      closeUpdateModal()
    }
  }
  const renderForm = () => {
    if (operation === 'add') {
      return (
        <Formik
          initialValues={{
            TagName: '',
           }}
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={TagsValidationSchema}
          onSubmit={handleSave}
        >
          {({ errors, values, handleChange }) => (
            <Form style={{ padding: '0 10px' }}>
              <ApprovedCodeTagsStyle.FormItemContainer>
                <ApprovedCodeTagsStyle.TextItem>Tag Name</ApprovedCodeTagsStyle.TextItem>
                <div style={{ display: 'flex' }}>
                  <MainModal.Input
                    name='TagName'
                    type='string'
                    value={values.TagName || ''}
                    placeholder='Enter Tag Name'
                    onChange={handleChange}
                    autoComplete='off'
                  />
                </div>
              </ApprovedCodeTagsStyle.FormItemContainer>
              <ApprovedCodeTagsStyle.FormErrorMsg>
                {errors && errors.TagName}
              </ApprovedCodeTagsStyle.FormErrorMsg>
              <ApprovedCodeTagsStyle.FormCTAContainer>
                <ApprovedCodeTagsStyle.TextItem>Tag Preview :</ApprovedCodeTagsStyle.TextItem>
                <ApprovedCodeTagsStyle.Tag color='#750000' style={{ marginTop: '1rem' }}>
                  {values.TagName}
                </ApprovedCodeTagsStyle.Tag>
                <MainModal.SaveButton
                  loading={TagsAddedStatus && get(TagsAddedStatus.toJS(), 'loading')}
                  type='primary'
                  icon='plus'
                  htmlType='submit'
                  style={{ border: 'none', boxShadow: 'none', background: '#37bee9', marginTop: '1rem' }}
                >Add Tag
                </MainModal.SaveButton>
              </ApprovedCodeTagsStyle.FormCTAContainer>
            </Form>
          )}
        </Formik>
      )
    } else if (operation === 'update' && updateTagsData) {
      return (
        <Formik
          initialValues={{
            TagName: updateTagsData.title
          }}
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={TagsValidationSchema}
          onSubmit={handleUpdate}
        >
          {({ errors, values, handleChange }) => (
            <Form style={{ padding: '0 10px' }}>
              <ApprovedCodeTagsStyle.FormItemContainer>
                <ApprovedCodeTagsStyle.TextItem>Tag Name</ApprovedCodeTagsStyle.TextItem>
                <div style={{ display: 'flex' }}>
                  <MainModal.Input
                    name='TagName'
                    type='string'
                    value={values.TagName || ''}
                    placeholder='Enter Tag Name'
                    onChange={handleChange}
                    autoComplete='off'
                  />
                </div>
              </ApprovedCodeTagsStyle.FormItemContainer>
              <ApprovedCodeTagsStyle.FormErrorMsg>
                {errors && errors.TagName}
              </ApprovedCodeTagsStyle.FormErrorMsg>
              <ApprovedCodeTagsStyle.FormCTAContainer>
                <ApprovedCodeTagsStyle.TextItem>Tag Preview</ApprovedCodeTagsStyle.TextItem>
                <ApprovedCodeTagsStyle.Tag color='#750000' style={{ marginTop: '1rem' }}>
                  {values.TagName}
                </ApprovedCodeTagsStyle.Tag>
                <MainModal.SaveButton
                  loading={TagsUpdateStatus && get(TagsUpdateStatus.toJS(), 'loading')}
                  type='primary'
                  icon='plus'
                  htmlType='submit'
                  style={{ border: 'none', boxShadow: 'none', background: '#37bee9', marginTop: '1rem' }}
                >Update Tag
                </MainModal.SaveButton>
              </ApprovedCodeTagsStyle.FormCTAContainer>
            </Form>
          )}
        </Formik>
      )
    }
  }
  return (
    <MainModal
      visible={visible}
      title={operation === 'add' ? 'Create Tag' : 'Edit Tag'}
      onCancel={closeModal}
      maskClosable
      width='568px'
      centered
      destroyOnClose
      footer={null}
    >
      {renderForm()}
    </MainModal>
  )
}

TagsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeSessionModal: PropTypes.func.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFields: PropTypes.func,
  }).isRequired,
}

export default memo(TagsModal)
