import React from 'react'
import PropTypes from 'prop-types'

const AnimateVisible = props => (
  <div style={{
            maxHeight: props.visible ? props.maxHeight : props.minHeight,
            overflow: 'hidden',
            transition: props.transition
        }}
  >
    {props.children}
  </div>
)

AnimateVisible.propTypes = {
  visible: PropTypes.bool.isRequired,
  minHeight: PropTypes.string.isRequired,
  transition: PropTypes.string.isRequired,
  children: PropTypes.shape({}).isRequired,
  maxHeight: PropTypes.string.isRequired
}

export default AnimateVisible
