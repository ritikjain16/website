import styled from 'styled-components'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Divider, Input, Select, Switch, Table } from 'antd'
import antdButtonColor from '../../utils/mixins/antdButtonColor'
import colors from '../../constants/colors'

const TopContainer = styled.div`
    display:flex;
    justify-content: ${props => props.justify ? props.justify : 'space-between'};
    padding-bottom:20px;
    align-items: center;
    & h1, & h2, & h3, & h4, & h5, & h6, & p{
      margin: 0;
      margin-right: 10px;
    }
`
const StyledButton = styled(Button)`
  &&& {
    ${props => props.type === 'primary' ? '#1890ff' : antdButtonColor(colors.subThemeColor)}
    color:white;
  }
`
const StyledTitle = styled.h2`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  color: white;
  font-weight: 400;
  position: absolute;
  top: 13px;
  left: 240px;
`

const StyledSelect = styled(Select)`
width: 200px;
`

const StyledInput = styled(Input.TextArea)`
width:100% !important;
min-height: 55px !important;
`

const MDTable = styled(Table)`
& .ant-table-content{
  color: #122b4a;
  background-color: #ffffff;
  border-radius:6px;
  
}
 & .ant-table-thead > tr > th{
  background-color: rgba(18, 43, 74, 0.17);
  margin: 0 0 78px 1px !important;
  font-weight: 600;
  color: #122b4a;
 }
 & tbody > tr{
   background-color: rgba(228, 228, 228, 0.35);
 }
 & .ant-table-content .ant-table-body .ant-table-tbody .antdTable-child-row > td {
   padding: 8px 0px;
 }
 & tbody > tr > td:nth-of-type(3){
   min-width: fit-content;
 }
 & tbody > tr .anticon-delete svg{
  width: 16.8px;
  height: 22.2px;
  color: ${colors.table.deleteIcon};
 }
`

const StyledSwitch = styled(Switch)`
  &.ant-switch {
    background-color: #fff;
    border: 1px solid ${(props) => props.bgcolor};
    margin: 0px 10px;
  }  
  &.ant-switch::after {
    background-color: ${(props) => props.bgcolor};
  }
`

const StyledTextArea = styled(Input.TextArea)`
width:100% !important;
min-height: 55px !important;
`


const StyledDivider = styled(Divider)`
    &.ant-divider {
      height: 2em;
      margin: 0px 15px;
      background: #b6b6b6; 
    }
`

const StyledModal = styled.div`
position: relative;
`

const StyledName = styled.div`
color: #1890ff;
cursor: pointer;
`

const CloseIcon = styled(CloseOutlined)`
position: absolute;
right: 20px;
top:10px;
cursor: pointer;
padding: 10px;
border-radius: 50px;
transition: all 0.1s ease-in-out;
&:hover{
  background-color: lightgray;
}
`

const ComponentPool = styled.div`
background: #FFFFFF;
border: 2px dashed lightgray;
box-sizing: border-box;
border-radius: 2px;
padding: 15px;
display: flex;
align-items: center;
flex-wrap: wrap;
width: 46.19vw;
margin-left: 20px;
`

const ComponentTags = styled.div`
display: flex;
justify-content: center;
align-items: center;
padding: 10px;
background: #E6F7FF;
border: 1px dashed #A8A7A7;
box-sizing: border-box;
border-radius: 30px;
cursor: pointer;
${props => props.selected ? 'background-color: lightblue !important;' : ''}
margin: 10px;`

const CompoContents = styled.div`
border-bottom: 2px solid #A8A7A7;
display: flex;
align-items: center;
`
const ComponentTab = styled.div`
display: flex;
justify-content: center;
align-items: center;
padding: 10px;
box-sizing: border-box;
cursor: pointer;
position: relative;
border-bottom: 5px solid #A8A7A7;
margin: 0 10px;
${props => props.selected ? `
color: #00ADE6;
border-bottom: 5px solid #00ADE6;
` : ''}
& .anticon-close{
  position: absolute;
  height: 1.4vw;
  width: 1.4vw;
  visibility: hidden;
  top: -10px;
  right: 0;
  color: black;
  background-color: #D34B57;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  border: 1.42105px solid #504F4F;
}
&:hover .anticon-close{
  visibility: visible;
}
`

const TableTab = styled.div`
display: flex;
justify-content: center;
align-items: center;
padding: 11px;
height: 47px;
background: #E6F7FF;
border: 1px dashed #A8A7A7;
box-sizing: border-box;
border-radius: 30px;
margin: 0 10px;
`

const LoView = styled.div`
display: grid;
grid-template-columns:28% 28% 28%;
margin: 15px 0;
justify-content: space-around;
overflow-y: auto;
height: 500px;
background: lightgray;
border: 1px dashed #282828;
position: relative;
`

export {
  TopContainer,
  StyledButton,
  StyledInput,
  MDTable,
  StyledSwitch,
  StyledDivider,
  StyledSelect,
  StyledTextArea,
  StyledTitle,
  StyledModal,
  CloseIcon,
  ComponentPool,
  ComponentTags,
  CompoContents,
  ComponentTab,
  TableTab,
  LoView,
  StyledName
}
