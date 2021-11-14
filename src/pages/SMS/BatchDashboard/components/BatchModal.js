/* eslint-disable max-len */
import { Button } from 'antd'
import { Formik, Form } from 'formik'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, memo, useState } from 'react'
import { List } from 'immutable'
import addBatch from '../../../../actions/batchDashboard/addBatch'
import fetchCodeByType from '../../../../actions/batchDashboard/fetchCodeByType'
import updateBatch from '../../../../actions/batchDashboard/updateBatch'
import fetchBatchTopic from '../../../../actions/batchDashboard/fetchBatchTopic'
import MainModal from '../../../../components/MainModal'
import { ADMIN, MENTOR, UMS_ADMIN } from '../../../../constants/roles'
import getDataFromLocalStorage from '../../../../utils/extract-from-localStorage'
import BatchDashboardStyle from '../BatchDashboard.style'
import { AddBatchValidationSchema, UpdateBatchValidationSchema } from './FormvalidationSchema'
import { filterKey } from '../../../../utils/data-utils'

const BatchModal = (props) => {
  const {
    visible,
    setAddBatch,
    mentors,
    topics,
    batchAddedStatus,
    closeUpdateModal,
    updateBatchData,
    batchUpdateStatus,
    deleteStatus,
    batchesTypes,
    pageType,
    coursesList,
    topicFetchingStatus,
    operation } = props
  const [code, setCode] = useState('')
  // const [type, setType] = useState(pageType === 'sms' ? 'b2b' : '')
  const fetchCodes = (types) => {
    if (pageType === 'ums') {
      fetchCodeByType('normal').then(res => {
        if (get(res, 'batches[0]')) {
          setCode(Number(get(res, 'batches[0].code', '').replace('TK-A', '')) + 1)
        } else {
          setCode(0)
        }
      })
    } else if (pageType === 'sms' && types === 'b2b') {
      fetchCodeByType('b2b').then(res => {
        if (get(res, 'batches[0]')) {
          setCode(Number(get(res, 'batches[0].code', '').replace('TK-BBS', '')) + 1)
        } else {
          setCode(0)
        }
      })
    } else if (pageType === 'sms' && types === 'b2b2c') {
      fetchCodeByType('b2b2c').then(res => {
        if (get(res, 'batches[0]')) {
          setCode(Number(get(res, 'batches[0].code', '').replace('TK-BCS', '')) + 1)
        } else {
          setCode(0)
        }
      })
    }
  }
  useEffect(() => {
    if (pageType === 'sms') {
      fetchCodes('b2b')
    } else {
      fetchCodes()
    }
  }, [pageType])
  useEffect(() => {
    if (batchAddedStatus && !get(batchAddedStatus.toJS(), 'loading')
      && get(batchAddedStatus.toJS(), 'success')) {
      setCode('')
      if (pageType === 'sms') {
        fetchCodes('b2b')
      } else {
        fetchCodes()
      }
    }
  }, [batchAddedStatus])
  useEffect(() => {
    if (batchUpdateStatus && !get(batchUpdateStatus.toJS(), 'loading')
      && get(batchUpdateStatus.toJS(), 'success')) {
      setCode('')
      if (pageType === 'sms') {
        fetchCodes('b2b')
      } else {
        fetchCodes()
      }
    }
  }, [batchUpdateStatus])
  useEffect(() => {
    if (deleteStatus && !get(deleteStatus.toJS(), 'loading')
      && get(deleteStatus.toJS(), 'success')) {
      setCode('')
      if (pageType === 'sms') {
        fetchCodes('b2b')
      } else {
        fetchCodes()
      }
    }
  }, [deleteStatus])
  const handleSave = (value) => {
    const { allotedMentor, batchCode, batchCodes, batchType,
      batchDescription, selectedCourse } = value
    addBatch({
      code: `${batchCodes}${batchCode}`,
      type: batchType,
      description: batchDescription,
    }, selectedCourse, allotedMentor)
  }
  const handleUpdate = (value) => {
    const { allotedMentor, batchCode, batchCodes, batchType,
      batchDescription, topic, selectedCourse, enrollmentType } = value
    const { currentComponentId, id } = updateBatchData
    const inputs = {}
    if (batchCode !== updateBatchData.code) {
      inputs.code = `${batchCodes}${batchCode}`
    }
    if (batchType !== updateBatchData.type) {
      inputs.type = batchType
    }
    if (batchDescription !== updateBatchData.description) {
      inputs.description = batchDescription
    }
    const componentInput = {}
    if (enrollmentType !== updateBatchData.enrollmentType) {
      componentInput.enrollmentType = enrollmentType
    }
    updateBatch(
      inputs,
      id,
      allotedMentor === updateBatchData.allotedMentorId ? null : allotedMentor,
      currentComponentId,
      topic === updateBatchData.topicId ? null : topic,
      selectedCourse === get(updateBatchData, 'course.id') ? '' : selectedCourse,
      componentInput
    )
  }
  const closeModal = () => {
    if (operation === 'add') {
      setAddBatch(false)
    } else {
      closeUpdateModal()
    }
  }
  const getTopicLoader = (course) => topicFetchingStatus
    && topicFetchingStatus.getIn([`topics${course}`])
    && get(topicFetchingStatus.getIn([`topics${course}`]).toJS(), 'loading')

  const getTopicsForCourse = (course) => {
    let topicList = List([])
    if (topics && topics.toJS() && topics.toJS().length > 0) {
      topicList = filterKey(topics, `topics${course}`)
    }
    return topicList.toJS()
  }
  const renderForm = () => {
    const savedRole = getDataFromLocalStorage('login.role')
    const savedId = getDataFromLocalStorage('login.id')
    if (operation === 'add') {
      return (
        <Formik
          initialValues={{
            batchCode: code,
            batchType: pageType === 'ums' ? 'normal' : 'b2b',
            batchDescription: '',
            allotedMentor: savedRole === MENTOR ? savedId : '',
            batchCodes: pageType === 'ums' ? 'TK-A' : 'TK-BBS',
            selectedCourse: get(coursesList, '[0].id', '')
          }}
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={AddBatchValidationSchema}
          onSubmit={handleSave}
        >
          {({ errors, values, handleChange, setFieldValue }) => (
            <Form style={{ padding: '0 10px' }}>
              <BatchDashboardStyle.FormItemContainer>
                <MainModal.TextItem>Batch Code</MainModal.TextItem>
                <div style={{ display: 'flex' }}>
                  <span style={{ marginRight: '10px', width: '100px' }}>
                    {values.batchCodes}
                  </span>
                  <MainModal.Input
                    name='batchCode'
                    type='number'
                    value={values.batchCode || ''}
                    placeholder='Enter Batch Code'
                    onChange={handleChange}
                    autoComplete='off'
                  />
                </div>
              </BatchDashboardStyle.FormItemContainer>
              <BatchDashboardStyle.FormErrorMsg>
                {errors && errors.batchCode}
              </BatchDashboardStyle.FormErrorMsg>
              {pageType === 'sms' && (
                <>
                  <BatchDashboardStyle.FormItemContainer>
                    <MainModal.TextItem>Batch Type</MainModal.TextItem>
                    <MainModal.Select
                      placeholder='Batch Type'
                      name='batchType'
                      value={values.batchType || ''}
                      onChange={(value) => {
                        handleChange('batchType')(value)
                        if (value === 'normal') {
                          setFieldValue('batchCodes', 'TK-A')
                        } else if (value === 'b2b') {
                          setFieldValue('batchCodes', 'TK-BBS')
                          fetchCodeByType('b2b').then(res => {
                            setFieldValue('batchCode',
                              Number(res.batches[0].code.replace('TK-BBS', '')) + 1)
                          })
                        } else if (value === 'b2b2c') {
                          setFieldValue('batchCodes', 'TK-BCS')
                          fetchCodeByType('b2b2c').then(res => {
                            setFieldValue('batchCode',
                              Number(res.batches[0].code.replace('TK-BCS', '')) + 1)
                          })
                        }
                      }}
                    >
                      {
                        batchesTypes.map(btype =>
                          <MainModal.Option key={btype}
                            value={btype}
                          >{btype}
                          </MainModal.Option>
                        )}
                    </MainModal.Select>
                  </BatchDashboardStyle.FormItemContainer>
                  <BatchDashboardStyle.FormErrorMsg>
                    {errors && errors.batchType}
                  </BatchDashboardStyle.FormErrorMsg>
                </>
              )}
              <BatchDashboardStyle.FormItemContainer>
                <MainModal.TextItem>Batch Description</MainModal.TextItem>
                <MainModal.TextArea
                  name='batchDescription'
                  value={values.batchDescription || ''}
                  placeholder='Enter Batch Description'
                  type='text'
                  onChange={handleChange}
                  autoComplete='off'
                />
              </BatchDashboardStyle.FormItemContainer>
              {savedRole !== MENTOR && (
                <>
                  <BatchDashboardStyle.FormItemContainer>
                    <MainModal.TextItem>Mentor Alloted</MainModal.TextItem>
                    <MainModal.Select
                      showSearch
                      placeholder='Select a Mentor'
                      optionFilterProp='children'
                      name='allotedMentor'
                      value={values.allotedMentor || ''}
                      onChange={(value) => handleChange('allotedMentor')(value)}
                      filterOption={(input, option) =>
                        option.props.children
                          ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : false
                      }
                    >
                      {
                        mentors && mentors.map(({ name, id }) =>
                          <MainModal.Option key={id}
                            value={id}
                          >{name}
                          </MainModal.Option>
                        )}
                    </MainModal.Select>
                  </BatchDashboardStyle.FormItemContainer>
                  <BatchDashboardStyle.FormErrorMsg>
                    {errors && errors.allotedMentor}
                  </BatchDashboardStyle.FormErrorMsg>
                </>
              )}
              <BatchDashboardStyle.FormItemContainer>
                <MainModal.TextItem>Select Course</MainModal.TextItem>
                <MainModal.Select
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
                      <MainModal.Option key={id}
                        value={id}
                      >{title}
                      </MainModal.Option>
                    )}
                </MainModal.Select>
              </BatchDashboardStyle.FormItemContainer>
              <Button onClick={closeModal}>CANCEL</Button>
              <MainModal.SaveButton
                type='primary'
                htmlType='submit'
                loading={batchAddedStatus && get(batchAddedStatus.toJS(), 'loading')}
                style={{ marginLeft: '10px' }}
              // form={id}
              >Save
              </MainModal.SaveButton>
            </Form>
          )}
        </Formik>
      )
    } else if (operation === 'update' && updateBatchData) {
      const prefixes = ['TK-A', 'TK-BBS', 'TK-BCS']
      const prefix = prefixes.find((p) => updateBatchData.code.includes(p))
      return (
        <Formik
          initialValues={{
            batchCode: prefix ? updateBatchData.code.replace(prefix, '') : updateBatchData.code,
            batchType: updateBatchData.type,
            batchDescription: updateBatchData.description,
            allotedMentor: updateBatchData.allotedMentorId,
            topic: updateBatchData.topicId,
            batchCodes: prefix,
            selectedCourse: get(updateBatchData, 'course.id'),
            enrollmentType: get(updateBatchData, 'enrollmentType')
          }}
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={UpdateBatchValidationSchema}
          onSubmit={handleUpdate}
        >
          {({ errors, values, handleChange, setFieldValue }) => (
            <Form style={{ padding: '0 10px' }}>
              <BatchDashboardStyle.FormItemContainer>
                <MainModal.TextItem>Batch Code</MainModal.TextItem>
                <div style={{ display: 'flex' }}>
                  <span style={{ marginRight: '10px', width: '100px' }}>
                    {values.batchCodes}
                  </span>
                  <MainModal.Input
                    name='batchCode'
                    value={values.batchCode || ''}
                    placeholder='Enter Batch Code'
                    type='text'
                    onChange={handleChange}
                    autoComplete='off'
                  />
                </div>
              </BatchDashboardStyle.FormItemContainer>
              <BatchDashboardStyle.FormErrorMsg>
                {errors && errors.batchCode}
              </BatchDashboardStyle.FormErrorMsg>
              {pageType === 'sms' && (
                <>
                  <BatchDashboardStyle.FormItemContainer>
                    <MainModal.TextItem>Batch Type</MainModal.TextItem>
                    <MainModal.Select
                      placeholder='Batch Type'
                      name='batchType'
                      value={values.batchType || ''}
                      onChange={(value) => {
                        handleChange('batchType')(value)
                        if (value === 'normal') {
                          setFieldValue('batchCodes', 'TK-A')
                        } else if (value === 'b2b') {
                          setFieldValue('batchCodes', 'TK-BBS')
                        } else if (value === 'b2b2c') {
                          setFieldValue('batchCodes', 'TK-BCS')
                        }
                      }}
                    >
                      {
                        batchesTypes.map(btype =>
                          <MainModal.Option key={btype}
                            value={btype}
                          >{btype}
                          </MainModal.Option>
                        )}
                    </MainModal.Select>
                  </BatchDashboardStyle.FormItemContainer>
                  <BatchDashboardStyle.FormErrorMsg>
                    {errors && errors.batchType}
                  </BatchDashboardStyle.FormErrorMsg>
                </>
              )}
              <BatchDashboardStyle.FormItemContainer>
                <MainModal.TextItem>Batch Description</MainModal.TextItem>
                <MainModal.TextArea
                  name='batchDescription'
                  value={values.batchDescription || ''}
                  placeholder='Enter Batch Description'
                  type='text'
                  onChange={handleChange}
                  autoComplete='off'
                />
              </BatchDashboardStyle.FormItemContainer>
              {
                savedRole !== MENTOR && (
                  <>
                    <BatchDashboardStyle.FormItemContainer>
                      <MainModal.TextItem>Mentor Alloted</MainModal.TextItem>
                      <MainModal.Select
                        showSearch
                        placeholder='Alloted Mentor'
                        optionFilterProp='children'
                        name='allotedMentor'
                        value={values.allotedMentor || ''}
                        onChange={(value) => handleChange('allotedMentor')(value)}
                        filterOption={(input, option) =>
                          option.props.children
                            ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            : false
                        }
                      >
                        {
                          mentors && mentors.map(({ name, id }) =>
                            <MainModal.Option key={id}
                              value={id}
                            >{name}
                            </MainModal.Option>
                          )}
                      </MainModal.Select>
                    </BatchDashboardStyle.FormItemContainer>
                    <BatchDashboardStyle.FormErrorMsg>
                      {errors && errors.allotedMentor}
                    </BatchDashboardStyle.FormErrorMsg>
                  </>
                )
              }
              <BatchDashboardStyle.FormItemContainer>
                <MainModal.TextItem>Select Course</MainModal.TextItem>
                <MainModal.Select
                  showSearch
                  placeholder='Select a Course'
                  optionFilterProp='children'
                  name='selectedCourse'
                  value={values.selectedCourse || ''}
                  onChange={async (value) => {
                    handleChange('selectedCourse')(value)
                    await fetchBatchTopic(value).then((res) => {
                      setFieldValue('topic', get(res, 'topics[0].id'))
                    })
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      : false
                  }
                >
                  {
                    coursesList && coursesList.map(({ title, id }) =>
                      <MainModal.Option key={id}
                        value={id}
                      >{title}
                      </MainModal.Option>
                    )}
                </MainModal.Select>
              </BatchDashboardStyle.FormItemContainer>
              <BatchDashboardStyle.FormItemContainer>
                <MainModal.TextItem>Topic</MainModal.TextItem>
                <MainModal.Select
                  showSearch
                  placeholder='Select topic'
                  optionFilterProp='children'
                  name='topic'
                  loading={getTopicLoader(values.selectedCourse)}
                  value={values.topic || ''}
                  onChange={(value) => handleChange('topic')(value)}
                  filterOption={(input, option) =>
                    option.props.children
                      ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      : false
                  }
                >
                  {
                    getTopicsForCourse(values.selectedCourse).map(({ title, id, order }) =>
                      <MainModal.Option key={id}
                        value={id}
                      >{`${order} ${title}`}
                      </MainModal.Option>
                    )}
                </MainModal.Select>
              </BatchDashboardStyle.FormItemContainer>
              <BatchDashboardStyle.FormErrorMsg>
                {errors && errors.topic}
              </BatchDashboardStyle.FormErrorMsg>
              {
                savedRole === UMS_ADMIN || savedRole === ADMIN ?
                  <BatchDashboardStyle.FormItemContainer>
                    <MainModal.TextItem>Payment Status</MainModal.TextItem>
                    <div>
                      <BatchDashboardStyle.ToggleButton
                        style={{
                          backgroundColor: values.enrollmentType === 'free' ? '#278af3' : '#fff',
                          color: values.enrollmentType === 'free' ? '#fff' : '#278af3',
                        }}
                        onClick={() => handleChange('enrollmentType')('free')}
                      >
                        Free
                      </BatchDashboardStyle.ToggleButton>
                      <BatchDashboardStyle.ToggleButton
                        style={{
                          backgroundColor: values.enrollmentType === 'pro' ? '#278af3' : '#fff',
                          color: values.enrollmentType === 'pro' ? '#fff' : '#278af3',
                        }}
                        onClick={() => handleChange('enrollmentType')('pro')}
                      >
                        Paid
                      </BatchDashboardStyle.ToggleButton>
                    </div>
                  </BatchDashboardStyle.FormItemContainer> : <div />
              }
              <Button onClick={closeModal}>CANCEL</Button>
              <MainModal.SaveButton
                type='primary'
                htmlType='submit'
                loading={batchUpdateStatus && get(batchUpdateStatus.toJS(), 'loading')}
                style={{ marginLeft: '10px' }}
              // form={id}
              >Update
              </MainModal.SaveButton>
            </Form>
          )}
        </Formik>
      )
    }
  }
  return (
    <MainModal
      visible={visible}
      title='Batch Details'
      onCancel={closeModal}
      maskClosable={false}
      width='568px'
      centered
      destroyOnClose
      footer={null}
    >
      {renderForm()}
    </MainModal>
  )
}

BatchModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeSessionModal: PropTypes.func.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFields: PropTypes.func,
  }).isRequired,
}

export default memo(BatchModal)
