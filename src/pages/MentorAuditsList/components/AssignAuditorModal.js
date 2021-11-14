/* eslint-disable max-len */
import { Button, Col, Empty, Form, Row, Select, Spin, Divider } from 'antd'
import { get } from 'lodash'
import React, { Component } from 'react'
import MainModal from '../../../components/MainModal'
import fetchUsers from '../../../actions/mentorAudits/fetchUsers'
import nameFormat from '../../../utils/name-to-alphabet'
import MentorAuditListStyle from '../MentorAuditList.style'
import updateMentorAudit from '../../../actions/mentorAudits/updateMentorAudit'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'
import getDataFromLocalStorage from '../../../utils/extract-from-localStorage'
import updatePreSalesAudit from '../../../actions/audits/updatePreSalesAudit'
import { PRE_SALES } from '../../../constants/roles'
import updatePostSalesAudit from '../../../actions/audits/updatePostSalesAudit'

const footerButtonStyle = { display: 'block', margin: '0 auto' }
const SelectedAuditStyle = {
  margin: 0,
  lineHeight: '20px'
}
const SelectedAuditHeaderStyle = {
  margin: 0,
  lineHeight: '25px',
  fontWeight: 520
}
const { Option, OptGroup } = Select
class AssignAuditorModal extends Component {
  state = {
    users: [],
    selectedAuditor: null,
    searchValue: '',
    searchType: 'Name',
    isLoading: false,
    isButtonLoading: false
  }
  onSave = async (isSelfAudit = false) => {
    const { selectedAuditId, auditType, addSalesUser } = this.props
    const { selectedAuditor } = this.state
    const currentUserId = getDataFromLocalStorage('login.id')
    const auditorConnectId = `auditorConnectId:"${isSelfAudit ? currentUserId : selectedAuditor}"`
    if (isSelfAudit) this.setState({ isLoading: true })
    else this.setState({ isButtonLoading: true })
    if ((selectedAuditor && selectedAuditId) || isSelfAudit) {
      if (auditType && auditType === 'preSales') {
        if (addSalesUser) {
          await updatePreSalesAudit({
            auditId: selectedAuditId,
            preSalesUserid: isSelfAudit ? currentUserId : selectedAuditor
          })
        } else {
          await updatePreSalesAudit({
            auditId: selectedAuditId,
            auditorConnectId
          })
        }
      } else if (auditType && auditType === 'postSales') {
        if (addSalesUser) {
          await updatePostSalesAudit({
            auditId: selectedAuditId,
            postSalesId: isSelfAudit ? currentUserId : selectedAuditor
          })
        } else {
          await updatePostSalesAudit({
            auditId: selectedAuditId,
            auditorConnectId
          })
        }
      } else {
        await updateMentorAudit(selectedAuditId, auditorConnectId, {}, 'mentorAudits')
      }
      this.setState({ isLoading: false, isButtonLoading: false })
      this.handleModalCancel()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.usersForAudits !== this.props.usersForAudits) {
      const groupedUsers = get(this.props, 'usersForAudits', null) &&
          get(this.props, 'usersForAudits', []).toJS().reduce((r, a) => {
            r[a.role] = r[a.role] || []
            r[a.role].push(a)
            return r
          }, Object.create(null))
      this.setState({
        users: groupedUsers
      })
    }
  }

  handleSearch = (value) => {
    const { auditType, addSalesUser } = this.props
    this.setState({ searchValue: value }, () => {
      const { searchValue, searchType } = this.state
      const filterIds = [getDataFromLocalStorage('login.id')]
      if (!auditType) filterIds.push(this.props.selectedAuditMentorId)
      let filterQuery = `
        {
          id_not_in:[${getIdArrForQuery(filterIds)}] 
        },
      `
      if (searchValue.length >= 3) {
        this.setState({
          selectedAuditor: null
        })
        switch (searchType) {
          case 'Name':
            filterQuery += `{
              name_contains:"${searchValue}"
            }`
            fetchUsers(filterQuery, auditType, addSalesUser)
            break
          case 'Username':
            filterQuery += `{
              username_contains:"${searchValue}"
            }`
            fetchUsers(filterQuery, auditType, addSalesUser)
            break
          case 'Email':
            filterQuery += `{
              email_contains:"${searchValue}"
            }`
            fetchUsers(filterQuery, auditType, addSalesUser)
            break
          case 'PhoneNo':
            filterQuery += `{
              phone_number_subDoc_contains:"${searchValue}"
            }`
            fetchUsers(filterQuery, auditType, addSalesUser)
            break
          default:
            break
        }
      }
    })
  }

  handleInputChange = (value) => {
    if (value && value !== '') {
      const user =
      get(this.props, 'usersForAudits', []).toJS()
        .filter(userRecord => get(userRecord, 'id', null) === value)[0]
      this.setState({
        selectedAuditor: value,
        searchValue: get(user, 'name', null),
        users: []
      }, () => {
        this.props.setSelectedAuditor({
          id: get(user, 'id', null),
          name: get(user, 'name', null),
          username: get(user, 'username', null),
          email: get(user, 'email', null),
          role: get(user, 'role', null)
        })
      })
    }
  }

  isSaving = () => {
    if (this.props.isAuditUpdating) {
      return true
    }
  }

  onCancel() {
    const { selectedAuditor } = this.state
    if (selectedAuditor.length !== 0) {
      this.setState({
        selectedAuditor: null,
        searchValue: null,
        searchType: 'Name'
      })
    }
    this.props.closeAssignAuditorModal()
  }

  getLoaderData = () => {
    const { usersFetchStatus } = this.props
    if (usersFetchStatus && usersFetchStatus.toJS().loading) return <Spin size='small' />
    if (this.state.searchValue.length < 3) {
      return <p>Type atleast 3 characters to get users</p>
    }
    return <p>No users found</p>
  }

  handleModalCancel = () => {
    this.setState({
      selectedAuditor: null,
      searchType: 'Name',
      searchValue: ''
    }, () => this.props.closeAssignAuditorModal())
  }

  renderSelectedAuditorProfile = () => {
    const { selectedAuditor } = this.props
    if (selectedAuditor) {
      return (
        <>
          <MentorAuditListStyle.UserImage>
            {get(selectedAuditor, 'name', null) ?
            nameFormat(get(selectedAuditor, 'name', 'NA')) :
            nameFormat(get(selectedAuditor, 'username', 'NA')
            )}
          </MentorAuditListStyle.UserImage>
          <div style={{ marginLeft: '.8rem' }}>
            <h3 style={SelectedAuditHeaderStyle}>{selectedAuditor ? get(selectedAuditor, 'name', null) : null }</h3>
            <p style={SelectedAuditStyle}>{selectedAuditor ? get(selectedAuditor, 'email', null) : null }</p>
            <p style={SelectedAuditStyle}>{selectedAuditor ? get(selectedAuditor, 'role', null) : null }</p>
          </div>
        </>
      )
    }
    return (
      <Empty description='No Auditor Selected' />
    )
  }

  renderModalTitle = () => {
    const { addSalesUser, auditType } = this.props
    return `${addSalesUser ? `Assign ${auditType} User` : 'Assign Auditor'}`
  }
  renderSaveButtonTitle = () => {
    const { addSalesUser, auditType } = this.props
    return this.isSaving() ? 'Assigning...' : `${addSalesUser ? `Assign ${auditType} User` : 'Assign Auditor'}`
  }
  render() {
    const filterDropdownOptions = [
      'Name',
      'Username',
      'Email',
      'PhoneNo',
    ]
    const currentUserId = getDataFromLocalStorage('login.id')
    const savedRole = getDataFromLocalStorage('login.role')
    const { addSalesUser } = this.props
    return (
      <MainModal
        title={this.renderModalTitle()}
        visible={this.props.isAssignAuditorModalVisible}
        onCancel={this.handleModalCancel}
        width='568px'
        footer={[
          <Button
            type='primary'
            style={footerButtonStyle}
            onClick={() => { this.onSave(false) }}
            disabled={!this.state.selectedAuditor}
            loading={this.state.isButtonLoading}
          >
            {this.renderSaveButtonTitle()}
          </Button>
        ]}
      >
        <Form.Item style={{ margin: 0 }}>
          {
            !addSalesUser && savedRole !== PRE_SALES && (
              <Button
                type='primary'
                style={{ width: '100%' }}
                onClick={() => { this.onSave(true) }}
                loading={this.state.isLoading}
                disabled={currentUserId === get(this.props, 'selectedAuditor.id')}
              >
                Assign Self
              </Button>
            )
          }
        </Form.Item>
        <Divider style={{ color: '#c7c7c7', fontSize: '.8rem' }}>OR</Divider>
        <Form.Item label='Choose Auditor'>
          <Row>
            <Col span={8} style={{ paddingRight: '1rem' }}>
              <Select
                style={{ width: '100%' }}
                value={this.state.searchType}
                onChange={(value) => this.setState({
                    searchType: value
                  })}
              >
                {
                filterDropdownOptions.map((option) =>
                  <Option
                    key={option}
                    value={option}
                  >{option}
                  </Option>
                )
              }
              </Select>
            </Col>
            <Col span={16}>
              <Select
                showSearch
                placeholder={`Search By ${this.state.searchType}`}
                filterOption={false}
                value={this.state.searchValue}
                notFoundContent={this.getLoaderData()}
                onSearch={this.handleSearch}
                onChange={this.handleInputChange}
                style={{ width: '100%' }}
              >
                {this.state.users && Object.keys(this.state.users).map(groupedUsers => (
                  <OptGroup label={groupedUsers}>
                    {
                          this.state.users[groupedUsers].map(user => (
                            <Option value={user.id}>{user && user.name || user.email}</Option>
                          ))
                      }
                  </OptGroup>
                    ))}
              </Select>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label='Selected Auditor'>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {this.props.usersForAudits && this.renderSelectedAuditorProfile()}
          </div>
        </Form.Item>
      </MainModal>
    )
  }
}

export default AssignAuditorModal
