import { Slider } from 'antd'
import React from 'react'
import { MAX_DIFFICULTY_RANGE } from '../../../../../../constants/questionBank'

const DifficultySlider = (props) => {
  const { label, value: values, setFieldValue, errors } = props
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
      <h3>{label} : </h3>
      <div style={{ display: 'flex' }}>
        <Slider
          style={{ width: '200px' }}
          value={values}
          max={MAX_DIFFICULTY_RANGE}
          onChange={value => setFieldValue('difficulty', value)}
        />
        <p>{values}</p>
      </div>
      {errors && errors.difficulty ? (
        <p style={{ fontSize: 'small', color: 'red' }} >{errors.difficulty}</p>) : null}
    </div>
  )
}

export default DifficultySlider
