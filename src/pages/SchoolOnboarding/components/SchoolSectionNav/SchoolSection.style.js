import styled from 'styled-components'
import { Radio } from 'antd'

const Main = styled.div`
height: 102%;
  & .ant-radio-group{
    display: flex;
    height: 101%;
}
`

const RadioGroup = styled(Radio.Group)`
& .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):first-child{
  border: 1px solid #A8A7A7 !important;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25) !important;
}
& .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled){
  border: 1px solid #A8A7A7 !important;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25) !important;
}
& .ant-radio-button-wrapper{
    background-color: lightgray;
    width: 9.32vw;
    padding: 0.52vw;
    height: 100%;
    display: flex;
    justify-content:center;
    align-items:center;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    color: #000000;
    font-size: 1.30vw;
    line-height: 120%;
    &:hover{
        color: #000000 !important;
    }
}
  .ant-radio-button-wrapper-checked {
    color: black !important;
    &:hover {
      color: black !important;
    }
    background: #FFFFFF !important;
    border: 1px solid #A8A7A7 !important;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25) !important;
    border-radius: 4px 0px 0px 4px !important;
  }
`

Main.RadioGroup = RadioGroup
export default Main
