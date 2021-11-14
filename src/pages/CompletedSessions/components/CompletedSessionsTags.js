import React, { Component } from 'react'
import { Checkbox, Button } from 'antd'
import PropTypes from 'prop-types'
// import { filter } from 'lodash'
import CompletedSessionStyle from '../CompletedSessions.style'
import { green, yellow, red } from '../../../constants/colors'
import { ADMIN, UMS_ADMIN, UMS_VIEWER } from '../../../constants/roles'

export default class CompletedSessionsTags extends Component {
  static propTypes = {
    count: PropTypes.shape({}).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    toggleTags: PropTypes.func.isRequired,
    filterByName: PropTypes.func.isRequired,
    checkAll: PropTypes.bool.isRequired,
    savedRole: PropTypes.string.isRequired
  }

  renderZoneColor = zone => {
    switch (zone) {
      case 'green':
        return green
      case 'red':
        return red
      case 'yellow':
        return yellow
      default:
        return 'grey'
    }
  }

  handleOnTagsClick = (item, key) => {
    const { savedRole } = this.props
    const admin =
      savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)
    if (admin) {
      this.props.toggleTags(item.tag, item.active, key)
    }
  }

  renderTags = () => {
    const { tags, count } = this.props
    return tags.map((item, key) => (
      <CompletedSessionStyle.StyledTagButton
        shape='round'
        key={`${item.tag}`}
        style={{ opacity: item.active ? 'inherit' : '0.3' }}
        onClick={() => this.handleOnTagsClick(item, key)}
      >
        <CompletedSessionStyle.TagsIcon
          style={{ marginRight: '5px', backgroundColor: `${this.renderZoneColor(item.zone)}` }}
        >
          {item.icon}
        </CompletedSessionStyle.TagsIcon>
        <span>{item.displayTitle ? item.displayTitle : item.tag}</span>
        {count.data[item.tag] && count.data[item.tag].count !== 0 ? (
          <CompletedSessionStyle.TagsIcon style={{ marginLeft: '5px', backgroundColor: '#8359f7' }}>
            {count.data[item.tag].count}
          </CompletedSessionStyle.TagsIcon>
        ) : null}
      </CompletedSessionStyle.StyledTagButton>
    ))
  }

  onCheckAllChange = e => {
    this.props.toggleTags('all', e.target.checked, -1)
  }

  render() {
    const { savedRole } = this.props
    const admin =
      savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)
    return (
      <React.Fragment>
        <CompletedSessionStyle.TagsContainer>
          {this.renderTags()}
          {admin ? (
            <CompletedSessionStyle.TagsContainer style={{ margin: '5px 10px', lineHeight: '32px' }}>
              <Checkbox checked={this.props.checkAll} onChange={this.onCheckAllChange}>
                Select All
              </Checkbox>
              <Button
                shape='round'
                style={{
                  height: '30px',
                  padding: '0 12px',
                  margin: '0',
                  fontSize: '12px'
                }}
                onClick={this.props.filterByName}
              >
                Get Results
              </Button>
            </CompletedSessionStyle.TagsContainer>
          ) : null}
        </CompletedSessionStyle.TagsContainer>
      </React.Fragment>
    )
  }
}
