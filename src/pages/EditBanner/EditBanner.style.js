import styled from 'styled-components'
import { Button, Input } from 'antd'
import colors from '../../constants/colors'

const EditBannerStyle = styled.div`
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
`
const StyledInput = styled(Input)`
width:100% !important;
`

const Container = styled.div`
  width: 100%;
  border-radius:3px;
  padding:1rem;
  box-shadow:0 8px 32px 0 rgba(0, 0, 0, 0.25);
  & h3{
    font-size: 14px;
    font-weight: 500;
}
`
const StyledRow = styled.div`
display:grid;
margin-right: 10px;
grid-gap:15px;
grid-template-columns:${props => props.right ? '24% 24% 24% 24%' : '40% 60%'};
grid-template-columns:${props => props.image && '15% 80%'};
align-items:center;
align-items:${props => props.right && 'flex-start'};
& .ant-calendar-picker{
  width: 100%;
}
`

const TopContainer = styled.div`
  display: grid;
  grid-template-columns: 20% 80%;
  grid-gap: 15px;
  padding-bottom: 20px;
`
const StyledButton = styled(Button)`
  &&& {
    margin: 2rem;
    color:${props => props.icon === 'file' ? 'blue' : 'green'};
    border: 2px solid ${props => props.icon === 'file' ? 'blue' : 'green'};
  }
`
const StyledLabel = styled.label`
padding: 10px;
  border: 2px solid black;
  cursor: pointer;
  display: flex;
  align-items:center;
  position: relative;
`
const CloseImage = styled.div`
  position: absolute;
  cursor:pointer;
  top: -10px;
  left: -10px;
  z-index: 10;
  display: flex;
  font-size: 18px;
  justify-content: center;
  align-items: center;
  font-weight: 800;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: white;
  color: ${colors.subThemeColor};
  box-shadow: -5px 4px 25px 12px rgba(46,61,73,0.1);
  transition: 0.2s all ease-in-out;
  &:hover {
    background: #f3f3f3;
  }
`

const Banner = styled.div`
  background-size: cover;
  position: relative;
  background-position: top center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
.landing-page-header-limitedText {
  margin-bottom: 0;
  position:absolute;
  bottom: 5px;
  right: 10px;
  font-family: Lato;
}
.landing-page-header-bannerText {
  font-family: Lato;
  text-align: center;
  position: relative;
}
.landing-page-header-gradientText {
  margin: 0 8px;
  background-size: 100%;
  font-weight: 900;
  background-repeat: repeat;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
  border: 1px solid black;
  margin: 0 auto;
  margin-bottom: 20px;
  & > span{
    display: flex;
    justify-content:center;
    align-items:center;
    height:inherit;
  }
  & > span > h4{
    margin-bottom: 0;
  }
    & > span > h2{
    margin-bottom: 0;
  }
  & > div{
    position: absolute;
    top: 0;
    left: 0;
  }
`

EditBannerStyle.StyledRow = StyledRow
EditBannerStyle.TopContainer = TopContainer
EditBannerStyle.Container = Container
EditBannerStyle.StyledButton = StyledButton
EditBannerStyle.StyledInput = StyledInput
EditBannerStyle.StyledLabel = StyledLabel
EditBannerStyle.CloseImage = CloseImage
EditBannerStyle.Banner = Banner

export default EditBannerStyle
