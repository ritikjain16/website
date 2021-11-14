import styled from 'styled-components'
import { Checkbox } from 'antd'

const SessionTimeModalStyle = styled.div`
  margin-top: 0 auto;
  display: flex;
  justify-content: ${props => !(props.shouldAlignLeft) ? 'center' : 'left'};
  align-items: center;
  flex-flow: row wrap;
  width: 100%;
  height: 100%;
`

const StyledCheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  min-width: 200px;
  margin-top: ${props => !(props.isFirst) ? '20px' : '0px'};
  margin-left: ${props => props.isLeft ? '55px' : '0px'};
`

const StyledCheckBox = styled(Checkbox)`
`

const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #757575;
  margin-left: 10px;
  overflow: hidden;
  text-align: center;
  flex-wrap: wrap;
`

const DateTabletContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
`
const DateTablet = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80px;
    border-radius: 4px;
    border: ${props => props.selected ? '2px solid #527cb5' : '2px solid #574e52'};
    opacity: ${props => props.selected ? '1' : '0.6'};
    position: relative;
    margin-left: 5px;
    margin-top: 4px;
`

const DateText = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.colored ? '#527cb5' : '#574e52'};
    font-size: 16px !important;
    font-family: Nunito;
    font-weight: 500;
    &:hover {
        cursor: default;
    }
`

const Selected = styled.div`
    position: absolute;
    border-radius: 4px;
    opacity: ${props => props.selected ? '0.2' : '0'};
    height: 100%;
    width: 100%;
    background-color: #527cb5;
    &:hover {
        cursor: default;
        opacity: 0.18;
    }
`

const SlotContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: ${props => props.justifyContent ? props.justifyContent : 'center'};
    align-items: center;
    flex-wrap: wrap;
`

const Slot = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 140px;
    height: 53px;
    font-family: Nunito;
    font-size: 16px;
    border-radius: 28px;
    color: ${props => !props.selected ? '#0fbde7' : '#fff'};
    border: ${props => !props.selected ? 'solid 1px #27d6e9' : ''};
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    ${props => props.selected ? 'background-image: linear-gradient(to bottom, #00ade6, #34e4ea);' : ''};
    ${props => props.isBooked ? 'background-color: #d9f2f2' : ''};
    margin-top: ${props => !(props.isFirst) ? '20px' : '0px'};
    margin-left: ${props => !props.isLeft ? '10px' : '0px'};
    &:hover {
        cursor: default;
        box-shadow: ${props => !props.selected ? '0 3px 6px 0 rgba(0, 0, 0, 0.35)' : '0 3px 6px 0 rgba(0, 0, 0, 0.25)'};
        opacity: 0.8;
    }
`

SessionTimeModalStyle.StyledCheckbox = StyledCheckBox
SessionTimeModalStyle.StyledCheckboxContainer = StyledCheckboxContainer
SessionTimeModalStyle.Item = Item
SessionTimeModalStyle.DateTabletContainer = DateTabletContainer
SessionTimeModalStyle.DateTablet = DateTablet
SessionTimeModalStyle.DateText = DateText
SessionTimeModalStyle.Selected = Selected
SessionTimeModalStyle.SlotContainer = SlotContainer
SessionTimeModalStyle.Slot = Slot

export default SessionTimeModalStyle
