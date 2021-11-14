import React, { Component, Fragment } from 'react'
import { Tooltip } from 'antd'
import { filter } from 'lodash'
import PropTypes from 'prop-types'
import MentorTagsStyle from './mentorTags.style'
import { green, yellow, red } from '../../constants/colors'

class MentorTags extends Component {
  state = {
    tags: [
      { tag: 'friendly', icon: 'FR', zone: 'green', active: true, count: 0 },
      {
        tag: 'motivating',
        icon: 'MO',
        zone: 'green',
        active: true,
        count: 0
      },
      { tag: 'engaging', icon: 'ENG', zone: 'green', active: true, count: 0 },
      { tag: 'helping', icon: 'HE', zone: 'green', active: true, count: 0 },
      {
        tag: 'enthusiastic',
        icon: 'ENT',
        zone: 'green',
        active: true,
        count: 0
      },
      { tag: 'patient', icon: 'PA', zone: 'green', active: true, count: 0 },
      {
        tag: 'conceptsPerfectlyExplained',
        displayTitle: 'Concepts Perfectly Explained',
        icon: 'CPE',
        zone: 'green',
        active: true,
        count: 0
      },
      {
        tag: 'averageExplanation',
        displayTitle: 'Average Explanation',
        icon: 'AE',
        zone: 'yellow',
        active: true,
        count: 0
      },
      { tag: 'distracted', icon: 'DI', zone: 'red', active: true, count: 0 },
      { tag: 'rude', icon: 'RU', zone: 'red', active: true, count: 0 },
      {
        tag: 'slowPaced',
        displayTitle: 'Slow Paced',
        icon: 'SP',
        zone: 'red',
        active: true,
        count: 0
      },
      {
        tag: 'fastPaced',
        displayTitle: 'Fast Paced',
        icon: 'FP',
        zone: 'red',
        active: true,
        count: 0
      },
      {
        tag: 'notPunctual',
        displayTitle: 'Not Punctual',
        icon: 'NP',
        zone: 'red',
        active: true,
        count: 0
      },
      { tag: 'boring', icon: 'BO', zone: 'red', active: true, count: 0 },
      {
        tag: 'poorExplanation',
        displayTitle: 'Poor Explanation',
        icon: 'PE',
        zone: 'red',
        active: true,
        count: 0
      }
    ]
  }

  componentDidMount() {
    const { tags } = this.state
    const tagsToShow = filter(tags, item => this.props.tags[item.tag])
    // console.log(this.props.tags, tagsToShow)
    this.setState({
      tagsToShow
    })
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

  render() {
    const { tagsToShow } = this.state
    if (!tagsToShow) {
      return '-'
    }
    if (tagsToShow.length > 3) {
      return (
        <Fragment>
          <MentorTagsStyle.TagsIcon
            style={{
              backgroundColor: `${this.renderZoneColor(tagsToShow[0].zone)}`,
              marginLeft: '-8px',
              border: '1px solid #fff'
            }}
          >
            {tagsToShow[0].icon}
          </MentorTagsStyle.TagsIcon>
          <MentorTagsStyle.TagsIcon
            style={{
              backgroundColor: `${this.renderZoneColor(tagsToShow[1].zone)}`,
              marginLeft: '-8px',
              border: '1px solid #fff'
            }}
          >
            {tagsToShow[1].icon}
          </MentorTagsStyle.TagsIcon>
          <Tooltip
            placement='right'
            title={() =>
              tagsToShow.map(item => (
                <MentorTagsStyle.MoreTags>
                  {item.displayTitle ? item.displayTitle : item.tag}
                </MentorTagsStyle.MoreTags>
              ))
            }
          >
            <MentorTagsStyle.TagsIcon
              style={{ backgroundColor: '#777', marginLeft: '-8px', border: '1px solid #fff' }}
            >
              +{tagsToShow.length - 2}
            </MentorTagsStyle.TagsIcon>
          </Tooltip>
        </Fragment>
      )
    }
    return tagsToShow.map(item => (
      <MentorTagsStyle.TagsIcon
        style={{
          backgroundColor: `${this.renderZoneColor(item.zone)}`,
          marginLeft: '-8px',
          border: '1px solid #fff'
        }}
      >
        {item.icon}
      </MentorTagsStyle.TagsIcon>
    ))
  }
}

MentorTags.propTypes = {
  tags: PropTypes.shape({}).isRequired
}

export default MentorTags
