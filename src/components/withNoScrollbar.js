import React, { Component } from 'react'

const withNoScrollBar = (ComponentToEnhance) => class NoScrollBar extends Component {
  componentDidMount() {
    const css = `::-webkit-scrollbar {
      display: none;
    }`
    const head = document.head || document.getElementsByTagName('head')[0]
    const style = document.createElement('style')
    style.setAttribute('id', 'scrollBarCSS')
    head.appendChild(style)
    style.type = 'text/css'
    if (style.styleSheet) {
      // This is required for IE8 and below.
      style.styleSheet.cssText = css
    } else {
      style.appendChild(document.createTextNode(css))
    }
  }
  componentWillUnmount() {
    const head = document.head || document.getElementsByTagName('head')[0]
    const style = document.getElementById('scrollBarCSS')
    head.removeChild(style)
  }
  render() {
    return <ComponentToEnhance {...this.props} />
  }
}

export default withNoScrollBar
