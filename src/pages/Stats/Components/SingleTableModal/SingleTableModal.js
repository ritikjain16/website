import React, { Component } from 'react'
import { CSVLink } from 'react-csv'
import fetchData from './FetchQueries'
import { Table, Modal, Button } from 'antd'
import moment from 'moment'

class SingleTableModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      tableDataLoading: true,
      data: [],
      columns: [],
      downloadCols: [],
      downloadData: []
    }

    let { fromDate, toDate, title } = this.props
    fromDate = fromDate ? moment(fromDate).startOf('day') : ''
    toDate = toDate ? moment(toDate).endOf('day') : ''
    switch (title) {
      case 'Registered Users':
        fetchData.getRegUsers(fromDate, toDate).then(this.setDataInState)
        break
      case 'Registered & Not Booked':
        fetchData.getRegNotBookedUsers(fromDate, toDate).then(this.setDataInState)
        break
      case 'Future Sessions Booked':
        fetchData.getFutureBookedSessions().then(this.setDataInState)
        break
      case 'Sessions Booked & Missed':
        fetchData.getBookedAndMissedSessions().then(this.setDataInState)
        break
      case 'Paid Users':
        fetchData.getPaidUsers().then(this.setDataInState)
        break
      default:
        break
    }
  }

  componentDidMount() {
    this._isMounted = true
  }

  setDataInState = ([data, columns]) => {
    const downloadCols = columns.map(ele => ({
      label: ele.title,
      key: ele.dataIndex
    }))
    if (this._isMounted) {
      this.setState({
        data,
        columns,
        tableDataLoading: false,
        downloadData: data,
        downloadCols
      })
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  getReactTitleNode = () => {
    const { title } = this.props
    const { downloadData, downloadCols } = this.state
    return (
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>{title}</div>
        <CSVLink style={{ marginRight: '25px' }} filename={title + '.csv'} data={downloadData} headers={downloadCols}>
          <Button type="primary" shape="circle" icon='download' size='large' />
        </CSVLink>
      </div>
    )
  }

  tableOnChange = (pagination, filters, sorter, extra) => {
    this.setState({ dataToBeDownloaded: extra.currentDataSource })
  }

  render() {
    return (
      <Modal
        centered
        footer={null}
        visible={this.state.visible}
        onCancel={() => {
          this.setState({
            visible: false
          })
        }}
        afterClose={this.props.closeModal}
        title={this.getReactTitleNode()}
        width='80vw'
      >
        <Table
          dataSource={this.state.data} columns={this.state.columns}
          scroll={{ x: 1680, y: '65vh' }}
          rowKey='id'
          size='middle'
          bordered
          loading={this.state.tableDataLoading}
          onChange={this.tableOnChange}
        />
      </Modal>
    )
  }
}

export default SingleTableModal
