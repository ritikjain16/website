/* eslint-disable max-len */
import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Icon, Button, Divider, notification } from 'antd'
import SalesExecMentorTableRow from './SalesExecMentorTableRow'
import MainTable from '../../../../components/MainTable'
import SalesExecMentorStyle from '../../SalesExecMentor.style'
import UpdateSalesExecProfilesModal from '../UpdateMentorsModal/UpdateSalesExecProfilesModal'
import AddMentorsModal from '../UpdateMentorsModal/AddMentorsModal'


export default class SalesExecMentorTableBody extends React.Component {
  state = {
    visible: false,
    confirmLoading: false,
    visibleAddMentor: false,
    confirmLoadingAddMentor: false,
    salesExecName: '',
    salesExecEmail: '',
    salesExecPhoneNumber: '',
    mentorDetails: [],
    salesExecId: ''
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isMentorGroupStatusUpdating && this.props.hasMentorGroupStatusUpdated) {
      this.setState({
        visible: false
      })
    }
    if ((prevProps.isAddingMentor && this.props.hasAddedMentor)
      || (prevProps.isUpdatingMentor && this.props.hasUpdatedMentor)) {
      this.setState({
        visibleAddMentor: false
      })
    }
  }
  showModal = (salesExec) => {
    this.setState({
      salesExecName: salesExec.user.username,
      salesExecEmail: salesExec.user.email,
      salesExecPhoneNumber: salesExec.user.phone.number,
      mentorDetails: salesExec.mentors,
      salesExecId: salesExec.id,
      visible: true
    })
  }

  handleOk = () => {
    this.setState({
      confirmLoading: true
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  setSalesExecValue = (salesExec) => {
    this.setState({
      salesExecId: salesExec.id,
      mentorDetails: salesExec.mentors
    })
  }

  showModalAddMentor = (salesExec) => {
    this.setSalesExecValue(salesExec)
    this.setState({
      visibleAddMentor: true
    })
  }

  handleOkAddMentor = () => {
    this.setState({ confirmLoadingAddMentor: true })
  }

  handleCancelAddMentor = () => {
    this.setState({ visibleAddMentor: false })
  }

  handleCannotAddMentor = () => {
    notification.error({
      message: 'Mentor already under Sales Executive!'
    })
    this.setState({ visibleAddMentor: false })
  }

  render() {
    const { mentorsData, isMentorStatusUpdating, hasMentorStatusUpdated, columnsTemplate, minWidth, isMentorGroupStatusUpdating, hasMentorGroupStatusUpdated, allMentorsData, isFetchingAllMentors, hasFetchedAllMentors, isAddingMentor, hasAddedMentor, fetchingSalesExecMentorError, hasSalesExecMentorFetched, hasDeletedMentor, hasUpdatedMentor } = this.props
    const { visible, confirmLoading, visibleAddMentor, confirmLoadingAddMentor, salesExecName, salesExecEmail, salesExecId, salesExecPhoneNumber, mentorDetails } = this.state
    if (!hasSalesExecMentorFetched && !hasMentorGroupStatusUpdated && !hasMentorStatusUpdated && !hasAddedMentor && !hasDeletedMentor && !hasUpdatedMentor) {
      return (
        <MainTable.Item justifyContent='flex-start'>
          <Icon type='loading' style={{ fontSize: 18 }} spin />
        </MainTable.Item>
      )
    }
    if (hasSalesExecMentorFetched && mentorsData.length === 0) {
      const emptyText = 'No Data found!'
      return <MainTable.EmptyTable>{emptyText}</MainTable.EmptyTable>
    }

    if (fetchingSalesExecMentorError) {
      const emptyText = `Error: ${fetchingSalesExecMentorError}`
      return <MainTable.EmptyTable>{emptyText}</MainTable.EmptyTable>
    }
    return (
      mentorsData.map((salesExec) => ((
        <React.Fragment key={salesExec.user.id}>
          <SalesExecMentorStyle.PaginationHolder>
            <Divider>
              <Button
                type='primary'
                onClick={() => this.showModal(salesExec)}
              >
                {salesExec.user.username} ({salesExec.mentors.length})
              </Button>
              <Button
                type='default'
                onClick={() => this.showModalAddMentor(salesExec)}
                style={{ marginLeft: '10px' }}
              >
                Add Mentors
              </Button>
            </Divider>
          </SalesExecMentorStyle.PaginationHolder>
          {
            salesExec.mentors.map((mentor, index) => ((
              <div style={{ marginTop: '10px' }} key={get(mentor, 'user.id')}>
                <SalesExecMentorTableRow
                  isMentorStatusUpdating={isMentorStatusUpdating}
                  hasMentorStatusUpdated={hasMentorStatusUpdated}
                  mentorName={get(mentor, 'user.name')}
                  status={mentor.status}
                  isMentorActive={mentor.isMentorActive}
                  emailID={get(mentor, 'user.email')}
                  phoneNo={get(mentor, 'user.phone.number')}
                  id={mentor.id}
                  columnsTemplate={columnsTemplate}
                  minWidth={minWidth}
                  order={index + 1}
                  serialNo={mentorsData.indexOf(mentor)}
                  salesExecId={salesExec.id}
                />
              </div>
            )))
          }
          <UpdateSalesExecProfilesModal
            title={salesExecName}
            visible={visible}
            onOk={this.handleOk}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
            salesExecEmail={salesExecEmail}
            salesExecPhoneNumber={salesExecPhoneNumber}
            mentorDetails={mentorDetails}
            salesExecId={salesExecId}
            isMentorGroupStatusUpdating={isMentorGroupStatusUpdating}
            hasMentorGroupStatusUpdated={hasMentorGroupStatusUpdated}
          />
          <AddMentorsModal
            title='Add Mentors'
            visible={visibleAddMentor}
            onOk={this.handleOkAddMentor}
            confirmLoading={confirmLoadingAddMentor}
            onCancel={this.handleCancelAddMentor}
            allMentorsData={allMentorsData}
            salesExecId={salesExecId}
            mentorsUnderSalesExec={mentorDetails}
            isFetchingAllMentors={isFetchingAllMentors}
            hasFetchedAllMentors={hasFetchedAllMentors}
            isAddingMentor={isAddingMentor}
            hasAddedMentor={hasAddedMentor}
            handleCannotAddMentor={this.handleCannotAddMentor}
          />
        </React.Fragment >
      )))
    )
  }
}

SalesExecMentorTableBody.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
}
