import React from 'react'
import { useField } from 'formik'
import { Select } from 'antd'
import {
  COURSE_BADGE_TYPE, COURSE_BADGE_UNLOCKING_POINT
} from '../../../../../constants/CourseComponents'
/* eslint-disable */

const FormSelect = ({ label, order, values, setFieldValue, textArea, typeSelector, ...props }) => {
    const [field, meta] = useField(props)
  const optionArray = typeSelector ? COURSE_BADGE_TYPE : COURSE_BADGE_UNLOCKING_POINT
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px' }}
    >
      <h3>{`${label ? `${label} : ` : ''}`}</h3>
      <Select autoComplete='off' {...field} {...props} >
        {
          optionArray.map(option => <Select.Option value={option} key={option} >{option}</Select.Option>)
        }   
      </Select>
      {meta.touched && meta.error ? (
        <p style={{ fontSize: 'small', color: 'red' }}>{meta.error}</p>
      ) : null}
    </div>
  )
}

export default FormSelect
