import styled from 'styled-components'
import colors from '../../constants/colors'

const HalfTable = styled.div`
  width: 50%;
  border: 1px solid #979797;
  border-radius: 2px;
  background: white;
`

const Row = styled.div`
  display: grid;
  width: ${props => props.isLarge ? '250%' : '100%'};
  justify-content: center;
  align-items: center;
  grid-template-columns: ${props => props.columnsTemplate};
  grid-gap: 1px;
  min-width: ${props => props.minWidth};
  height: ${props => !props.isVideoLOMapping ? '48px' : '80px'};
  border-bottom: ${props => !props.noBorder && '1px solid #bdbdbd'};
  //background: ${props => props.isHovering ? colors.video.background : ''};
  &:hover {
    background-color: #e6f7fe !important
  }
  &:hover>div{
    background-color: ${props => props.hoverBackgroundColor ? props.hoverBackgroundColor : '#e6f7fe'} !important;
  }
`
const Item = styled.div`
  display: flex;
  justify-content: ${props => props.justifyContent ? props.justifyContent : 'center'};
  align-items: ${props => props.alignItems ? props.alignItems : 'center'};
  height: ${props => props.height ? props.height : '100%'};
  overflow-x: hidden;
  min-width: 0;
  border-right: ${props => props.borderRight ? props.borderRight : 'none'};
  background-color: ${props => props.backgroundColor ? props.backgroundColor : '#fff'};
  position: ${props => props.position ? props.position : 'static'} !important;
  z-index: ${props => props.zIndex ? props.zIndex : '0'} !important;
  overflow-y: ${props => props.overflowY ? props.overflowY : 'hidden'};
`
const SubHeadItem = styled.div`
  display: flex;
  justify-content: ${props => props.justifyContent ? props.justifyContent : 'center'};
  align-items: ${props => props.alignItems ? props.alignItems : 'center'};
  height: ${props => props.height ? props.height : '100%'};
  overflow-x: hidden;
  min-width: 0;
  border-right: ${props => props.borderRight ? props.borderRight : 'none'};
  background-color: ${props => props.backgroundColor ? props.backgroundColor : '#fff'};
  position: sticky !important;
  left: 0;
  top:0;
  z-index: ${props => props.zIndex ? props.zIndex : '0'} !important;
  overflow-y: ${props => props.overflowY ? props.overflowY : 'hidden'};
`

const StickyItem = styled(Item)`
  z-index: 11 !important;
  position: sticky !important;
  border-right: 1px solid #bdbdbd;
`

HalfTable.Row = Row
HalfTable.Item = Item
HalfTable.StickyItem = StickyItem
HalfTable.SubHeadItem = SubHeadItem
export default HalfTable
