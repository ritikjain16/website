import React from 'react'

const injectProps = extraProps => Component => props => (
  <Component {...props} {...extraProps} />
)

export default injectProps
