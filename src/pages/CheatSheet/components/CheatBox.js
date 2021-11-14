import { message, Popconfirm } from 'antd'
import React from 'react'
import { deleteCheatSheet } from '../../../actions/cheatSheet'
import MainTable from '../../../components/MainTable'
import CheatSheetStyle from '../CheetSheet.style'
import PublishSwitcher from './PublishSwitcher'

const CheatBox = (props) => {
  const { type, onClick, title, id, status,
    fetchCheatSheet, topicId, order, onEditClick, description } = props
  const deleteCheatSheets = async () => {
    const hideLoadingMessage = message.loading('Deleting content...', 0)
    const { deleteCheatSheet: data } = await deleteCheatSheet(id)
    if (data && data.id) {
      hideLoadingMessage()
      message.success('Content deleted successfully')
    } else {
      hideLoadingMessage()
    }
  }
  return (
    <CheatSheetStyle.CheatBox>
      <CheatSheetStyle.StyledButton
        style={{ width: 'fit-content', display: 'flex', alignItems: 'center' }}
        type={type}
        onClick={onClick}
      >
        {order}.
        {title}
        <PublishSwitcher
          cheatSheetId={id}
          status={status}
          fetchCheatSheet={fetchCheatSheet}
          topicId={topicId}
        />
        <div style={{ display: 'flex', marginLeft: '10px', flexDirection: 'column' }}>
          <MainTable.ActionItem.IconWrapper>
            <Popconfirm
              title='Do you want to delete?'
              placement='topRight'
              onConfirm={() => deleteCheatSheets()}
              okText='Yes'
              cancelText='Cancel'
              overlayClassName='popconfirm-overlay-primary'
            >
              <MainTable.ActionItem.IconWrapper>
                <MainTable.ActionItem.DeleteIcon />
              </MainTable.ActionItem.IconWrapper>
            </Popconfirm>
          </MainTable.ActionItem.IconWrapper>
          <MainTable.ActionItem.IconWrapper>
            <MainTable.ActionItem.EditIcon
              style={{ color: type === 'primary' ? 'white' : '#096dd9' }}
              onClick={() =>
                onEditClick({ id, title, status, order, description: description || '' })}
            />
          </MainTable.ActionItem.IconWrapper>
        </div>
      </CheatSheetStyle.StyledButton>
    </CheatSheetStyle.CheatBox>
  )
}

export default CheatBox
