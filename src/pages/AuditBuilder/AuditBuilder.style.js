import styled from 'styled-components'
import { Button, Checkbox, Divider, Input, Modal, Radio, Select, Table } from 'antd'
import antdButtonColor from '../../utils/mixins/antdButtonColor'
import colors from '../../constants/colors'
import materialInput from '../../utils/mixins/materialInput'

const AuditBuilderContainer = styled.div`
    display:flex;
    justify-content: ${props => props.justify ? props.justify : 'space-between'};
    padding-bottom:10px;
    align-items: center;
    h3, p, h4{
      opacity: 0.5;
    }
    padding: ${props => props.padding ? props.padding : '10px'};
    ${props => props.modalGrid ? `
    display: grid;
    grid-template-columns: 30% 65%;
    justify-content: space-between;
    padding: 0;
    ` : ''}
    ${props => props.addAudit ? `
    padding: 10px;
    margin-top: 15px;
    background-image: repeating-linear-gradient(-38deg, #333333, #333333 10px, transparent 10px, transparent 17px, #333333 17px),
    repeating-linear-gradient(52deg, #333333, #333333 10px, transparent 10px, transparent 17px, #333333 17px),
    repeating-linear-gradient(142deg, #333333, #333333 10px, transparent 10px, transparent 17px, #333333 17px),
    repeating-linear-gradient(232deg, #333333, #333333 10px, transparent 10px, transparent 17px, #333333 17px);
    background-size: 1px 100%, 100% 1px, 1px 100% , 100% 1px;
    background-position: 0 0, 0 0, 100% 0, 0 100%;
    background-repeat: no-repeat;
    justify-content: center;
    align-items: center;
    ` : ''}
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

const StyledSelect = styled(Select)`
width: 200px;
`

const StyledInput = styled(Input)`
width:100% !important;
input{
  border-radius: 24px;
}
`

const AuditTable = styled(Table)`
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
 & tbody > tr .anticon-delete svg{
  width: 16.8px;
  height: 22.2px;
  color: ${colors.table.deleteIcon};
 }
`

const AuditTypeCheckbox = styled(Checkbox)`
  font-family: "Lato", sans-serif;
  font-size: 12px;
  position: relative;
  .ant-checkbox + span {
    padding-right: 0px;
    padding-left: 0px;
  }
  .ant-checkbox{
    position: absolute;
    top: 10px;
    left: 10px;
  }
  margin-right: 10px !important;
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: transparent;
    border-color: ${props => props.checked ? 'white' : 'black'};
    color: ${props => props.checked ? 'white' : 'black'};
  }
  .ant-checkbox-inner {
    width: 20px;
    height: 20px;
    background-color: #fff;
    border: 1px solid ${props => props.checked ? 'white' : 'black'};
  }
  .ant-checkbox-inner::after {
    left: 19.5%;
    width: 8px;
    height: 12px;
    border: 2px solid ${props => props.checked ? 'white' : 'black'} !important;
    border-top: 0 !important;
    border-left: 0 !important;
  }
  .ant-checkbox-checked::after {
    border: 1px solid ${props => props.checked ? 'white' : 'black'} !important;
  }
`

const AuditTypeFilterBox = styled.span`
padding: 0;
border: 1px solid;
height: 40px;
width: 150px;
display: flex;
align-items: center;
justify-content: center;
border-radius:22px;
background-color: ${props => props.checked === true ? '#FAAD14' : ''};
color: ${props => props.checked === true ? 'white' : 'black'};
span{
  margin-left: 10px;
}
${props => props.scoreBox ? `
border-radius: 0px;
width: 200px;
` : ''}
`

const StyledTextArea = styled(Input.TextArea)`
${materialInput()}
`


const StyledDivider = styled(Divider)`
&.ant-divider {
  height: 2em;
  margin: 0px 15px;
  background: #b6b6b6; 
}
`
const RadioGroup = styled(Radio.Group)`
.ant-radio-button-wrapper-checked {
  background: ${colors.themeColor};
  color: white;
  &:hover {
    color: white;
  }
}
`

const ScoreArea = styled.div`
width: 279px;
height: 69px;
top: 0px;
background: #F0F0F0;
border-radius: 0px 24px 0px 0px;
padding: 15px;
display: flex;
align-items: center;
`

const AuditModal = styled(Modal)`
.ant-modal-content{
  border-radius: 24px;
}
.ant-modal-header{
  padding: 0px;
  border-radius: 24px 24px 0 0;
}
.ant-modal-body{
  padding: 10px;
}
`
const AuditStatus = styled.div`
width: 12px;
height: 12px;
background: ${props => colors.status[props.status]};
border-radius: 50%;
`

const AuditTab = styled.div`
background: #FFFFFF;
border-radius: 8px;
cursor: pointer;
box-shadow: 0px 1.46867px 2.93734px rgba(0, 0, 0, 0.15);
height: 40px;
width: 115px;
display: flex;
justify-content: center;
align-items: center;
margin-right: 10px;
font-style: normal;
font-weight: bold;
font-size: 15px;
line-height: 29px;
color: #000000;
border-bottom: ${props => props.checked ? '2px solid #00ADE6' : ''};
`

export {
  AuditBuilderContainer,
  StyledButton,
  StyledInput,
  AuditTable,
  StyledDivider,
  StyledSelect,
  StyledTextArea,
  RadioGroup,
  AuditTypeCheckbox,
  AuditTypeFilterBox,
  ScoreArea,
  AuditModal,
  AuditStatus,
  AuditTab
}
