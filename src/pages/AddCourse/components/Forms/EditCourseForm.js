/* eslint-disable max-len  */
import React, { useEffect, useRef, useState } from 'react'
import { Form, Formik } from 'formik'
import { get, sortBy } from 'lodash'
import { Button, Select, Input as InputField } from 'antd'
import { Input, PublishInput, courseValidation } from './FormElements'
import Dropzone from '../../../../components/Dropzone'
import getFullPath from '../../../../utils/getFullPath'
import { MDTable, TopContainer } from '../../AddCourse.styles'
import { COMPONENT_ARRAY, TARGET_GROUP_ARRAY, LO_COMPONENT_ARRAY, LEARNING_OBJECTIVE } from '../../../../constants/CourseComponents'
import restrictedNumverValues from '../../../../constants/restrictedNumberValues'
import CODING_LANGUAGES from '../../../../constants/codinglanguages'
import getGrades from '../../../../utils/getGrades'

const EditCourseForm = (props) => {
  const { handleEditCourse, editData, courseUpdateStatus, orderInUse } = props
  const thumbnailRef = useRef()
  const [selectedComponent, setSelectedComponent] = useState([])
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailUrl, setThumbnailUrl] = useState(null)
  const bannerRef = useRef()
  const [bannerFile, setBannerFile] = useState(null)
  const [bannerUrl, setBannerUrl] = useState(null)
  const [componentError, setComponentError] = useState('')
  const [selectedTargetGroup, setSelectedTargetGroup] = useState([])
  const [primaryColor, setPrimaryColor] = useState(editData.theme.primaryColor)
  const [secondaryColor, setSecondaryColor] = useState(editData.theme.secondaryColor)
  const [backdropColor, setBackdropColor] = useState(editData.theme.backdropColor)
  const [selectedLoComponent, setSelectedLoComponent] = useState([])
  const [loComponentError, setLoComponentError] = useState('')
  const [codingLangauges, setCodingLanguages] = useState([])
  const [grades, setGrades] = useState({ minGrade: 0, maxGrade: 0 })

  const onDropThumbnail = (file) => {
    setThumbnailFile(file)
  }

  const onDropBanner = (file) => {
    setBannerFile(file)
  }
  const handleSubmit = (value, meta) => {
    const theme = {
      primaryColor,
      secondaryColor,
      backdropColor
    }
    if (selectedComponent && selectedComponent.length > 0) {
      const newOrders = []
      let isSameOrder = 0
      let zeroMinVal = 0
      let zeroMaxVal = 0
      let isMinMoreThanMax = 0

      let isSameLoOrder = 0
      const newLoOrder = []

      selectedLoComponent.forEach(component => {
        if (!newLoOrder.includes(component.order)) {
          newLoOrder.push(component.order)
        } else {
          isSameLoOrder += 1
        }
      })
      const addedComponent = []
      selectedComponent.forEach(component => {
        if (!newOrders.includes(component.order)) {
          newOrders.push(component.order)
        } else {
          isSameOrder += 1
        }
        if (component.min <= 0) {
          zeroMinVal += 1
        }
        if (component.max <= 0) {
          zeroMaxVal += 1
        }
        if (component.min > component.max) {
          isMinMoreThanMax += 1
        }
        addedComponent.push(get(component, 'componentName'))
      })
      let selectedLoDefaultComponent = 0
      if (addedComponent.includes(LEARNING_OBJECTIVE) && selectedLoComponent.length === 0) {
        selectedLoDefaultComponent += 1
      }
      setComponentError('')
      setLoComponentError('')
      if (isSameOrder >= 1) {
        setComponentError('2 components cannot have same order')
      } else if (zeroMinVal >= 1) {
        setComponentError('Components cannot have minimum value as 0 or less than 0')
      } else if (zeroMaxVal >= 1) {
        setComponentError('Components cannot have maximum value as 0 or less than 0')
      } else if (isMinMoreThanMax >= 1) {
        setComponentError('Minimum value cannot be greater than Maximum value')
      } else if (isSameLoOrder >= 1) {
        setLoComponentError('2 LO components cannot have same order')
      } else if (selectedLoDefaultComponent >= 1) {
        setLoComponentError('Please add atleast one LO Component')
      } else {
        handleEditCourse(value, meta, thumbnailFile, bannerFile, selectedComponent,
          selectedTargetGroup, theme, selectedLoComponent, codingLangauges, grades)
      }
    } else {
      handleEditCourse(value, meta, thumbnailFile, bannerFile, selectedComponent,
        selectedTargetGroup, theme, selectedLoComponent, codingLangauges, grades)
    }
  }

  const handleSelectComponent = (value) => {
    const newValue = [...selectedComponent, {
      ...value,
      componentName: get(value, 'label'),
      min: 0,
      max: 0,
      order:
        selectedComponent.length === 0 ? 1 :
          Math.max(...selectedComponent.map((data) => data.order)) + 1,
      id:
        selectedComponent.length === 0 ? 1 :
          Math.max(...selectedComponent.map((data) => data.order)) + 1,
    }]
    setSelectedComponent(newValue)
  }

  const handleSelectLoComponent = (value) => {
    const newValue = [...selectedLoComponent, {
      ...value,
      componentName: get(value, 'label'),
      order:
        selectedLoComponent.length === 0 ? 1 :
          Math.max(...selectedLoComponent.map((data) => data.order)) + 1,
      id:
        selectedLoComponent.length === 0 ? 1 :
          Math.max(...selectedLoComponent.map((data) => data.order)) + 1,
    }]
    setSelectedLoComponent(newValue)
  }

  const handleSelectedTargetGroup = (value) => {
    const newSelectedTargetGroup = [...selectedTargetGroup]
    newSelectedTargetGroup.push(value)
    setSelectedTargetGroup(newSelectedTargetGroup)
  }

  const handleComponentValueChange = ({ value, name }, compoName) => {
    const newComponent = [...selectedComponent]
    const isExist = newComponent.find(component => get(component, 'label') === compoName)
    if (isExist) isExist[name] = Number(value)
    const newData = newComponent.filter(component => get(component, 'label') !== compoName)
    setSelectedComponent([...newData, isExist])
  }

  const handleLoComponentOrderChange = ({ value, name }, compoName) => {
    const newComponent = [...selectedLoComponent]
    const isExist = newComponent.find(component => get(component, 'label') === compoName)
    if (isExist) isExist[name] = Number(value)
    const newData = newComponent.filter(component => get(component, 'label') !== compoName)
    setSelectedLoComponent([...newData, isExist])
  }

  const PrimaryColorPicker = () => <input type='color' value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} />

  const SecondaryColorPicker = () => <input type='color' value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} />


  const BackdropColorPicker = () => <input type='color' value={backdropColor} onChange={e => setBackdropColor(e.target.value)} />

  const onInputKeyDown = (e) => {
    if (restrictedNumverValues.includes(e.key)) {
      e.preventDefault()
    }
  }

  const handleLangaugeSelect = (value) => {
    const newCourseLangauges = [...codingLangauges, value]
    setCodingLanguages(newCourseLangauges)
  }

  useEffect(() => {
    if (get(editData, 'courseComponentRule')
      && get(editData, 'courseComponentRule', []).length > 0) {
      const newComponent = []
      sortBy(get(editData, 'courseComponentRule', []), 'order').forEach((component, i) => {
        newComponent.push({
          label: get(component, 'componentName'),
          key: get(component, 'componentName'),
          componentName: get(component, 'componentName'),
          min: get(component, 'min'),
          max: get(component, 'max'),
          order: get(component, 'order'),
          id: i
        })
      })
      setSelectedComponent(newComponent)
    } else {
      setSelectedComponent([])
    }
    if (get(editData, 'defaultLoComponentRule')
      && get(editData, 'defaultLoComponentRule', []).length > 0) {
      const newLoComponent = []
      sortBy(get(editData, 'defaultLoComponentRule', []), 'order').forEach((component, i) => {
        newLoComponent.push({
          label: get(component, 'componentName'),
          key: get(component, 'componentName'),
          componentName: get(component, 'componentName'),
          order: get(component, 'order'),
          id: i
        })
      })
      setSelectedLoComponent(newLoComponent)
    } else {
      setSelectedLoComponent([])
    }
    if (get(editData, 'codingLanguages', []).length > 0) {
      const newCourseLangauges = []
      get(editData, 'codingLanguages', []).forEach(language => {
        newCourseLangauges.push({
          label: get(language, 'value'),
          key: get(language, 'value'),
        })
      })
      setCodingLanguages(newCourseLangauges)
    }
    if (get(editData, 'minGrade') || get(editData, 'maxGrade')) {
      const gradesValue = {
        minGrade: get(editData, 'minGrade', 0),
        maxGrade: get(editData, 'maxGrade', 0)
      }
      setGrades(gradesValue)
    }
  }, [editData.id])

  useEffect(() => {
    if (get(editData, 'targetGroup', []).length > 0) {
      const newComponent = []
      get(editData, 'targetGroup', []).forEach(component => {
        newComponent.push({
          label: get(component, 'type'),
          key: get(component, 'type')
        })
      })
      setSelectedTargetGroup(newComponent)
    } else {
      setSelectedTargetGroup([])
    }
  }, [])

  const handleRemoveComponent = ({ label }) => {
    const newComponents = [...selectedComponent].filter(compo => get(compo, 'label') !== label)
    newComponents.forEach((_, index) => {
      newComponents[index].order = index + 1
    })
    setSelectedComponent(newComponents)
  }


  const handleRemoveLoComponent = ({ label }) => {
    const newLoComponent = [...selectedLoComponent].filter(compo => get(compo, 'label') !== label)
    newLoComponent.forEach((_, index) => {
      newLoComponent[index].order = index + 1
    })
    setSelectedLoComponent(newLoComponent)
  }

  const handleGradeChange = (name, value) => {
    setGrades({
      ...grades,
      [name]: value
    })
  }

  const gradeNumber = (grade) => grade.replace('Grade', '')
  return (
    <Formik
      initialValues={editData}
      onSubmit={handleSubmit}
      validateOnBlur
      validationSchema={courseValidation}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form style={{ padding: '0 10px' }} id='form'>
          <TopContainer justify='space-between' modalGrid>
            <div>
              <h3>Thumbnail</h3>
              <Dropzone
                style={{ height: '200px', width: '100%', marginBottom: '15px' }}
                getDropzoneFile={onDropThumbnail}
                ref={thumbnailRef}
                defaultImage={thumbnailUrl || getFullPath(get(editData, 'thumbnail.uri'))}
                defaultFile={thumbnailFile}
                onImageUrl={imgUrl => setThumbnailUrl(imgUrl)}
              >Click or drag to attach
              </Dropzone>
            </div>
            <div>
              <h3>Banner</h3>
              <Dropzone
                style={{ height: '200px', width: '100%', marginBottom: '15px' }}
                getDropzoneFile={onDropBanner}
                ref={bannerRef}
                defaultImage={bannerUrl || getFullPath(get(editData, 'bannerThumbnail.uri'))}
                defaultFile={bannerFile}
                onImageUrl={imgUrl => setBannerUrl(imgUrl)}
              >Click or drag to attach
              </Dropzone>
            </div>
          </TopContainer>
          <TopContainer modalGrid>
            <div>
              <Input
                label='Add Course Title'
                placeholder='Add Course Title'
                name='title'
                type='text'
                value={values.title || ''}
                onChange={(e) => handleChange(e)}
                setFieldValue={setFieldValue}
              />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '70% 50%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '10px'
                }}
              >
                <Input
                  placeholder='Enter Order'
                  type='number'
                  name='order'
                  label='Order'
                  value={values.order || ''}
                  order
                  values={values}
                  orderInUse={orderInUse}
                  setFieldValue={setFieldValue}
                  onChange={(e) => handleChange(e)}
                />
                <PublishInput
                  values={values}
                  setFieldValue={setFieldValue}
                />
              </div>
            </div>
            <div style={{ flex: '0.8' }}>
              <Input
                label='Add Course Description'
                placeholder='Add Course Description'
                name='description'
                type='text'
                value={values.description || ''}
                onChange={(e) => handleChange(e)}
                setFieldValue={setFieldValue}
                textArea='textArea'
              />
            </div>
          </TopContainer>
          <TopContainer modalGrid style={{ gridTemplateColumns: '45% 45%', marginTop: '10px' }}>
            <Input
              label='Add Banner Title'
              placeholder='Add Banner Title'
              name='bannerTitle'
              type='text'
              value={values.bannerTitle || ''}
              onChange={(e) => handleChange(e)}
              setFieldValue={setFieldValue}
              textArea='textArea'
            />
            <Input
              label='Add Banner Description'
              placeholder='Add Banner Description'
              name='bannerDescription'
              type='text'
              value={values.bannerDescription || ''}
              onChange={(e) => handleChange(e)}
              setFieldValue={setFieldValue}
              textArea='textArea'
            />
          </TopContainer>
          <Input
            label='Secondary Category'
            placeholder='Eg. BLOCK-BASED PROGRAMMING'
            name='secondaryCategory'
            type='text'
            value={values.secondaryCategory || ''}
            onChange={(e) => handleChange(e)}
            setFieldValue={setFieldValue}
          />
          <TopContainer modalGrid style={{ gridTemplateColumns: '30% 30% 30%', marginTop: '10px' }}>
            <Input
              label='Primary Color'
              placeholder='Primary Color'
              name='primaryColor'
              type='text'
              readOnly
              value={primaryColor || ''}
              onChange={(e) => handleChange(e)}
              setFieldValue={setFieldValue}
              suffix={PrimaryColorPicker()}
            />
            <Input
              label='Secondary Color'
              placeholder='Secondary Color'
              name='secondaryColor'
              type='text'
              readOnly
              value={secondaryColor || ''}
              onChange={(e) => handleChange(e)}
              setFieldValue={setFieldValue}
              suffix={SecondaryColorPicker()}
            />
            <Input
              label='Backdrop Color'
              placeholder='Backdrop Color'
              name='backdropColor'
              type='text'
              readOnly
              value={backdropColor || ''}
              onChange={(e) => handleChange(e)}
              setFieldValue={setFieldValue}
              suffix={BackdropColorPicker()}
            />
          </TopContainer>
          <h3 style={{ marginTop: '10px', marginBottom: '0px' }}>Select Grade Range :</h3>
          <TopContainer modalGrid style={{ gridTemplateColumns: '45% 45%', marginTop: '10px' }}>
            <TopContainer>
              Minimum Grade
              <Select
                label='Minimum Grade'
                placeholder='Minimum Grade'
                name='minGrade'
                value={grades.minGrade || ''}
                onChange={(value) => handleGradeChange('minGrade', value)}
                style={{ width: '50%', margin: '0 10px' }}
              >
                {
              getGrades().map(grade =>
                <Select.Option
                  value={gradeNumber(grade)}
                  key={gradeNumber(grade)}
                >
                  {gradeNumber(grade)}
                </Select.Option>
              )
            }
              </Select>
            </TopContainer>
            <TopContainer>
              Maximum Grade
              <Select
                label='Maximum Grade'
                placeholder='Maximum Grade'
                name='maxGrade'
                value={grades.maxGrade || ''}
                disabled={!get(grades, 'minGrade')}
                onChange={(value) => handleGradeChange('maxGrade', Number(value))}
                style={{ width: '50%', margin: '0 10px' }}
              >
                {[...getGrades()].filter(grade =>
                  Number(gradeNumber(grade)) > get(grades, 'minGrade')).map(grade =>
                    <Select.Option
                      value={gradeNumber(grade)}
                      key={gradeNumber(grade)}
                    >
                      {gradeNumber(grade)}
                    </Select.Option>
                  )
                }
              </Select>
            </TopContainer>
          </TopContainer>
          <h3 style={{ marginTop: '10px', marginBottom: '0px' }}>Select Target Group :</h3>
          <Select
            mode='multiple'
            labelInValue
            filterOption={false}
            value={selectedTargetGroup}
            onSelect={handleSelectedTargetGroup}
            style={{ width: '100%', margin: '10px 0' }}
            onDeselect={({ label }) =>
              setSelectedTargetGroup(selectedTargetGroup.filter(compo => get(compo, 'label') !== label))}
          >
            {
              TARGET_GROUP_ARRAY.map(item =>
                <Select.Option
                  value={item}
                  key={item}
                >
                  {item}
                </Select.Option>
              )
            }
          </Select>
          <h3 style={{ marginTop: '10px', marginBottom: '0px' }}>Select Langauges :</h3>
          <Select
            mode='multiple'
            labelInValue
            placeholder='Search Langauges'
            filterOption={false}
            value={codingLangauges}
            onSelect={handleLangaugeSelect}
            style={{ width: '100%', margin: '10px 0' }}
            onDeselect={({ label }) =>
                setCodingLanguages(codingLangauges.filter(compo => get(compo, 'label') !== label))}
          >
            {
              CODING_LANGUAGES.map(item =>
                <Select.Option
                  value={item}
                  key={item}
                >
                  {item}
                </Select.Option>
              )
            }
          </Select>
          <h3 style={{ marginTop: '10px', marginBottom: '0px' }}>Select Components :</h3>
          <Select
            mode='multiple'
            labelInValue
            placeholder='Type min 3 characters'
            filterOption={false}
            value={sortBy(selectedComponent, 'id')}
            onSelect={handleSelectComponent}
            style={{ width: '100%', margin: '10px 0' }}
            onDeselect={handleRemoveComponent}
          >
            {
              COMPONENT_ARRAY.map(item =>
                <Select.Option
                  value={item}
                  key={item}
                >
                  {item}
                </Select.Option>
              )
            }
          </Select>
          <div>
            <MDTable
              columns={[
                {
                  title: 'Order',
                  dataIndex: 'order',
                  key: 'order',
                  align: 'center',
                  render: (data, component) => (
                    <InputField
                      label='Order'
                      placeholder='Order'
                      name='order'
                      type='order'
                      onKeyDown={onInputKeyDown}
                      value={component.order || ''}
                      onChange={({ target }) => handleComponentValueChange(target, get(component, 'label'))}
                    />
                  )
                },
                {
                  title: 'Minimum',
                  dataIndex: 'min',
                  key: 'min',
                  align: 'center',
                  render: (data, component) => (
                    <InputField
                      label='Minimum'
                      placeholder='Minimum'
                      name='min'
                      type='number'
                      onKeyDown={onInputKeyDown}
                      value={component.min || ''}
                      onChange={({ target }) => handleComponentValueChange(target, get(component, 'label'))}
                    />
                  )
                },
                {
                  title: 'Maximum',
                  dataIndex: 'max',
                  key: 'max',
                  align: 'center',
                  render: (data, component) => (
                    <InputField
                      label='Maximum'
                      placeholder='Maximum'
                      name='max'
                      type='number'
                      onKeyDown={onInputKeyDown}
                      value={component.max || ''}
                      onChange={({ target }) => handleComponentValueChange(target, get(component, 'label'))}
                    />
                  )
                },
                {
                  title: 'Component Name',
                  dataIndex: 'label',
                  key: 'label',
                  align: 'center',
                },
              ]}
              dataSource={sortBy(selectedComponent, 'id')}
              pagination={false}
            />
            {componentError && (
              <p style={{ fontSize: 'small', color: 'red' }}>{componentError}</p>)}
          </div>
          <h3 style={{ marginTop: '10px', marginBottom: '0px' }}>Select LO Components :</h3>
          <Select
            mode='multiple'
            labelInValue
            placeholder='Type min 3 characters'
            filterOption={false}
            value={sortBy(selectedLoComponent, 'id')}
            onSelect={handleSelectLoComponent}
            style={{ width: '100%', margin: '10px 0' }}
            onDeselect={handleRemoveLoComponent}
          >
            {
              LO_COMPONENT_ARRAY.map(item =>
                <Select.Option
                  value={item}
                  key={item}
                >
                  {item}
                </Select.Option>
              )
            }
          </Select>
          <div>
            <MDTable
              columns={[
                {
                  title: 'Order',
                  dataIndex: 'order',
                  key: 'order',
                  align: 'center',
                  width: 200,
                  render: (data, component) => (
                    <InputField
                      label='Order'
                      placeholder='Order'
                      name='order'
                      type='order'
                      onKeyDown={onInputKeyDown}
                      value={component.order || ''}
                      onChange={({ target }) => handleLoComponentOrderChange(target, get(component, 'label'))}
                    />
                  )
                },
                {
                  title: 'Component Name',
                  dataIndex: 'label',
                  key: 'label',
                  align: 'center',
                },
              ]}
              dataSource={sortBy(selectedLoComponent, 'id')}
              pagination={false}
            />
            {loComponentError && (
              <p style={{ fontSize: 'small', color: 'red' }}>{loComponentError}</p>)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '10px' }}>
            <Button
              type='primary'
              icon='file'
              id='add-btn'
              htmlType='submit'
              loading={courseUpdateStatus && get(courseUpdateStatus.toJS(), 'loading')}
            >
              Update
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default EditCourseForm
