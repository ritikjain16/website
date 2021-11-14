import styled from 'styled-components'

const StatsTopContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
`

const innerContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const filledCircle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background: ${props => props.filterWillWork ? '#1890ff' : '#d7b927'};
  display: inline-block;
  margin-right: 10px;
`

const StyledTab = styled.div`
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

StatsTopContainer.filledCircle = filledCircle
StatsTopContainer.innerContainer = innerContainer
StatsTopContainer.StyledTab = StyledTab

export default StatsTopContainer