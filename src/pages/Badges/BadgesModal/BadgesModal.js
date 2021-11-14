import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'antd'
import MainModal from '../../../components/MainModal'
import DropZone from '../../../components/Dropzone'
import validators from '../../../utils/formValidators'
import { BADGE_TYPES, BADGE_UNLOCK_POINT } from '../../../constants/badges'
import { getOrderAutoComplete, getOrdersInUse } from '../../../utils/data-utils'

class BadgesModal extends React.Component {
    state={
      inactiveImage: null,
      isInactiveImage: false,
      activeImage: null,
      isActiveImage: false
    }
    // dropzone ref to access the dropzone
    inactiveImageDropzoneRef=React.createRef()
    activeImageDropzoneRef=React.createRef()

    componentDidUpdate(prevProps) {
      if (!prevProps.visible && this.props.visible) {
        this.setDefaultValues()
        // to open the dropzone or set the default image
        if (this.inactiveImageDropzoneRef.current) {
          this.inactiveImageDropzoneRef.current.onOpen()
        }
        if (this.activeImageDropzoneRef.current) {
          this.activeImageDropzoneRef.current.onOpen()
        }
        const { defaultData: { inactiveImage, activeImage } } = this.props
        if (inactiveImage) {
          this.setState({ isInactiveImage: true })
        } else {
          this.setState({ isInactiveImage: false })
        }
        if (activeImage) {
          this.setState({ isActiveImage: true })
        } else {
          this.setState({ isActiveImage: false })
        }
      }
    }

    // set the default form values
    setDefaultValues=() => {
      const { form, defaultData } = this.props
      const { name, order, type, description, unlockPoint } = defaultData
      form.setFieldsValue({
        badgeName: name,
        badgeType: type,
        order,
        description,
        unlockPoint
      })
    }

    // to set the state when image is dropped
    onInactiveImageDrop=(file, isThumbnail) => {
      this.setState({
        inactiveImage: file,
        isInactiveImage: isThumbnail
      })
    }

    onActiveImageDrop=(file, isThumbnail) => {
      this.setState({
        activeImage: file,
        isActiveImage: isThumbnail
      })
    }

    // send the values to database after succesful validation
    onSave= () => {
      this.props.form.validateFields(async (err, values) => {
        if (!err) {
          const {
            badgeName: name,
            badgeType: type,
            order,
            description,
            unlockPoint
          } = values
          const { id: defaultDataId } = this.props.defaultData
          const { inactiveImage, activeImage, isInactiveImage, isActiveImage } = this.state
          const input = {
            name,
            type,
            order,
            description: description ? description.trim() : '',
            unlockPoint
          }
          // files=when images are added or changed files contain the image information
          const files = [inactiveImage, activeImage]
          // isThumbnails=to check to if images are present either new or default image
          const isThumbnails = [isInactiveImage, isActiveImage]
          const { id } = await this.props.onSave(defaultDataId, input, files, isThumbnails)
          // close the modal only if badge is successfully added or updated
          if (id) {
            this.props.closeModal()
          }
        }
      })
    }

    // to view orders in use on change of badge type 1.character,2.equipment
    setOrder = (badgeType) => {
      const ordersInUse = this.ordersInUse(badgeType)
      const {
        form: { setFieldsValue }
      } = this.props
      setFieldsValue({
        order: getOrderAutoComplete(ordersInUse)
      })
    }

    // to calculate ordersinuse the 2nd param is id for edit mode else only 'AddQuestion'
    ordersInUse = (badgeType, id = 'AddQuestion') => {
      const { badges } = this.props
      if (!badgeType || badges.length === 0) {
        return []
      }
      if (id !== 'AddQuestion') {
        // We are editing badge info
        const badgesOfType = badges.filter(badge => badge.type === badgeType && badge.id !== id)
        return getOrdersInUse(badgesOfType)
      }
      const badgesOfType = badges.filter(badge => badge.type === badgeType)
      return getOrdersInUse(badgesOfType)
    }

    // called on clicking cancel button and reset all fields
    onCancel=() => {
      const { closeModal, form } = this.props
      form.resetFields()
      this.setState({
        isActiveImage: false,
        isInactiveImage: false,
        inactiveImage: null,
        activeImage: null
      })
      closeModal()
    }

    render() {
      const { visible, title, form, form: { getFieldValue }, defaultData: { id } } = this.props
      const ordersInUse = this.ordersInUse(getFieldValue('badgeType'), id)
      return (
        <MainModal
          visible={visible}
          onCancel={this.onCancel}
          title={title}
          onOk={this.onSave}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', textAlign: 'center' }}>Inactive Image</div>
              <DropZone
                width='90%'
                getDropzoneFile={this.onInactiveImageDrop}
                ref={this.inactiveImageDropzoneRef}
                defaultImage={this.props.defaultData.inactiveImage}
              />
            </div>
            <div style={{ border: '1px solid grey' }} />
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', textAlign: 'center' }}>Active Image</div>
              <DropZone
                width='90%'
                getDropzoneFile={this.onActiveImageDrop}
                ref={this.activeImageDropzoneRef}
                defaultImage={this.props.defaultData.activeImage}
              />
            </div>
          </div>
          <Form onSubmit={this.onSave}>
            <div id={`badgeType${this.props.title}`}>
              {/* id:badgeType not working if used since
              addmodal and edit modal are different instances */}
              <MainModal.FormItem>
                {
                  form.getFieldDecorator(...validators.badgeType)(
                    <MainModal.Select style={{ width: '100%' }}
                      placeholder='Choose Badge Type'
                      /** This prop helps in correctly rendering the dropdown menu
                       * How to use this prop?Wrap the select tag with a div and give a id.
                       * The prop accepts a function which returns node for which the select
                       * tag should takes a reference and render relative to it
                       * Here is a link to the issue if this prop was not used
                       * URL:https://monosnap.com/file/WHQjB5AHxno6SDqiAYXHkjLHoIZOMw
                       */
                      getPopupContainer={() => document.getElementById(`badgeType${this.props.title}`)}
                      onChange={badgeType => this.setOrder(badgeType)}
                    >
                      {
                        BADGE_TYPES.map(badgeType =>
                          <MainModal.Option key={badgeType} value={badgeType}>
                            {badgeType}
                          </MainModal.Option>)
                      }
                    </MainModal.Select>
                  )
                }
              </MainModal.FormItem>
            </div>
            <MainModal.FormItem>
              {
                form.getFieldDecorator(...validators.badgeName)(
                  <MainModal.Input
                    placeholder='Enter the name'
                    autosize
                  />
                )
              }
            </MainModal.FormItem>
            <MainModal.FormItem>
              {
                form.getFieldDecorator('description')(
                  <MainModal.TextArea placeholder='Enter the badge description' rows={4} />
                )
              }
            </MainModal.FormItem>
            <div id={`badgeUnlockPoint${this.props.title}`}>
              <MainModal.FormItem>
                {
                  form.getFieldDecorator(...validators.unlockPoint)(
                    <MainModal.Select style={{ width: '100%' }}
                      placeholder='Choose Badge Unlock Point'
                      getPopupContainer={() => document.getElementById(`badgeUnlockPoint${this.props.title}`)}
                      onChange={badgeType => this.setOrder(badgeType)}
                    >
                      {
                        BADGE_UNLOCK_POINT.map(unlockPoint =>
                          <MainModal.Option key={unlockPoint} value={unlockPoint}>
                            {unlockPoint}
                          </MainModal.Option>)
                      }
                    </MainModal.Select>
                  )
                }
              </MainModal.FormItem>
            </div>
            <MainModal.OrderHelperText>Orders in use: {ordersInUse.join(',')}</MainModal.OrderHelperText>
            <MainModal.FormItem>
              {
                form.getFieldDecorator(...validators.order(ordersInUse, 100))(
                  <MainModal.OrderInput />
                )
              }
            </MainModal.FormItem>
          </Form>
        </MainModal>
      )
    }
}

BadgesModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  ordersInUse: PropTypes.arrayOf(PropTypes.number).isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFields: PropTypes.func,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  defaultData: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    order: PropTypes.number,
    category: PropTypes.string,
    description: PropTypes.string,
    inactiveImage: PropTypes.string,
    activeImage: PropTypes.string,
    unlockPoint: PropTypes.string.isRequired
  }).isRequired,
  badges: PropTypes.arrayOf({}).isRequired,
}

export default Form.create()(BadgesModal)
