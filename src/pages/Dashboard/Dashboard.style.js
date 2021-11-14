import styled from 'styled-components'
import { Select } from 'antd'

const DashboardMain = styled.div`
    margin:auto;
    width: 90%;
`

const flexContainer = styled.div`

    display: flex;
    flex-basis:15%;
    flex-flow: row wrap;
    
    align-content: center;
    align-items: space-around;
    
`
const flexItem = styled.div`
display: 'flex',
flex-direction: 'column',


                min-width: '20%',
                flexgrow: '1',
                background: 'white',
                margin: '0.5vw',
                width: '300px',
                height: '190px',
                margin-bottom:'4vw',

                font-weight: 'normal',
                font-size: '1.7em',
                text-align: 'center',
                border-radius: '.6vw .6vw 1.5vw 1.5vw',
                border: '.1vw solid white',
                box-shadow: '0.3vw 0.3vw .4vw silver',
                transition: ' 0.3s' 
    
`
const dashtable = styled.table`
    table-layout:fixed;
    width: 100% ;
    margin-top: 0;
    font-weight: normal;
`

const hr = styled.div`
    font-size: 18px;
    font-weight: bold;
    text-transform: uppercase;
    height:2.5vw;
`

const pr = styled.div`
    font-size: 16px;
    font-weight: normal;
   
    display: table;
    background:blue;
    line-height: 30px;
    
`

const th = styled.th`
    text-align: center;
    font-weight: normal;
`

const StyledSelect = styled(Select)`
min-width: 160px;
display: flex;
align-items: left;
`

const StyledOption = styled(Select.Option)`

    `

DashboardMain.flexContainer = flexContainer
DashboardMain.flexItem = flexItem
DashboardMain.hr = hr
DashboardMain.pr = pr
DashboardMain.dashtable = dashtable
DashboardMain.th = th
DashboardMain.Select = StyledSelect
DashboardMain.Option = StyledOption
export default DashboardMain
