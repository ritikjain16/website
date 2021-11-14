import { Empty, Icon, message } from 'antd'
import React from 'react'
import { addTagsToCheatSheet, removeTagFromCheatSheet } from '../../../../actions/cheatSheet'
import Main from './contentTags.style'

class ContentTags extends React.Component {
  state = {
    tagText: ''
  }
  addTagsToCheatSheet = async (value) => {
    const { selectedCheat, addCheatSheetContentToContents } = this.props
    const hideLoadingMessage = message.loading('Adding Tags...', 0)
    const { addToCheatSheetContentTag: { contentTag } } =
      await addTagsToCheatSheet({}, selectedCheat, value)
    if (contentTag && contentTag.id) {
      hideLoadingMessage()
      this.setState({ tagText: '' })
      addCheatSheetContentToContents(contentTag, 'tags')
    }
  }
  deleteTagsFromCheatSheet = async (value) => {
    const { selectedCheat, deleteCheatSheetContentFromContents } = this.props
    const hideLoadingMessage = message.loading('Removing Tags...', 0)
    const { removeFromCheatSheetContentTag: { contentTag } } =
    await removeTagFromCheatSheet({}, selectedCheat, value)
    if (contentTag && contentTag.id) {
      hideLoadingMessage()
      deleteCheatSheetContentFromContents(contentTag, 'tags')
    }
  }
  getFilteredTags = () => {
    const { addedTags } = this.props
    const tag = []
    if (addedTags && addedTags) {
      tag.push(...addedTags.map(({ id }) => id))
    }
    return tag
  }
  render() {
    const { tags, addedTags } = this.props
    return (
      <Main.FormModal>
        <Main.FormHeading>
          Content Tags
        </Main.FormHeading>
        <Main.FormWrapper>
          <Main.StyledRow>
            <Main.StyledCol span={24}>
              <Main.TagsParentContainer>
                <Main.TagSearch>
                  <Main.TagTitle>
                    Tags
                  </Main.TagTitle>
                  <Main.StyledAutocomplete
                    placeholder='Search Tags'
                    value={this.state.tagText}
                    onChange={(value) => this.setState({ tagText: value })}
                    onSelect={(value) => this.addTagsToCheatSheet(value)}
                    filterOption={(inputValue, option) => (
                      option.props.children &&
                      option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    )}
                  >
                    {tags && addedTags &&
                        tags.filter(t => !this.getFilteredTags().includes(t.id)).map((t) => (
                          <Main.Option key={t.id} value={t.id}>
                            {t.title}
                          </Main.Option>
                    ))}
                  </Main.StyledAutocomplete>
                </Main.TagSearch>
                <Main.TagsContainer>
                  {addedTags &&
                    addedTags.length > 0 ?
                    addedTags.map((tag) => {
                    if (tag) {
                      return (
                        <Main.Tag color='#50d4eb'>
                          <Icon type='cross'
                            onClick={() =>
                              this.deleteTagsFromCheatSheet(tag.id)
                            }
                            style={{
                              background: '#ff6c6c',
                              borderRadius: '100px',
                              fontSize: '10px',
                              padding: '3px',
                              marginRight: '.5rem',
                            }}
                          />
                          {tag.title}
                        </Main.Tag>
                      )
                    }
                  }) : <Empty description='No Tags Added' style={{ margin: '0 auto' }} />}
                </Main.TagsContainer>
              </Main.TagsParentContainer>
            </Main.StyledCol>
          </Main.StyledRow>
        </Main.FormWrapper>
      </Main.FormModal>
    )
  }
}

export default ContentTags
