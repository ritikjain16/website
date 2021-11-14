import { Table } from 'antd'
import { get } from 'lodash'
import React from 'react'
import MainModal from '../../../../components/MainModal'

class GradesModal extends React.Component {
  onClose = () => {
    const { onCloseGradesModal } = this.props
    onCloseGradesModal()
  }
  getSchoolColumns = () => {
    const column = [
      {
        title: 'Grade',
        dataIndex: 'grade',
        key: 'grade',
        align: 'center',
      },
      {
        title: 'Count',
        dataIndex: 'count',
        key: 'count',
        align: 'center',
      },
    ]
    return column
  }
  render() {
    const { showGradesModal, selectedSchool, isDataLoading } = this.props
    const grades = get(selectedSchool, 'grades', [])
    let uniqueGrades = []
    grades.map(item => {
      const data = uniqueGrades.find(d => get(d, 'grade') === item.grade)
      if (data) {
        data.count += item.count
        const filtrd = uniqueGrades.filter((d) => get(d, 'grade') !== data.grade)
        uniqueGrades = [...filtrd, data]
      } else {
        uniqueGrades.push({
          grade: item.grade,
          count: item.count
        })
      }
    })
    return (
      <MainModal
        visible={showGradesModal}
        title='Grades'
        onCancel={() => this.onClose()}
        maskClosable={false}
        width='500px'
      >
        <Table
          dataSource={uniqueGrades}
          columns={this.getSchoolColumns()}
          bordered
          loading={isDataLoading}
        />
      </MainModal>
    )
  }
}

export default GradesModal
