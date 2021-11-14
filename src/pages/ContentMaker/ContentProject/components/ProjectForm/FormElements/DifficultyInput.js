import { ThunderboltFilled } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { FlexContainer } from '../../../ContentProject.styles'

const DifficultyInput = (props) => {
  const { value, setFieldValue } = props
  const [selected, setSelected] = useState([])
  useEffect(() => {
    const newSelected = []
    if (value === 1) newSelected.push('One')
    if (value === 2) newSelected.push('One', 'Two')
    if (value === 3) newSelected.push('One', 'Two', 'Three')
    setSelected(newSelected)
  }, [value])
  return (
    <div
      style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px' }}
    >
      <h3 style={{ marginRight: '10px' }}>Difficulty</h3>
      <FlexContainer>
        <ThunderboltFilled style={{ color: selected.includes('One') ? '#FFDD09' : 'lightgray', fontSize: '24px' }} onClick={() => setFieldValue('difficulty', 1)} />
        <ThunderboltFilled style={{ color: selected.includes('Two') ? '#FFDD09' : 'lightgray', fontSize: '24px' }} onClick={() => setFieldValue('difficulty', 2)} />
        <ThunderboltFilled style={{ color: selected.includes('Three') ? '#FFDD09' : 'lightgray', fontSize: '24px' }} onClick={() => setFieldValue('difficulty', 3)} />
      </FlexContainer>
    </div>
  )
}

export default DifficultyInput
