import React from 'react'
import { Popconfirm } from 'antd'
import { get } from 'lodash'
import USER_SAVED_CODE_STATUS from '../../../../constants/userSavedCodeStatus'
import updateUserSavedCode from '../../../../actions/userSavedCodes/updateUserSavedCode'
import CodeApprovalStyle from '../../CodeApproval.style'

class ApprovalToggle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      approvalStatus: false,
      showPopConfirm: false,
      isSubmitting: false,
    }
  }

  componentDidMount() {
    this.setState({
      approvalStatus: this.props.isApprovedForDisplay
    })
  }

  showPopConfirm = (checked) => {
    const status = checked ? 'accepted' : 'pending'
    this.setState({
      approvalStatus: status,
      showPopConfirm: true
    })
  }

  onConfirm = () => {
    const { isViewOnlyModal } = this.props
    const input = {
      isApprovedForDisplay: this.state.approvalStatus
    }
    this.setState({
      isSubmitting: true
    }, () => {
      updateUserSavedCode(this.props.userSavedCode.id, input)
      this.setState({
        isSubmitting: false,
        showPopConfirm: false
      }, () => {
        if (isViewOnlyModal) {
          if (this.checkIfSavedCodeIsAccepted(input.isApprovedForDisplay)) {
            this.props.history.push(`/ums/approvedCode/${this.props.userSavedCode.id}`, {
              filterQuery: this.props.filterQuery || {}
            })
          } else {
            this.props.closeModal()
          }
        }
      })
    })
  }

  checkIfSavedCodeIsAccepted = (isApprovedForDisplay) => {
    if (isApprovedForDisplay === USER_SAVED_CODE_STATUS.ACCEPTED) {
      return true
    }
    return false
  }

  onCancel = () => {
    this.setState({
      showPopConfirm: false,
    })
  };

  getRejectButton = () => {
    const { isReviewRequested, isApprovedForDisplay, userSavedCode, isMentorLoggedIn } = this.props
    if ((isReviewRequested || isMentorLoggedIn) &&
      isApprovedForDisplay === USER_SAVED_CODE_STATUS.REJECTED) {
      return (
        <div style={{ marginLeft: '20px', color: '#f7412d' }}>
          Rejected
        </div>
      )
    }
    if ((isReviewRequested || isMentorLoggedIn) &&
      get(userSavedCode, 'userApprovedCode.status', false) !== 'published') {
      return (
        <CodeApprovalStyle.RejectButton
          onClick={() => this.props.openCommentsModal(userSavedCode)}
          size='default'
        >
          Reject
        </CodeApprovalStyle.RejectButton>
      )
    }
    return null
  }


  render() {
    const { isViewOnlyModal, isApprovedForDisplay } = this.props
    return (
      <CodeApprovalStyle.TableContainer
        style={{
          justifyContent: `${!isViewOnlyModal ? 'flex-start' : 'center'}`
        }}
      >
        <CodeApprovalStyle.TableContainer
          style={{
            justifyContent: `${!isViewOnlyModal ? 'flex-start' : 'center'}`,
            padding: `${!isViewOnlyModal ? '0px 30px' : '0px 30px 20px'}`
          }}
        >
          {!isViewOnlyModal ? '' : 'Not Approved '}
          <Popconfirm
            title={`Do you want to ${this.checkIfSavedCodeIsAccepted(isApprovedForDisplay) ? 'disapprove' : 'approve'} this code?`}
            visible={this.state.showPopConfirm}
            onConfirm={this.onConfirm}
            onCancel={this.onCancel}
            placement='topRight'
            okText='Yes'
            okButtonProps={{ loading: this.state.isSubmitting }}
            cancelText='Cancel'
            key='toggle'
          >
            <CodeApprovalStyle.StyledSwitch
              bgcolor={this.checkIfSavedCodeIsAccepted(isApprovedForDisplay) ? '#64da7a' : '#ff5744'}
              checked={this.checkIfSavedCodeIsAccepted(isApprovedForDisplay)}
              defaultChecked={this.checkIfSavedCodeIsAccepted(isApprovedForDisplay)}
              onChange={this.showPopConfirm}
              size='default'
            />
          </Popconfirm>
          {!isViewOnlyModal ? (
            this.checkIfSavedCodeIsAccepted(isApprovedForDisplay) && ' Approved ' || ' Not Approved '
          ) : ' Approved'}
        </CodeApprovalStyle.TableContainer>
        <CodeApprovalStyle.TableContainer
          style={{ padding: `${!isViewOnlyModal ? '0px' : '0px 30px 20px'}` }}
        >
          {this.getRejectButton()}
        </CodeApprovalStyle.TableContainer>
      </CodeApprovalStyle.TableContainer>
    )
  }
}

export default ApprovalToggle
