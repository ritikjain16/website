import { Button, Input } from 'antd'
import React from 'react'

const ProductInput = (props) => {
  const { deleteField, ...restProps } = props
  return (
    <div style={{ position: 'relative' }}>
      <Input.TextArea
        autoComplete='off'
        {...restProps}
      />
      <Button
        icon='delete'
        type='danger'
        onClick={deleteField}
        style={{ position: 'absolute', top: '15px', right: '12px' }}
      />
    </div>
  )
}

export default ProductInput
