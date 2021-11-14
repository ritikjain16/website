import { Icon, Spin } from 'antd'
import React from 'react'
import NetPromoterScoreStyle from '../NetPromoterScore.style'

const SearchInput = ({
    datasArray,
    onChange,
    onKeyPress,
    searchByFilter,
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
            <NetPromoterScoreStyle.AutoComplete
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
                {datasArray && datasArray.map(({ id,title }) => (
                    <NetPromoterScoreStyle.Option
                        key={id}
                        value={id}
                    >{title}
                    </NetPromoterScoreStyle.Option>
                ))}
            </NetPromoterScoreStyle.AutoComplete>
            <NetPromoterScoreStyle.SearchIcon
                onClick={searchByFilter}
            >
                <Icon type='search'
                    style={{
                        fontSize: 18
                    }}
                />
            </NetPromoterScoreStyle.SearchIcon>
        </div>
    )
}

export default SearchInput
