import { Icon, Tooltip } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'
import MainTable from '../../../../../components/MainTable'
import { Table } from '../../../../../components/StyledComponents'

const LoComponent = (props) => {
  const { data, type } = props
  const getTotalEmojiCount = () => {
    let totalEmojiCount = 0
    get(data, 'messages', []).map((message) => (
      totalEmojiCount += get(message, 'emojiMessagesCount.count', 0)
    ))
    return totalEmojiCount
  }

  const renderStats = () => {
    const tdStyle = { backgroundColor: 'transparent' }
    const mainStyle = { border: '1px solid lightgray', borderRadius: '5px', padding: '8px' }
    if (type === 'chat') {
      return (
        <div style={mainStyle}>
          <Table.Item style={tdStyle}>
            <Tooltip title='Left Messages Count' placement='left'>
              <MainTable.ItemBox isLeft title=''>{get(data, 'leftTextMessagesCount.count')}</MainTable.ItemBox>
            </Tooltip>
          </Table.Item>
          <Table.Item style={tdStyle}>
            <Tooltip title='Right Messages Count' placement='right'>
              <MainTable.ItemBox>{get(data, 'rightTextMessagesCount.count')}</MainTable.ItemBox>
            </Tooltip>
          </Table.Item>
          <Table.Item style={tdStyle}>
            <MainTable.Item isInlineItem style={{ margin: '2px 0 0 0' }}>
              <Tooltip title='Emoji Count' placement='left'>
                <img src='/images/emoji.png' alt='Emoji' />
              </Tooltip>
            </MainTable.Item>
            <MainTable.Item isInlineItem style={{ margin: '2px 0 0 0' }} >{getTotalEmojiCount()}</MainTable.Item>
            <MainTable.Item isInlineItem style={{ opacity: '0.5' }}>|</MainTable.Item>
            <MainTable.Item isInlineItem style={{ margin: '2px 0 0 0' }}>
              <Tooltip title='Sticker Count' placement='left'>
                <img src='/images/sticker.png' alt='Sticker' />
              </Tooltip>
            </MainTable.Item>
            <MainTable.Item isInlineItem style={{ margin: '2px 0 0 0' }} >{get(data, 'stickerMessagesCount.count')}</MainTable.Item>
            <MainTable.Item isInlineItem style={{ opacity: '0.5' }}>|</MainTable.Item>
            <Tooltip title='Terminal Count' placement='right'>
              <Icon type='code' style={{ fontSize: '20px', margin: '2px 0 0 0' }} />
            </Tooltip>
            <MainTable.Item isInlineItem style={{ margin: '2px 0 0 0' }} >{get(data, 'terminalMessagesCount.count')}</MainTable.Item>
          </Table.Item>
        </div>
      )
    } else if (type === 'quiz') {
      return (
        <div style={mainStyle}>
          <Table.Item style={tdStyle}>
            <Tooltip title='published' placement='left'>
              <MainTable.Status status='published' isInlineItem />
            </Tooltip>
            <MainTable.Item isInlineItem>{get(data, 'publishedQuizCount.count')}
            </MainTable.Item>
            <MainTable.Item isInlineItem style={{ opacity: '0.5' }}>|
            </MainTable.Item>
            <Tooltip title='unpublished' placement='left'>
              <MainTable.Status status='unpublished' isInlineItem />
            </Tooltip>
            <MainTable.Item isInlineItem>{get(data, 'unpublishedQuizCount.count')}
            </MainTable.Item>
          </Table.Item>
        </div>
      )
    } else if (type === 'PQ') {
      return (
        <div style={mainStyle}>
          <Table.Item style={tdStyle}>
            <Tooltip title='published' placement='left'>
              <MainTable.Status status='published' isInlineItem />
            </Tooltip>
            <MainTable.Item isInlineItem>{get(data, 'publishedPQCount.count')}
            </MainTable.Item>
            <MainTable.Item isInlineItem style={{ opacity: '0.5' }}>|
            </MainTable.Item>
            <Tooltip title='unpublished' placement='left'>
              <MainTable.Status status='unpublished' isInlineItem='true' />
            </Tooltip>
            <MainTable.Item isInlineItem>{get(data, 'unpublishedPQCount.count')}
            </MainTable.Item>
          </Table.Item>
        </div>
      )
    } else if (type === 'title') {
      return <Link to={`/comic/${get(data, 'id')}`}>{get(data, 'title')}</Link>
    }
  }
  return (
    <div>
      {renderStats()}
    </div>
  )
}

export default LoComponent
