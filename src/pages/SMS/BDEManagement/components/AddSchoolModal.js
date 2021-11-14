import { notification, Select, Spin } from 'antd'
import { get } from 'lodash'
import React from 'react'
import addSchoolsToBDE from '../../../../actions/bdManagement/addSchoolsToBDE'
import MainModal from '../../../../components/MainModal'

const { Option } = Select

class AddSchoolModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedSchools: []
    }
  }

  onClose = () => {
    const { onCloseAddSchoolModal } = this.props
    this.setState({
      selectedSchools: []
    }, onCloseAddSchoolModal)
  }
  onSelectSchool = (value) => {
    const { selectedSchools } = this.state
    const newSelectedSchools = [...selectedSchools, value]
    this.setState({
      selectedSchools: newSelectedSchools
    })
  }

  onDeselectSchool = (value) => {
    const { selectedSchools } = this.state
    const newSelectedSchools = [...selectedSchools].filter(school => get(school, 'key') !== get(value, 'key'))
    this.setState({
      selectedSchools: newSelectedSchools
    })
  }

  onSave = async () => {
    const { selectedBDId, fetchBDEProfileData } = this.props
    const { selectedSchools } = this.state
    const schoolsConnectIds = selectedSchools.map(school => get(school, 'key'))
    if (schoolsConnectIds.length > 0) {
      if (selectedBDId) {
        let updateSchoolsQuery = ''
        schoolsConnectIds.forEach((schoolId, ind) => {
          if (ind === 0) {
            updateSchoolsQuery += `updateSchool(id: "${schoolId}", bdeConnectId: "${selectedBDId}") {
              id
            }`
          } else {
            updateSchoolsQuery += `updateSchool${ind}: updateSchool(id: "${schoolId}", bdeConnectId: "${selectedBDId}") {
              id
            }`
          }
        })
        await addSchoolsToBDE({
          updateSchoolsQuery
        }).then((res) => {
          if (res && res.updateSchool && res.updateSchool.id) {
            notification.success({
              message: 'School Added successfully'
            })
            fetchBDEProfileData()
            this.onClose()
          }
        })
      }
    } else {
      notification.warn({
        message: 'Please select schools to add'
      })
    }
  }

  onSaveLoading = () => {
    const { selectedBDId, bdProfileUpdatingStatus } = this.props
    if (selectedBDId) {
      return bdProfileUpdatingStatus && get(bdProfileUpdatingStatus.toJS(), 'loading')
    }
    return false
  }
  render() {
    const { showAddSchoolModal, schoolsData, schoolFetchStatus, addedSchools } = this.props
    const { selectedSchools } = this.state
    const schoolsList = schoolsData.filter(school => !addedSchools.map(sch => get(sch, 'id')).includes(get(school, 'id')))
    return (
      <MainModal
        visible={showAddSchoolModal}
        title='Assign Schools'
        onCancel={() => this.onClose()}
        maskClosable={false}
        width='500px'
        footer={
          [
            <MainModal.SaveButton
              type='primary'
              htmlType='submit'
              onClick={this.onSave}
              loading={this.onSaveLoading()}
            >
              {this.onSaveLoading() ? 'Adding...' : 'ADD'}
            </MainModal.SaveButton>
          ]}
      >
        <MainModal.FormItem label='Choose Schools to Add:'>
          <Select
            mode='multiple'
            labelInValue
            value={selectedSchools}
            placeholder='Select School'
            loading={schoolFetchStatus}
            notFoundContent={schoolFetchStatus ? <Spin size='small' /> : null}
            filterOption={(input, option) =>
                get(option, 'props.children')
                    ? get(option, 'props.children')
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                    : false
                }
            style={{ width: '100%' }}
            onSelect={this.onSelectSchool}
            onDeselect={this.onDeselectSchool}
          >
            {schoolsList.map(school => (
              <Option key={school.id} value={school.id}>{school.name}</Option>
            ))}
          </Select>
        </MainModal.FormItem>
      </MainModal>
    )
  }
}

export default AddSchoolModal
