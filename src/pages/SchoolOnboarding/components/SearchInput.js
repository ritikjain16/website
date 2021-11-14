import { Select } from 'antd'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { StyledSelect } from '../SchoolOnBoarding.style'

const { Option } = Select

const SearchInput = (props) => {
  const { value, placeholder, onChange, dataArray = [], optionGrades } = props
  return (
    <StyledSelect
      showSearch
      value={value}
      placeholder={placeholder}
      optionFilterProp='children'
      onChange={onChange}
      filterOption={(input, option) =>
        get(option, 'props.children')
          ? get(option, 'props.children')
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
          : false
      }
    >
      {
       optionGrades ? (
         dataArray.map(({ grade }) => <Option key={grade} value={grade}>{grade}</Option>)
       ) : (
         dataArray.map((school) =>
           <Option value={get(school, 'id')} key={get(school, 'id')}>{get(school, 'name')}</Option>)
       )
      }
    </StyledSelect>
  )
}


SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  dataArray: PropTypes.arrayOf({}).isRequired,
  optionGrades: PropTypes.arrayOf({}).isRequired,
}

export default SearchInput
