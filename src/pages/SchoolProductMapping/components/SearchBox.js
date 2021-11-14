import { Button, Spin } from 'antd'
import React from 'react'
import SchoolProductMappingStyle from '../schoolProductMapping.style'

const SearchBox = ({
  datasArray,
  onChange,
  onKeyPress,
  onClick,
  handleValueSelect,
  placeholder }) => {
  const styles = { width: 200 }
  return (
    <div style={{
      marginLeft: '20px',
      display: 'inline-flex',
      flexDirection: 'row'
    }}
    >
      <SchoolProductMappingStyle.StyledAutocomplete
        allowClear
        style={styles}
        option={datasArray}
        filterOption={(inputValue, option) => (
          option.props.children &&
          option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        )}
        placeholder={placeholder}
        onSelect={handleValueSelect}
        notFoundContent={!datasArray ? <Spin /> : 'No Match Found'}
        onChange={onChange}
        onKeyPress={onKeyPress}
      >
        {datasArray && datasArray.map(({ id, name }) => (
          <SchoolProductMappingStyle.StyledOption
            key={id}
            value={id}
          >{name}
          </SchoolProductMappingStyle.StyledOption>
        ))}
      </SchoolProductMappingStyle.StyledAutocomplete>
      <Button type='primary' onClick={onClick} >Search</Button>
    </div>
  )
}

export default SearchBox
