import styled from 'styled-components'
import { Checkbox, Icon, Radio, Rate } from 'antd'

const MentorAuditStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
`

const StyledCheckbox = styled(Checkbox)`
    & .ant-checkbox-checked .ant-checkbox-inner{
        border-color: #6fcf97;
        background: #6fcf97;
    }
    margin-left: 0px !important;
`

const ViewOnly = styled.div`
    border-radius: 4px;
    box-shadow: none;
    box-sizing: border-box;
    font-weight: 550;
    font-size: 12px;
    letter-spacing: 0.25px;
    background: orange;
    color: #fff;
    padding: .2rem .8rem;
    place-items: center;
    display: flex;
    text-align: center;
    margin: 6px 0 6px 0px;
    user-select: none;
    width: max-content;
`

const StyledRadio = styled(Radio)`
  & .ant-radio-inner{
      border-radius: 3px;
  }

  & .ant-radio-checked .ant-radio-inner {
      border-color: ${props => props.color};
      background: ${props => props.color};
  }

  & .ant-radio-checked .ant-radio-inner::after {
    position: absolute;
    display: table;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    -webkit-transform: rotate(45deg) scale(1) translate(-50%, -50%);
    -ms-transform: rotate(45deg) scale(1) translate(-50%, -50%);
    transform: rotate(45deg) scale(1) translate(-50%, -50%);
    opacity: 1;
    -webkit-transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
    transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
    content: ' ';
    }

  & .ant-radio-inner::after{
      top: 50%;
    left: 22%;
    display: table;
    width: 5.71428571px;
    height: 9.14285714px;
    border: 2px solid #fff;
    border-radius: 1px;
    border-top: 0;
    border-left: 0;
    background-color: ${props => props.color};
    -webkit-transform: rotate(45deg) scale(0) translate(-50%, -50%);
    -ms-transform: rotate(45deg) scale(0) translate(-50%, -50%);
    transform: rotate(45deg) scale(0) translate(-50%, -50%);
    opacity: 0;
    -webkit-transition: all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6), opacity 0.1s;
    transition: all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6), opacity 0.1s;
    content: ' ';
  }
`

const CloseIcon = styled(Icon)`
position: absolute;
height: 15px;
width: 15px;
visibility: hidden;
top: -5px;
right: 0px;
color: white;
background-color: #D34B57;
display: flex;
justify-content: center;
align-items: center;
border-radius: 100px;
font-size: 10px;
cursor: pointer;
&:hover{
  visibility: visible;
}
`

const StyledRating = styled(Rate)`
padding-bottom: 2px !important;
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
&:nth-of-type(2){
  margin: 0 15px;
}
font-style: normal;
font-weight: bold;
font-size: 16px;
line-height: 29px;
color: #000000;
border-bottom: ${props => props.checked ? '2px solid #00ADE6' : ''};
`

MentorAuditStyle.StyledRadio = StyledRadio
MentorAuditStyle.StyledCheckbox = StyledCheckbox
MentorAuditStyle.ViewOnly = ViewOnly
MentorAuditStyle.CloseIcon = CloseIcon
MentorAuditStyle.StyledRating = StyledRating
MentorAuditStyle.AuditTab = AuditTab

export default MentorAuditStyle
