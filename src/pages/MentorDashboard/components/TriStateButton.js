import React, { Component } from 'react'
import styled from 'styled-components'

/**
 * Example Usage
    <TriStateButton
        values={[
            { val: 'x', label: 'X', icon: <Cross />, bg: '#D34B57' },
            { val: '-', label: '--', icon: <Neu />, bg: '#8C61CB' },
            { val: 'ok', label: '\\/', icon: <Check />, bg: '#01AA93' }
        ]}
        selected='x'
    />
 */

const TriStateSwitch = styled.div`
  font-family: 'Inter';
  position: relative;
  height: 32px;
  width: 90px;
  background-color: #eeeeee;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 17px;
  opacity: ${props => props.disabled ? 0.5 : 1};
  cursor: ${props => props.disabled ? 'no-drop' : ''};
  /* box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.1) */
`

const TriStateSwitchRadio = styled.input`
  display: none;
`

const TriStateSwitchSelection = styled.span`
  display: block;
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 0px;
  width: 30px;
  height: 30px;
  border-radius: 17px;
  transition: left 0.25s ease-out;
`

const TriStateSwitchLabel = styled.label`
  position: relative;
  z-index: 2;
  float: left;
  width: 30px;
  display: flex;
  font-weight: 700;
  align-items: center;
  transition: all 0.25s ease-out;
  justify-content: center;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
  cursor: pointer;

  svg {
    transition: all 0.25s ease-out;
    fill: ${props => props.active ? '#FFF' : '#5a5a5a'};
  }

`

const ClickableLabel = ({ icon, keyVal, onChange, id, selected }) => (
  <TriStateSwitchLabel
    active={selected === keyVal}
    onClick={() => onChange(keyVal)}
    className={id}
  >
    {icon}
  </TriStateSwitchLabel>
)

const ConcealedRadio = ({ value, selected }) => (
  <TriStateSwitchRadio type='radio' name='switch' checked={selected === value} />
)

export default class TriStateButton extends Component {
  handleChange = (val) => {
    if (this.props.handleChange) {
      this.props.handleChange(val)
    }
  }

  getIndexof = () => this.props.values.findIndex((el) => el.val === this.props.selected)

  getBgColor = () => this.props.values[this.getIndexof()] ? this.props.values[this.getIndexof()].bg : ''

  selectionStyle = () => ({
    left: `${(this.getIndexof() / 3) * 100}%`,
    background: `${this.getBgColor()}`
  })

  render() {
    const { selected, disabled } = this.props
    return (
      <TriStateSwitch disabled={disabled}>
        {this.props.values.map((el) => (
          <span style={{ pointerEvents: `${disabled ? 'none' : ''}` }}>
            <ConcealedRadio value={el.val} selected={selected} />
            <ClickableLabel
              selected={selected}
              label={el.label}
              icon={el.icon}
              keyVal={el.val}
              onChange={this.handleChange}
            />
          </span>
        ))}
        <TriStateSwitchSelection style={this.selectionStyle()} />
      </TriStateSwitch>
    )
  }
}
