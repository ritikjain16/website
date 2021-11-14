import { get } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import MainModal from '../../../../components/MainModal'
import AddAdminForm from './AddAdminForm'
import EditAdminForm from './EditAdminForm'

class SchoolAdminModal extends React.Component {
  state = {
    name: '',
    email: '',
    phoneNumber: '',
    countryCode: '+91',
    username: '',
  }

  componentDidUpdate = async (prevProps) => {
    const { userUpdateStatus,
      userAddStatus, closeModal } = this.props

    if (userAddStatus && !get(userAddStatus.toJS(), 'loading')
      && get(userAddStatus.toJS(), 'success') &&
      (prevProps.userAddStatus !== userAddStatus)) {
      closeModal()
    }

    if (userUpdateStatus && !get(userUpdateStatus.toJS(), 'loading')
      && get(userUpdateStatus.toJS(), 'success') &&
      (prevProps.userUpdateStatus !== userUpdateStatus)) {
      closeModal()
    }
  }
  render() {
    const { openModal, operation, closeModal, editData,
      handleAddAdmin, userAddStatus, handleEditAdmin, userUpdateStatus } = this.props
    return (
      <MainModal
        visible={openModal}
        title={operation === 'add' ? 'Add School Admin' : 'Edit School Admin'}
        onCancel={closeModal}
        maskClosable={false}
        width='600px'
        centered
        destroyOnClose
        footer={null}
      >
        {
          operation === 'add' ? (
            <AddAdminForm
              addFormData={{ ...this.state }}
              handleAddAdmin={handleAddAdmin}
              userAddStatus={userAddStatus}
            />
          ) : (
            <EditAdminForm
              editFormData={editData}
              handleEditAdmin={handleEditAdmin}
              userUpdateStatus={userUpdateStatus}
            />
          )
        }
      </MainModal>
    )
  }
}

const mapStateToProps = (state) => ({
  userAddStatus: state.data.getIn(['users', 'addStatus', 'users']),
  userUpdateStatus: state.data.getIn(['users', 'updateStatus', 'users']),
})

export default connect(mapStateToProps)(SchoolAdminModal)
