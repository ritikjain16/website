import styled from 'styled-components'
import { Input, Table, Divider, Select, Button } from 'antd'
import antdButtonColor from '../../utils/mixins/antdButtonColor'
import colors from '../../constants/colors'

const BannerStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
`

const TopContainer = styled.div`
    display:flex;
    justify-content:space-between;
    padding-bottom:20px;
`
const StyledSelect = styled(Select)`
    min-width: 200px;
`
const StyledOption = styled(Select.Option)``

const StyledInput = styled(Input)`
    min-width: 200px;
    display: flex;
    align-items: left;
    border-width: 0 0 2px 0 !important;
`

const SearchIcon = styled.div`
    opacity: 0.5;
    margin-top: 8px;
`

const StyledDivider = styled(Divider)`
    &.ant-divider {
      height: 2em;
      margin: 0px 15px;
      background: #b6b6b6;
    }
`

const statusIcon = styled.span`
  width: 15px;
  height: 15px;
  margin: 0 10px;
  background-color: ${props => props.color};
  border-radius: 50%;
`

const MDTable = styled(Table)`
`

const PaginationContainer = styled.div`
display:flex;
justify-content:space-between;
align-items:center;
width:100%;
padding:10px 20px 30px 10px;
`


const StyledButton = styled(Button)`
  &&& {
    ${antdButtonColor(colors.subThemeColor)}
  }
`
const Image = styled.img`
  height: 55px;
  width: 100px;
`
const PreviewButton = styled(Button)`
border:none !important;
background-color: transparent !important;
& .anticon.anticon-eye-invisible{
  font-size: 24px;
  color: gray;
}
& .anticon.anticon-eye{
  font-size:24px;
  color: #37bee9;
}
`
const LivePreview = styled.div`
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
  margin: 10px auto;
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

BannerStyle.TopContainer = TopContainer
BannerStyle.Select = StyledSelect
BannerStyle.Option = StyledOption
BannerStyle.SearchIcon = SearchIcon
BannerStyle.StatusIcon = statusIcon
BannerStyle.MDTable = MDTable
BannerStyle.Input = StyledInput
BannerStyle.PaginationContainer = PaginationContainer
BannerStyle.StyledDivider = StyledDivider
BannerStyle.StyledButton = StyledButton
BannerStyle.Image = Image
BannerStyle.PreviewButton = PreviewButton
BannerStyle.LivePreview = LivePreview
export default BannerStyle
