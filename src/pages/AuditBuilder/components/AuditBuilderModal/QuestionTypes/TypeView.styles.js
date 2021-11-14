import { Input } from 'antd'
import styled from 'styled-components'
import materialInput from '../../../../../utils/mixins/materialInput'

const TagBox = styled.div`
margin: 5px 10px;
padding: 5px 10px;
border-radius: 20px;
background-color: ${props => props.backgroundColor ? props.backgroundColor : '#8C61CB'};
position: relative;
font-weight: 600;
font-style: normal;
font-size: 16px;
line-height: 24px;
color: #fff;
& .anticon-close{
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
}
&:hover .anticon-close{
    visibility: visible;
}
`

const Tags = styled.div`
display: flex;
border-bottom: 2px solid #C4C4C4;
padding-bottom: 5px;
box-sizing: border-box;
flex-wrap: wrap;
`

const McqInput = styled(Input)`
${materialInput()}
`
export {
  TagBox,
  Tags,
  McqInput
}
