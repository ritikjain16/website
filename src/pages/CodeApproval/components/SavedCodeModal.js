import React from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { debounce, get } from 'lodash'
import USER_SAVED_CODE_STATUS from '../../../constants/userSavedCodeStatus'
import CodeApprovalStyle from '../CodeApproval.style'
import MainModal from '../../../components/MainModal'
import StudentDetails from '../../EditApprovedCode/components/StudentDetails'
import CodeMetaDetails from '../../EditApprovedCode/components/CodeMetaDetails'
import CodePreview from '../../EditApprovedCode/components/CodePreview'
import ApprovalToggle from './MDTableColumns/ApprovalToggle'
import MainTable from '../../../components/MainTable'

const SavedCodeModal = ({
  userSavedCodes, selectedSavedCode, setSelectedSavedCode,
  isSavedCodeModalVisible, onModalClose, isUserSavedCodeUpdating,
  history, filterQuery, isReviewRequested, openCommentsModal
}) => {
  const getSelectedSavedCodeIndex = () => {
    const userSavedCodesData = userSavedCodes && userSavedCodes.toJS()
    if (userSavedCodesData && userSavedCodesData.length && selectedSavedCode) {
      return userSavedCodesData.findIndex(savedCode => savedCode.id === selectedSavedCode.id)
    }
    return null
  }

  const loadPrevData = () => {
    const userSavedCodesData = userSavedCodes && userSavedCodes.toJS()
    const index = getSelectedSavedCodeIndex() - 1
    setSelectedSavedCode(userSavedCodesData, index)
  }

  const loadNextData = () => {
    const userSavedCodesData = userSavedCodes && userSavedCodes.toJS()
    const index = getSelectedSavedCodeIndex() + 1
    setSelectedSavedCode(userSavedCodesData, index)
  }

  const getUserApprovedCodeStatus = () => {
    if (selectedSavedCode && get(selectedSavedCode, 'userApprovedCode', false)) {
      return selectedSavedCode.userApprovedCode.status === 'published'
    }
    return false
  }

  const userSavedCodeCurrentPageCount = userSavedCodes &&
      userSavedCodes.toJS().length
  return (
    <MainModal
      visible={isSavedCodeModalVisible}
      title='View User Saved Code'
      onCancel={() => { onModalClose() }}
      style={{ minWidth: '700px' }}
      maskClosable
      width='fit-content'
      centered
      destroyOnClose
      footer={null}
    >
      {getSelectedSavedCodeIndex() > 0 && (
        <CodeApprovalStyle.PrevBtn
          onClick={debounce(loadPrevData, 300)}
        >
          <LeftOutlined />
        </CodeApprovalStyle.PrevBtn>
      )}
      {selectedSavedCode && get(selectedSavedCode, 'isApprovedForDisplay', 'pending') === USER_SAVED_CODE_STATUS.ACCEPTED ? (
        <CodeApprovalStyle.EditBtnContainer>
          <CodeApprovalStyle.TableContainer
            style={{
              color: `${getUserApprovedCodeStatus() ? '#16d877' : '#d4d4d4'}`,
            }}
          >
            <CodeApprovalStyle.StatusIcon
              color={getUserApprovedCodeStatus() ? '#16d877' : '#d4d4d4'}
            />
            {getUserApprovedCodeStatus() ? 'Code Published' : 'Code Unpublished'}
          </CodeApprovalStyle.TableContainer>
          <CodeApprovalStyle.EditBtn onClick={() => {
              history.push(`/ums/approvedCode/${get(selectedSavedCode, 'id', false)}`,
                {
                  filterQuery,
              })
            }}
          >
            <MainTable.ActionItem.EditIcon style={{ padding: '0px 10px !important' }} />
            Edit Approved Code
          </CodeApprovalStyle.EditBtn>
        </CodeApprovalStyle.EditBtnContainer>
      ) : (
        <ApprovalToggle
          closeModal={() => { onModalClose() }}
          openCommentsModal={openCommentsModal}
          history={history}
          isViewOnlyModal
          filterQuery={filterQuery}
          isReviewRequested={isReviewRequested}
          isApprovedForDisplay={selectedSavedCode &&
          get(selectedSavedCode, 'isApprovedForDisplay', 'pending')}
          isUserSavedCodeUpdating={isUserSavedCodeUpdating}
          userSavedCode={selectedSavedCode}
        />
      )}
      <StudentDetails
        studentName={selectedSavedCode && get(selectedSavedCode, 'studentName', '')}
        grade={selectedSavedCode && get(selectedSavedCode, 'grade', '')}
      />
      <CodeMetaDetails
        isEditable={false}
        title='Title'
        userSavedCodes={selectedSavedCode}
      />
      <CodeMetaDetails
        isEditable={false}
        title='Description'
        userSavedCodes={selectedSavedCode}
      />
      <CodePreview
        isEditable={false}
        userSavedCodes={selectedSavedCode}
      />
      {getSelectedSavedCodeIndex() < (userSavedCodeCurrentPageCount - 1) && (
        <CodeApprovalStyle.NextBtn
          onClick={debounce(loadNextData, 300)}
        >
          <RightOutlined />
        </CodeApprovalStyle.NextBtn>
      )}
    </MainModal>
  )
}

export default SavedCodeModal
