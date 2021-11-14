import styled from 'styled-components'
import colors from '../../../../constants/colors'
import MainTable from '../../../../components/MainTable'

const Screen = styled.div`
  width: 100%;
  height:auto;
  display:flex;
  flex-direction:column;
  background-color:${colors.loPage.tableBg};
`
const LOGridItem = styled(MainTable.Item)`
  height: auto;
  border: none;
  flex-direction: column;
  padding: 10px;
`

export { Screen, LOGridItem }
