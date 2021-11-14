import React from 'react'
import { Player } from '@lottiefiles/react-lottie-player'
import EditBannerStyle from '../EditBanner.style'

const LiveBanner = (props) => {
  const { data: {
    backgroundImage,
    height,
    width,
    lottie,
    beforeColor,
    beforeFontSize,
    textBeforeDiscount,
    discountColor,
    discountSize,
    discount,
    afterColor,
    afterFontSize,
    textAfterDiscount,
    discountBackground,
    disclaimerText,
    disclaimerTextColor,
    disclaimerTextFontSize
  } } = props
  return (
    <>
      <h2>Preview</h2>
      <EditBannerStyle.Banner
        style={{
          backgroundImage: `url(${backgroundImage})`,
          height: `${height}px`,
          width: `${width === 0 || !width ? '100%' : `${width}px`}`
        }}
      >
        <Player
          autoplay
          loop
          src={lottie}
        />
        <span style={{ zIndex: '10', position: 'unset' }} >
          <h4
            className='landing-page-header-bannerText'
            style={{ color: beforeColor, fontSize: `${beforeFontSize}px` }}
          >
            {textBeforeDiscount}
          </h4>
          <h2
            className='landing-page-header-gradientText'
            style={{
              color: discountColor,
              fontSize: `${discountSize}px`,
              backgroundImage: `${discountBackground}`,
            }}
          >{discount}
          </h2>
          <h4
            className='landing-page-header-bannerText'
            style={{ color: afterColor, fontSize: `${afterFontSize}px` }}
          >
            {textAfterDiscount}
          </h4>
        </span>
        <h5 className='landing-page-header-limitedText'
          style={{
            color: disclaimerTextColor || 'white',
            fontSize: `${disclaimerTextFontSize}px`
          }}
        >{disclaimerText}
        </h5>
      </EditBannerStyle.Banner>
    </>
  )
}

export default LiveBanner
