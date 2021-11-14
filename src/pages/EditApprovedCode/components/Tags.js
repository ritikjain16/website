import React, { memo, useEffect, useState } from 'react'
import { Empty, Icon } from 'antd'
import EditApprovedCodeStyle from '../EditApprovedCode.style'
import fetchUserApprovedTags from '../../../actions/userApprovedCodeTags/fetchUserApprovedCodeTags'
import addUserApprovedCodeTagMapping from '../../../actions/userApprovedCodeTags/addUserApprovedCodeTagMapping'
import deleteUserApprovedCodeTagMapping from '../../../actions/userApprovedCodeTags/deleteUserApprovedCodeTagMapping'

const Tags = ({ userApprovedCode, approvedCodeTags, fetchUserSavedCodeData }) => {
  const [tagFilterIds, setTagFilterIds] = useState([])

  useEffect(() => {
    setTagFilterIds(
      userApprovedCode && userApprovedCode.userApprovedCodeTagMappings &&
        userApprovedCode.userApprovedCodeTagMappings.map(
          (tags) => tags.userApprovedCodeTag && tags.userApprovedCodeTag.id))
  }, [approvedCodeTags])

  useEffect(() => {
    const filterQuery = `{ and: [
        {status:published}
      ]
    }`
    fetchUserApprovedTags(filterQuery, 0, 0)

    setTagFilterIds(
      userApprovedCode && userApprovedCode.userApprovedCodeTagMappings &&
        userApprovedCode.userApprovedCodeTagMappings.map(
          (tags) => tags.userApprovedCodeTag && tags.userApprovedCodeTag.id))
  }, [])

  const addApprovedTagMapping = (userApprovedTagString) => {
    /**
     * @userApprovedTagString -> id/title
     *
     * id => userApprovedTagData[0];
     * title => userApprovedTagData[1];
    */
    const userApprovedTagData = userApprovedTagString.split('/')
    const input = {}
    if (userApprovedTagData[1]) {
      // eslint-disable-next-line prefer-destructuring
      input.title = userApprovedTagData[1]
    }
    addUserApprovedCodeTagMapping(input, userApprovedCode.id, userApprovedTagData[0]).then(() => {
      fetchUserSavedCodeData()
    })
  }

  const deleteApprovedTagMapping = (tagMappingId) => {
    deleteUserApprovedCodeTagMapping(tagMappingId).then(() => {
      fetchUserSavedCodeData()
    })
  }

  return (
    <>
      <EditApprovedCodeStyle.StyledRow>
        <EditApprovedCodeStyle.StyledCol span={24}>
          <EditApprovedCodeStyle.TagsParentContainer>
            <EditApprovedCodeStyle.TagSearch>
              <EditApprovedCodeStyle.TagTitle>
                Tags
              </EditApprovedCodeStyle.TagTitle>
              <EditApprovedCodeStyle.Select
                placeholder='Search  Tags'
                onChange={(value) => addApprovedTagMapping(value)}
                value='Search Tags'
              >
                {approvedCodeTags && tagFilterIds &&
                  approvedCodeTags.filter(tags => !tagFilterIds.includes(tags.id)).map((tags) => (
                    <EditApprovedCodeStyle.Option key={tags.id} value={`${tags.id}/${tags.title}`}>
                      {tags.title}
                    </EditApprovedCodeStyle.Option>
                  ))}
              </EditApprovedCodeStyle.Select>
            </EditApprovedCodeStyle.TagSearch>
            <EditApprovedCodeStyle.TagsContainer>
              {userApprovedCode &&
                userApprovedCode.userApprovedCodeTagMappings.length ?
                userApprovedCode.userApprovedCodeTagMappings.map((tag) => {
                  if (tag.userApprovedCodeTag) {
                    return (
                      <EditApprovedCodeStyle.Tag color='#50d4eb'>
                        <Icon type='cross'
                          onClick={() =>
                            deleteApprovedTagMapping(tag && tag.id)
                          }
                          style={{
                            background: '#ff6c6c',
                            borderRadius: '100px',
                            fontSize: '10px',
                            padding: '3px',
                            marginRight: '.5rem',
                          }}
                        />
                        {tag.userApprovedCodeTag.title}
                      </EditApprovedCodeStyle.Tag>
                    )
                  }
                }) : <Empty description='No Tags Added' />}
            </EditApprovedCodeStyle.TagsContainer>
          </EditApprovedCodeStyle.TagsParentContainer>
        </EditApprovedCodeStyle.StyledCol>
      </EditApprovedCodeStyle.StyledRow>
    </>
  )
}


export default memo(Tags)
