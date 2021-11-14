import { Icon, message, Spin } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import EditBannerStyle from './EditBanner.style'
import fetchBanners from '../../actions/banner/fetchBanners'
import AddBanner from './components/AddBanner'
import EditBannerForm from './components/EditBannerForm'
import LiveBanner from './components/LiveBanner'

class EditBanner extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bannerId: this.props.match.params.id,
      editBanners: null,
      addBanners: {
        title: '',
        description: '',
        width: 0,
        height: 0,
        textBeforeDiscount: '',
        beforeFontSize: 0,
        beforeColor: '',
        discount: '',
        discountColor: '',
        discountSize: 0,
        discountBackground: '',
        textAfterDiscount: '',
        afterColor: '',
        afterFontSize: 0,
        expiry: '',
        inceptionDate: '',
        backgroundImage: null,
        lottie: null,
        disclaimerText: '',
        disclaimerTextColor: '',
        disclaimerTextFontSize: 0,
      }
    }
  }
  componentDidMount = async () => {
    const { bannerId } = this.state
    if (bannerId) {
      const { banners } = await fetchBanners(`{id: "${bannerId}"}`, 1, 0)
      const {
        title, description, width, height, textBeforeDiscount,
        textBeforeDiscountFontSize, textBeforeDiscountColor, discount,
        discountColor, discountFontSize, discountBackground, textAfterDiscount,
        textAfterDiscountColor, textAfterDiscountFontSize, expiryDate, disclaimerText,
        disclaimerTextColor, disclaimerTextFontSize, inceptionDate, ...rest
      } = banners[0]
      this.setState({
        editBanners: {
          title,
          description: description || '',
          width: width || 0,
          height: height || 0,
          textBeforeDiscount: textBeforeDiscount || '',
          beforeFontSize: textBeforeDiscountFontSize || 0,
          beforeColor: textBeforeDiscountColor || '',
          discount: discount || '',
          discountColor: discountColor || '',
          discountSize: discountFontSize || 0,
          discountBackground: discountBackground || '',
          textAfterDiscount: textAfterDiscount || '',
          afterColor: textAfterDiscountColor || '',
          afterFontSize: textAfterDiscountFontSize || 0,
          expiry: expiryDate,
          inceptionDate,
          disclaimerText: disclaimerText || '',
          disclaimerTextColor: disclaimerTextColor || '',
          disclaimerTextFontSize: disclaimerTextFontSize || 0,
          ...rest
        }
      })
    }
  }
  handleAddBanner = async (value) => {
    const { beforeFontSize, beforeColor,
      discountSize,
      afterColor, afterFontSize,
      expiry, lottie, ...rest } = value
    const { addBanner } = this.props
    const hideLoadingMessage = message.loading('Adding Banner...', 0)
    const addedBanner = await addBanner({
      textAfterDiscountColor: afterColor,
      textAfterDiscountFontSize: afterFontSize,
      expiryDate: expiry,
      textBeforeDiscountFontSize: beforeFontSize,
      textBeforeDiscountColor: beforeColor,
      discountFontSize: discountSize,
      lottieFile: lottie,
      ...rest
    })
    if (addedBanner && addedBanner.id) {
      hideLoadingMessage()
      message.success(`Banner ${addedBanner.title} added successfully`)
      this.props.history.goBack()
    } else {
      hideLoadingMessage()
      message.error('Unexpected error.')
    }
  }
  handleUpdateBanner = async (value, { setErrors }) => {
    const { beforeFontSize, beforeColor, discountSize,
      afterColor, afterFontSize, backgroundImg, lottieUri,
      expiry, backgroundImage, lottie, lottieId,
      disclaimerTextFontSize,
      backgroundImgId, lottieName, width, height, ...rest } = value
    const { bannerId } = this.state
    const { updateBanner, removeBackground, removeLottieFile } = this.props
    const datas = {
      id: bannerId,
      textAfterDiscountColor: afterColor,
      textAfterDiscountFontSize: afterFontSize || 0,
      expiryDate: expiry,
      textBeforeDiscountFontSize: beforeFontSize || 0,
      textBeforeDiscountColor: beforeColor,
      discountFontSize: discountSize || 0,
      disclaimerTextFontSize: disclaimerTextFontSize || 0,
      width: width || 0,
      height: height || 0,
      ...rest
    }
    const hideLoadingMessage = message.loading('Updating Banner...', 0)
    if ((!backgroundImg && !backgroundImage)) {
      hideLoadingMessage()
      setErrors({ backgroundImage: 'Required' })
    } else if (backgroundImage || lottie) {
      if (backgroundImage) {
        await removeBackground({ bannerId, backgroundImgId })
        datas.backgroundImage = backgroundImage
      }
      if (lottie) {
        if (lottieId) await removeLottieFile({ bannerId, lottieId })
        datas.lottieFile = lottie
      } else if (!lottie && !lottieName && !lottieUri && lottieId) {
        await removeLottieFile({ bannerId, lottieId })
      }
      const editedData = await updateBanner({
        ...datas
      })
      if (editedData && editedData.id) {
        hideLoadingMessage()
        message.success(`Banner ${editedData.title} updated successfully`)
        this.props.history.goBack()
      } else {
        hideLoadingMessage()
        message.error('Unexpected error.')
      }
    } else {
      if (!lottie && !lottieName && !lottieUri && lottieId) {
        await removeLottieFile({ bannerId, lottieId })
      }
      const editedData = await updateBanner({
        ...datas
      })
      if (editedData && editedData.id) {
        hideLoadingMessage()
        message.success(`Banner ${editedData.title} updated successfully`)
        this.props.history.goBack()
      } else {
        hideLoadingMessage()
        message.error('Unexpected error.')
      }
    }
  }
  handleStateChange = (e) => {
    const { name, value } = e.target
    if (this.state.bannerId) {
      this.setState({
        editBanners: {
          ...this.state.editBanners,
          [name]: value
        }
      })
    } else {
      this.setState({
        addBanners: {
          ...this.state.addBanners,
          [name]: value
        }
      })
    }
  }
  handleFileChange = (file, type, defaultFile) => {
    if (this.state.bannerId && this.state.editBanners) {
      this.setState({
        editBanners: {
          ...this.state.editBanners,
          [type]: file ? URL.createObjectURL(file) : defaultFile || {}
        }
      })
    } else {
      this.setState({
        addBanners: {
          ...this.state.addBanners,
          [type]: file ? URL.createObjectURL(file) : {}
        }
      })
    }
  }
  render() {
    const { bannerId, editBanners, addBanners } = this.state
    const { isBannerFetching, hasBannerFetched } = this.props
    return (
      <>
        {bannerId && editBanners ?
          <LiveBanner data={editBanners} /> :
          addBanners && <LiveBanner data={addBanners} />}
        <EditBannerStyle>
          <EditBannerStyle.Container>
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'flex-end', }} >
              <Link to='/ums/banner'
                style={{
                  fontSize: '20px'
                }}
              >
                <Icon type='cross' />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }} >
              {bannerId ? (
                <Spin
                  spinning={!hasBannerFetched && isBannerFetching}
                >
                  {editBanners && <EditBannerForm
                    editBanners={editBanners}
                    handleStateChange={this.handleStateChange}
                    handleFileChange={this.handleFileChange}
                    handleUpdateBanner={this.handleUpdateBanner}
                  />}
                </Spin>
              ) : addBanners &&
              <AddBanner
                addBannerData={addBanners}
                handleAddBanner={this.handleAddBanner}
                handleFileChange={this.handleFileChange}
                handleStateChange={this.handleStateChange}
              />}
            </div>
          </EditBannerStyle.Container>
        </EditBannerStyle>
      </>
    )
  }
}

export default EditBanner
