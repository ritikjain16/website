import { Button } from 'antd'
import React from 'react'
import { CSVLink } from 'react-csv'
import headerConfig from './headerConfig'

const DownloadReport = ({ name, row }) => (
  <CSVLink style={{ marginRight: '25px' }} filename={`${name}_progress.csv`} data={[row]} headers={headerConfig}>
    <Button type='primary' shape='circle' icon='download' size='large' />
  </CSVLink>
)

export default DownloadReport
