import { Button, Radio } from 'antd'
import React from 'react'
import { NAOPTION, PARTIALOPTION } from '../../../../../constants/auditQuestionConst'
import sections from '../../../../../constants/sections'

const BoolType = (props) => {
  const { moreYesNoField, moreFieldOperation } = props
  const includesNA = moreYesNoField.includes(NAOPTION)
  const includesPartial = moreYesNoField.includes(PARTIALOPTION)
  return (
    <div>
      {
        ['Yes', 'No', ...moreYesNoField].map((option, ind) => (
          <label htmlFor='trueOption' key={option} style={{ margin: '10px 0', display: 'block' }} >
            <Radio id='trueOption' value={option === 'True'} />{' '} <strong>{sections[ind]}</strong>. {option}
          </label>
        ))
      }
      <div>
        <Button icon={includesNA ? 'minus' : 'plus'} type={includesNA ? 'danger' : 'primary'} onClick={() => moreFieldOperation(NAOPTION)} />
        <span style={{ marginLeft: '10px' }}>{includesNA ? 'Remove' : 'Add'} NA</span>
      </div>
      <div style={{ marginTop: '10px' }}>
        <Button icon={includesPartial ? 'minus' : 'plus'} type={includesPartial ? 'danger' : 'primary'} onClick={() => moreFieldOperation(PARTIALOPTION)} />
        <span style={{ marginLeft: '10px' }}>{includesPartial ? 'Remove' : 'Add'} Partially Correct</span>
      </div>
    </div>
  )
}

export default BoolType
