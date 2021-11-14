import styled from 'styled-components'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Divider, Input, Select, Switch } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import antdButtonColor from '../../../utils/mixins/antdButtonColor'
import colors from '../../../constants/colors'

const FlexContainer = styled.div`
    display:flex;
    justify-content: ${props => props.justify ? props.justify : 'space-between'};
    padding-bottom:20px;
    align-items: center;
    width: 100%;
    & h1, & h2, & h3, & h4, & h5, & h6, & p{
      margin: 0;
      margin-right: 10px;
    }
    ${props => props.comicForm ? `
    display: grid;
    grid-template-columns: 30% 60%;
    justify-content: space-between;
    align-items: flex-start;` : ''}
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
min-height: 55px !important;
`

const StyledTextArea = styled(TextArea)`
width:100% !important;
min-height: 100px !important;
`

const StyledDivider = styled(Divider)`
    &.ant-divider {
      height: 2px;
      margin: 0px;
      background: #b6b6b6; 
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

const ImageCard = styled.div`
width: ${props => props.isDragging ? '188px' : '90%'};
background-position: center;
background-repeat: no-repeat;
background-size: contain;
border: 1px solid;
height: ${props => props.isDragging ? '208px' : '500px'};
cursor: ${props => props.isDragging ? 'pointer' : 'inherit'};
position: relative;
${props => props.src ? `background-image: url(${props.src});
margin: 10px;
` : 'background: #D5D5D5;'}
`
const SliderContainer = styled.div`
overflow-y: auto;
height: fit-content;
background: #F6F8F7;
box-sizing: border-box;
display: grid;
grid-template-columns: 45% 45%;
justify-content: space-between;
flex: 1;
`
const CloseIcon = styled(CloseOutlined)`
position: absolute;
right: 0;
border: 1px solid;
cursor: pointer;
padding: 4px;
color: white;
background: red;
border-radius: 50px;
-webkit-transition: all 0.1s ease-in-out;
transition: all 0.1s ease-in-out;
&:hover{
  background-color: lightgray;
}
`

export {
  FlexContainer,
  StyledButton,
  StyledInput,
  StyledDivider,
  StyledSelect,
  StyledTextArea,
  StyledSwitch,
  ImageCard,
  SliderContainer,
  CloseIcon
}
