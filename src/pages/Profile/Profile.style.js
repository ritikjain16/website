import { Table } from 'antd'
import styled from 'styled-components'
import colors from '../../constants/colors'

const ProfileTable = styled(Table)`
margin-top: 20px;
& .ant-table-body{
  font-family: Nunito;
  border: solid 1px rgba(0, 0, 0, 0.2);
}
& .ant-table-content{
  color: #122b4a;
  background-color: #ffffff;
  border-radius:6px;
}
 & .ant-table-thead > tr > th{
  font-weight: 600;
  color: #122b4a;
 }
 & tbody > tr .anticon-delete svg{
  width: 16.8px;
  height: 22.2px;
  color: ${colors.table.deleteIcon};
 }

`
export default ProfileTable
