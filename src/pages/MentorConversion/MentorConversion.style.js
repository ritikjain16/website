import styled from 'styled-components'
import { Button, Select, Table } from 'antd'
// import antdButtonColor from '../../utils/mixins/antdButtonColor'
// import colors from '../../constants/colors'

const MentorConversionStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
`

const StyledTable = styled(Table)`
  .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td{
    background-color: unset;
  },
  tr.ant-table-row :nth-child(even){
    background-color: #ffffff;
  }
  tr.ant-table-row :nth-child(odd){
    background-color: #e6f7ff;
  }
  .ant-table-tbody .ant-table-row-cell-break-word {
    position: relative;
    padding-top: 40px;
  }
`

// const StyledInput = styled(Input)`
//     min-width: 200px;
//     display: flex;
//     align-items: left;
//     border-width: 0 0 2px 0 !important;
// `

const NoticeBox = styled.div`
  background-color: #ceeaef;
  border: 1px solid #73a5aa;
  padding: 6px 8px;
`

const Hl = styled.div`
  background-color: #d8d8d8;
  margin: 10px 0;
  height: 1px;
  width: 100%
`
const Vl = styled.div`
  background-color: #d8d8d8;
  margin: 0 5px;
  width: 1px;
  height: 100%;
`

const Title = styled.span`
  font-family: Nunito;
  font-size: 15px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #000000;  
  text-transform: capitalize;
  padding: 5px 0;
`

const SubTitle = styled.span`
  font-family: Nunito;
  font-size: 15px;
  font-weight: 100;
  font-stretch: normal;
  font-style: italic;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: #9b9b9b;
  text-transform: capitalize;
  padding: 5px 0;
  display: flex;
  justify-content: space-between;
`

const ToggleButtonContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100px;
`

const ToggleButton = styled(Button)`
  margin-left: 0 !important;
  border-radius: 0 !important;
  border-color: #73a5aa !important;
`

const CustomSelect = styled(Select)`
  .ant-select-selection{
    border: solid 1px #73a5aa !important;
    background-color: #e6f3ff !important;
    min-width: 100px !important;
  }
`

const PaymentSection = styled.div`
  text-align: center;
`

const Banner = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  padding: 10px;
`

const SearchBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-bottom: 20px;
`

MentorConversionStyle.StyledTable = StyledTable
MentorConversionStyle.NoticeBox = NoticeBox
MentorConversionStyle.Hl = Hl
MentorConversionStyle.Vl = Vl
MentorConversionStyle.Title = Title
MentorConversionStyle.SubTitle = SubTitle
MentorConversionStyle.ToggleButtonContainer = ToggleButtonContainer
MentorConversionStyle.ToggleButton = ToggleButton
MentorConversionStyle.CustomSelect = CustomSelect
MentorConversionStyle.PaymentSection = PaymentSection
MentorConversionStyle.Banner = Banner
MentorConversionStyle.SearchBox = SearchBox

export default MentorConversionStyle
