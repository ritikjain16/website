import {
  DatePicker, Modal, notification, Pagination,
  Button, Input, Select, Icon, Typography
} from 'antd'
import { get } from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import SchoolOverviewTableMain from './components/SchoolOverviewTableMain'
import SchoolOverviewTableStyle from './SchoolOverviewTable.style'
import addSchool from '../../actions/SchoolOverviewTable/addSchool'
import updateSchool from '../../actions/SchoolOverviewTable/updateSchool'
import {
  DEAN, HOD, OWNER, PRINCIPAL,
  TRUSTEE, VICEPRINCIPAL, TEACHER, DIRECTOR
} from '../../constants/schoolCoordinatorRoles'
import AddForm from './components/AddForm'
import fetchSchools from '../../actions/SchoolOverviewTable/fetchSchools'
import addImageToSchool from '../../actions/SchoolOverviewTable/addLogoToSchool'
import EditForm from './components/EditForm'
import fetchBDEUsers from '../../actions/SchoolOverviewTable/fetchBdEUsers'

class SchoolOverviewTable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      schoolsData: [],
      currentPage: 1,
      perPageQueries: 15,
      modalVisible: false,
      actionType: '',
      updateSchoolInput: {
        id: ''
      },
      addSchoolInput: {
        schoolName: '',
        coOrdinatorName: '',
        coOrdinatorEmail: '',
        coOrdinatorPhoneNumber: '',
        coOrdinatorPhoneCode: '+91',
        currentCoordinatorRole: '',
        schoolCity: '',
        code: '',
        logo: '',
        selectedBd: ''
      },
      coOrdinatorRoles: [PRINCIPAL, DEAN, VICEPRINCIPAL, HOD, TEACHER, OWNER, TRUSTEE, DIRECTOR],
      filterOptions: ['All', 'School Name', 'Co-ordinator Name', 'Co-ordinator Email'],
      searchKey: 'All',
      searchValue: '',
      searchQuery: null,
      fromDate: null,
      toDate: null,
      stopLoading: false,
      bdUsers: [],
    }
  }

  componentDidMount() {
    this.fetchSchoolData()
  }
  fetchSchoolData = async () => {
    const { searchQuery, fromDate, toDate, currentPage, perPageQueries } = this.state
    await fetchSchools({
      page: currentPage,
      perPage: perPageQueries
    }, searchQuery, fromDate, toDate)
    this.setState({
      stopLoading: false
    })
  }
  componentDidUpdate(prevProps) {
    const {
      fetchSchoolsSuccess,
      fetchSchoolsLoading,
      fetchSchoolsFailure,
      deleteSchoolSuccess,
      deleteSchoolFailure,
      deleteErrors,
      addSchoolSuccess,
      addSchoolFailure,
      addErrors,
      updateSchoolSuccess,
      updateSchoolFailure,
      updateErrors,
      userAddFailure,
      userAddStatus,
      userUpdateStatus,
      userUpdateFailure,
      userDeleteStatus,
      userDeleteFailure,
      bdUsersfetchingStatus
    } = this.props
    if (!fetchSchoolsLoading && fetchSchoolsSuccess) {
      if (get(prevProps, 'schoolsData') !== get(this.props, 'schoolsData')) {
        this.setState({
          schoolsData:
            this.props.schoolsData ?
              this.props.schoolsData.toJS() : []
        })
      }
    }
    if (fetchSchoolsFailure !== prevProps.fetchSchoolsFailure) {
      if (fetchSchoolsFailure) {
        notification.error({
          message: 'Failed to fetch'
        })
      }
    }
    if (deleteSchoolSuccess !== prevProps.deleteSchoolSuccess) {
      if (deleteSchoolSuccess) {
        notification.success({
          message: 'Deleted School successfully'
        })
        this.setState({
          schoolsData:
            this.props.schoolsData ?
              this.props.schoolsData.toJS() : []
        })
      }
    }
    if (deleteSchoolFailure !== prevProps.deleteSchoolFailure) {
      if (deleteSchoolFailure) {
        const currentError = deleteErrors.pop()
        notification.error({
          message:
            currentError.error.errors &&
            currentError.error.errors[0] &&
            currentError.error.errors[0].message
        })
      }
    }
    if (addSchoolSuccess !== prevProps.addSchoolSuccess) {
      if (addSchoolSuccess) {
        this.setState({
          schoolsData:
            this.props.schoolsData ?
              this.props.schoolsData.toJS() : []
        })
      }
    }
    if (addSchoolFailure !== prevProps.addSchoolFailure) {
      if (addSchoolFailure) {
        const currentError = addErrors.pop()
        notification.error({
          message:
            currentError.error.errors &&
            currentError.error.errors[0] &&
            currentError.error.errors[0].message
        })
      }
    }
    if (updateSchoolSuccess !== prevProps.updateSchoolSuccess) {
      if (updateSchoolSuccess) {
        this.setState({
          schoolsData:
            this.props.schoolsData ?
              this.props.schoolsData.toJS() : []
        })
      }
    }
    if (updateSchoolFailure !== prevProps.updateSchoolFailure) {
      if (updateSchoolFailure) {
        const currentError = updateErrors.pop()
        notification.error({
          message:
            currentError.error.errors &&
            currentError.error.errors[0] &&
            currentError.error.errors[0].message
        })
      }
    }

    if (userAddStatus && !get(userAddStatus.toJS(), 'loading')
      && get(userAddStatus.toJS(), 'success') &&
      (prevProps.userAddStatus !== userAddStatus)) {
      notification.success({
        message: 'Admin added successfully'
      })
    } else if (userAddStatus && !get(userAddStatus.toJS(), 'loading')
      && get(userAddStatus.toJS(), 'failure') &&
      (prevProps.userAddFailure !== userAddFailure)) {
      if (userAddFailure && userAddFailure.toJS().length > 0) {
        notification.error({
          message: get(get(userAddFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }

    if (userUpdateStatus && !get(userUpdateStatus.toJS(), 'loading')
      && get(userUpdateStatus.toJS(), 'success') &&
      (prevProps.userUpdateStatus !== userUpdateStatus)) {
      notification.success({
        message: 'Admin updated successfully'
      })
    } else if (userUpdateStatus && !get(userUpdateStatus.toJS(), 'loading')
      && get(userUpdateStatus.toJS(), 'failure') &&
      (prevProps.userUpdateFailure !== userUpdateFailure)) {
      if (userUpdateFailure && userUpdateFailure.toJS().length > 0) {
        notification.error({
          message: get(get(userUpdateFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }

    if (userDeleteStatus && !get(userDeleteStatus.toJS(), 'loading')
      && get(userDeleteStatus.toJS(), 'success') &&
      (prevProps.userDeleteStatus !== userDeleteStatus)) {
      notification.success({
        message: 'Admin deleted successfully'
      })
    } else if (userDeleteStatus && !get(userDeleteStatus.toJS(), 'loading')
      && get(userDeleteStatus.toJS(), 'failure') &&
      (prevProps.userDeleteFailure !== userDeleteFailure)) {
      if (userDeleteFailure && userDeleteFailure.toJS().length > 0) {
        notification.error({
          message: get(get(userDeleteFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }

    if (bdUsersfetchingStatus && !get(bdUsersfetchingStatus.toJS(), 'loading')
      && get(bdUsersfetchingStatus.toJS(), 'success') &&
      (prevProps.bdUsersfetchingStatus !== bdUsersfetchingStatus)) {
      this.setState({
        bdUsers: this.props.bdUsers && this.props.bdUsers.toJS() || []
      })
    }
  }
  onPageChange = (page) => {
    this.setState({
      currentPage: page
    }, this.fetchSchoolData)
  }
  showModal = (actionTypeFromClick, data) => {
    this.setState({
      modalVisible: true,
      actionType: actionTypeFromClick
    })
    const { bdUsers } = this.state
    if (bdUsers.length === 0) fetchBDEUsers()
    if (actionTypeFromClick === 'edit') {
      const { currentCoordinatorRole } = this.state.addSchoolInput
      this.setState({
        updateSchoolInput: {
          id: get(data, 'id')
        }
      })
      this.setState({
        addSchoolInput: {
          schoolName: get(data, 'name') || '',
          coOrdinatorName: get(data, 'coordinatorName') || '',
          coOrdinatorEmail: get(data, 'coordinatorEmail') || '',
          coOrdinatorPhoneNumber: get(data, 'coordinatorPhone.number') || '',
          coOrdinatorPhoneCode: get(data, 'coordinatorPhone.countryCode') || '+91',
          schoolCity: get(data, 'city') || '',
          code: get(data, 'code') || '',
          logo: get(data, 'logo.uri'),
          logoId: get(data, 'logo.id'),
          hubspotId: get(data, 'hubspotId') || '',
          currentCoordinatorRole: get(data, 'coordinatorRole') || currentCoordinatorRole,
          schoolPicture: get(data, 'schoolPicture.uri'),
          schoolPictureId: get(data, 'schoolPicture.id'),
          enrollmentType: get(data, 'enrollmentType'),
          whiteLabel: get(data, 'whiteLabel'),
          bdId: get(data, 'bde.id')
        }
      })
    }
  }
  closeModal = () => {
    this.setState({
      modalVisible: false,
      addSchoolInput: {
        schoolName: '',
        coOrdinatorEmail: '',
        coOrdinatorPhoneNumber: '',
        coOrdinatorPhoneCode: '+91',
        schoolCity: ''
      },
      updateSchoolInput: {
        id: ''
      },
    })
  }
  handleCoOrdinatorRoleChange = (value) => {
    this.setState({
      addSchoolInput: {
        ...this.state.addSchoolInput,
        currentCoordinatorRole: value
      }
    })
  }
  handleSearchKeyChange = (value) => {
    if (value === 'All') {
      this.setState({
        searchQuery: null,
        searchValue: '',
        searchKey: value,
        fromDate: null,
        toDate: null
      }, this.fetchSchoolData)
    }
    this.setState({
      searchKey: value
    })
  }
  renderModalContent = () => {
    const { actionType, coOrdinatorRoles, addSchoolInput, bdUsers } = this.state
    const { addSchoolLoading, updateSchoolLoading } = this.props
    if (actionType === 'add') {
      return (
        <AddForm
          coOrdinatorRoles={coOrdinatorRoles}
          actionType={actionType}
          handleSubmit={this.handleSubmit}
          getModalBtnText={this.getModalBtnText}
          addSchoolLoading={addSchoolLoading}
          bdUsers={bdUsers}
        />
      )
    } else if (actionType === 'edit') {
      return (
        <EditForm
          coOrdinatorRoles={coOrdinatorRoles}
          addSchoolInput={addSchoolInput}
          actionType={actionType}
          handleSubmit={this.handleSubmit}
          getModalBtnText={this.getModalBtnText}
          updateSchoolLoading={updateSchoolLoading}
          bdUsers={bdUsers}
        />
      )
    }
  }
  handleSubmit = async (value, logoFile, pictureFile) => {
    const { actionType } = this.state
    if (actionType === 'add') {
      const {
        schoolName,
        coOrdinatorName,
        coOrdinatorEmail,
        coOrdinatorPhoneNumber,
        coOrdinatorPhoneCode,
        schoolCity,
        currentCoordinatorRole,
        code,
        hubspotId,
        selectedBd
      } = value
      let addInput = {
      }
      if (schoolName) {
        addInput = {
          ...addInput,
          name: schoolName,
          code
        }
      }
      if (coOrdinatorName) {
        addInput = {
          ...addInput,
          coordinatorName: coOrdinatorName,
        }
      }
      if (coOrdinatorEmail) {
        addInput = {
          ...addInput,
          coordinatorEmail: coOrdinatorEmail
        }
      }
      if (coOrdinatorPhoneNumber) {
        addInput = {
          ...addInput,
          coordinatorPhone: {
            ...addInput.coordinatorPhone,
            number: coOrdinatorPhoneNumber
          }
        }
      }
      if (schoolCity) {
        addInput = {
          ...addInput,
          city: schoolCity
        }
      }
      if (currentCoordinatorRole) {
        addInput = {
          ...addInput,
          coordinatorRole: currentCoordinatorRole
        }
      }
      if (coOrdinatorPhoneCode) {
        if (coOrdinatorPhoneNumber) {
          addInput = {
            ...addInput,
            coordinatorPhone: {
              ...addInput.coordinatorPhone,
              countryCode: coOrdinatorPhoneCode
            }
          }
        }
      }
      if (hubspotId) {
        addInput = {
          ...addInput,
          hubspotId
        }
      }
      if (selectedBd) {
        addInput = {
          ...addInput,
          selectedBd
        }
      }
      await addSchool(addInput).then(async res => {
        if (res && res.addSchool && res.addSchool.id) {
          if (logoFile || pictureFile) {
            if (logoFile) {
              await addImageToSchool({
                file: logoFile,
                schoolId: res.addSchool.id,
                typeField: 'logo'
              })
            }
            if (pictureFile) {
              await addImageToSchool({
                file: pictureFile,
                schoolId: res.addSchool.id,
                typeField: 'schoolPicture'
              })
            }
            this.setState({
              stopLoading: true
            })
            this.fetchSchoolData()
          }
          notification.success({
            message: 'Added School successfully'
          })
          this.closeModal()
        }
      })
    } else if (actionType === 'edit') {
      const { id } = this.state.updateSchoolInput
      const { addSchoolInput } = this.state
      const {
        schoolName,
        coOrdinatorName,
        coOrdinatorEmail,
        coOrdinatorPhoneNumber,
        coOrdinatorPhoneCode,
        schoolCity,
        currentCoordinatorRole,
        hubspotId,
        code,
        enrollmentType,
        whiteLabel,
        selectedBd
      } = value
      let editInput = {
        name: schoolName,
        coordinatorName: coOrdinatorName,
        coordinatorEmail: coOrdinatorEmail,
        code,
        hubspotId,
        coordinatorPhone: {
          number: coOrdinatorPhoneNumber,
          countryCode: coOrdinatorPhoneCode
        },
        city: schoolCity,
        enrollmentType,
        whiteLabel
      }
      if (!coOrdinatorPhoneNumber) {
        editInput = {
          ...editInput,
          coordinatorPhone: {
            ...editInput.coordinatorPhone,
            countryCode: ''
          }
        }
      }
      if (currentCoordinatorRole) {
        editInput = {
          ...editInput,
          coordinatorRole: currentCoordinatorRole
        }
      }
      if (get(addSchoolInput, 'bdId') !== selectedBd) {
        editInput = {
          ...editInput,
          selectedBd
        }
      }
      await updateSchool(id, editInput).then(async res => {
        if (res && res.updateSchool && res.updateSchool.id) {
          if (logoFile || pictureFile) {
            if (logoFile) {
              await addImageToSchool({
                file: logoFile,
                schoolId: res.updateSchool.id,
                typeField: 'logo',
                prevFileId: get(addSchoolInput, 'logoId')
              })
            }
            if (pictureFile) {
              await addImageToSchool({
                file: pictureFile,
                schoolId: res.updateSchool.id,
                typeField: 'schoolPicture',
                prevFileId: get(addSchoolInput, 'schoolPictureId')
              })
            }
            this.setState({
              stopLoading: true
            })
            this.fetchSchoolData()
          }
          notification.success({
            message: 'Updated School successfully'
          })
          this.closeModal()
        }
      })
    }
  }
  handleSearchSubmit = () => {
    const { searchValue, searchKey } = this.state
    switch (searchKey) {
      case 'School Name':
        this.setState({
          searchQuery: `
          {name_contains:"${searchValue}"}
          `
        }, this.fetchSchoolData)
        break
      case 'Co-ordinator Name':
        this.setState({
          searchQuery: `
          {coordinatorName_contains:"${searchValue}"}`
        }, this.fetchSchoolData)
        break
      case 'Co-ordinator Email':
        this.setState({
          searchQuery: `
          {coordinatorEmail_contains:"${searchValue}"}
          `
        }, this.fetchSchoolData)
        break
      default:
        break
    }
  }
  handleEnterSubmit = (e) => {
    if (e.key === 'Enter') {
      const { searchValue, searchKey } = this.state
      switch (searchKey) {
        case 'School Name':
          this.setState({
            searchQuery: `
            {name_contains:"${searchValue}"}
            `
          }, this.fetchSchoolData)
          break
        case 'Co-ordinator Name':
          this.setState({
            searchQuery: `
            {coordinatorName_contains:"${searchValue}"}`
          }, this.fetchSchoolData)
          break
        case 'Co-ordinator Email':
          this.setState({
            searchQuery: `
            {coordinatorEmail_contains:"${searchValue}"}
            `
          }, this.fetchSchoolData)
          break
        default:
          break
      }
    }
  }
  handleDateChange = (value, type) => {
    if (type === 'from') {
      this.setState({
        fromDate: new Date(value),
        currentPage: 1
      }, this.fetchSchoolData)
    } else if (type === 'to') {
      this.setState({
        toDate: new Date(value),
      }, this.fetchSchoolData)
    }
  }
  handleClearFilter = () => {
    this.setState({
      searchKey: 'All',
      searchValue: '',
      searchQuery: null,
      fromDate: null,
      toDate: null,
      currentPage: 1
    }, this.fetchSchoolData)
  }
  getModalBtnText = () => {
    const { actionType } = this.state
    const { addSchoolLoading, updateSchoolLoading } = this.props
    if (actionType === 'add') {
      if (addSchoolLoading) {
        return 'Adding...'
      }
      return 'Add'
    } else if (actionType === 'edit') {
      if (updateSchoolLoading) {
        return 'Updating...'
      }
      return 'Update'
    }
  }
  getModalTitle = () => {
    const { actionType } = this.state
    if (actionType === 'add') {
      return 'Add School'
    } else if (actionType === 'edit') {
      return 'Update School'
    }
  }
  render() {
    const {
      schoolsData,
      modalVisible,
      filterOptions,
      searchKey,
      fromDate,
      toDate,
      stopLoading,
    } = this.state
    const { schoolCount, fetchSchoolsLoading } = this.props
    const { Text } = Typography
    const { Option } = Select
    return (
      <SchoolOverviewTableStyle>
        <Modal
          title={this.getModalTitle()}
          visible={modalVisible}
          onCancel={this.closeModal}
          destroyOnClose='true'
          footer={null}
        >
          {this.renderModalContent()}
        </Modal>
        <SchoolOverviewTableStyle.FlexContainer spacebetween>
          <Select
            style={{ minWidth: '200px' }}
            value={searchKey}
            onChange={this.handleSearchKeyChange}
          >
            {
              filterOptions.map(option => (
                <Option
                  key={option}
                >{option}
                </Option>
              ))
            }
          </Select>
          {
            searchKey !== 'All' &&
            <SchoolOverviewTableStyle.FlexContainer>
              <Input
                placeholder='Search here'
                type='text'
                onChange={(e) => this.setState({
                  searchValue: e.target.value
                })}
                onKeyPress={(e) => this.handleEnterSubmit(e)}
              />
              <Button type='primary' onClick={this.handleSearchSubmit} style={{ marginLeft: '10px' }}>
                <Icon type='search' />
              </Button>
            </SchoolOverviewTableStyle.FlexContainer>
          }
          <Pagination
            total={schoolCount || 0}
            onChange={this.onPageChange}
            defaultPageSize={this.state.perPageQueries}
          />
          <div>
            <DatePicker
              placeholder='Select Start Date'
              isClearable
              allowClear
              dateRender={current => {
                const currentDate = new Date().setHours(0, 0, 0, 0)
                const style = {}
                if (currentDate === new Date(current).setHours(0, 0, 0, 0)) {
                  style.backgroundColor = '#a8a6ee'
                  style.color = '#ffffff'
                }
                style.cursor = 'pointer'
                return (
                  <div className='ant-picker-cell-inner' style={style}>
                    {current.date()}
                  </div>
                )
              }}
              value={fromDate !== null ? moment(fromDate) : undefined}
              onChange={(value) => this.handleDateChange(value, 'from')}
            />
            <DatePicker
              placeholder='Select To Date'
              isClearable
              allowClear
              dateRender={current => {
                const currentDate = new Date().setHours(0, 0, 0, 0)
                const style = {}
                if (currentDate === new Date(current).setHours(0, 0, 0, 0)) {
                  style.backgroundColor = '#a8a6ee'
                  style.color = '#ffffff'
                }
                style.cursor = 'pointer'
                return (
                  <div className='ant-picker-cell-inner' style={style}>
                    {current.date()}
                  </div>
                )
              }}
              value={toDate !== null ? moment(toDate) : undefined}
              onChange={(value) => this.handleDateChange(value, 'to')}
            />
          </div>
        </SchoolOverviewTableStyle.FlexContainer>
        <SchoolOverviewTableStyle.ButtonContainer>
          <Button type='primary' onClick={this.handleClearFilter} >Clear Filter</Button>
          {/* <div> */}
          <Text >Total Schools {schoolCount && schoolCount}
          </Text>
          <SchoolOverviewTableStyle.StyledButton onClick={() => this.showModal('add')}>
            Add School
          </SchoolOverviewTableStyle.StyledButton>
          {/* </div> */}
        </SchoolOverviewTableStyle.ButtonContainer>
        <SchoolOverviewTableMain
          showLoading={!stopLoading && fetchSchoolsLoading && fetchSchoolsLoading}
          schoolsData={schoolsData}
          showModal={this.showModal}
          fetchSchoolData={this.fetchSchoolData}
        />
      </SchoolOverviewTableStyle>
    )
  }
}
export default SchoolOverviewTable
