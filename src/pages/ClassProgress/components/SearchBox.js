import { Icon, Spin } from 'antd'
import React from 'react'
import ClassProgressStyle from '../ClassProgress.styles'

const SearchBox = (props) => {
  const { value, onChange, placeholder, onKeyPress, searchByFilter, autoComplete,
    datasArray, handleValueSelect
  } = props
  return (
    <div
      style={{
        marginLeft: '20px',
        display: 'inline-flex',
        flexDirection: 'row'
      }}
    >
      {
        autoComplete ? (
          <>
            <ClassProgressStyle.StyledAutocomplete
              option={datasArray}
              filterOption={(inputValue, option) => (
                option.props.children &&
                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              )}
              placeholder={placeholder}
              onSelect={handleValueSelect}
              notFoundContent={datasArray && datasArray.length > 0 ? 'No Match Found' : <Spin />}
              onChange={onChange}
              onKeyPress={onKeyPress}
            >
              {datasArray && datasArray.map(({ id, name }) => (
                <ClassProgressStyle.StyledOption
                  key={id}
                  value={id}
                >{name}
                </ClassProgressStyle.StyledOption>
              ))}
            </ClassProgressStyle.StyledAutocomplete>
            <ClassProgressStyle.SearchIcon
              onClick={searchByFilter}
            >
              <Icon type='search'
                style={{
                  fontSize: 18
                }}
              />
            </ClassProgressStyle.SearchIcon>
          </>
        ) : (
        <>
          <ClassProgressStyle.StyledInput
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPress}
          />
          <ClassProgressStyle.SearchIcon onClick={searchByFilter}>
            <Icon type='search'
              style={{
                fontSize: 18
              }}
            />
          </ClassProgressStyle.SearchIcon>
        </>
        )
      }
    </div>
  )
}

export default SearchBox
