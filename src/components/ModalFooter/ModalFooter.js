import React, { Component } from 'react'
import { Spin, Icon } from 'antd'
import PropTypes from 'prop-types'
import Footer from './ModalFooter.style'

/** it is the footer for the modal consisting of cancel and save and will be used
* in multiple modals and it expects two functions for handling the click on cancel
* and save.
*/
class ModalFooter extends Component {
 static propTypes = {
   handleCancel: PropTypes.func,
   handleSave: PropTypes.func,
   id: PropTypes.string,
   isLoading: PropTypes.bool
 }

 static defaultProps = {
   handleCancel: () => {},
   handleSave: () => {},
   id: null,
   isLoading: false
 }

  // function invoked when clicked on cancel which invokes the callback if passed
  handleCancel = () => {
    if (this.props.handleCancel) {
      this.props.handleCancel()
    }
  }

  // function invoked when clicked on save which invokes the callback if passed
  handleSave = () => {
    if (this.props.handleSave) {
      this.props.handleSave()
    }
  }

  render() {
    const antIcon = <Icon type='loading' style={{ fontSize: 18 }} spin />
    return (
      <Footer>
        <Footer.Cancel onClick={this.handleCancel}>CANCEL</Footer.Cancel>
        <Footer.SaveButton
          type='primary'
          onClick={this.handleSave}
          htmlType='submit'
          form={this.props.id}
        >
         SAVE
          {this.props.isLoading && <Spin indicator={antIcon} />}
        </Footer.SaveButton>
      </Footer>
    )
  }
}

export default ModalFooter
