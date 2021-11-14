import React, { Component } from 'react'
import PropTypes from 'prop-types'
import editorStyles from './editorStyle.module.scss'
import HeadlinesPicker from './HeadlinesPicker'

class HeadlinesButton extends Component {
    onClick = () =>
    // A button can call `onOverrideContent` to replace the content
    // of the toolbar. This can be useful for displaying sub
    // menus or requesting additional information from the user.
      this.props.onOverrideContent(HeadlinesPicker);

    render() {
      return (
        <div className={editorStyles.headlineButtonWrapper}>
          <button onClick={this.onClick} className={editorStyles.headlineButton}>
                    H
          </button>
        </div>
      )
    }
}

HeadlinesButton.propTypes = {
  onOverrideContent: PropTypes.func.isRequired
}

export default HeadlinesButton
