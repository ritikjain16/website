import React from 'react'
import ClassProgressStyle from '../ClassProgress.styles'

const FilterBox = (props) => {
  const { name, checked, onChange, value, data, label, total, boxStyle, divStyle, radio } = props
  return (
    radio ? (
      <>
        <ClassProgressStyle.FilterRadioButton
          value={value}
          checked={checked}
        >
          <ClassProgressStyle.FilterBox style={boxStyle}>
            <span>{label}</span>
            <div style={divStyle}>
              <span>{data}</span>
              <span>{`${total ? Math.round((data / total) * 100) : 0}%`}</span>
            </div>
          </ClassProgressStyle.FilterBox>
        </ClassProgressStyle.FilterRadioButton>
      </>
    ) : (
      <>
        <ClassProgressStyle.FilterCheckBox
          name={name}
          checked={checked}
          onChange={onChange}
          value={value}
        >
          <ClassProgressStyle.FilterBox style={boxStyle}>
            <span>{label}</span>
            <div style={divStyle}>
              <span>{data}</span>
              <span>{`${total ? Math.round((data / total) * 100) : 0}%`}</span>
            </div>
          </ClassProgressStyle.FilterBox>
        </ClassProgressStyle.FilterCheckBox>
      </>
    )
  )
}

export default FilterBox
