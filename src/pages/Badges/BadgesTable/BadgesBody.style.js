import styled from 'styled-components'

const TypeRow = styled.div`
  background:#f5f5f5;
  grid-column-start:1;
  grid-column-end:${props => props.badgeCount > 0 ? 7 : 9};
  padding:5px 0px 5px 5px;
  font-weight:bold;
  border:none;
  display:flex;
  justifyContent:space-between;
`
export default {
  TypeRow
}
