import styled from 'styled-components'
import { Switch } from 'antd'
import { TekieAmethyst } from '../../../../constants/colors'

const AvailabilityModal = styled.div`
    font-family: 'Inter' !important;
    height: 100%;
    width: 100%;
    margin: 0 auto;
`
const HeaderDetails = styled.div`
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    font-family: Inter;
`
const HeaderIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 45px;
    background: ${props => props.bgColor ? props.bgColor : '#fff'};
    border-radius: ${props => props.borderRadius ? props.borderRadius : '10px'};
`
const TabsContainer = styled.div`
    background: #EEEEEE;
    border-radius: 10px;
    padding: 3px;
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
`
const Tab = styled.div`
    background: ${props => props.isActive ? '#FFF' : 'transparent'};
    color: ${props => props.isActive ? TekieAmethyst : '#666666'};
    transition: all .2s;
    text-align: center;
    border-radius: 8px;
    user-select: none;
    cursor: pointer;
    padding: 6px;
    flex: 1;
`
const CustomSlider = styled(Switch)`
    &.ant-switch-checked {
        background: ${TekieAmethyst};
    }
`
const SecondaryText = styled.div`
    font-weight: 500;
    font-size: 13px;
    color: #333333;
    padding-bottom: 12px;
`
const CustomCheckboxContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    border-radius: 8px;
    flex: 1 1 30%;
    background: ${props => props.isSelected ? '#FAF7FF' : '#FFFFFF'};
    border: 1px solid ${props => props.isSelected ? TekieAmethyst : '#CCCCCC'};
    color: #333333;
    cursor: pointer;
    text-transform: capitalize;
    user-select: none;
    margin: 4px;
`
const CustomSelectsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
`
const CustomCheckboxText = styled.div`
    font-family: 'Inter';
    font-weight: normal;
    font-size: ${props => props.fontSize || '14px'};
    color: #333333;
    letter-spacing: 0px;
    line-height: 12px;
    white-space: nowrap;
`
const CustomWeekDaySelects = styled.div`
    background: ${props => props.isSelected ? '#FAF7FF' : '#FFFFFF'};
    border: 1px solid ${props => props.isSelected ? TekieAmethyst : '#AAAAAA'};
    border-radius: 8px;
    flex: 1 1;
    padding: 8px 12px;
    margin: 4px;
    color: #333333;
    text-align: center;
    cursor: pointer;
    text-transform: capitalize;
    user-select: none;
`
const FooterText = styled.div`
    flex: 1 1;
    font-weight: 500;
    font-size: 14px;
    color: #333333;
`

AvailabilityModal.HeaderDetails = HeaderDetails
AvailabilityModal.HeaderIcon = HeaderIcon
AvailabilityModal.TabsContainer = TabsContainer
AvailabilityModal.CustomSlider = CustomSlider
AvailabilityModal.Tab = Tab
AvailabilityModal.SecondaryText = SecondaryText
AvailabilityModal.FooterText = FooterText
AvailabilityModal.CustomWeekDaySelects = CustomWeekDaySelects
AvailabilityModal.CustomSelectsContainer = CustomSelectsContainer
AvailabilityModal.CustomCheckboxContainer = CustomCheckboxContainer
AvailabilityModal.CustomCheckboxText = CustomCheckboxText

export default AvailabilityModal
