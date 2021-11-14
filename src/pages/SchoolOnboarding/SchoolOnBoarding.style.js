import styled from 'styled-components'
import { Button, Checkbox, Divider, Input, Radio, Select, Table } from 'antd'
import {
  CloseOutlined, CopyOutlined, LeftOutlined,
  LinkOutlined, SettingOutlined, UserOutlined
} from '@ant-design/icons'

const gradeStyle = `
  border-radius: 4px;
  border: 1px solid #A8A7A7;
  padding:  1.041vw;
  margin: 2vw 0;
  flex-direction: column;
  & > div{
    width: 100%;
  }
  & h1{
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 1.5vw;
    line-height: 1.45vw;
    color: #000000;
  }
  & h3{
     margin : 0;
     font-family: Lato;
     font-style: normal;
     font-weight: normal;
     font-size: 1.041vw;
     line-height: 1.51vw;
     color: #403F3F;
    }
  `

const sectionStyle = `
background: linear-gradient(180deg,rgba(43,77,119,0.17) 0%,rgba(25,45,77,0.3) 99.99%,rgba(18,43,74,0) 100%);
filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
color: white;
margin-bottom: 1vw;
`

const campaignStyle = `
background-image: repeating-linear-gradient(-38deg, #333333, #333333 10px, transparent 10px, transparent 17px, #333333 17px),
repeating-linear-gradient(52deg, #333333, #333333 10px, transparent 10px, transparent 17px, #333333 17px),
repeating-linear-gradient(142deg, #333333, #333333 10px, transparent 10px, transparent 17px, #333333 17px),
repeating-linear-gradient(232deg, #333333, #333333 10px, transparent 10px, transparent 17px, #333333 17px);
background-size: 1px 100%, 100% 1px, 1px 100% , 100% 1px;
background-position: 0 0, 0 0, 100% 0, 0 100%;
background-repeat: no-repeat;
padding: 0.8vw;
margin: 2vw 0;
`
const campaigns = `
border: 1px solid #A8A7A7;
padding: 0.8vw;
margin: 2vw 0;
& h3{
font-family: Lato;
font-style: normal;
font-weight: normal;
font-size:  0.83vw;
line-height: 0.9375vw;
color: #000000;
margin: 0;
}
`

const StyledButton = styled(Button)`
  &&& {
    ${props => props.type === 'primary' ? '#00ADE6' : ''}
    color:white;
  }
  &&& {
    ${props => props.type === 'default' ? 'background-color: white;color: black;' : ''}
  }
  box-sizing: content-box;
  margin-right: 8px;
  width: fit-content !important;
  height: 1.92vw !important;
  font-size: 0.8333vw !important;
  line-height:  120% !important;
  & .shareIcon{
    font-size: 20px;
    margin-top: 1px;
  }
`
const FlexContainer = styled.div`
display: flex;
align-items: center;
padding: ${props => props.noPadding ? '0' : '0.625vw'};
justify-content: ${props => props.justify ? props.justify : 'space-between'};
& h1, h2, p{
  margin: 0;
}
${props => props.WhiteBoxes ? 'width: 100%; max-width: 700px; margin: 10px auto;' : ''}
${props => props.buttonGroup ? 'border-radius: 4px;border: .1vw solid #A8A7A7;margin:0; margin: 1vw 0 2.5vw 0; height: 3.125vw;' : ''}
${props => props.grade ? gradeStyle : ''}
${props => props.section ? sectionStyle : ''}
  & .studentTab__selectTitle{
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 1.302vw;
    margin-right: 1.77vw;
    line-height: 120%;
    color: #000000;
  }
  ${props => props.createCampaign || props.createGrade ? campaignStyle : ''}
  ${props => props.campaigns ? campaigns : ''}

  & .campaign__ChooseGrade{
  font-family: Lato;
  font-style: normal;
  font-weight: normal;
  font-size: 1.302vw;
  line-height: 120%;
  color: #000000;
  }
  & label.campaign__ChooseGrade{ cursor: pointer; }
  & .campaign__clearSelection{
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 1.145vw;
    line-height: 120%;
    text-decoration-line: underline;
    cursor:pointer;
    color: #D34B57;
  }
  & .gradeCard__sectionButton{
    position: relative;
    display: inline-block;
    & .anticon-close{
    position: absolute;
    height: 1.4vw;
    width: 1.4vw;
    visibility: hidden;
    top: -0.46875vw;
    right: 1.302vw;
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
  }
  & .campaign__batchCount{
    align-self: flex-end;
    padding: 0 10px;
  }
`
const StyledDivider = styled(Divider)`
    &.ant-divider {
      height: 1px;
      background: #b6b6b6;
      margin: 0;
    }
`
const SchoolDetails = styled.div`
margin-bottom: 1.5vw;
padding:1.5vw;
background-color: #E6F7FD;
min-height: 11.197vw;
& .schoolOnBoarding___schoolName h1{
  font-family: Lato;
  font-style: normal;
  font-weight: normal;
  font-size:  1.041vw;
  line-height: 0.9375vw;
  color: #403F3F;
  opacity: 0.5;
  margin-bottom: 10px;
}
`
const StyledSelect = styled(Select)`
width:23.125vw;
& .ant-select-selection{
  height: 3.02vw;
  border-radius: 4px;
  border: 0.5px solid #000000;
}
& .ant-select-selection__rendered{
  height: 100%;
  display: flex;
  align-items: center;
}
& .ant-select-selection-selected-value{
  font-size:  1.041vw;
  line-height: 1.25vw;
  color: black;
}
& input{
  font-size:  1.041vw !important;
  line-height: 1.25vw !important;
  color: black;
}
& .ant-select-arrow{
  right: ${props => props.selectCampaign ? '1.56vw' : '11px'};
}
& .ant-select-arrow-icon{
  font-size: 1.0546875vw;
  color: black;
}
`
const WhiteBox = styled.div`
height:6.25vw;
width:6.25vw;
word-break: break-all;
border-radius: 8px;
border: 1px solid #A8A7A7;
background-color: white;
display: flex;
justify-content: center;
align-items: center;
text-align: center;
flex-direction: column;
padding: 0.52vw;
box-sizing: border-box;
font-family: Lato;
color: #000000;
h1{
  font-size: 1.875vw;
  line-height: 0.9375vw;
  margin-bottom: 10px;
}
span{
  font-size: 0.83vw;
  line-height: 0.9375vw;
}
h2{
  font-weight: 700;
  font-size: 1.3vw;
}
h3{
  margin-bottom: 0;
  font-weight:700;
  font-size: 1vw;
}
`
const SectionButton = styled(Button)`
  &&& {
    ${props => props.type === 'primary' ? `
    background: #00ADE6 !important;
    border: 1px solid #00ADE6 !important;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 1.041vw;
    line-height: 1.51vw;
    color: #FFFFFF;
    ` : ''}
    color:white;
  }
  &&& {
    ${props => props.type === 'default' ? `
    border: 1px solid #00ADE6;
    box-sizing: border-box;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 1.041vw;
    line-height: 1.51vw;
    color: #00ADE6;
    ` : ''}
  }
  margin-right: 8px;
  width: ${props => props.campaign ? '100% !important' : 'fit-content !important'};
  height: 2.55vw !important;
  font-size: 1.041vw !important;
`
const AddButton = styled(Button)`
  border-radius: 999px !important;
  background-color: white !important;
  color: black !important;
  height: 2.08vw !important;
  width: 2.08vw !important;
  font-size: 0.93vw !important;
  font-weight: 700 !important;
`

const AddCampaign = styled.div`
position: relative;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
border: 1px solid #A8A7A7;
min-height: 14.375vw;
`

const StyledInput = styled(Input.TextArea)`
width:100% !important;
min-height: 55px !important;
`

const MDTable = styled(Table)`
& .ant-table-body{
  display: flex;
  justify-content: center;
}

& .ant-table-content{
  color: #122b4a;
  background-color: #ffffff;
  border-radius:6px;
  
}
 & .ant-table-thead > tr > th{
  background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%), rgba(18, 43, 74, 0.17);
  font-weight: 600;
  color: #122b4a;
  font-family: Lato;
  font-style: normal;
  font-weight: 400;
  font-size: 1.041vw;
  line-height: 1.51vw;
  color: #000000;
 }
 & tbody > tr{
  background-color: rgba(228, 228, 228, 0.35);
  font-family: Lato;
  font-style: normal;
  font-weight: 400;
  font-size: 0.93vw;
  line-height: 1.14vw;
  color: #504F4F;
 }
 & .ant-table-content .ant-table-body .ant-table-tbody .antdTable-child-row > td {
   padding: 8px 0px;
 }
`

const BackIcon = styled(LeftOutlined)`
position: absolute;
left: 10px;
font-size: 1.25vw;
cursor: pointer;
padding: 10px;
border-radius: 50px;
transition: all 0.1s ease-in-out;
top: 10px;
&:hover{
  background-color: lightgray;
}

`
const SchoolInput = styled.div`
width:23.125vw;
height: 3.02vw;
border-radius: 4px;
border: 0.5px solid #000000;
display: flex;
align-items: center;
font-size:  1.041vw;
line-height: 1.25vw;
color: black;
padding: 0.78vw;
& input{
  font-size:  1.041vw !important;
  line-height: 1.25vw !important;
  color: black;
  outline: none;
  border: none;
  flex: 0.95;
}
& .anticon{
  font-size: 1.2vw;
  color: black;
}
& .campaign__link{
  flex: 0.95;
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 1.041vw;
  line-height: 1.25vw;
  text-decoration-line: underline;
  color: #00ADE6;
}
`
const LinkIcon = styled(LinkOutlined)`
font-size: 1vw;
cursor: pointer;
transition: all 0.1s ease-in-out;
&:hover{
  background-color: lightgray;
}
`
const SettingIcon = styled(SettingOutlined)`
font-size: 1.3vw;
cursor: pointer;
padding: 6px;
border-radius: 50px;
color: #00ADE6;
transition: all 0.1s ease-in-out;
&:hover{
  background-color: lightgray;
}
`
const CopyIcon = styled(CopyOutlined)`
cursor: pointer;
padding: 10px;
border-radius: 50px;
transition: all 0.1s ease-in-out;
&:hover{
  background-color: lightgray;
}`

const GradeButton = styled(Button)`
  &&& {
    ${props => props.type === 'primary' ? 'background-color: #80D6F3 !important; border: none !important;' : ''}
    color:white;
  }
  &&& {
    ${props => props.type === 'default' ? 'background-color: white;color: black;' : ''}
  }
  box-sizing: content-box;
  margin-right: 8px;
  width: fit-content !important;
  height: 1.92vw !important;
  font-size: 0.8333vw !important;
  line-height:  120% !important;
`

const StyledCheckbox = styled(Checkbox)`
margin-right: 10px !important;
.ant-checkbox-checked .ant-checkbox-inner {
    background-color: transparent;
    border-color: black;
    color: black;
}
.ant-checkbox-inner {
    width: 1.40vw;
    height: 1.40vw;
    background-color: #fff;
    border: 1px solid black;
}
.ant-checkbox-inner::after {
    left: 19.5%;
    width: 0.59vw;
    height: 0.851vw;
    border: 2px solid black !important;
    border-top: 0 !important;
    border-left: 0 !important;
}
.ant-checkbox-checked::after {
    border: 1px solid black !important;
}
`

const StyledRadio = styled(Radio)`
margin-right: 10px !important;
.ant-radio-inner {
    width: 1.40vw;
    height: 1.40vw;
    background-color: #fff;
    border: 1px solid black;
}
.ant-radio-inner::after {
  top: 0.19vw;
  left: 0.19vw;
  display: table;
  width: 70%;
  height: 70%;
  background-color: black;
  border-radius: 999px;
}
.ant-radio-checked .ant-radio-inner {
  border-color: black;
}
.ant-radio-checked::after {
  border: 1px solid black !important;
}
`

const CloseIcon = styled(CloseOutlined)`
position: absolute;
right: 20px;
top: 20px;
cursor: pointer;
padding: 10px;
border-radius: 50px;
transition: all 0.1s ease-in-out;
&:hover{
  background-color: lightgray;
}
`

const AddGradeButton = styled(Button)`
  &&& {
    ${props => props.type === 'primary' ? 'background-color: #00ADE6;color: white;' : ''}
  }
   &&& {
    ${props => props.type === 'selected' ? 'background-color: lightgray; color: black;' : ''}
  }
`

const GradeBox = styled.div`
border: 0.5px solid #000000;
box-sizing: border-box;
border-radius: 4px;
font-family: Lato;
height: 3.02vw;
width: 3.33vw;
font-style: italic;
font-weight: normal;
font-size: 20px;
line-height: 24px;
color: #000000;
opacity: 0.5;
display: flex;
justify-content: center;
align-items: center;
margin-left: 20px;
`

const SectionSelect = styled(StyledSelect)`
width: 70px;
height: 100%;
.ant-select-selection {
  border: none !important;
}
.ant-select-focused{
  border: none !important;
}
& .ant-select-selection{
  height: 100%;
  border-radius: 4px;
  border: 0.5px solid #000000;
}
`

const SectionSelectDiv = styled.div`
width:fit-content;
height: 2.7vw;
border-radius: 4px;
border: 0.5px solid #000000;
display: inline-flex;
align-items: center;
font-size:  1.041vw;
line-height: 1.25vw;
padding:0 8px;
color: black;
& input{
  font-size:  1.041vw !important;
  line-height: 1.25vw !important;
  color: black;
  outline: none;
  border: none;
  flex: 0.8;
}
& .anticon{
  font-size: 1.2vw;
  color: black;
}
h4{
  margin:0;
}
.ant-btn-icon-only {
  margin-left: 6px;
    width: 32px !important;
    height: 32px !important;
    padding: 0;
    font-size: 16px;
    border-radius: 63px;
}
`

const CampaignBox = styled.div`
width: 90%;
height: 16.45vw;
display: flex;
margin: 1.04vw;
padding: 0.6vw;
${props => props.createCampaign ? `
background-image: repeating-linear-gradient(-38deg, #333333, #333333 10px, transparent 10px, transparent 17px, #333333 17px),
repeating-linear-gradient(52deg, #333333, #333333 10px, transparent 10px, transparent 17px, #333333 17px),
repeating-linear-gradient(142deg, #333333, #333333 10px, transparent 10px, transparent 17px, #333333 17px),
repeating-linear-gradient(232deg, #333333, #333333 10px, transparent 10px, transparent 17px, #333333 17px);
background-size: 1px 100%, 100% 1px, 1px 100% , 100% 1px;
background-position: 0 0, 0 0, 100% 0, 0 100%;
background-repeat: no-repeat;
justify-content: center;
align-items: center;
` : `
border: 1px solid black;
&> div{
  width: 50%;
}
`}
& .campaign__name{
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 1.145vw;
  line-height: 18px;
  color: #000000;
  margin: 0;
  word-break: break-all;
}
& .campaign__uploadButton{
  background-color: transparent;
  border: none;
  outline: none;
  color: white;
  cursor: pointer;
}
`

const StudentModalBox = styled.div`
border: 1px solid #000000;
box-sizing: border-box;
border-radius: 3.99213px;
box-sizing: border-box;
font-family: Lato;
height: 3.02vw;
font-weight: normal;
font-size: 20px;
line-height: 24px;
color: #000000;
display: flex;
justify-content: center;
align-items: center;
margin-left: 20px;
padding: 15px;
display:flex;
justify-content:space-between;
h4{
  margin: 0;
  font-size:1.302vw;
}
`
const UserIcon = styled(UserOutlined)`
padding: 4px;
border-radius: 50px;
border: 2px solid white;
`
const BatchName = styled.div`
font-family: Lato;
font-style: normal;
font-weight: normal;
font-size: 0.93vw;
line-height: 22px;
text-decoration-line: underline;
color: #00ADE6;
cursor: pointer;
`

const BatchSection = styled.div`
position: relative;
`

const BatchActionButton = styled.div`
font-size: 1.2vw;
font-weight: 700;
${props => props.selected ? 'border-bottom: 2px solid #00ADE6; color: #00ADE6;' : ''}
padding: 1vw;
padding-bottom: 0.3vw;
cursor: pointer;
`
const Error = styled.div`
width: 100%;
font-size: 0.9vw;
color: red;
`

const SlotsInfo = styled.div`
background: ${props => props.bgColor};
box-sizing: border-box;
border-radius: 5px;
display: flex;
justify-content: center;
align-items: center;
width: 60%;
`

const ProfileCard = styled.div`
width: 429px;
height: 400px;
background: #FBFBFB;
padding: 15px;
`


export {
  StyledButton,
  StyledInput,
  MDTable,
  FlexContainer,
  SchoolDetails,
  WhiteBox,
  StyledSelect,
  StyledDivider,
  SectionButton,
  AddButton,
  AddCampaign,
  BackIcon,
  SchoolInput,
  LinkIcon,
  SettingIcon,
  CopyIcon,
  GradeButton,
  StyledCheckbox,
  StyledRadio,
  CloseIcon,
  AddGradeButton,
  GradeBox,
  SectionSelect,
  SectionSelectDiv,
  CampaignBox,
  StudentModalBox,
  UserIcon,
  BatchName,
  BatchSection,
  BatchActionButton,
  Error,
  SlotsInfo,
  ProfileCard
}
