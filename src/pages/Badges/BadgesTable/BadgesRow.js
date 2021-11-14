import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Table } from '../../../components/StyledComponents'
import MainTable from '../../../components/MainTable'
import ActionPanel from '../../../components/ActionsPanel'
import formatDate from '../../../utils/formatDate'
import { PUBLISHED_STATUS } from '../../../constants/questionBank'
import getFullPath from '../../../utils/getFullPath'
import Modal from '../../../components/MainModal'

/** @returns a row of badge */
const BadgeRow = (props) => {
  const [isHovering, setIsHovering] = useState(false)
  const [isInactiveImageVisible, setInactiveModalVisible] = useState(false)
  const [isActiveImageVisible, setActiveModalVisible] = useState(false)
  const { badge: { id, order, name, status, inactiveImage, activeImage } } = props
  const createdAt = formatDate(props.badge.createdAt)
  const updatedAt = formatDate(props.badge.updatedAt)

  const onMouseEnter = () => {
    setIsHovering(true)
  }

  const onMouseLeave = () => {
    setIsHovering(false)
  }

  const openInactiveImageModal = () => {
    setInactiveModalVisible(true)
  }

  const closeInactiveImageModal = () => {
    setInactiveModalVisible(false)
  }

  const openActiveImageModal = () => {
    setActiveModalVisible(true)
  }

  const closeActiveImageModal = () => {
    setActiveModalVisible(false)
  }

  return (
    <Table.Row
      isHovering={isHovering}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ height: '100px' }}
      {...props}
    >
      <Table.Item><MainTable.Item>{order}</MainTable.Item></Table.Item>
      <Table.Item><MainTable.Item>{name}</MainTable.Item></Table.Item>
      <Table.Item style={{ height: '100%' }}>
        <MainTable.Item style={{ height: '100%', padding: '5px', borderRadius: '5px' }} onClick={openInactiveImageModal}>
          <img src={inactiveImage && getFullPath(inactiveImage.uri)} alt='' style={{ height: '100%', flex: 1 }} />
        </MainTable.Item>
      </Table.Item>
      <Modal title='Inactive Image' visible={isInactiveImageVisible} onCancel={closeInactiveImageModal} footer={null}>
        <img src={inactiveImage && getFullPath(inactiveImage.uri)} alt='' style={{ height: '100%', width: '100%' }} />
      </Modal>
      <Table.Item style={{ height: '100%', }} onClick={openActiveImageModal}>
        <MainTable.Item style={{ height: '100%', padding: '5px', borderRadius: '5px' }}>
          <img src={activeImage && getFullPath(activeImage.uri)} alt='' style={{ height: '100%', flex: 1 }} />
        </MainTable.Item>
      </Table.Item>
      <Modal title='Active Image' visible={isActiveImageVisible} onCancel={closeActiveImageModal} footer={null}>
        <img src={activeImage && getFullPath(activeImage.uri)} alt='' style={{ height: '100%', width: '100%' }} />
      </Modal>
      <Table.Item>
        <MainTable.DateItem>
          <div>{createdAt.date}</div>
          <div>{createdAt.time}</div>
        </MainTable.DateItem>
      </Table.Item>
      <Table.Item>
        <MainTable.DateItem>
          <div>{updatedAt.date}</div>
          <div>{updatedAt.time}</div>
        </MainTable.DateItem>
      </Table.Item>
      <Table.Item>
        <MainTable.Status status={status} />
      </Table.Item>
      <Table.Item>
        <ActionPanel
          id={id}
          title='Badge'
          deleteItem={props.deleteBadge}
          openEdit={props.openEditModal}
          publish={props.publishBadge}
          unpublish={props.unpublishBadge}
          isPublished={status === PUBLISHED_STATUS}
        />
      </Table.Item>
    </Table.Row>
  )
}

BadgeRow.propTypes = {
  badge: PropTypes.shape({
    id: PropTypes.string,
    order: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    status: PropTypes.string,
    chaptersMeta: PropTypes.shape({
      count: PropTypes.number
    })
  }).isRequired,
  // function to open edit modal
  openEditModal: PropTypes.func.isRequired,
  deleteBadge: PropTypes.func.isRequired,
  publishBadge: PropTypes.func.isRequired,
  unpublishBadge: PropTypes.func.isRequired
}

export default BadgeRow
