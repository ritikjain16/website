import { Icon, Select } from 'antd'
import React from 'react'
import { removeFromWorkbookContentTag } from '../../../../../actions/workbook'
import WorkbookStyle from '../../../Workbook.style'

const TagSelector = (props) => {
  const { values, setFieldValue, tags, label, operation, workbookId } = props
  return (
    <div>
      <h3>{label} : </h3>
      <Select
        style={{ marginBottom: '10px' }}
        showSearch
        filterOption={(inputValue, option) => (
          option.props.children &&
          option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        )}
        placeholder='Please select'
        value={values.textTag || ''}
        onChange={(value) => setFieldValue('textTag', value)}
        onSelect={(value) => {
          setFieldValue('formTags', [...values.formTags, tags.find(({ id }) => id === value)])
          setFieldValue('textTag', '')
        }}
      >
        {
          tags && tags.length > 0 &&
            tags.filter(t => ![...values.formTags.map(({ id }) => id)]
                .includes(t.id)).map(({ id, title }) => (
                  <Select.Option value={id} key={id} >{title}</Select.Option>
          ))
        }
      </Select>
      <div style={{ display: 'flex', flexWrap: 'wrap' }} >
        {values.formTags && values.formTags.map(({ id, title }) => (
          <WorkbookStyle.Tag key={id} color='#750000' >
            <Icon type='cross'
              onClick={() => {
                setFieldValue('formTags', values.formTags.filter(t => t.id !== id))
                if (operation && operation === 'edit' && workbookId) {
                  removeFromWorkbookContentTag(id, workbookId)
                }
              }}
              style={{
                background: '#ff6c6c',
                borderRadius: '100px',
                fontSize: '10px',
                padding: '3px',
                marginRight: '.5rem',
                cursor: 'pointer'
              }}
            />
            {title}
          </WorkbookStyle.Tag>
        ))}
      </div>
    </div>
  )
}

export default TagSelector
