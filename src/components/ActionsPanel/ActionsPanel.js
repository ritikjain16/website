import React from 'react'
import PropTypes from 'prop-types'
import { Popconfirm } from 'antd'
import MainTable from '../MainTable'

const TableActions = ({
  id,
  eyeRequired,
  deleteItem,
  openEdit,
  openEmulatorView,
  unpublish,
  publish,
  isPublished,
  title,
  questions,
  setEmulatorViewQuestions
}) => (
  <MainTable.ActionItem>
    {
      eyeRequired &&
      <React.Fragment>
        <div>
          <MainTable.ActionItem.IconWrapper onClick={() => {
              openEmulatorView(id)
              setEmulatorViewQuestions(questions)
          }}
          >
            <MainTable.ActionItem.EyeIcon />
          </MainTable.ActionItem.IconWrapper>
        </div>
        <MainTable.ActionItem.Line />
      </React.Fragment>
  }
    <div>
      <MainTable.ActionItem.IconWrapper onClick={openEdit(id)}>
        <MainTable.ActionItem.EditIcon />
      </MainTable.ActionItem.IconWrapper>
    </div>
    <MainTable.ActionItem.Line />
    <div>
      <Popconfirm
        title={`Do you want to delete this ${title}?`}
        placement='topRight'
        onConfirm={deleteItem(id)}
        okText='Yes'
        cancelText='Cancel'
        key='delete'
        overlayClassName='popconfirm-overlay-primary'
      >
        <MainTable.ActionItem.IconWrapper>
          <MainTable.ActionItem.DeleteIcon />
        </MainTable.ActionItem.IconWrapper>
      </Popconfirm>
    </div>
    <MainTable.ActionItem.Line />
    <div>
      {isPublished
        ? (
          <Popconfirm
            title={`Do you want to unpublish this ${title} ?`}
            placement='topRight'
            onConfirm={unpublish(id)}
            okText='Yes'
            cancelText='Cancel'
            key='unpublish'
            overlayClassName='popconfirm-overlay-primary'
          >
            <MainTable.ActionItem.IconWrapper>
              <MainTable.ActionItem.UnpublishIcon />
            </MainTable.ActionItem.IconWrapper>
          </Popconfirm>
        )
        : (
          <Popconfirm
            title={`Do you want to publish this ${title} ?`}
            placement='topRight'
            onConfirm={publish(id)}
            okText='Yes'
            cancelText='Cancel'
            key='publish'
            overlayClassName='popconfirm-overlay-primary'
          >
            <MainTable.ActionItem.IconWrapper>
              <MainTable.ActionItem.PublishIcon />
            </MainTable.ActionItem.IconWrapper>
          </Popconfirm>
        )
      }
    </div>
  </MainTable.ActionItem>
)

TableActions.propTypes = {
  id: PropTypes.string.isRequired,
  eyeRequired: PropTypes.bool,
  deleteItem: PropTypes.func.isRequired,
  openEdit: PropTypes.func.isRequired,
  openEmulatorView: PropTypes.func.isRequired,
  publish: PropTypes.func.isRequired,
  unpublish: PropTypes.func.isRequired,
  isPublished: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  questions: PropTypes.shape({}),
  setEmulatorViewQuestions: PropTypes.func.isRequired
}
TableActions.defaultProps = {
  eyeRequired: false,
  questions: {}
}
export default TableActions
